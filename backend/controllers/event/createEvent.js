import Event from "../../database/models/Event.js";
import Calendar from "../../database/models/Calendar.js";

async function handleCreateEvent(req, res) {
    try {
        const { calendarId } = req.params;
        const {
            title,
            description,
            category,
            start_time,
            end_time,
            location,
            participants,
            due_date,
            reminder_time,
            is_all_day,
            reminders
        } = req.body;

        const calendar = await Calendar.findById(calendarId);
        if (!calendar) {
            return res.status(404).json({ error: "Calendar not found" });
        }

        if (String(calendar.owner) !== req.session.user.id) {
            return res.status(403).json({ error: "Access denied" });
        }

        const eventData = {
            calendar_id: calendarId,
            title,
            description,
            category,
            is_all_day: !!is_all_day,
            reminders: reminders || []
        };

        if (category === "arrangement") {
            if (!start_time || !end_time) {
                return res.status(400).json({ error: "Start and end time required for arrangement" });
            }
            eventData.start_time = start_time;
            eventData.end_time = end_time;
            eventData.location = location || "";
            eventData.participants = Array.isArray(participants)
                ? participants.filter(p => p.trim() !== "")
                : [];
        } else if (category === "reminder") {
            if (!reminder_time) {
                return res.status(400).json({ error: "reminder_time required for reminder" });
            }
            eventData.reminder_time = reminder_time;
        } else if (category === "task") {
            if (!due_date) {
                return res.status(400).json({ error: "due_date required for task" });
            }
            eventData.due_date = due_date;
            eventData.is_completed = false;
        } else {
            return res.status(400).json({ error: "Invalid category" });
        }

        const event = new Event(eventData);
        await event.save();

        res.status(201).json({ message: "Event created", event });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

export default handleCreateEvent;
