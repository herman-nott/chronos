// import libs
import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import session from "express-session";
import crypto from "crypto";
import nodemailer from "nodemailer";
import cors from "cors";

// .env
import 'dotenv/config';

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

    // === POST Requests ===
    app.post('/api/auth/register', (req, res) => { handleRegister(req, res, bcrypt, nodemailer) });
    app.post('/api/auth/register/verify-email', (req, res) => { handleVerifyEmail(req, res) });
    app.post('/api/auth/login', requireEmailConfirmed, (req, res) => { handleLogin(req, res, bcrypt) });
    app.post('/api/auth/logout', requireAuth, (req, res) => { handleLogout(req, res) });
    app.post('/api/auth/password-reset', (req, res) => { handlePasswordReset(req, res, crypto, nodemailer) });
    app.post('/api/auth/password-reset/:confirm_token', (req, res) => { handlePasswordResetConfirm(req, res, bcrypt, crypto) });

    // === PATCH Requests ===

    // === DELETE Requests ===

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

start();
