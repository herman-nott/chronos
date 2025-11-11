import Event from "../../database/models/Event.js";
import Calendar from "../../database/models/Calendar.js";

async function handleGetEvents(req, res) {
    try {
        const { calendarId } = req.params;

        const calendar = await Calendar.findOne({ _id: calendarId, owner: req.session.user.id });
        if (!calendar) {
            return res.status(403).json({ error: "No access or calendar not found" });
        }

        const events = await Event.find({ calendar_id: calendarId });
        res.status(200).json(events);
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

export default handleGetEvents;
