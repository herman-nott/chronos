import Calendar from "../../database/models/Calendar.js";
import User from "../../database/models/User.js";

export default async function handleGetSharedCalendar(req, res) {
  try {
    const { shareToken } = req.params;

    // Find calendar with this share token
    const calendar = await Calendar.findOne({
      "shared_with.shareToken": shareToken
    });

    if (!calendar) {
      return res.status(404).json({ error: "Calendar not found" });
    }

    // Find the specific share entry
    const shareEntry = calendar.shared_with.find(
      share => share.shareToken === shareToken
    );

    // Get owner info
    const owner = await User.findById(calendar.owner);

    res.json({
      calendar: {
        _id: calendar._id,
        title: calendar.title,
        color: calendar.color,
        description: calendar.description
      },
      sharedBy: owner ? {
        username: owner.login,
        email: owner.email
      } : null,
      permission: shareEntry.permission
    });
  } catch (error) {
    console.error("Get shared calendar error:", error);
    res.status(500).json({ error: error.message });
  }
}