import Calendar from "../../database/models/Calendar.js";
import crypto from "crypto";

export default async function handleGenerateShareLink(req, res) {
  try {
    const { calendarId } = req.params;
    const { permission = "view" } = req.body;
    const userId = req.session?.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const calendar = await Calendar.findById(calendarId);
    if (!calendar) {
      return res.status(404).json({ error: "Calendar not found" });
    }

    if (calendar.owner.toString() !== userId) {
      return res.status(403).json({ error: "Only owner can generate share links" });
    }

    // Check if a public share link already exists (one without email)
    const existingPublicShare = calendar.shared_with.find(
      share => !share.email && share.permission === permission && share.shareToken
    );

    if (existingPublicShare) {
      // Return existing link
      const shareLink = `http://localhost:5173/calendar/shared/${existingPublicShare.shareToken}`;
      return res.json({ 
        message: "Share link already exists", 
        shareLink,
        shareToken: existingPublicShare.shareToken 
      });
    }

    // Generate a new public share token
    const shareToken = crypto.randomBytes(32).toString('hex');

    const shareEntry = {
      permission,
      accepted: true, // Public links are auto-accepted
      shareToken,
      sharedBy: userId,
      sharedAt: new Date()
      // No email - this is a public link
    };

    calendar.shared_with.push(shareEntry);
    await calendar.save();

    const shareLink = `http://localhost:5173/calendar/shared/${shareToken}`;

    res.json({ 
      message: "Share link generated successfully", 
      shareLink,
      shareToken
    });
  } catch (error) {
    console.error("Generate share link error:", error);
    res.status(500).json({ error: error.message });
  }
}