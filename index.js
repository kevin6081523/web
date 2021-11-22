const express = require('express')
const app =new express()
const ejs =require('ejs')
const flash =require('connect-flash')
const mongoose = require('mongoose')
const BlogPost = require('./models/BlogPost')
const User = require('./models/User')
const expressSession = require('express-session')
const fileUpload = require('express-fileupload')

mongoose.connect('mongodb+srv://mydatabase:point4197@cluster0.vzrfy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{useNewUrlParser:true})

app.set('view engine','ejs')
app.use(flash())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload())
app.use(expressSession({
    secret:'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

global.loggedIn = null;
app.use("*",(req,res,next)=>{
    loggedIn = req.session.userId
    next()
})
app.get('/post/:id',async(req,res)=>{
    const blogpost = await BlogPost.findById(req.params.id)
    res.render('post',{
        blogpost
    })
})
const authMiddleware = require('./middleware/authMiddleware')
const homeController = require('./controllers/home')
const newUserController = require('./controllers/newUser')
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')

app.get('/',homeController)
app.get('/auth/register',redirectIfAuthenticatedMiddleware,newUserController)
app.get('/auth/login',redirectIfAuthenticatedMiddleware,loginController)
app.post('/users/register',redirectIfAuthenticatedMiddleware,storeUserController)
app.post('/users/login',redirectIfAuthenticatedMiddleware,loginUserController)

const validateMiddleWare = require('./middleware/validationMiddleware')
app.use('/posts/store',validateMiddleWare)
app.get('/',async(req,res)=>{
    const blogposts = await BlogPost.find({
    })
    res.render('index',{
        blogposts:blogposts
    })
})

let port = process.env.PORT
if(port==null || port==""){
    port=4000
}

app.listen(port,()=>{
    console.log('App listening...')
})



const logoutController = require('./controllers/logout')
app.get('/auth/logout',logoutController)
app.use((req,res)=>res.render('notfound'));
