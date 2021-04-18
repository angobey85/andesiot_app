import mongoose from "mongoose";
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  user_name: { type: String, required: [true] },
  user_email: { type: String, required: [true], unique: true},
  user_password: {  type: String, required: [true]},
});


//Validator
userSchema.plugin(uniqueValidator, { message: 'Error, Email ya Existe.'});


// convert to model
const User = mongoose.model('User', userSchema);

export default User;
