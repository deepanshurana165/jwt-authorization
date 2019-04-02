const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();

//loading user model
const User = require('../../models/Users');

//testing
router.get('/',(req,res)=>{
    res.json({msg: 'Hey this is users'})
})

//register
router.post('/register',(req,res)=>{
    User.findOne({email: req.body.email})
    .then(user => {
        console.log(req.body)
        if(user){
            return res.status(400).json({msg:'Email already exists'});
        }else{
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err,salt)=>{
                bcrypt.hash(newUser.password,salt, (err,hash)=>{
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                    .then((newUser)=>{
                        res.json(newUser)
                    })
                    .catch(err => {console.log(err)});
                });
            })
        }
    })
})

//login

router.post('/login',(req,res)=>{
    const useremail = req.body.email;
    const password = req.body.password;

    User.findOne({email: useremail})
    .then((user)=>{
        if(user){
            bcrypt.compare(password,user.password)
            .then(isMatched =>{
                if(isMatched){
                    //user matched
                    
                    //creating payload for jwt
                    const payload = {userid: user.id, name: user.name}

                    //sign token
                    jwt.sign(
                        payload,
                        process.env.secret,
                        {expiresIn: 360000},
                        (err,token)=>{
                            //sending jwt token
                            res.json({
                                success: true,
                                token: 'Bearer '+token
                            })
                        })
                } 
                else res.status(400).json({msg:'Password incorrect'});
            })
        }else{
            res.status(404).json({msg: 'User does not exists'})
        }
    })
    .catch(err=>console.log(err));
});

// @route GET api/users/current
// @desc Return current user
// @access Private

router.get('/current',passport.authenticate('jwt',{session: false}),(req,res)=>{
    res.json({name:req.user.name,
        email: req.user.email
    })
})

module.exports = router;