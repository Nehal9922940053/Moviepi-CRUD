const express =require('express');
const router = express.Router();
const Movie = require('../models/movies');
const multer = require('multer');
const fs = require('fs');

//image upload
var storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null,'./uploads');
    },
    filename:function(req, file, cb){
        cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
});

var upload = multer({
storage:storage,
}).single('image');

//Insert an movie into database route
router.post('/add', upload, (req,res) => {
    const movie = new Movie({
        movie_name: req.body.movie_name,
        released:req.body.released,
        desc:req.body.desc,
        image:req.file.filename,
    });
    movie.save((err) =>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        }else{
            req.session.message = {
                type: 'success',
                message:'Movie added successfully'
            };
            res.redirect("/");
        }
    });
});


//Get all movies route


router.get('/',(req,res) =>{
    // res.render("index",{title:"Home Page"});
    Movie.find().exec((err, movies)=>{
        if(err){
            res.json({message:err.message});
        }else{
            res.render("index",{
                title:"Home Page",
                movies:movies
            });
        }
    });
});

router.get('/add',(req,res) =>{
    res.render("add_movies",{title:"Add Movies"});
});


router.get('/edit/:id',(req,res) =>{
    let id = req.params.id;
    Movie.findById(id,(err,movie)=>{
        if(err) {
            res.redirect('/');
        }else{
             if(movie == null) {
                res.redirect('/');
        }else{
            res.render("edit_movies",{
                title:"Edit Movie",
                movie: movie,
            });
        }
    }
    });
});

router.post('/update/:id', upload, (req, res) => {
    let id= req.params.id;
    let new_image='';

    if(req.file){
        new_image = req.file.filename;
        try {
            fs.unlinkSync('./uploads/'+req.body.old_image);
        } catch (error) {
        console.log(error);
        }
    }else{
        new_image = req.body.old_image;
    }
    Movie.findByIdAndUpdate(id,{
        movie_name:req.params.movie_name,
        released:req.body.released,
        desc:req.body.desc,
        image:new_image,
    }, (err,result) =>{
        if(err){
            res.json({message:err.message});
        } else{
            req.session.message ={
                type:'success',
                message:'Movie updated successfully',
            };
            res.redirect("/");
        }
    })
});

//Delete movie route
router.get('/delete/:id', (req, res) =>{
    let id =req.params.id;
    Movie.findByIdAndRemove(id, (err,result) =>{
        if(result.image != ''){
            try {
                fs.unlinkSync('./uploads/'+result.image);
            } catch (err) {
                console.log(err);
            }
        }

        if(err){
            res.json({message:err.message});
        }else{
            req.session.message ={
                type:'success',
                message:'Movie Deleted Successfully',
        };
        res.redirect("/");
    }
    });
});

module.exports = router;