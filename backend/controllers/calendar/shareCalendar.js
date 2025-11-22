import Calendar from "../../database/models/Calendar.js";
import User from "../../database/models/User.js";

export default async function handleShareCalendar(req, res, nodemailer) {
  try {
    const { calendarId } = req.params;
    const { email, permission = "view" } = req.body;
    const userId = req.session?.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const calendar = await Calendar.findById(calendarId);
    if (!calendar) {
      return res.status(404).json({ error: "Calendar not found" });
    }

    if (calendar.owner.toString() !== userId) {
      return res.status(403).json({ error: "Only owner can share calendar" });
    }

    // Check if user exists
    const invitedUser = await User.findOne({ email });

    // Add to shared_with
    const shareEntry = {
      email,
      permission,
      accepted: false,
    };

    if (invitedUser) {
      shareEntry.userid = invitedUser._id;
    }

    // Check if already shared
    const alreadyShared = calendar.shared_with.some(
      (share) => share.email === email
    );

    if (alreadyShared) {
      return res.status(400).json({ error: "Calendar already shared with this user" });
    }

    calendar.shared_with.push(shareEntry);
    await calendar.save();

    // Email notification integration?

    res.json({ message: "Calendar shared successfully", calendar });
  } catch (error) {
    console.error("Share calendar error:", error);
    res.status(500).json({ error: error.message });
  }
}