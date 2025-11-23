import Event from "../../database/models/Event.js";
import Calendar from "../../database/models/Calendar.js";

async function handleGetEvents(req, res) {
    try {
        const { calendarId } = req.params;

        const calendar = await Calendar.findById(calendarId);

        if (!calendar) {
            return res.status(404).json({ error: "Calendar not found" });
        }

        const isOwner = String(calendar.owner) === req.session.user.id;
        const isMember = calendar.members?.some(
            memberId => String(memberId) === req.session.user.id
        );

        if (!isOwner && !isMember) {
            return res.status(403).json({ error: "Access denied" });
        }

        const events = await Event.find({ calendar_id: calendarId });
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export default handleGetEvents;