import User from '../../database/models/User.js';
import Calendar from '../../database/models/Calendar.js';
import crypto from 'crypto';

async function handleInviteToCalendar(req, res, nodemailer) {
    try {
        const { calendarId } = req.params;
        const { email, permission = 'edit' } = req.body; // Default to 'edit' if not set

        const currentUserId = req.session.user.id;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const calendar = await Calendar.findById(calendarId);
        if (!calendar) return res.status(404).json({ message: "Calendar not found" });

        if (calendar.members.includes(user._id)) {
            return res.status(400).json({ message: "User already invited" });
        }

        if (user._id.toString() === currentUserId.toString()) {
            return res.status(400).json({ message: "You cannot invite yourself" });
        }

        calendar.members.push(user._id);

        const shareToken = crypto.randomBytes(32).toString('hex');
        calendar.shared_with.push({
            email: user.email,
            userid: user._id,
            permission: permission,
            accepted: true, // Auto-accept for invited members
            shareToken,
            sharedBy: currentUserId,
            sharedAt: new Date()
        });

        await calendar.save();

        try {
            const transporter = nodemailer.createTransporter({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });

            const mailOptions = {
                from: process.env.FROM_EMAIL,
                to: user.email,
                subject: `You were added to the calendar "${calendar.title}"`,
                html: `
                    <p>Hi ${user.full_name || user.login},</p>
                    <p>You have been added to the calendar <b>"${calendar.title}"</b> by ${req.session.user?.login || "someone"}.</p>
                    <p>Open the app to view events and stay updated!</p>
                    <p>— Chronos Team</p>
                `
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
        }

        res.json({ message: `User ${email} invited successfully with ${permission} permission.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

export default handleInviteToCalendar;