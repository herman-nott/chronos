import Event from "../../database/models/Event.js";
import User from "../../database/models/User.js";
import checkEventPermission from "../../middleware/checkEventPermission.js";
import crypto from "crypto";

async function handleUpdateEvent(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;

        const event = await Event.findById(id).populate("calendar_id");

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        if (event.is_system_holiday || event.is_readonly) {
            return res.status(403).json({ 
                error: "Cannot edit system holiday events" 
            });
        }

        // Check event-level permissions (includes calendar AND event sharing)
        const canEdit = await checkEventPermission(
            id, 
            req.session.user.id, 
            'edit'
        );
        
        if (!canEdit) {
            return res.status(403).json({ error: "Access denied: No permission to edit this event" });
        }

        // kolkhoz
        if (updates.category === "arrangement" && updates.participants) {
            const newParticipants = Array.isArray(updates.participants) 
                ? updates.participants.filter(p => p.trim() !== "")
                : [];

            const oldParticipants = event.participants || [];

            // initialize shared_with if it doesn't exist
            if (!event.shared_with) {
                event.shared_with = [];
            }

            // find participants to add (in new list but not in old list)
            const participantsToAdd = newParticipants.filter(
                email => !oldParticipants.includes(email)
            );

            // find participants to remove (in old list but not in new list)
            const participantsToRemove = oldParticipants.filter(
                email => !newParticipants.includes(email)
            );

            // add new participants to shared_with
            for (const email of participantsToAdd) {
                if (!email.trim()) continue;
                
                // check if already in shared_with (might have been manually shared)
                const alreadyShared = event.shared_with.some(
                    share => share.email === email.trim()
                );

                if (!alreadyShared) {
                    const participantUser = await User.findOne({ email: email.trim() });
                    const shareToken = crypto.randomBytes(32).toString('hex');
                    
                    const shareEntry = {
                        email: email.trim(),
                        permission: 'edit', // participants can edit the event
                        accepted: true, // auto-accept
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

            // remove old participants from shared_with
            if (participantsToRemove.length > 0) {
                event.shared_with = event.shared_with.filter(share => {
                    const isRemovedParticipant = participantsToRemove.includes(share.email);
                    const isStillParticipant = newParticipants.includes(share.email);
                    
                    return !isRemovedParticipant || isStillParticipant;
                });
            }
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