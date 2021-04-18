//REQUERIMIENTOS
const express = require("express");
const router = express.Router();
const {checkAuth} = require('../middlewares/authentication.js');
const { default: Equipment } = require("../models/equipment.js");
const axios = require('axios');


/*                                              
 __  __  ___  _     ____  _____ _     ___  ____  
|  \/  |/ _ \| |   |  _ \| ____| |   / _ \/ ___| 
| |\/| | | | | |   | | | |  _| | |  | | | \___ \ 
| |  | | |_| | |___| |_| | |___| |__| |_| |___) |
|_|  |_|\___/|_____|____/|_____|_____\___/|____/                                                
*/

import equipment from '../models/equipment.js';
import SaveRule from '../models/emqx_saver_rule.js';
import Template from '../models/template.js';
import AlarmRule from '../models/emqx_alarm_rule.js';

/*                  
    _    ____ ___ 
   / \  |  _ |_ _|
  / _ \ | |_) | | 
 / ___ \|  __/| | 
/_/   \_|_|  |___|
*/             


const auth = {
    auth: {
        username: 'admin',
        password: process.env.EMQX_APPLICATION_SECRET
    }
}


//CONSULTAR

router.get("/equipment", checkAuth, async (req, res) => {

    try {

        const userId = req.userData._id;

        //OBTENER EQUIPOS

        var equipments = await Equipment.find({equipment_user_id: userId});

        //ARRAY MONGOOSE A ARRAY JS

        equipments = JSON.parse(JSON.stringify(equipments));

        //OBTENER REGLA DE SAVER

        const saveRules = await getSaveRules(userId)

        //OBTENER ALARMAS

        const alarmRules = await getAlarmRules(userId)

        //OBTENER PLANTILLAS

        const templates = await getTemplates(userId)

        //REGLA SAVER A EQUIPOS

        equipments.forEach((equipment, index) => {
            equipments[index].equipment_saveRule = saveRules.filter(saveRule => saveRule.saverule_equipment_id == equipment.equipment_id)[0];
            equipments[index].template = templates.filter(template => template._id == equipment.equipment_template_id)[0];
            equipments[index].alarmRule = alarmRules.filter(alarmRule => alarmRule.alarmrule_equipment_id == equipment.equipment_id);
          });
    
        const toSend = {
            status: "success",
            data: equipments
        }

        res.json(toSend);
        
    } catch (error) {

        const toSend = {
            status: "error",
            data: error
        }
        console.log ("ERROR AL CONSULTAR EQUIPOS")
        res.json(toSend);
        
    }
    


}); 


//INSERTAR

router.post("/equipment", checkAuth, async (req, res) => {

    try {

        const userId = req.userData._id;
        var newEquipment = req.body.newEquipment;
      
        newEquipment.equipment_user_id = req.userData._id;
        newEquipment.equipment_date = Date.now();
    
        await createSaveRule(userId, newEquipment.equipment_id, true);

        const equipment = await Equipment.create(newEquipment);
    
        const toSend = {
            status: "success",
        }
    
        return res.json(toSend);
        
    } catch (error) {

        console.log("ERROR AL CREAR EL EQUIPO");
        console.log(error);
        const toSend = {
            status: "error",
            error: error
        }
    
        return res.status(500).json(toSend);
        
    }



}); 

// BORRAR

router.delete("/equipment",checkAuth, async (req, res) => {


    try {

        const userId = req.userData._id;
        const equipmentId = req.query.equipment_id

        await deleteSaveRule(equipmentId);
    
        const result = await Equipment.deleteOne({equipment_user_id: userId, equipment_id: equipmentId})
    
        const toSend = {
            status: "success",
            data: result
        };
    
        return res.json(toSend);
        
    } catch (error) {

        console.log("ERROR AL BORRAR EL EQUIPO");
        console.log(error);
        const toSend = {
            status: "Error",
            error: error
        }
    
        return res.status(500).json(toSend);
        
    }



}); 

// ACTUALIZAR

router.put("/equipment",checkAuth, async (req, res) => {

    const eId = req.body.equipment_id;
    const userId = req.userData._id;
 
    if (await selectEquipment(userId, eId)) {
      const toSend = {
        status: "success"
      };
  
      return res.json(toSend);
    } else {
      const toSend = {
        status: "error"
      };
  
      return res.json(toSend);
    }

}); 

// ACTUALIZAR REGLA SAVER

