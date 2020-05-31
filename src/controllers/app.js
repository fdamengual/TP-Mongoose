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
    useNewUrlParser:true
})
    .then(db => console.log('DB conected'))
    .catch(err => console.log(err))


//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.resolve(__dirname + '\\..\\public', 'views'));
app.set('view engine', 'ejs');


//middleware
app.use(morgan('dev'));
app.use(express.urlencoded({}))
const storage = multer.diskStorage({
    destination :path.join(__dirname + '../uploads/img'),
    filename: (req, file, cb, filename) => {
       cb(null, uuid.v4() + path.extname(file.originalname));
     
    }
})

app.use(multer({ storage:storage  }).single('img'))
app.use(express.static(path.join(__dirname , '../uploads/img')))
app.use(express.static(path.join(__dirname, '../public')))

console.log(path.join(__dirname ,'../uploads/img'))
console.log(path.join(__dirname, '../public'))
//post

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//routes
app.use('/', router)

//starting the server
app.listen(app.get('port'), () => {
    console.log(`Server en el puerto ${app.get('port')}`);
});




