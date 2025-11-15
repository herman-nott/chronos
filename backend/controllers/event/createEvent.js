import Event from "../../database/models/Event.js";
import Calendar from "../../database/models/Calendar.js";

async function handleCreateEvent(req, res) {
    try {
        const { calendarId } = req.params;
        const { title, description, start_time, end_time, location, is_all_day, reminders } = req.body;

        const calendar = await Calendar.findOne({ _id: calendarId, owner: req.session.user.id });
        if (!calendar) {
            return res.status(403).json({ error: "No access or calendar not found" });
        }

        const newEvent = new Event({
            calendar_id: calendarId,
            title,
            description,
            start_time,
            end_time,
            location,
            is_all_day,
            reminders
        });

        await newEvent.save();

        res.status(201).json({ message: "Event created", event: newEvent });
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

export default handleCreateEvent;