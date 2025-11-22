import Calendar from "../../database/models/Calendar.js";
import User from "../../database/models/User.js";

async function handleGetCalendars(req, res) {
    try {
        const userId = req.session?.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const myCalendars = await Calendar.find({ owner: userId });

        /*const otherCalendars = await Calendar.find({ 
            members: userId,
            owner: { $ne: userId }
        });*/

        const sharedCalendars = await Calendar.find({
            $or: [
                { "shared_with.user_id": userId },
                { "shared_with.email": user.email },
            ],
        });

        return res.status(200).json({
            myCalendars,
            otherCalendars: sharedCalendars,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export default handleGetCalendars;
