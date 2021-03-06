const express = require('express');
const router = express.Router();
const moment = require('moment')

let taskShow = null;
const list=null;
const Task = require('../models/tasks')
const List = require('../models/tasksList')

router.get('/', async (req, res) => {
  const  tasks = await Task.find({listId: ""})
 const   list = await List.find()
    
    res.render('index', { tasks, list })
});


//task
router.post('/add', async (req, res) => {

    const task = new Task(req.body)
    if (req.file != null) {
        task.img = req.file
        task.img.path = '/uploads/img/' + req.file.filename;
    }
  
    if(req.body.deafline!='')
    task.deafline = moment(task.deafline).format('YYYY-MM-DD').toString()
    await task.save()
        .then(() => console.log("Tarea cargada"))
        .catch(err => {
            const mess = (`${err['message']}`)
        });
    res.redirect('/')
});

//A task in a list.
router.post('/addToList/', async (req, res) => {

    const list = await List.findById(req.body.list_id);
    list.state=false;
    await list.save()
    if (list != null) {
        const task = new Task(req.body)
        if (req.file != null) {
            task.img = req.file
            task.img.path = '/uploads/img/' + req.file.filename;
        }
        task.listId = list.id;
        if(req.body.deafline!='')
        task.deafline = moment(task.deafline).format('YYYY-MM-DD').toString()
     
        await task.save()
            .then(() => console.log("A task in a list"))
            .catch(err => {
                const mess = (`${err['message']}`)
            });
        res.redirect('/list/' + list.id)
    }
});

//list
router.post('/addList/', async (req, res) => {

    const list = new List(req.body)
    list.title = req.body.title;
    list.creationDate = moment(new Date).format('YYYY-MM-DD').toString()
    list.state= false
    await list.save()
        .then(() => console.log("LISTA cargada"))
        .catch(err => {
            const mess = (`${err['message']}`)
        });

    res.redirect('/list/' + list.id)
})
//check list


//task
router.get('/check/:id/:idlist', async (req, res) => {
    const { id } = req.params;
    const task1 = await Task.findById(id);
    const {idlist}= req.params
       
    if (!(task1.state)) {
        task1.state = true    
        const res = moment.utc().format('YYYY-MM-DD HH:mm:ss')
        task1.resolutionDate = res.toString()
        await task1.save();
    }    

    if(idlist!= "nada"){
        const tasks = await Task.find({ listId: idlist })
        const list = await List.findById(idlist);
        res.render('list', { tasks, list })
    }
    else
    res.redirect('/');
})

//list

router.get('/list/:id', async (req, res) => {
    const { id } = req.params;
    const tasks = await Task.find({ listId: id })
    const list = await List.findById(id);

    res.render('list', { tasks, list })
})

router.get('/checkList/:id/:action', async (req, res) => {
    const { id } = req.params;
    const list = await List.findById(id);
    const {action} = req.params

    if (list.state == false) {       
        list.state = true
        const res = moment.utc().format('YYYY-MM-DD HH:mm:ss')
        list.resolutionDate = res.toString()
    }
    else {
        list.state = true
        list.state = false       
        list.resolutionDate = "-"
    }
    await list.save();

    res.redirect('/')
 
})

//task
router.get('/delete/:id/:idlist', async (req, res) => {
    const { id } = req.params;
    const {idlist}= req.params;
    
    await Task.deleteOne({ _id: id })
   
    if(idlist!='nada'){
        const list = await List.findById({_id:idlist});
        const tasks = await Task.find({ listId: idlist })
        res.render('list', { tasks, list })
    }
else{
    res.redirect('/')
}
})

//list
router.get('/deleteList/:id', async (req, res) => {
    const { id } = req.params;
    await List.deleteOne({ _id: id })
    await Task.deleteMany({listId:id})
    res.redirect('/')

})

//task
router.get('/traerTask/:id', async (req, res) => {
    const { id } = req.params;

   const taskShow = await Task.find({ _id: id })
    res.json(taskShow)


})

//task
router.post('/editTask/:id', async (req, res, next) => {
    const { id } = req.params;

    const task = await Task.findById(id);
    const resolutionDat = moment.utc().format('YYYY-MM-DD HH:mm:ss').toString()
    await Task.update({ _id: id }, req.body);
    res.redirect('/');
})

router.post('/editTaskList/:id', async (req, res, next) => {
    const { id } = req.params;

    const list = await List.findById(req.body.list_id);
    if (list != null) {
        const task = await Task.findById(id);
        if (task != null) {
            const resolutionDat = moment.utc().format('YYYY-MM-DD HH:mm:ss').toString()
            await Task.update({ _id: id }, req.body);

           
            res.redirect('/list/' + list.id);
        }
    }
    else res.redirect('/');
})

router.get('/orderByCreationDate/:id',async(req,res)=>{
    const {id}= req.params
    const list = await List.findById(id);
  const  tasks= await Task.find({listId:id}).sort({creationDate:-1})
    res.json(tasks)

})


module.exports = router;