const express = require("express");
const router = express.Router();
const axios = require('axios');
const colors = require('colors');

const auth = {
    auth: {
        username: 'admin',
        password: process.env.EMQX_APPLICATION_SECRET
    }
}

global.saverResource = null;
global.alarmResource = null;

// EMQX 


async function listResources(){

    const url = "http://localhost:8085/api/v4/resources/"

    const res = await axios.get(url, auth);

    const size = res.data.data.length;

    try {

        if (res.status ===200) {
  
            if (size == 0) {
                console.log("Creando Emqx webhook".green)
                createResources();
            }else if(size == 2) {
                res.data.data.forEach(resource=> {
                    if (resource.description == "alarm-webhook") {
                        global.alarmResource = resource;
                    }
    
                    if (resource.description == "saver-webhook") {
                        global.saverResource = resource;
                    }
                });
            }else{
                function printWarning(){
                    console.log("BORRE TODO LOS WEBHOOK EMQX Y RESETE EL NODE");
                    setTimeout(() => {
                        printWarning();
                    }, 1000);
    
                }

                printWarning();
            }
   
  
        }else{
            console.log("ERROR AL CONSULTAR API EMQX")
        }
        
    } catch (error) {
        console.log("Error al listar los recursos EMQX");
        console.log(error);
        
    }


}


async function createResources(){

    const url = "http://localhost:8085/api/v4/resources";

    const data1 = {
        "type": "web_hook",
        "config": {
            url: "http://localhost:3001/api/saver-webhook",
            headers: {
                token: process.env.EMQX_API_TOKEN
            },
            method: "POST"
        },
        description: "saver-webhook"
    }

    const data2 = {
        "type": "web_hook",
        "config": {
            url: "http://localhost:3001/api/alarm-webhook",
            headers: {
                token: process.env.EMQX_API_TOKEN
            },
            method: "POST"
        },
        description: "alarm-webhook"
    }

    const res1 = await axios.post(url, data1, auth);

    if (res1.status ===200) {
        console.log("Recursos de Guardado Creado")
    }

    const res2 = await axios.post(url, data2, auth);

    if (res2.status ===200) {
        console.log("Recursos de Alarma Creado")
    }

    setTimeout(() => {
        console.log("Eqmx Web Hooks Creados")
        listResources();    
    }, 1000);
    

}

setTimeout(() => {
    listResources();    
}, 1000);

module.exports = router;