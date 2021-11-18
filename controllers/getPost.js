const BlogPost = require('../models/BlogPost.js')

module.exports = async(req,res)=>{
    const blogposts = await BlogPost.findById(req.params.id)
    console.log(blogpost)
    res.render('post',{
        blogposts
    })
}