router.put("/saver-rule",checkAuth, async (req, res) => {

  const rule = req.body.rule;

    await updateSaveRuleStatus(rule.saverule_emqx_rule_id, rule.saverule_status)

    const toSend = {
        status: "success"
    };

    res.json(toSend);

}); 

/*
  _____ _   _ _   _  ____ ___ ___  _   _ _____ ____  
 |  ___| | | | \ | |/ ___|_ _/ _ \| \ | | ____/ ___| 
 | |_  | | | |  \| | |    | | | | |  \| |  _| \___ \ 
 |  _| | |_| | |\  | |___ | | |_| | |\  | |___ ___) |
 |_|    \___/|_| \_|\____|___\___/|_| \_|_____|____/ 
                                                    
*/

async function selectEquipment(userId, eId) {
    try {
      const result = await Equipment.updateMany(
        { equipment_user_id: userId },
        { equipment_selected: false }
      );
  
      const result2 = await Equipment.updateOne(
        { equipment_id: eId, equipment_user_id: userId },
        { equipment_selected: true }
      );
  
      return true;
    } catch (error) {
      console.log("ERROR IN 'selectEquipment' FUNCTION ");
      console.log(error);
      return false;
    }
  }

//OBTENER PLANTILLA
async function getTemplates(userId) {
    try {
      const templates = await Template.find({ template_user_id: userId });
      return templates;
    } catch (error) {
      return false;
    }
  }


  //OBTENER REGLA SAVER
async function getSaveRules(userId) {
    try {
      const rules = await SaveRule.find({ saverule_user_id: userId });
      return rules;
    } catch (error) {
      return false;
    }
  }

  //OBTENER REGLA SAVER
  async function getAlarmRules(userId) {
    try {
      const rules = await AlarmRule.find({ alarmrule_user_id: userId });
      return rules;
    } catch (error) {
      return false;
    }
  }


//CREAR REGLA SAVER

async function createSaveRule(userId, equipment_id, status){

    try {

        const url = "http://"+process.env.EMQX_NODE_HOST+":8085/api/v4/rules"

        const topic = "data/" + userId + "/" + equipment_id + "/+";
        const rawsql = 'SELECT topic, payload FROM \"' + topic + '\" WHERE payload.save=1';
        var newRule = {
            rawsql : rawsql,
            actions: [
                {
                    name: "data_to_webserver",
                    params: {
                        $resource: global.saverResource.id,
                        payload_tmpl:
                            '{"userId":"' + userId +  '","payload":${payload},"topic":"${topic}"}'
                    }
                }
            ],
            description: "SAVER-RULE",
            enabled: status
        };
    
        const res = await axios.post(url,newRule, auth);
    
        if (res.status === 200 && res.data.data) {
    
            console.log(res.data.data);
    
            await SaveRule.create({
                saverule_user_id: userId,
                saverule_equipment_id: equipment_id,
                saverule_emqx_rule_id: res.data.data.id,
                saverule_status: status
            });
    
            return true;
          
        }else{
            return false;
        }
        
    } catch (error) {
        console.log("Error al crear la regla Saver")
        console.log(error)
    }




}

//ACTUALIZAR REGLA SAVER

async function updateSaveRuleStatus(emqxRuleId, status) {
    const url = "http://"+process.env.EMQX_NODE_HOST+":8085/api/v4/rules/" + emqxRuleId;
  
    const newRule = {
      enabled: status
    };
  
    const res = await axios.put(url, newRule, auth);
  
    if (res.status === 200 && res.data.data) {
      await SaveRule.updateOne({ saverule_emqx_rule_id: emqxRuleId }, { saverule_status: status });
      console.log("Saver Rule Status Updated...".green);
      return {
        status: "success",
        action: "updated"
      };
    }
}
  
  //BORRAR REGLA SAVER
async function deleteSaveRule(dId) {
    try {
      const mongoRule = await SaveRule.findOne({ saverule_equipment_id: dId });
  
      const url = "http://"+process.env.EMQX_NODE_HOST+":8085/api/v4/rules/" + mongoRule.saverule_emqx_rule_id;
  
      const emqxRule = await axios.delete(url, auth);
  
      const deleted = await SaveRule.deleteOne({ saverule_equipment_id: dId });
  
      return true;
    } catch (error) {
      console.log("Error deleting saver rule");
      console.log(error);
      return false;
    }
}



module.exports = router;