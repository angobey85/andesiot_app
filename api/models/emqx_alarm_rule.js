import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const alarmRuleSchema = new Schema({
    alarmrule_user_id: {type: String, required: [true]},
    alarmrule_equipment_id: { type: String, required: [true] },
    alarmrule_emqx_rule_id: { type: String, required: [true] },
    alarmrule_variable_name: { type: String },
    alarmrule_variable_id: { type: String },
    alarmrule_value: {type: Number},
    alarmrule_condition:  { type: String },
    alarmrule_triggerTime: { type: Number },
    alarmrule_status:  { type: Boolean },
    alarmrule_counter: { type: Number, default: 0},
    alarmrule_createdTime: {type: Number}
});



const AlarmRule = mongoose.model('alarmRule', alarmRuleSchema);


export default AlarmRule;  