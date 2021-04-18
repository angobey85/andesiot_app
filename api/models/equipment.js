import mongoose from "mongoose";
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const equipmentSchema = new Schema({

    equipment_user_id: { type: String, required: [true] },
    equipment_id: { type: String, required: [true], unique: true },
    equipment_name: {  type: String, required: [true]},
    equipment_brand: {  type: String, required: [true]},
    equipment_model: {  type: String, required: [true]},
    equipment_tag: {  type: String, required: [true]},
    equipment_template_name: { type: String, required: [true]},
    equipment_template_id: { type: String, required: [true]},
    equipment_selected: { type: Boolean, required: [true], default: false },
    equipment_date: { type: Number}
});


//Validator
equipmentSchema.plugin(uniqueValidator, { message: 'Error, Equipment ya Existe.'});


// convert to model
const Equipment = mongoose.model('Equipment', equipmentSchema);

export default Equipment;
