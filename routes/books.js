//Setup Depedency
var express = require('express')
var router = express.Router();
var dbConnetion = require('../lib/db')


//Get Data Books
router.get('/', function(req, res, next) {
    dbConnetion.query("SELECT * FROM book ORDER BY id desc", function(err, rows){
        if(err){
            req.flash("Error", err);
            //Render Error
            res.render("Books", {data: ''})
        } else{
            //Render Data to Web
            res.render("Books", {data:rows})
        }
    })
})


//Display add Book Page
router.get('/add', function(req, res, next){
    //render to add.ejs
    res.render("books/add", {
        name : "",
        author: "",
    })
})


//Add new Book
router.post('/add', function(req, res, next){
    
    let name = req.body.name;
    let author = req.body.author;
    let errors = false;

    if(name.length === 0 || author.length === 0){
        //set Flash Message
        req.flash('Error', "Please enter name and author");

        //render Response Error
        res.render('books/add', {
            name : name,
            author : author
        })
    }
    //If No err
    if(!errors){
        var form_data = {
            name: name,
            author: author,
        }
        dbConnetion.query("INSERT INTO book set ?", form_data, function(err, result){
            if(err){
                //Get Error Data
                req.flash("Error", err)

                //render to add.ejs
                res.render("books/add", {
                    name: form_data.name,
                    author: form_data.author
                })
            } else{
                req.flash("Success", "Book Successfully Added");
                res.redirect("/books");
            }
        })
    }
})

//Edit Data Book
router.get('/edit/(:id)', function(req, res, next){
    let id = req.params.id;

    //Get Id Data Books
    dbConnetion.query("SELECT * FROM book where id = " + id, function(err, rows, fields){
        if(err) throw err

        //if data Not Found
        if(rows.length <= 0){
            req.flash("error", "Book not Found with id = " + id)
            res.redirect("/books")
        }else {
            //Render Edit to edit.ejs
            res.render("books/edit", {
                title: "Edit Book",
                id: rows[0].id,
                name: rows[0].name,
                author: rows[0].author,
            })
        }
        

        //Store Data to Db
        if(!errors){
            var form_data = {name: name, author:author}
            dbConnetion.query("UPDATE book set ? where id =" + id, form_data, function(err, result){

                //if(err) throw error
                if(err){
                    req.flash("error", err)
                    res.render("books/edit", {
                        id: req.params.id,
                        name: req.params.name,
                        author: req.params.author
                    })
                }
            })
        } else {
            req.flash("Success", "Book successfully update");
            req.redirect("/books");
        }
    })
})


//delet book
router.get('/delete/(:id)', function(req, res, next){
    let id = req.params.id;
    dbConnetion.query("DELETE FROM book WHERE id =" + id, function(err, result){
        //if Err
        if(err){
            req.flash("Error", err)
            res.redirect("/books")
        }else{
            req.flash("Success", "Book successfully Deleted id =" + id)
            res.redirect("/books")
        }
    })
})



module.exports = router;