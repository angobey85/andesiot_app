//REQUERIMIENTOS
const express = require("express");
const router = express.Router();
const {checkAuth} = require('../middlewares/authentication.js');
const { default: Device } = require("../models/device.js");


/*                                              
 __  __  ___  _     ____  _____ _     ___  ____  
|  \/  |/ _ \| |   |  _ \| ____| |   / _ \/ ___| 
| |\/| | | | | |   | | | |  _| | |  | | | \___ \ 
| |  | | |_| | |___| |_| | |___| |__| |_| |___) |
|_|  |_|\___/|_____|____/|_____|_____\___/|____/                                                
*/

import device from '../models/device.js';


/*                  
    _    ____ ___ 
   / \  |  _ |_ _|
  / _ \ | |_) | | 
 / ___ \|  __/| | 
/_/   \_|_|  |___|
*/             


//CONSULTAR

router.get("/device", checkAuth, async (req, res) => {

    try {

        const userId = req.userData._id;

        const devices = await Device.find({device_user_id: userId});
    
        const toSend = {
            status: "success",
            data: devices
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

router.post("/device", checkAuth, async (req, res) => {

    try {

        const userId = req.userData._id;
        var newDevice = req.body.newDevice;
        console.log(newDevice);
    
        newDevice.device_user_id = req.userData._id;
        newDevice.device_date = Date.now();
    
        const device = await Device.create(newDevice);
    
        const toSend = {
            status: "success",
        }
    
        return res.json(toSend);
        
    } catch (error) {

        console.log("ERROR CREANDO EL DISPOSITIVO");
        console.log(error);
        const toSend = {
            status: "Error",
            error: error
        }
    
        return res.status(500).json(toSend);
        
    }



}); 

// BORRAR

router.delete("/device",checkAuth, async (req, res) => {


    try {

        const userId = req.userData._id;
        const deviceId = req.query.device_id
    
        const result = await Device.deleteOne({device_user_id: userId, device_id: deviceId})
    
        const toSend = {
            status: "success",
            data: result
        };
    
        return res.json(toSend);
        
    } catch (error) {

        console.log("ERROR BORRANDO EL DISPOSITIVO");
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