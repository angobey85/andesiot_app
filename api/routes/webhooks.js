const express = require('express');
const router = express.Router();
const axios = require('axios');
const colors = require('colors');
var mqtt = require('mqtt');

import { checkAuth } from "../middlewares/authentication.js";
import Data from "../models/data.js"
import AlarmRule from "../models/emqx_alarm_rule.js";
import Equipment from "../models/equipment.js";
import Notification from "../models/notification.js";

var client;

/*                  
    _    ____ ___ 
   / \  |  _ |_ _|
  / _ \ | |_) | | 
 / ___ \|  __/| | 
/_/   \_|_|  |___|
*/             

router.get("/notifications", checkAuth, async (req, res) =>{
    try {
        const userId = req.userData._id;
        const notifications = await getNotifications(userId);

        const toSend = {
            status : "success",
            data: notifications
        };

        res.json(toSend)
    } catch (error) {

        console.log("ERROR AL OBTENER NOTIFICACIONES")
        console.log(error)

        const toSend = {
            status : "error",
            error: error
        };
        
        res.status(500).json(toSend)
    }
})

router.put("/notifications", checkAuth, async (req, res) =>{
    try {
        const userId = req.userData._id;
        const notificationId = req.body.notifId;

        await Notification.updateOne({notification_user_id: userId, _id: notificationId}, {notification_readed: true});

        const toSend = {
            status: "success",
        };

        res.json(toSend)
    } catch (error) {

        console.log("ERROR AL ACTUALIZAR NOTIFICACIONES")
        console.log(error)

        const toSend = {
            status : "error",
            error: error
        };
        
        res.status(500).json(toSend)
    }
})

router.post("/saver-webhook", async (req, res) =>{
    
    if (req.headers.token != process.env.EMQX_API_TOKEN) {
        req.sendStatus(404);
        return;
    }

    const data = req.body;

    const splittedTopic = data.topic.split("/");
    const equipmentId = splittedTopic[2];
    const variable = splittedTopic[3];

    var result = await Equipment.find({equipment_id: equipmentId, equipment_user_id: data.userId})

    if (result.length == 1) {

        Data.create({

            data_userId: data.userId,
            data_equipment_id: equipmentId,
            data_variable: variable,
            data_value: data.payload.value,
            data_time: Date.now()
        })

        console.log("DATO CREADO CON EXITO")
        
    }

    res.sendStatus(200);

});

router.post("/alarm-webhook", async (req, res) =>{

    try {

        if (req.headers.token != "andesiot") {
            req.sendStatus(404);
            return;
        }
    
        const alarm = req.body;

        updateAlarmCounter(alarm.notification_emqx_rule_id);

        const lastNotif = await Notification.find({ notification_equipment_id: alarm.notification_equipment_id, notification_emqx_rule_id: alarm.notification_emqx_rule_id}).sort({ notification_date: -1}).limit(1);

        if (lastNotif == 0) {
            console.log("PRIMERA ALARMA")
            saveNotiMongo(alarm);
            sendMqttNotif(alarm)        
           
        }else{
            const lastNotifNowMins = (Date.now() - lastNotif[0].notification_date) / 1000 / 60 ;
            if (lastNotifNowMins > alarm.notification_triggerTime) {
                console.log("TRIGGERS ALARMA")
                saveNotiMongo(alarm);
                sendMqttNotif(alarm)
            }
        }

        
        


    
        res.sendStatus(200);
        
        
    } catch (error) {

        console.log(error);
        res.sendStatus(200);
        
    }
    

});


/*
  _____ _   _ _   _  ____ ___ ___  _   _ _____ ____  
 |  ___| | | | \ | |/ ___|_ _/ _ \| \ | | ____/ ___| 
 | |_  | | | |  \| | |    | | | | |  \| |  _| \___ \ 
 |  _| | |_| | |\  | |___ | | |_| | |\  | |___ ___) |
 |_|    \___/|_| \_|\____|___\___/|_| \_|_____|____/ 
                                                    
*/


function sendMqttNotif(notif){
    const topic = 'notif/' + notif.notification_user_id + '/dummy-did/dummy-var';
    const msg = 'ADVERTENCIA LA VARIABLE: ' + notif.notification_variable_name + ' ES ' + notif.notification_condition + ' QUE ' + notif.notification_value;
    client.publish(topic, msg);
}


function startMqttClient (){

    const options = {
        port: 1883,
        host: process.env.EMQX_NODE_HOST,
        clientId: 'webhook_superuser' + Math.round(Math.random() * (0-10000) * -1),
        username: process.env.EMQX_NODE_SUPERUSER_USER,
        password: process.env.EMQX_NODE_SUPERUSER_PASSWORD,
        keepalive: 60,
        reconnectPeriod: 5000,
        protocolId: 'MQIsdp',
        protocolVersion: 3,
        clean: true,
        enconding: 'utf8'
    }

    client = mqtt.connect ('mqtt://'+process.env.EMQX_NODE_HOST, options);
      client.on('connect', function(){
        console.log("\n");
        console.log("************************************".green);
        console.log("SE HA CONECTADO A MQTT CORRECTAMENTE".green);
        console.log("************************************".green);
        console.log("\n");
    });

    client.on('reconnect', function(){
        console.log("MQTT RECONECTADO");
    });    

    client.on('error', function(){
        console.log("\n");
        console.log("*************************************".red);
        console.log("********ERROR A CONECTAR MQTT********".red);
        console.log("*************************************".red);
        console.log("\n");
        console.log(error);

    });


}

async function getNotifications(userId){
    try {
        const res = await Notification.find({notification_user_id: userId, notification_readed: false});
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}




function saveNotiMongo(alarm){
    var newNotif = alarm;
    newNotif.notification_date = Date.now()
    newNotif.notification_readed = false;
    Notification.create(newNotif);
}

async function updateAlarmCounter(emqxRuleId) {

    try {
        await AlarmRule.updateOne({alarmrule_emqx_rule_id: emqxRuleId}, {$inc: { alarmrule_counter: 1}});
    } catch (error) {
        console.log(error)
    }
}

setTimeout(() => {
    startMqttClient();
}, 3000);


module.exports = router;