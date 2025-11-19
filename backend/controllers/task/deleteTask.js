import Task from "../../database/models/Task.js";

async function handleDeleteTask(req, res) {
    try {
        const { id } = req.params;

        const task = await Task.findById(id).populate("calendar_id");
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        if (String(task.calendar_id.owner) !== req.session.user.id) {
            return res.status(403).json({ error: "No access" });
        }

        await task.deleteOne();

        res.status(200).json({ message: "Task deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export default handleDeleteTask;
