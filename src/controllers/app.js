const express = require('express');
const mongoose = require('mongoose')
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const router = require(path.resolve(__dirname + '\\..\\', 'routes'))
const multer = require('multer')
const uuid = require('uuid');


const app = express();

//connecting to db
mongoose.connect('mongodb://localhost/tp6',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
    .then(db => console.log('DB conected'))
    .catch(err => console.log(err))


//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.resolve(__dirname + '\\..\\public', 'views'));
app.set('view engine', 'ejs');

app.use('/uploads/img', express.static(path.join(__dirname, '/../uploads/img')));

//middleware
app.use(morgan('dev'));
app.use(express.urlencoded({}))
const storage = multer.diskStorage({
    destination :path.join(__dirname + '/../uploads/img'),
    filename: (req, file, cb, filename) => {
       cb(null, uuid.v4() + path.extname(file.originalname));
     
    }
})

app.use(multer({ storage:storage  }).single('img'))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

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




