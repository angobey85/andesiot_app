import mongoose from "mongoose";
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const deviceSchema = new Schema({

    device_user_id: { type: String, required: [true] },
    device_id: { type: String, required: [true], unique: true},
    device_serie: { type: String, required: [true]},
    device_name: {  type: String, required: [true]},
    device_model: {  type: String, required: [true]},
    device_date: { type: Number}
});


//Validator
deviceSchema.plugin(uniqueValidator, { message: 'Error, Dispositivo ya Existe.'});


// convert to model
const Device = mongoose.model('Device', deviceSchema);

export default Device;
