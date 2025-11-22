import Event from "../../database/models/Event.js";
import Calendar from "../../database/models/Calendar.js";
import User from "../../database/models/User.js";

async function handleGetEvents(req, res) {
    try {
        const { calendarId } = req.params;
        const userId = req.session?.user?.id;

        if (!userId) {
            return res.status(401).json({error: "Not authenticated"});
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const calendar = await Calendar.findById(calendarId);

        if (!calendar) {
            return res.status(404).json({ error: "Calendar not found" });
        }

        const isOwner = calendar.owner.toString() === userId;
        const isShared = calendar.shared_with.some(
            (share) => 
            share.userid?.toString() === userId ||
            share.email === user.email
        );

        //if (String(calendar.owner) !== req.session.user.id) {
        if (!isOwner && !isShared) {
            return res.status(403).json({ error: "Access denied" });
        }

        const calendarEvents = await Event.find({ calendar_id: calendarId });
        const participantEvents = await Event.find({
            category: "arrangement",
            participants: user.email, // нгл, лучше логины - но покуй, окей
            calendar_id: { $ne: calendarId },
        });

        const allEvents = [...calendarEvents, ...participantEvents];
        
        res.json(allEvents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export default handleGetEvents;
