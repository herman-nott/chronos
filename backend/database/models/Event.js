import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    calendar_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Calendar', 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    description: {
        type: String
    },
    start_time: { 
        type: Date, 
        required: true 
    },
    end_time: { 
        type: Date, 
        required: true 
    },
    location: {
        type: String
    },
    is_all_day: { 
        type: Boolean, 
        default: false 
    },
    reminders: [{ 
        type: Number // время уведомлений перед событием
    }],
}, { timestamps: true });

const Event = mongoose.model('Event', EventSchema);

export default Event;
