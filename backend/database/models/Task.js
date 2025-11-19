import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    calendar_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Calendar', required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    due_date: { 
        type: Date,
        required: true 
    },
    is_completed: { 
        type: Boolean, 
        default: false 
    }, 
    reminders: [{ 
        type: Number 
    }]
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);

export default Task;
