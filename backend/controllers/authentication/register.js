import User from "../../database/models/User.js";
import Calendar from "../../database/models/Calendar.js";
import EmailVerification from "../../database/models/EmailVerification.js";

//addited 
// import holidayFetch from "../holidays/hollidayFetch.js";


async function handleRegister(req, res, bcrypt, nodemailer) {

    const { login, password, password_confirmation, firstname, lastname, email, country, time_format, timezone } = req.body;

    try {
        if (password !== password_confirmation) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        if (!login || !email || !password || !password_confirmation) {
            return res.status(400).json({ error: "Please fill in all required fields" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must contain at least 6 characters" });
        }

        const existingLoginUser = await User.findOne({ login });
        const existingEmailUser = await User.findOne({ email });

        if (existingLoginUser && existingLoginUser.is_email_confirmed) {
            return res.status(400).json({ error: "Login is already taken" });
        }

        if (existingEmailUser && existingEmailUser.is_email_confirmed) {
            return res.status(400).json({ error: "Email is already registered" });
        }

        const hash = await bcrypt.hash(password, 10);

        let newUser;
        
        if ((existingLoginUser && !existingLoginUser.is_email_confirmed) || 
            (existingEmailUser && !existingEmailUser.is_email_confirmed)) {
            
            const userToUpdate = existingLoginUser || existingEmailUser;

            userToUpdate.login = login;
            userToUpdate.password_hash = hash;
            userToUpdate.full_name = `${firstname} ${lastname}`;
            userToUpdate.email = email;
            userToUpdate.updatedAt = new Date();
            // userToUpdate.locale = locale;

            newUser = await userToUpdate.save();
        } else {
            newUser = await User.create({
                login,
                password_hash: hash,
                full_name: `${firstname} ${lastname}`,
                email,
                // locale: "en-US",
                timezone: timezone || "UTC",
                calendars: [],
                is_email_confirmed: false,
                country: country.toLowerCase(),
                time_format: time_format
            });
        }

        const defaultCalendar = await Calendar.create({
            owner: newUser._id,
            title: `Main calendar`,
            color: "#2196F3",
            is_visible: true,
            members: []
        });

        //this aria addited by polina, could brake all code 
        //create holliday calendar 
        const holidayCalendar = await Calendar.create({
            owner: newUser._id,
            title: `holiday calendar`,
            color: "#018659",
            is_visible: true,
            members: [newUser._id],
            is_system_holiday: true,
            is_readonly: true
        });

       
        newUser.calendars.push(defaultCalendar._id);
        newUser.calendars.push(holidayCalendar._id);
        await newUser.save();

        // сгенерировать 6-значный код и срок действия
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await EmailVerification.create({
            user_id: newUser._id,
            code: code,
            expires_at: expiresAt
        });

        try {
            const transporter = nodemailer.createTransport({
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
                to: newUser.email,
                subject: 'Email Confirmation',
                text: `To complete your registration, please confirm your email.\n\nYour confirmation code: ${code}\n\nThis code is valid for 15 minutes.\n\nIf you did not sign up, ignore this message.`,
                html: `<p>To complete your registration, please confirm your email.</p>
                        <h2>Your confirmation code: <b>${code}</b></h2>
                        <p>This code is valid for <b>15 minutes</b>.</p>
                        <p>If you did not sign up, please ignore this email.</p>`
            };

            await transporter.sendMail(mailOptions);
            // console.log(`Password reset email sent to ${newUser.email}`);
        } catch (error) {
            // console.error('Error sending email confirmation email:', error);
            return res.status(500).json({ error: 'Unable to register' });
        }

        // добавить сессию
        req.session.userId = newUser._id;
        req.session.user = {
            id: newUser._id,
            login: newUser.login
        };

        res.json({
            message: "Please confirm your email using the 6-digit code sent to you."
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Unable to register');
    }
}

export default handleRegister;