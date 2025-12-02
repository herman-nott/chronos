import Event from "../../database/models/Event.js";
import Calendar from "../../database/models/Calendar.js";
import User from "../../database/models/User.js";
import hasCalendarPermission from "../../middleware/checkCalendarPermission.js";
import crypto from "crypto";

async function handleCreateEvent(req, res) {
    try {
        const { calendarId } = req.params;
        const {
            title,
            description,
            category,
            start_time,
            end_time,
            location,
            participants,
            due_date,
            reminder_time,
            is_all_day,
            reminders,
            color
        } = req.body;

        const calendar = await Calendar.findById(calendarId);
        if (!calendar) {
            return res.status(404).json({ error: "Calendar not found" });
        }

        if (calendar.is_holiday_calendar || calendar.is_readonly) {
            return res.status(403).json({ 
                error: "Cannot create events in this calendar" 
            });
        }

        const canEdit = await hasCalendarPermission(calendarId, req.session.user.id, 'edit');
        if (!canEdit) {
            return res.status(403).json({ error: "Access denied: No clearance" });
        }

        const eventData = {
            calendar_id: calendarId,
            title,
            description,
            category,
            color: color || '#4285F4',
            is_all_day: !!is_all_day,
            reminders: reminders || []
        };

        if (category === "arrangement") {
            if (!start_time || !end_time) {
                return res.status(400).json({ error: "Start and end time required for arrangement" });
            }
            eventData.start_time = start_time;
            eventData.end_time = end_time;
            eventData.location = location || "";
            eventData.participants = Array.isArray(participants)
                ? participants.filter(p => p.trim() !== "")
                : [];
        } else if (category === "reminder") {
            if (!reminder_time) {
                return res.status(400).json({ error: "reminder_time required for reminder" });
            }
            eventData.reminder_time = reminder_time;
        } else if (category === "task") {
            if (!due_date) {
                return res.status(400).json({ error: "due_date required for task" });
            }
            eventData.due_date = due_date;
            eventData.is_completed = false;
        } else {
            return res.status(400).json({ error: "Invalid category" });
        }

        const event = new Event(eventData);

        // Auto-share event with participants
        if (category === "arrangement" && Array.isArray(participants) && participants.length > 0) {
            event.shared_with = [];
            
            for (const email of participants) {
                if (!email.trim()) continue;
                
                // Find user by email
                const participantUser = await User.findOne({ email: email.trim() });
                
                // Generate unique share token
                const shareToken = crypto.randomBytes(32).toString('hex');
                
                const shareEntry = {
                    email: email.trim(),
                    permission: 'view', // Participants get view-only by default
                    accepted: true, // Auto-accept since they were explicitly added
                    shareToken,
                    sharedBy: req.session.user.id,
                    sharedAt: new Date()
                };
                
                if (participantUser) {
                    shareEntry.userid = participantUser._id;
                }
                
                event.shared_with.push(shareEntry);
            }
        }

        await event.save();

        res.status(201).json({ 
            message: "Event created and shared with participants", 
            event 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

export default handleCreateEvent;