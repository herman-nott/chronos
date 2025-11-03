import mongoose from 'mongoose';

const PasswordResetSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, // ссылка на пользователя
        ref: 'User',
        required: true
    },
    token_hash: { 
        type: String, 
        required: true,
        index: true // индекс для быстрого поиска
    },
    expires_at: { 
        type: Date, 
        required: true 
    },
    used: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

const PasswordReset = mongoose.model('PasswordReset', PasswordResetSchema);

export default PasswordReset;
