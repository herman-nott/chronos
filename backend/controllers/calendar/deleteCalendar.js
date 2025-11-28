import Calendar from "../../database/models/Calendar.js";
import Event from "../../database/models/Event.js";
import mongoose from "mongoose";

async function handleDeleteCalendar(req, res) {
    const { id } = req.params;

    try {
        const calendar = await Calendar.findById(id);

        if (!calendar) {
            return res.status(404).json({ error: "Calendar not found" });
        }

        if (calendar.owner.toString() !== req.session.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }

        await Event.deleteMany({ calendar_id: new mongoose.Types.ObjectId(id) });

        await calendar.deleteOne();
        res.json({ message: "Calendar deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

export default handleDeleteCalendar;
