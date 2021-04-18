//REQUERIMIENTOS
const express = require("express");
const router = express.Router();
const {checkAuth} = require('../middlewares/authentication.js');
const { default: Variable } = require("../models/variable.js");


/*                                              
 __  __  ___  _     ____  _____ _     ___  ____  
|  \/  |/ _ \| |   |  _ \| ____| |   / _ \/ ___| 
| |\/| | | | | |   | | | |  _| | |  | | | \___ \ 
| |  | | |_| | |___| |_| | |___| |__| |_| |___) |
|_|  |_|\___/|_____|____/|_____|_____\___/|____/                                                
*/

import variable from '../models/variable.js';


/*                  
    _    ____ ___ 
   / \  |  _ |_ _|
  / _ \ | |_) | | 
 / ___ \|  __/| | 
/_/   \_|_|  |___|
*/             


//CONSULTAR

router.get("/variable", checkAuth, async (req, res) => {

    try {

        const userId = req.userData._id;

        const variables = await Variable.find({variable_user_id: userId});
    
        const toSend = {
            status: "success",
            data: variables
        }

        res.json(toSend);
        
    } catch (error) {

        const toSend = {
            status: "error",
            data: error
        }
        console.log ("ERROR AL CONSULTAR VARIABLES")
        res.json(toSend);
        
    }
    


}); 


//INSERTAR

router.post("/variable", checkAuth, async (req, res) => {

    try {

        const userId = req.userData._id;
        var newVariable = req.body.newVariable;
        console.log(newVariable);
    
        newVariable.variable_user_id = req.userData._id;
        newVariable.variable_date = Date.now();
    
        const variable = await Variable.create(newVariable);
    
        const toSend = {
            status: "success",
        }
    
        return res.json(toSend);
        
    } catch (error) {

        console.log("ERROR CREANDO LA VARIABLE");
        console.log(error);
        const toSend = {
            status: "Error",
            error: error
        }
    
        return res.status(500).json(toSend);
        
    }



}); 

// BORRAR

router.delete("/variable",checkAuth, async (req, res) => {


    try {

        const userId = req.userData._id;
        const variableId = req.query.variable_id
    
        const result = await Variable.deleteOne({variable_user_id: userId, variable_id: variableId})
    
        const toSend = {
            status: "success",
            data: result
        };
    
        return res.json(toSend);
        
    } catch (error) {

        console.log("ERROR AL BORRAR LA VARIABLE");
        console.log(error);
        const toSend = {
            status: "Error",
            error: error
        }
    
        return res.status(500).json(toSend);
        
    }



}); 

// ACTUALIZAR

router.put("/device", (req, res) => {

}); 

/*



*/



module.exports = router;