const express = require('express');
const router = express.Router();
const axios = require('axios');
const { checkAuth } = require('../middlewares/authentication.js');
const colors = require('colors');


import { response } from 'express';
import AlarmRule from '../models/emqx_alarm_rule.js'

const auth = {
    auth: {
        username: 'admin',
        password: process.env.EMQX_APPLICATION_SECRET
    }
};



/* 
  ___  ______ _____ 
 / _ \ | ___ \_   _|
/ /_\ \| |_/ / | |  
|  _  ||  __/  | |  
| | | || |    _| |_ 
\_| |_/\_|    \___/                                   
*/

//CREAR UNA NUEVA ALARMA
router.post('/alarm-rule', checkAuth, async (req, res) => {

    var newRule = req.body.newRule;
    newRule.userId = req.userData._id;

    var r = await createAlarmRule(newRule);

    if (r) {

        const response = {
            status: "success",
        }

        return res.json(response);

    } else {
        const response = {
            status: "error",
        }

        return res.status(500).json(response);
    }

});

// ACTUALIZAR ALARMA

router.put("/alarm-rule",checkAuth, async (req, res) => {

    const rule = req.body.rule;

    var r = await updateAlarmRuleStatus(rule.alarmrule_emqx_rule_id, rule.alarmrule_status)

if (r.status == "success") {

    const toSend = {
        status: "success"
    };

    return res.json(toSend);
    
}else{
    const toSend = {
        status: "success"
    };

    return res.json(toSend);
}    

}); 

// ELIMINAR ALARMA

router.delete("/alarm-rule",checkAuth, async (req, res) => {

        const emqxRuleId = req.query.alarmrule_emqx_rule_id

        var r = await deleteAlarmRule(emqxRuleId);
    
        if (r) {

            const toSend = {
                status: "success",
            };
        
            return res.json(toSend);
            
        } else {
            console.log("ERROR AL BORRAR EL EQUIPO");
            console.log(error);
            const toSend = {
                status: "Error",
                error: error
            }
        
            return res.status(500).json(toSend);   
        }
    


}); 



/* 
______ _   _ _   _ _____ _____ _____ _____ _   _  _____ 
|  ___| | | | \ | /  __ \_   _|_   _|  _  | \ | |/  ___|
| |_  | | | |  \| | /  \/ | |   | | | | | |  \| |\ `--. 
|  _| | | | | . ` | |     | |   | | | | | | . ` | `--. \
| |   | |_| | |\  | \__/\ | |  _| |_\ \_/ / |\  |/\__/ /
\_|    \___/\_| \_/\____/ \_/  \___/ \___/\_| \_/\____/  
*/

//CREAR ALARMA
async function createAlarmRule(newAlarm) {

    const url = "http://"+process.env.EMQX_NODE_HOST+":8085/api/v4/rules";

    // topicExample = userid/did/temp  //msgExample = {value: 20}
    const topic = "data/" + newAlarm.userId + "/" + newAlarm.equipment_id + "/" + newAlarm.variable;

    const rawsql = "SELECT username, topic, payload FROM \"" + topic + "\" WHERE payload.value "  + newAlarm.condition + " " + newAlarm.value + " AND is_not_null(payload.value)";

    var newRule = {
        rawsql: rawsql,
        actions: [{
            name: "data_to_webserver",
            params: {
                $resource: global.alarmResource.id,
                payload_tmpl: '{"userId":"' + newAlarm.userId + '","payload":${payload},"topic":"${topic}"}'
            }
        }],
        description: "ALARM-RULE",
        enabled: newAlarm.status
    }

    //save rule in emqx - grabamos la regla en emqx
    const res = await axios.post(url, newRule, auth);

    var emqxRuleId = res.data.data.id;


    if (res.data.data && res.status === 200) {

        //save rule in mongo -- grabamos regla en mongo
        const mongoRule = await AlarmRule.create({

            alarmrule_user_id: newAlarm.userId,
            alarmrule_equipment_id: newAlarm.equipment_id ,
            alarmrule_emqx_rule_id: emqxRuleId ,
            alarmrule_variable_name: newAlarm.variableFullName ,
            alarmrule_variable_id: newAlarm.variable ,
            alarmrule_value: newAlarm.value,
            alarmrule_condition: newAlarm.condition,
            alarmrule_triggerTime: newAlarm.triggerTime,
            alarmrule_status: newAlarm.status,
            alarmrule_createdTime: Date.now()
        });

        const url = "http://"+process.env.EMQX_NODE_HOST+":8085/api/v4/rules/" + mongoRule.alarmrule_emqx_rule_id;

        const payload_templ = '{"notification_user_id":"' + newAlarm.userId + '","notification_equipment_id":"' + newAlarm.equipment_id + '","notification_equipment_name":"' + newAlarm.equipment_name + '","notification_payload":${payload},"notification_topic":"${topic}","notification_emqx_rule_id":"' + mongoRule.alarmrule_emqx_rule_id + '","notification_value":' + newAlarm.value + ',"notification_condition":"' + newAlarm.condition + '","notification_variable_id":"' + newAlarm.variable + '","notification_variable_name":"' + newAlarm.variableFullName + '","notification_triggerTime":' + newAlarm.triggerTime + '}';
        
        newRule.actions[0].params.payload_tmpl = payload_templ;

        const res = await axios.put(url, newRule, auth);

        console.log("Nueva Regla de Alarma Creada...".green);

        return true;
    
    }

}

//ACTUALIZAR ALARMA

async function updateAlarmRuleStatus(emqxRuleId, status) {
    const url = "http://"+process.env.EMQX_NODE_HOST+":8085/api/v4/rules/" + emqxRuleId;
  
    const newRule = {
      enabled: status
    };
  
    const res = await axios.put(url, newRule, auth);
  
    if (res.status === 200 && res.data.data) {
      await AlarmRule.updateOne({ alarmrule_emqx_rule_id: emqxRuleId }, { alarmrule_status: status });
      console.log("Alarma Actualizada...".green);
      return {
        status: "success",
        action: "updated"
      };
    }
}

//BORRAR ALARMA
async function deleteAlarmRule(emqxRuleId) {
    try {
  
      const url = "http://"+process.env.EMQX_NODE_HOST+":8085/api/v4/rules/" + emqxRuleId;
  
      const emqxRule = await axios.delete(url, auth);
  
      const deleted = await AlarmRule.deleteOne({ alarmrule_emqx_rule_id: emqxRuleId });
  
      return true;

    } catch (error) {
      console.log("Error al borrar la alarma");
      console.log(error);
      return false;
    }
}


module.exports = router;