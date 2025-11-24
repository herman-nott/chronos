import Event from "../../database/models/Event.js";
import User from "../../database/models/User.js";

export default async function handleGetSharedEvent(req, res) {
  try {
    const { shareToken } = req.params;

    // Find event with this share token
    const event = await Event.findOne({
      'shared_with.shareToken': shareToken
    }).populate('calendar_id');

    if (!event) {
      return res.status(404).json({ error: "Event not found or share link is invalid" });
    }

    // Find the specific share entry
    const shareEntry = event.shared_with.find(s => s.shareToken === shareToken);

    if (!shareEntry) {
      return res.status(404).json({ error: "Share link is invalid" });
    }

    // Get sharer info
    const sharer = await User.findById(shareEntry.sharedBy);

    // Return event details with sharing information
    res.json({
      event: {
        _id: event._id,
        title: event.title,
        description: event.description,
        start: event.start,
        end: event.end,
        location: event.location,
        color: event.color,
      },
      calendar: event.calendar_id ? {
        _id: event.calendar_id._id,
        title: event.calendar_id.title,
        color: event.calendar_id.color,
      } : null,
      sharedBy: sharer ? {
        username: sharer.username,
        email: sharer.email,
      } : null,
      permission: shareEntry.permission,
      sharedAt: shareEntry.sharedAt,
    });
  } catch (error) {
    console.error("Get shared event error:", error);
    res.status(500).json({ error: error.message });
  }
}