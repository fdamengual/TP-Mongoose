const express = require('express');
const router = express.Router();
const moment = require('moment')
const jwt = require('jsonwebtoken')
const config = require('../models/config')
const verifyToken = require('../middleware/verifyToken')
let taskShow = null;
const list = null;
const Task = require('../models/tasks')
const List = require('../models/tasksList')
const User = require('../models/user');


router.get('/', verifyToken, async (req, res) => {
    var user = verifyToken.getUser();
    var tasks = await Task.find({ user, list : null }).catch(showErrors);
    var list = await List.find({ user }).catch(showErrors);

    res.render('index', { tasks, list })
    return;
});


router.get('/login', verifyToken, (req, res) => {
    var message = ""
    res.render('login', { message })
})
router.get('/register', (req, res) => {
    res.render('register')
})

//task
router.post('/add', verifyToken, async (req, res) => {
    var user = verifyToken.getUser();
    const task = new Task(req.body)
    if (req.file != null) {
        task.img = req.file
        task.img.path = '/uploads/img/' + req.file.filename;
    }

    if (req.body.deafline != '')
        task.deafline = moment(task.deafline).format('YYYY-MM-DD').toString()
    task.user = user;
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
    list.state = false;
    if (list != null) {
        const task = new Task(req.body)
        if (req.file != null) {
            task.img = req.file
            task.img.path = '/uploads/img/' + req.file.filename;
        }
        task.list = list;
        if (req.body.deafline != '')
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
router.post('/addList/', verifyToken, async (req, res) => {
    var user = await verifyToken.getUser();
    const list = new List(req.body)
    list.title = req.body.title;
    list.creationDate = moment(new Date).format('YYYY-MM-DD').toString()
    list.state = false
    list.user = user;
    await list.save()
        .then(() => console.log("Lista creada con éxito."))
        .catch(err => {
            const mess = (`${err['message']}`)
        });
    res.redirect('/list/' + list.id)
})
//check list


//task
router.get('/check/:id/:idlist', verifyToken, async (req, res) => {
    const { id } = req.params;
    var user = verifyToken.getUser();
    const task = await Task.findOne({ _id: id, user }).catch(showErrors);
    if (task) {
        const { idlist } = req.params

        if (idlist != "nada") {
            const tasks = await Task.find({ listId: idlist, user })
            var list = await List.findOne({ idlist, user });
            res.redirect('/list/' + list.id);
        }
        else {
            if (!(task.state)) {
                task.state = true
                task.user = user;
                const res = moment.utc().format('YYYY-MM-DD HH:mm:ss')
                task.resolutionDate = res.toString()
                await task.save();
                res.redirect('/');
            }
        }
    }
    res.redirect('/');
})

//list

router.get('/list/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    var user = await verifyToken.getUser();
    var list = await List.findOne({ _id: id, user }).catch(showErrors);
    var tasks = {}
    if (list) {
        tasks = await Task.find({ list: list }).catch(showErrors);
        res.render('list', { tasks, list })
        return;
    }
    var message = "List not found."
    res.render('error', { tasks, list, message })
})

var showErrors = function (erro) {
    console.log("Error al obtener un objeto.");
}

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
router.get('/delete/:id/:idlist', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { idlist } = req.params;
    var user = await verifyToken.getUser();
    var task = await Task.findOne({ _id: id, user }).catch(showErrors);
    if (task) {
        await Task.deleteOne({ _id: id })
    }

    if (idlist != 'nada') {
        const list = await List.findOne({ _id: idlist}).catch(showErrors);
        if (list) {
            res.redirect('/list/' + list.id)
            return;
        }
    }
    res.redirect('/')
    return;
})

//list
router.get('/deleteList/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    var user = verifyToken.getUser();
    await List.deleteOne({ _id: id, user })
    res.redirect('/')
})

//task
router.get('/traerTask/:id', async (req, res) => {
    const { id } = req.params;

   const taskShow = await Task.find({ _id: id })
    res.json(taskShow)


})

//task
router.post('/editTask/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    var user = verifyToken.getUser();
    const task = await Task.findById(id);
    if(task != null)
    {
        task.deafline = req.body.deafline;
        task.title = req.body.title;
        task.preority = req.body.preority;
        task.description = req.body.description;   
        task.user = user;
        task.save();
    }
    await task.updateOne(task.id);
    res.redirect('/');
})

router.post('/editTaskList/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    const list = await List.findById(req.body.list_id);
    if (list != null) {
        const task = await Task.findById(id);
        if (task != null) {
            const resolutionDat = moment.utc().format('YYYY-MM-DD HH:mm:ss').toString()

            task.deafline = req.body.deafline;
            task.title = req.body.title;
            task.preority = req.body.preority;
            task.description = req.body.description;   
            task.save();
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

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    if (email && password) {
        var user = await User.findOne({ email: email })
        if (user) {
            if (await user.verifyPassword(password)) {
                const token = jwt.sign({ id: user._id }, config.secret, {
                    expiresIn: 60 * 60 * 24
                })
                console.log(new Date(), ' token creado. ' + token + " user: " + user.name);

                res.cookie('x-access-token', token)
            }
            else {
                var message = "Incorrect password."
                res.render('login', { message })
                return;
            }
        }
        else {
            var message = "No user was found with that email."
            res.render('login', { message })
            return;
        }
    }
    else {
        var message = "You must enter an email and a password."
        res.render('login', { message })
        return;
    }
    res.redirect('/')
    return;
})

router.post('/register/', async (req, res, next) => {
    const { email, password, name } = req.body
    var user = await User.findOne({ email: email })
    if (user) {
        console.log("Este usuario ya se encuentra registrado.")
        res.send("ya estás registrado")
    }
    else {
        user = new User({
            name,
            email,
            password
        })
        user.password = await user.encryptPassword(user.password)
        console.log(user)
        await user.save()
        const token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 60 * 60 * 24
        })

        res.redirect('/login')
    }
})

router.get('/logout/', verifyToken, async (req, res) => {
    var user = verifyToken.getUser();
    res.clearCookie('x-access-token')
    return res.redirect('/');
})



module.exports = router;