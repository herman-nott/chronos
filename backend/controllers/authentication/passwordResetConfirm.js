import User from "../../database/models/User.js";
import PasswordReset from "../../database/models/PasswordReset.js";

async function handlePasswordResetConfirm(req, res, bcrypt, crypto) {
    try {
        const { confirm_token } = req.params;
        const { new_password } = req.body;
        const { new_password_confirmation } = req.body;

        if (!new_password) {
            return res.status(400).json({ error: "Password is required" });
        }

        if (new_password !== new_password_confirmation) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        if (new_password.length < 6) {
            return res.status(400).json({ error: "Password must contain at least 6 characters" });
        }

        // поиск токена
        const tokenHash = crypto.createHash('sha256').update(confirm_token).digest('hex');
        const resetToken = await PasswordReset.findOne({ token_hash: tokenHash });

        // проверить наличие, скрок действия и использование токена
        if (!resetToken) {
            return res.status(400).json({ error: 'Invalid token' });
        }

        if (resetToken.used) {
            return res.status(400).json({ error: "Token is already used" });   
        }

        if (new Date(resetToken.expires_at) < new Date()) {
            return res.status(400).json({ error: "Token has expired" });
        }

        // получить пользователя
        const user = await User.findById(resetToken.user_id);
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const hashedNewPassword = await bcrypt.hash(new_password, 10);

        // обновить пароль
        user.password_hash = hashedNewPassword;
        await user.save();

        // поменять у токена used на true
        resetToken.used = true;
        await resetToken.save();

        return res.json({ message: "Password has been reset successfully" });        
    } catch (error) {
        // console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
}

export default handlePasswordResetConfirm;