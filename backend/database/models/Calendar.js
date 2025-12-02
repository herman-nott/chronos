import mongoose from 'mongoose';

const CalendarSchema = new mongoose.Schema({
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    color: { 
        type: String, 
        default: '#2196F3' // цвет для UI
    },
    is_visible: { 
        type: Boolean, 
        default: true 
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ], 

    // зашарить с челиком, приглосы
    shared_with: [
        {
            userid: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            email: String, // для приглосов
            permission: {
                type: String,
                enum: ["view", "edit"],
                default: "view",
            },
            accepted: {
                type: Boolean,
                default: false,
            },
            shareToken: {
                type: String,
                unique: true,
                sparse: true
            },
            sharedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            sharedAt: {
                type: Date,
                default: Date.now
            }
        },
    ],
    
    is_system_holiday: { 
        type: Boolean
    },
    is_readonly: { 
        type: Boolean
    },
},
{ timestamps: true });

const Calendar = mongoose.model('Calendar', CalendarSchema);

export default Calendar;