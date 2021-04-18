import mongoose from "mongoose";
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const saveRuleSchema = new Schema({

    saverule_user_id: { type: String, required: [true] },
    saverule_equipment_id: {  type: String, required: [true]},
    saverule_emqx_rule_id: {  type: String, required: [true]},
    saverule_status: {  type: Boolean, required: [true]}

});


//Validator
saveRuleSchema.plugin(uniqueValidator, { message: 'Error, Regla ya Existe.'});


// convert to model
const SaveRule = mongoose.model('SaveRule', saveRuleSchema);

export default SaveRule;
