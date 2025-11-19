import Appointment from "../../database/models/Appointment.js";
import Calendar from "../../database/models/Calendar.js";

async function handleGetAppointments(req, res) {
    try {
        const { calendarId } = req.params;

        const calendar = await Calendar.findOne({ _id: calendarId, owner: req.session.user.id });
        if (!calendar) {
            return res.status(403).json({ error: "No access or calendar not found" });
        }

        const appointments = await Appointment.find({ calendar_id: calendarId });
        res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export default handleGetAppointments;
