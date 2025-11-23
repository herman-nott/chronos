import Calendar from "../../database/models/Calendar.js";

async function handleGetCalendars(req, res) {
    try {
        const userId = req.session?.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const myCalendars = await Calendar.find({ owner: userId });

        const otherCalendars = await Calendar.find({ 
            members: userId,
            owner: { $ne: userId }
        });        

        return res.status(200).json({
            myCalendars,
            otherCalendars
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

export default handleGetCalendars;