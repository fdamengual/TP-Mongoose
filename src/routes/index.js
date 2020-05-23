const express = require('express');
const router = express.Router();
const moment= require('moment')

const Task = require('../models/tasks')

router.get('/', async (req, res) => {
    const tasks = await Task.find()
    res.render('index', { tasks })
});

router.post('/add', async (req, res) => {

    const task = new Task(req.body)
    task.img = req.file
    task.img.path = '/uploads/img/' + req.file.filename;

    await task.save()
        .then(() => console.log("Tarea cargada"))
        .catch(err => {
            const mess = (`${err['message']}`)
            console.log(mess)
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
        console.log(res)
        console.log(task.resolutionDate)
    }
    
    await task.save();
    res.redirect('/');
})

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await Task.remove({ _id: id })
    res.redirect('/')

})




module.exports = router;