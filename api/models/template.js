import mongoose from "mongoose";
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const templateSchema = new Schema({

  template_user_id: { type: String, required: [true] },
  template_name: { type: String, required: [true], unique: true},
  template_description: {  type: String},
  template_date: { type: Number, required: [true]},
  template_widgets: {type: Array, default: []}

});


// convert to model
const Template = mongoose.model('Template', templateSchema);

export default Template;
