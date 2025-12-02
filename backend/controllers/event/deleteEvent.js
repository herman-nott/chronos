import Event from "../../database/models/Event.js";
import checkEventPermission from "../../middleware/checkEventPermission.js";

async function handleDeleteEvent(req, res) {
    try {
        const { id } = req.params;

        const event = await Event.findById(id).populate("calendar_id");

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        if (event.is_system_holiday || event.is_readonly) {
            return res.status(403).json({ 
                error: "Cannot delete system holiday events" 
            });
        }

        const canEdit = await checkEventPermission(
            id, 
            req.session.user.id, 
            'edit'
        );
        
        if (!canEdit) {
            return res.status(403).json({ error: "Access denied: No permission to delete this event" });
        }

        await event.deleteOne();

        res.json({ message: "Event deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

export default handleDeleteEvent;