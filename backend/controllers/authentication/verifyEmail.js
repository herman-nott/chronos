import User from "../../database/models/User.js";
import EmailVerification from "../../database/models/EmailVerification.js";

async function handleVerifyEmail(req, res) {
    const { code } = req.body;
    
    const userId = req.session?.user?.id;

    if (!userId || !code) {
        return res.status(400).json({ error: "User ID and code are required" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const record = await EmailVerification.findOne({ user_id: user._id, code });
        if (!record) {
            return res.status(400).json({ error: "Invalid or expired code" });
        }

        user.is_email_confirmed = true;
        await user.save();

        // удаляем запись с кодом
        await EmailVerification.deleteOne({ _id: record._id });

        const { password_hash, ...safeUser } = user.toObject();

        res.json({
            message: "Email confirmed successfully",
            user: safeUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json('Server error');
    }
}

export default handleVerifyEmail;