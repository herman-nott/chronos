import Event from "../../database/models/Event.js";

async function handleDeleteEvent(req, res) {
    try {
        const { id } = req.params;

        const event = await Event.findById(id).populate("calendar_id");
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        if (String(event.calendar_id.owner) !== req.session.user.id) {
            return res.status(403).json({ error: "No access" });
        }

        await event.deleteOne();

        res.status(200).json({ message: "Event deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export default handleDeleteEvent;
