import Task from "../../database/models/Task.js";
import Calendar from "../../database/models/Calendar.js";

async function handleCreateTask(req, res) {
    try {
        const { calendarId } = req.params;
        const { title, description, due_date, is_completed, reminders } = req.body;

        const calendar = await Calendar.findOne({ _id: calendarId, owner: req.session.user.id });
        if (!calendar) {
            return res.status(403).json({ error: "No access or calendar not found" });
        }

        const newTask = new Task({
            calendar_id: calendarId,
            title,
            description,
            due_date,
            is_completed,
            reminders
        });

        await newTask.save();

        res.status(201).json({ message: "Task created", task: newTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export default handleCreateTask;