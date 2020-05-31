const express = require('express');
const router = express.Router();
const moment= require('moment')

const Task = require('../models/tasks')
let tasks;
router.get('/', async (req, res) => {
     tasks = await Task.find()
    res.render('index', { tasks })
});

router.post('/add', async (req, res) => {

    const task = new Task(req.body)
    task.img = req.file
    task.img.path = '/uploads/img/' + req.file.filename;
    task.deafline= moment(task.deafline).format('YYYY-MM-DD').toString()
    await task.save()
        .then(() => console.log("Tarea cargada"))
        .catch(err => {
            const mess = (`${err['message']}`)
           /* console.log(mess)*/
        });
    res.redirect('/')

});

router.get('/check/:id', async (req, res) => {
   console.log("hola")
    const { id } = req.params;
    const task = await Task.findById(id);
    if(!(task.state)){
        task.state = true
        
        const res= moment.utc().format('YYYY-MM-DD HH:mm:ss')
        task.resolutionDate= res.toString()
       // console.log(res)
       // console.log(task.resolutionDate)
    }
    
    await task.save();
    res.redirect('/');
})

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await Task.remove({ _id: id })
    res.redirect('/')

})

router.get('/traerTask/:id',async (req,res)=>{
const {id} = req.params;

const taskShow= await Task.find({_id:id})
//console.log(taskShow);
res.json(taskShow)


})

router.put('/editTask/:ide', async(req,res)=>{
  
   console.log(req.body)

    

})


module.exports = router;