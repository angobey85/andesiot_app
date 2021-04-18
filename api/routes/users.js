const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {checkAuth} = require('../middlewares/authentication.js');

//models import
import User from "../models/user.js";
import EmqxRule from "../models/emqx_auth.js"

//AUTH

router.post("/register", async (req, res) => {

try {

    const encrypterPassword = bcrypt.hashSync(req.body.user_password, 10);

    const newUser = {
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_password: encrypterPassword
    }

    const user = await User.create(newUser);

    const toSend = {
        status: "success",
    }

    res.json(toSend);
    
} catch (error) {

    console.log ("ERROR - INSERTAR ENDPOINT")
    console.log (error);

    const toSend = {
        status: "error",
        error: error
    }
    
    res.status(500).json(toSend);

}


}); 

router.post("/login", async(req, res) => {

    const email = req.body.user_email;
    const password = req.body.user_password;

    var user = await User.findOne({
        user_email: email
    });

    if(!user){
        const toSend = {
            status: "error",
            error: "Credenciales Invalidas"
        }
        
        return res.status(401).json(toSend);
    }

    if (bcrypt.compareSync(password, user.user_password)){

        user.set('user_password', undefined, {strict: false}); //eliminar pass de user

        const token = jwt.sign({userData: user}, 'securePasswordHere', {expiresIn: 60*60*24*30 });

        const toSend = {
            status: "success",
            token: token,
            userData: user
        }
        return res.status(200).json(toSend);
    }else{
        const toSend = {
            status: "error",
            error: "Credenciales Invalidas"
        }
        
        return res.status(401).json(toSend);
    }

    console.log(user);
    res.json({"status":"success"});

}); 


router.get("/new-user", async (req, res) => {

    try {
        const user = await User.create({
            user_name: "Andres Gonzalez",
            user_email: "angobey85@gmail.com",
            user_password: "16224774ango"
          });
          res.json({"status":"success"})
    } catch (error) {
        console.log(error);
        res.json({"status":"fail"});
    }


});

//MQTT CREDENCIALES WEB

router.post("/getMqttCredentials", checkAuth, async (req, res) =>{

try {

    const userId = req.userData._id;


    const credentials = await getWebUserMqtt(userId);
 
    const toSend = {
        status: "success",
        username: credentials.username,
        password: credentials.password
    }

    res.json(toSend);

    setTimeout(() => {
        getWebUserMqtt(userId)
    }, 10000);
    return 

    
} catch (error) {

    console.log(error);

    const toSend = {
        status: "error",
    };
    return res.status(500).json(toSend);
}

});


router.post("/getMqttReconnection", checkAuth, async (req, res) =>{
    const userId = req.userData._id;
    const credentials = await getWebUserMqttReconnection(userId);

    const toSend = {
        status: "success",
        username: credentials.username,
        password: credentials.password
    }

    console.log(toSend)
    res.json(toSend);

    setTimeout(() => {
        getWebUserMqtt(userId)    
    }, 15000);

})


//MQTT TIPOS DE CREDENCIALES
async function getWebUserMqtt(userId){


    try {

        var rule = await EmqxRule.find({type: "user", user_id: userId});

        if (rule.length == 0) {
    
            const newRule = {
    
                user_id: userId,
                username: makeid(10),
                password: makeid(10),
                publish: ["+/" + userId + "/#"],
                subscribe: ["+/" + userId + "/#"],
                type: "user",  
                date: Date.now(),
                updateDate: Date.now()
    
            }
    
            const result = await EmqxRule.create(newRule);
            
            const toSend = {
                username: result.username,
                password: result.password
            }
    
            return toSend;
        }
    
        const newUserName = makeid(10);
        const newPassword = makeid(10);
    
        const result = await EmqxRule.updateOne({type:"user", user_id: userId}, {$set:{username: newUserName, password: newPassword, updateDate: Date.now()}})
    
        if (result.n == 1 && result.ok ==1) {
            return {
                username: newUserName,
                password: newPassword
            }
        }else{
            return false;
        }
        
    } catch (error) {
        console.log(error);
        return false;
    }



}

async function getWebUserMqttReconnection(userId){
    try {
        const rule = await EmqxRule.find({type:"user", user_id: userId });

        if (rule.length == 1) {

            const toSend = {
                username: rule[0].username,
                password: rule[0].password
            }

            return toSend;
            
        }

    } catch (error) {

        console.log(error);
        return false;
        
    }
}


function makeid(length) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
        Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}

module.exports = router;

