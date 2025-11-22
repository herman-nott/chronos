import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    login: { 
        type: String, 
        unique: true, 
        required: true 
    },
    email: { 
        type: String, 
        unique: true, 
        required: true 
    },
    password_hash: { 
        type: String, 
        required: true 
    },
    full_name: {
        type: String
    },
    locale: { 
        type: String, 
        default: 'en-US' 
    },
    timezone: { 
        type: String, 
        default: 'UTC' 
    },
    country: {
        type: String,
        default: null
    },
    calendars: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Calendar' 
    }],
    is_email_confirmed: {
        type: Boolean
    }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

export default User;