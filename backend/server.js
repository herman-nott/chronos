// import libs
import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import session from "express-session";
import crypto from "crypto";
import nodemailer from "nodemailer";
import cors from "cors";

// .env -- load from parent directory
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '../.env') });

// database
import connectDB from "./database/connection.js";

// controllers
// ~~~ Authentication ~~~
import handleRegister from "./controllers/authentication/register.js";
import handleVerifyEmail from "./controllers/authentication/verifyEmail.js";
import handleLogin from "./controllers/authentication/login.js";
import handleLogout from "./controllers/authentication/logout.js";
import handlePasswordReset from "./controllers/authentication/passwordReset.js";
import handlePasswordResetConfirm from "./controllers/authentication/passwordResetConfirm.js";
// ~~~ Calendar ~~~
import handleCreateCalendar from "./controllers/calendar/createCalendar.js";
import handleGetCalendars from "./controllers/calendar/getCalendars.js";
import handleUpdateCalendar from "./controllers/calendar/updateCalendar.js";
import handleDeleteCalendar from "./controllers/calendar/deleteCalendar.js";
// ~~~ Event ~~~
import handleCreateEvent from "./controllers/event/createEvent.js";
import handleGetEvents from "./controllers/event/getEvents.js";
import handleUpdateEvent from "./controllers/event/updateEvent.js";
import handleDeleteEvent from "./controllers/event/deleteEvent.js";
// ~~~ Task ~~~
import handleCreateTask from "./controllers/task/createTask.js";
import handleGetTasks from "./controllers/task/getTasks.js";
import handleUpdateTask from "./controllers/task/updateTask.js";
import handleDeleteTask from "./controllers/task/deleteTask.js";
// ~~~ Appointment ~~~
import handleCreateAppointment from "./controllers/appointment/createAppointment.js";
import handleGetAppointments from "./controllers/appointment/getAppointments.js";
import handleUpdateAppointment from "./controllers/appointment/updateAppointment.js";
import handleDeleteAppointment from "./controllers/appointment/deleteAppointment.js";

// middleware
import requireAuth from "./middleware/requireAuth.js";
import requireEmailConfirmed from "./middleware/requireEmailConfirmed.js";

async function start() {
    const app = express();
    const PORT = 3000;

    await connectDB();
    
    app.use(bodyParser.json());
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,                        // не сохранять сессию, если она не изменена
        saveUninitialized: false,             // не создавать сессию до первого использования
        cookie: { secure: false }             // для разработки secure: false, в проде с HTTPS нужно secure: true
    }));
    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true
    }));


    // === GET Requests ===
    app.get('/', (req, res) => {    
        res.send('getting root');
    });
    app.get('/api/calendars', requireAuth, (req, res) => { handleGetCalendars(req, res) });
    app.get('/api/events/:calendarId', requireAuth, (req, res) => { handleGetEvents(req, res) });
    app.get('/api/tasks/:calendarId', requireAuth, (req, res) => { handleGetTasks(req, res) });
    app.get('/api/appointments/:calendarId', requireAuth, (req, res) => { handleGetAppointments(req, res) });

    // === POST Requests ===
    app.post('/api/auth/register', (req, res) => { handleRegister(req, res, bcrypt, nodemailer) });
    app.post('/api/auth/register/verify-email', (req, res) => { handleVerifyEmail(req, res) });
    app.post('/api/auth/login', requireEmailConfirmed, (req, res) => { handleLogin(req, res, bcrypt) });
    app.post('/api/auth/logout', requireAuth, (req, res) => { handleLogout(req, res) });
    app.post('/api/auth/password-reset', (req, res) => { handlePasswordReset(req, res, crypto, nodemailer) });
    app.post('/api/auth/password-reset/:confirm_token', (req, res) => { handlePasswordResetConfirm(req, res, bcrypt, crypto) });
    app.post('/api/calendar', requireAuth, (req, res) => { handleCreateCalendar(req, res) });
    app.post('/api/events/:calendarId', requireAuth, (req, res) => { handleCreateEvent(req, res) });
    app.post('/api/tasks/:calendarId', requireAuth, (req, res) => { handleCreateTask(req, res) });
    app.post('/api/appointments/:calendarId', requireAuth, (req, res) => { handleCreateAppointment(req, res) });

    // === PATCH Requests ===
    app.patch('/api/calendars/:id', requireAuth, (req, res) => { handleUpdateCalendar(req, res) });
    app.patch('/api/events/:id', requireAuth, (req, res) => { handleUpdateEvent(req, res) });
    app.patch('/api/tasks/:id', requireAuth, (req, res) => { handleUpdateTask(req, res) });
    app.patch('/api/appointments/:id', requireAuth, (req, res) => { handleUpdateAppointment(req, res) });

    // === DELETE Requests ===
    app.delete('/api/calendars/:id', requireAuth, (req, res) => { handleDeleteCalendar(req, res) });
    app.delete('/api/events/:id', requireAuth, (req, res) => { handleDeleteEvent(req, res) });
    app.delete('/api/tasks/:id', requireAuth, (req, res) => { handleDeleteTask(req, res) });
    app.delete('/api/appointments/:id', requireAuth, (req, res) => { handleDeleteAppointment(req, res) });

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

start();
