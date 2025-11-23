import Event from "../../database/models/Event.js";
import Calendar from "../../database/models/Calendar.js";

async function handleGetEvents(req, res) {
    try {
        const { calendarId } = req.params;

        const calendar = await Calendar.findById(calendarId);

        if (!calendar) {
            return res.status(404).json({ error: "Calendar not found" });
        }

        if (String(calendar.owner) !== req.session.user.id) {
            return res.status(403).json({ error: "Access denied" });
        }

        const events = await Event.find({ calendar_id: calendarId });
        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

export default handleGetEvents;
