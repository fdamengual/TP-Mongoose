const express = require('express');
const router = express.Router();
const moment = require('moment')
const jwt = require('jsonwebtoken')
const config = require('../models/congif')
const verifyToken = require('../middleware/verifyToken')
let taskShow = null;
const list = null;
const Task = require('../models/tasks')
const List = require('../models/tasksList')
const User = require('../models/user')

router.get('/', verifyToken, async (req, res) => {
    var user;
    if (req.userId) user = await User.findById(req.userId);
    if (!user) {
        res.clearCookie("x-access-token")
        return res.redirect('/login')
    }
    else {        
        var tasks = await Task.find({user: user});
        var list = await List.find({user: user});
        return res.render('index', { tasks, list })
    }
});


router.get('/login', verifyToken, (req, res) => {
    if (req.userId) console.log("user_id: " + req.userId)
    else console.log("user_id: null")
    res.render('login')
})
router.get('/register', verifyToken, (req, res) => {

    res.render('register')
})

//task
router.post('/add', verifyToken, async (req, res) => {

    var user;
    if (req.userId) user = await User.findById(req.userId);
    if (user) {
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
    }

    if (req.body.deafline != '')
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
    list.state = false;
    await list.save()
    if (list != null) {
        const task = new Task(req.body)
        if (req.file != null) {
            task.img = req.file
            task.img.path = '/uploads/img/' + req.file.filename;
        }
        task.listId = list.id;
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
router.post('/addList/', async (req, res) => {

    const list = new List(req.body)
    list.title = req.body.title;
    list.creationDate = moment(new Date).format('YYYY-MM-DD').toString()
    list.state = false
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
    const { idlist } = req.params

    if (!(task1.state)) {
        task1.state = true
        const res = moment.utc().format('YYYY-MM-DD HH:mm:ss')
        task1.resolutionDate = res.toString()
        await task1.save();
    }

    if (idlist != "nada") {
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
    const { action } = req.params

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
    const { idlist } = req.params;

    await Task.deleteOne({ _id: id })

    if (idlist != 'nada') {
        const list = await List.findById({ _id: idlist });
        const tasks = await Task.find({ listId: idlist })
        res.render('list', { tasks, list })
    }
    else {
        res.redirect('/')
    }
})

//list
router.get('/deleteList/:id', async (req, res) => {
    const { id } = req.params;
    await List.deleteOne({ _id: id })
    await Task.deleteMany({ listId: id })
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

router.get('/orderByCreationDate/:id', async (req, res) => {
    const { id } = req.params
    const list = await List.findById(id);
    const tasks = await Task.find({ listId: id }).sort({ creationDate: -1 })
    res.json(tasks)
})

router.post('/login', verifyToken, async (req, res) => {
    const { email, password } = req.body

    if (email && password) {
        var user = await User.findOne({ email: email })
        if (user) {
            if (user.verifyPassword(password)) {
                const token = jwt.sign({ id: user._id }, config.secret, {
                    expiresIn: 60 * 60 * 24
                })
                console.log(new Date(), ' token creado. ' + token + " user: " + user.name);

                res.cookie('x-access-token', token)

                var tasks = await Task.find({user: user});
                var list = await List.find({user: user});
                return res.render('index', { tasks, list })
            }
            else console.log("Contraseña incorrecta.")
        }
        else console.log("No se encontró ningún usuario con ese correo.");
    }
    else console.log("No hay datos ingresados.")
    return res.redirect('/login')
})

router.post('/login', async (req, res) => {


    const user = User.find({  })
    

    const tasks = await Task.find({ listId: "" })
    const list = await List.find()

    res.setHeader('x-access-token', res.get('x-access-token'))

    console.log(req.headers['x-access-token'])

    res.render('index', { tasks, list })
})


router.post('/register/', async (req, res, next) => {
    const { email, password, name } = req.body
    const user = await User.findOne({ email: email })
    if (!user) {
        console.log("Este usuario ya se encuentra registrado.")
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
     
        res.set('x-access-token', token)
        res.render('login', { auth: true, token })
    }



})



router.post('/register/', async (req, res, next) => {
    const { email, password, name } = req.body
    var user = await User.findOne({ email: email })
    if (user) {
        console.log("Este usuario ya se encuentra registrado.")
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

        res.set('x-access-token', token)
        res.redirect('/login')
    }



})



module.exports = router;