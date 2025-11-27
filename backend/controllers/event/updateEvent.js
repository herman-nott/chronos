import Event from "../../database/models/Event.js";
import hasCalendarPermission from "../../middleware/checkCalendarPermission.js";

async function handleUpdateEvent(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;

        const event = await Event.findById(id).populate("calendar_id");

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        const canEdit = await hasCalendarPermission(
            event.calendar_id._id, 
            req.session.user.id, 
            'edit'
        );
        
        if (!canEdit) {
            return res.status(403).json({ error: "Access denied: No clearance" });
        }

        Object.assign(event, updates);

        await event.save();

        res.json({ message: "Event updated", event });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

export default handleUpdateEvent;
