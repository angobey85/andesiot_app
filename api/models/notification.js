import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const notificationSchema = new Schema({

    notification_user_id: { type: String, required: [true] },
    notification_equipment_name: { type: String, required: [true] },
    notification_equipment_id: { type: String, required: [true] },
    notification_payload: { type: Object },
    notification_emqx_rule_id: { type: String, required: [true] },
    notification_topic: { type: String, required: [true] },
    notification_value: { type: Number, required: [true] },
    notification_condition: { type: String, required: [true] },
    notification_variable_name: { type: String, required: [true] },
    notification_variable_id: { type: String, required: [true] },
    notification_readed: {type: Boolean, required: [true]},
    notification_date: {type: Number, required: [true]}

});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;  
