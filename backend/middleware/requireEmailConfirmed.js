import User from "../database/models/User.js";

async function requireEmailConfirmed(req, res, next) {
    try {
        const { emailOrLogin } = req.body;

        if (!emailOrLogin) {
            return res.status(400).json({ error: "Email or Login is required" });
        }

        const user = await User.findOne({
            $or: [{ email: emailOrLogin }, { login: emailOrLogin }]
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!user.is_email_confirmed) {
            return res.status(403).json({ error: "Email is not confirmed." });
        }

        // email подтверждён, пропускаем дальше
        next();
    } catch (error) {
        console.error("Error in requireEmailConfirmed middleware:", error);
        res.status(500).json({ error: "Server error" });
    }
}

export default requireEmailConfirmed;
