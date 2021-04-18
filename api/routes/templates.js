//REQUERIMIENTOS
const express = require("express");
const router = express.Router();
const {checkAuth} = require('../middlewares/authentication.js');
const { default: Template } = require("../models/template.js");


import template from '../models/template.js';

//CONSULTAR

router.get("/template", checkAuth, async (req, res) => {

    try {

        const userId = req.userData._id;

        const templates = await Template.find({template_user_id: userId});
    
        const toSend = {
            status: "success",
            data: templates
        }

        res.json(toSend);
        
    } catch (error) {

        const toSend = {
            status: "error",
            data: error
        }
        console.log ("ERROR AL CONSULTAR DISPOSITIVOS")
        res.json(toSend);
        
    }
    


}); 


//INSERTAR

router.post("/template", checkAuth, async (req, res) => {

    try {

        const userId = req.userData._id;
        var newTemplate = req.body.template;
        console.log(newTemplate);
    
        newTemplate.template_user_id = userId;
        newTemplate.template_date = Date.now();
    
        const template = await Template.create(newTemplate);
    
        const toSend = {
            status: "success",
        }
    
        return res.json(toSend);
        
    } catch (error) {

        console.log("ERROR CREANDO LA PLANTILLA");
        console.log(error);
        const toSend = {
            status: "Error",
            error: error
        }
    
        return res.status(500).json(toSend);
        
    }



}); 


// BORRAR

router.delete("/template",checkAuth, async (req, res) => {


    try {

        const userId = req.userData._id;
        const templateId = req.query.template_id
    
        const result = await Template.deleteOne({template_user_id: userId, _id: templateId})
    
        const toSend = {
            status: "success",
            data: result
        };
    
        return res.json(toSend);
        
    } catch (error) {

        console.log("ERROR BORRANDO LA PLANTILLA");
        console.log(error);
        const toSend = {
            status: "error",
            error: error
        }
    
        return res.status(500).json(toSend);
        
    }



}); 





module.exports = router;