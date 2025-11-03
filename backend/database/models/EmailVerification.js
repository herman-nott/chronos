import mongoose from 'mongoose';

const EmailVerificationSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, // ссылка на пользователя
        ref: 'User',
        required: true 
    },
    code: { 
        type: String, // 6-значный код
        required: true 
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    expires_at: { 
        type: Date, 
        required: true 
    }
}, { timestamps: true });

const EmailVerification = mongoose.model('EmailVerification', EmailVerificationSchema);

export default EmailVerification;
