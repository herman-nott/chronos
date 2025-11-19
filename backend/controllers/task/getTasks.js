import Task from "../../database/models/Task.js";
import Calendar from "../../database/models/Calendar.js";

async function handleGetTasks(req, res) {
    try {
        const { calendarId } = req.params;

        const calendar = await Calendar.findOne({ _id: calendarId, owner: req.session.user.id });
        if (!calendar) {
            return res.status(403).json({ error: "No access or calendar not found" });
        }

        const tasks = await Task.find({ calendar_id: calendarId });
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export default handleGetTasks;
