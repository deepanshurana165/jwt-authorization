const JwtStratergy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
require('dotenv').config();

const options = {};

options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.secret;

module.exports = passport => {
    passport.use(new JwtStratergy(options, (jwt_payload,done)=>{
        console.log(jwt_payload);
        User.findById(jwt_payload.userid)
            .then(user=>{
                if(user){
                    console.log(user);
                    return done(null,user);
                }
                else{
                    console.log('else ran');
                    return done(null,false);
                }
            })
            .catch((err)=>{
                console.log(err)
            })
    }))
}
