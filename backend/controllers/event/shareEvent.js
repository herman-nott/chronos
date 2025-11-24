import Event from "../../database/models/Event.js";
import Calendar from "../../database/models/Calendar.js";
import User from "../../database/models/User.js";
import crypto from "crypto";

export default async function handleShareEvent(req, res, nodemailer) {
  try {
    const { eventId } = req.params;
    const { email, permission = "view" } = req.body;
    const userId = req.session?.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if user has permission to share (must own the calendar or have edit access)
    const calendar = await Calendar.findById(event.calendar_id);
    if (!calendar) {
      return res.status(404).json({ error: "Calendar not found" });
    }

    const isOwner = calendar.owner.toString() === userId;
    const isMember = calendar.members?.some(
      memberId => String(memberId) === userId
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({ error: "Only calendar members can share events" });
    }

    // Check if user exists
    const invitedUser = await User.findOne({ email });

    // Initialize shared_with array if it doesn't exist
    if (!event.shared_with) {
      event.shared_with = [];
    }

    // Check if already shared with this email
    const alreadyShared = event.shared_with.some(
      (share) => share.email === email
    );

    if (alreadyShared) {
      return res.status(400).json({ error: "Event already shared with this user" });
    }

    // Generate a unique share token for the link
    const shareToken = crypto.randomBytes(32).toString('hex');

    // Create share entry
    const shareEntry = {
      email,
      permission,
      accepted: false,
      shareToken,
      sharedBy: userId,
      sharedAt: new Date(),
    };

    if (invitedUser) {
      shareEntry.userid = invitedUser._id;
    }

    event.shared_with.push(shareEntry);
    await event.save();

    // Generate shareable link
    const shareLink = `http://localhost:5173/event/shared/${shareToken}`;

    // Optional: Send email notification
    
    res.json({ 
      message: "Event shared successfully", 
      event,
      shareLink 
    });
  } catch (error) {
    console.error("Share event error:", error);
    res.status(500).json({ error: error.message });
  }
}