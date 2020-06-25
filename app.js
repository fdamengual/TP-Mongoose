const express = require('express');
const mongoose = require('mongoose')
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const router = require(path.resolve(__dirname + "/src/routes"))
const multer = require('multer')
const uuid = require('uuid');
const passport = require('passport');
const googleStratergy = require(path.resolve(__dirname + '/src/models/googleStrategy'))

require('@google-cloud/debug-agent').start();

const app = express();

//6ZtPbPjWxJflrpPB
/*
onst MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://nodeJS:6ZtPbPjWxJflrpPB@cluster0-90yvp.gcp.mongodb.net/laboratorio?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
mongodb+srv://nodeJS:6ZtPbPjWxJflrpPB@cluster0-90yvp.gcp.mongodb.net/test
*/

//connecting to db
mongoose.connect('mongodb+srv://nodeJS:6ZtPbPjWxJflrpPB@cluster0-90yvp.gcp.mongodb.net/laboratorio?retryWrites=true&w=majority',{
    useNewUrlParser:true
})
    .then(db => console.log('DB conected'))
    .catch(err => console.log(err))

app.use(passport.initialize())

// Api call for google authenticationapp.get('/',
passport.authenticate('google', { scope: ['email', 'profile'] }), (req, res) => { };
// Api call back function
app.get('/callback', passport.authenticate('google', { scope: ['email', 'profile'] }),
    (req, res) => {
        return res.send("Congrats");
    });

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.resolve(__dirname + '/src/public/views'));
app.set('view engine', 'ejs');

app.use('/uploads/img', express.static(path.join(__dirname, '/src/uploads/img')));

//middleware
app.use(morgan('dev'));
app.use(express.urlencoded({}))
const storage = multer.diskStorage({
    destination :path.join(__dirname + '/src/uploads/img'),
    filename: (req, file, cb, filename) => {
       cb(null, uuid.v4() + path.extname(file.originalname));
     
    }
})

app.use(multer({ storage:storage  }).single('img'))


//static files
//app.use(express.static(path.join(__dirname + '/../uploads/img')))

//post

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//routes
app.use('/', router)

//starting the server
app.listen(app.get('port'), () => {
    console.log(`Server en el puerto ${app.get('port')}`);
});




