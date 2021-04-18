  
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const dataSchema = new Schema({
  data_userId: { type: String, required: [true] },
  data_equipment_id: { type: String, required: [true] },
  data_variable: { type: String, required: [true] },
  data_value: { type: Number, required: [true] },
  data_time: { type: Number, required: [true] }
});

// Convertir a modelo
const Data = mongoose.model("Data", dataSchema);

export default Data;