import User from "../../database/models/User.js";

async function handleUpdateSettings(req, res) {
    try {
        const userId = req?.session?.user?.id;

        const { country, time_format } = req.body;

        const updated = await User.findByIdAndUpdate(
            userId,
            { country, time_format },
            { new: true }
        );

        res.json({
            success: true,
            user: {
                country: updated.country,
                locale: updated.country,
                time_format: updated.time_format
            }
        });
    } catch (err) {
        console.error("Update settings error:", err);
        res.status(500).json({ error: "Server error" });
    }
}

export default handleUpdateSettings;
