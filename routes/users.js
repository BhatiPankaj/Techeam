var express = require('express'),
    router = express.Router(),
    bcrypt = require("bcryptjs"),
    passport = require("passport");

let  User = require('../models/user');

router.get('/register',function(req, res){
    res.render('register');
});

router.post('/register', function(req, res){
    const name = req.body.name;
          email = req.body.email;
          username = req.body.username;
          password = req.body.password;
          confirmPassword = req.body.confirmPassword;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', ' Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
    req.checkBody('confirmPassword', 'passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if(errors){
        res.render('register', {
            errors:errors
        });
    }else {
        let newUser = new User({
            name:name,
            email:email,
            username:username,
            password:password
        });
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                console.log(req.body.name);
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    }else {
                        req.flash('success','You are now registered and can login');
                        res.redirect('/users/login');
                    }
                });
            });
        });
    }
});
// Login form
router.get('/login', function(req, res){
  res.render("login");
});

// Login Process
router.post("/login", function(req, res, next){
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

// Logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You are logged out");
    res.redirect("/users/login");
});

module.exports = router;