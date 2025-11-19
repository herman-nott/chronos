import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
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
    participants: [{ 
        type: String 
    }],
    reminders: [{ 
        type: Number 
    }]
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', AppointmentSchema);

export default Appointment;
