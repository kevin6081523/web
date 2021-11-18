const express = require('express')
const app =new express()
// const path = require('path')
const ejs =require('ejs')
const flash =require('connect-flash')
const mongoose = require('mongoose')
const BlogPost = require('./models/BlogPost')
const User = require('./models/User')
mongoose.connect('mongodb://localhost/my_database',{useNewUrlparser:true
})
const expressSession = require('express-session')
app.use(flash())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const fileUpload = require('express-fileupload')

app.set('view engine','ejs')

app.use(fileUpload())
app.use(expressSession({
    secret:'keyboard cat'
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

// app.post('/posts/store',async(req,res) =>{    
//     let image = req.files.image
//     image.mv(path.resolve(__dirname,'public/img',image.name),
//         async (error)=>{
//             await BlogPost.create({
//                 ...req.body,
//                 image:'/img/'+image.name
//             })
//             res.redirect('/')
//         })

// })
const authMiddleware = require('./middleware/authMiddleware')
const homeController = require('./controllers/home')
const storeController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const newPostController = require('./controllers/newPost')
const newUserController = require('./controllers/newUser')
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')
const storePostController = require('./controllers/storePost')
app.get('/',homeController)
app.get('/post/:id',getPostController)
app.get('/posts/new',newPostController)
app.get('/auth/register',redirectIfAuthenticatedMiddleware,newUserController)
app.get('/auth/login',redirectIfAuthenticatedMiddleware,loginController)
app.post('/posts/store',authMiddleware,storeController)
app.post('/users/register',redirectIfAuthenticatedMiddleware,storeUserController)
app.post('/users/login',redirectIfAuthenticatedMiddleware,loginUserController)


// app.get('/posts/new',(req,res) =>{
//     res.render('create')
// })

// app.post('/posts/store',async(req,res) =>{  
//     await BlogPost.create(req.body,(error,blogpost)=>{
//     res.redirect('/')
//     }) 
// })
const validateMiddleWare = require('./middleware/validationMiddleware')
app.use('/posts/store',validateMiddleWare)
app.get('/',async(req,res)=>{
    const blogposts = await BlogPost.find({
    })
    res.render('index',{
        blogposts:blogposts
    })
})

// app.listen(4000,()=>{
//     console.log('App listening 4000')
// })

let port = process.env.PORT
if(port==null || port==""){
    port=4000
}

app.listen(port,()=>{
    console.log('App listening...')
})


app.get('/posts/new',authMiddleware,newPostController)
app.post('/posts/store',authMiddleware,storePostController)

const logoutController = require('./controllers/logout')
app.get('/auth/logout',logoutController)
app.use((req,res)=>res.render('notfound'));

