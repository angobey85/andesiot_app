import mongoose from "mongoose";
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const emqxRuleSchema = new Schema({

  user_id: { type: String, required: [true] },
  equipment_id: { type: String },
  username: { type: String, required: [true]},
  password: {  type: String, required: [true]},
  publish: { type: Array},
  subscribe: { type: Array},
  type: {  type: String, required: [true]},  
  date: {  type: Number},
  updateDate: {  type: Number}
});


//Validator
// convert to model
const EmqxRule = mongoose.model('EmqxRule', emqxRuleSchema);

export default EmqxRule;