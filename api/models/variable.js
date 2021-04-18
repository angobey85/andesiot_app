import mongoose from "mongoose";
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const variableSchema = new Schema({

    variable_user_id: { type: String, required: [true] },
    variable_id: { type: String, required: [true], unique: true},
    variable_name: {  type: String, required: [true]},
    variable_med: {  type: String, required: [true]},
    variable_template: { type: String, required: [true]},
    variable_template_id: { type: String, required: [true]},
    variable_date: { type: Number}
});


//Validator
variableSchema.plugin(uniqueValidator, { message: 'Error, Variable ya Existe.'});


// convert to model
const Variable = mongoose.model('Variable', variableSchema);

export default Variable;
