const bcrypt = require('bcryptjs');

bcrypt.genSalt().then((r)=>{
    console.log('Salt is : '+r);
    bcrypt.hash('hello',r,(err,hash)=>{
        console.log(hash)
    })
})