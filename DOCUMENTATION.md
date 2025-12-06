# CHRONOS

1. [Short Description](#short-description)
2. [Current Status and Progress per CBL Stages](#current-status-and-progress-per-cbl-stages)
   - Engage
   - Investigate
   - Act
3. [Project Architecture and Algorithm](#project-architecture-and-algorithm)
4. [Main Components and Routes](#main-components-and-routes)
5. [Installation and Running](#installation-and-running)
6. [Environment Variables](#environment-variables)
7. [Docker Setup](#docker-setup)
8. [Example User Flows](#example-user-flows)
9. [Future Improvements](#future-improvements)

## Short Description

CHRONOS is a full-stack event calendar application built with **React.js (frontend)** and **Node.js (backend)** that provides comprehensive event management capabilities.  
It includes user authentication, calendar creation and management, event scheduling with multiple categories, collaborative features, and automated notifications.

**Key features:**
- User registration and authentication
- Multiple calendars per user with customization options
- Three event categories: arrangements, reminders, and tasks
- Calendar sharing and collaborative event management
- Email invitations for events
- Multiple calendar views (week, month, year)
- National holidays integration
- Event search and filtering
- Push and email notifications
- Responsive UI for all devices

---

## Current Status and Progress per CBL Stages

### Engage
**Goal:** Define the purpose and scope of the calendar application.
**Done:**
- Analyzed requirements for event management system
- Defined three main event categories and their purposes
- Established need for collaborative features and notifications
- Identified integration requirements with third-party APIs
- Determined Docker containerization requirements

**Result:** Clear understanding of business logic and technical requirements for a comprehensive event calendar system.

---

### Investigate
**Guiding Questions Answered:**
- **Business Logic:** Core functionality includes user management, calendar operations, event CRUD, sharing mechanisms, and notification systems
- **Framework Choice:** React.js for frontend (component-based, efficient), Node.js with Express for backend (scalable, JavaScript ecosystem)
- **Event Categories:** 
  - Arrangements: scheduled meetings with duration, location, participants
  - Reminders: time-based notifications without duration
  - Tasks: action items with completion status and deadlines
- **Database Choice:** MongoDB (flexible schema for varied event types, easy scaling)
- **Docker Benefits:** Consistent environments, easy deployment, isolated services, simplified setup for new developers

**Technologies Chosen:**
- **Frontend:** React.js with Vite for fast development
- **Backend:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Containerization:** Docker and Docker Compose
- **Styling:** CSS Modules for component-scoped styles
- **State Management:** React Context API and hooks
- **API Integration:** Axios for HTTP requests
- **Authentication:** JWT tokens and session management

**Result:** Solid technical foundation with modern, scalable technologies suitable for full-stack development.

---

### Act
**Goal:** Implement all required features and creative enhancements.

**Completed (Basic):**
- User registration and authentication system
- Automatic default calendar creation for new users
- Multiple calendar management with customization (name, description, color)
- Three event categories with specific functionality
- Dual event creation methods (inline and full-page)
- Calendar sharing and collaborative features
- Email invitation system
- Multiple calendar views (day, week, month, year)
- Week numbers display in weekly view
- Event search functionality
- Category-based event filtering
- Clickable events with preview information
- User rights management for shared calendars
- National holidays integration via API
- Docker containerization for all services
- Mobile view adaptation

**Completed (Creative):**
- Push and email notification system
- Event sharing functionality
- Multiple calendar representation styles
- Advanced event visualization
- Different time styles depiction
- National holidays adaptation for different countries

**Remaining:**
- Advanced recurring event patterns
- User personalization
- Minor bug fixes

---

## Project Architecture and Algorithm

### Folder Structure
```
chronos/
├── backend/
│   ├── controllers/
│   │   ├── authentication/
│   │   │   ├── login.js
│   │   │   ├── logout.js
│   │   │   ├── me.js
│   │   │   ├── passwordReset.js
│   │   │   ├── passwordResetConfirm.js
│   │   │   ├── register.js
│   │   │   └── verifyEmail.js
│   │   ├── calendar/
│   │   │   ├── createCalendar.js
│   │   │   ├── deleteCalendar.js
│   │   │   ├── generateShareLink.js
│   │   │   ├── getCalendars.js
│   │   │   ├── getMembers.js
│   │   │   ├── getSharedCalendar.js
│   │   │   ├── inviteUser.js
│   │   │   ├── removeMember.js
│   │   │   ├── shareCalendar.js
│   │   │   └── updateCalendar.js
│   │   ├── event/
│   │   │   ├── createEvent.js
│   │   │   ├── deleteEvent.js
│   │   │   ├── generateShareLink.js
│   │   │   ├── getAllUserEvents.js
│   │   │   ├── getEvents.js
│   │   │   ├── getSharedEvent.js
│   │   │   ├── shareEvent.js
│   │   │   └── updateEvent.js
│   │   ├── holidays/
│   │   │   ├── holidaysPopulate.js
│   │   │   └── hollidayFetch.js
│   │   └── user/
│   │       ├── searchUsers.js
│   │       └── updateSettings.js
│   ├── database
│   │   ├── models/
│   │   │   ├── Calendar.js
│   │   │   ├── EmailVerification.js
│   │   │   ├── Event.js
│   │   │   ├── Notification.js
│   │   │   ├── PasswordReset.js
│   │   │   └── User.js
│   │   └── connection.js
│   ├── middleware/
│   │   ├── checkCalendarPermission.js
│   │   ├── checkEventPermission.js
│   │   ├── requireAdmin.js
│   │   ├── requireAuth.js
│   │   └── requireEmailConfirmed.js
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── src/
│   │   ├── assets/
│   │   │   └── images/
│   │   │       ├── background.png
│   │   │       ├── logo.png
│   │   │       └── logo.svg
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login/
│   │   │   │   │   ├── Login.css
│   │   │   │   │   └── Login.jsx
│   │   │   │   ├── PasswordReset/
│   │   │   │   │   ├── PasswordReset.css
│   │   │   │   │   └── PasswordReset.jsx
│   │   │   │   ├── Register/
│   │   │   │   │   ├── Register.css
│   │   │   │   │   └── Register.jsx
│   │   │   │   └── VerifyEmail/
│   │   │   │       ├── VerifyEmail.css
│   │   │   │       └── VerifyEmail.jsx
│   │   │   ├── BigCalendar/
│   │   │   │   ├── BigCalendar.css
│   │   │   │   ├── BigCalendar.jsx
│   │   │   │   ├── CreateEvent.css
│   │   │   │   ├── CreateEvent.jsx
│   │   │   │   ├── DayCalendar.jsx
│   │   │   │   ├── MonthCalendar.css
│   │   │   │   ├── MonthCalendar.jsx
│   │   │   │   ├── Today.jsx
│   │   │   │   ├── WeekCalendar.css
│   │   │   │   ├── WeekCalendar.jsx
│   │   │   │   ├── YearCalendar.css
│   │   │   │   └── YearCalendar.jsx
│   │   │   ├── BodyClassController/
│   │   │   │   ├── BodyClassController.css
│   │   │   │   └── BodyClassController.jsx
│   │   │   ├── Calendar/
│   │   │   │   ├── Calendar.css
│   │   │   │   └── Calendar.jsx
│   │   │   ├── CurrentTimeLine/
│   │   │   │   └── CurrentTimeLine.jsx
│   │   │   ├── Event/
│   │   │   │   ├── Event.jsx
│   │   │   │   ├── EventPopup.jsx
│   │   │   │   ├── Task.jsx
│   │   │   │   └── WeekEventContainer.jsx
│   │   │   ├── LeftSide/
│   │   │   │   ├── LeftSide.css
│   │   │   │   └── LeftSide.jsx
│   │   │   ├── ParticleBackground/
│   │   │   │   └── ParticleBackground.jsx
│   │   │   ├── PopUp/
│   │   │   │   ├── EditCalendar.jsx
│   │   │   │   ├── EditEvent.jsx
│   │   │   │   ├── EventDetails.css
│   │   │   │   ├── EventDetails.jsx
│   │   │   │   ├── InviteUsers.jsx
│   │   │   │   ├── ManageMembers.jsx
│   │   │   │   ├── NewClendar.css
│   │   │   │   ├── NewClendar.jsx
│   │   │   │   ├── NewEvent.css
│   │   │   │   ├── NewEvent.jsx
│   │   │   │   ├── Popup.css
│   │   │   │   ├── PopUp.jsx
│   │   │   │   ├── PopUpController.jsx
│   │   │   │   ├── Settings.jsx
│   │   │   │   ├── ShareCalendar.jsx
│   │   │   │   └── ShareEvent.jsx
│   │   │   ├── SettingsContext/
│   │   │   │   └── SettingsContext.jsx
│   │   │   ├── SharedCalendarView/
│   │   │   │   ├── SharedCalendarView.css
│   │   │   │   └── SharedCalendarView.jsx
│   │   │   ├── SharedEventView/
│   │   │   │   ├── SharedEventView.css
│   │   │   │   └── SharedEventView.jsx
│   │   │   ├── SmallCalendar/
│   │   │   │   ├── SmallCalendar.css
│   │   │   │   ├── SmallCalendar.jsx
│   │   │   │   └── SmallCalendarYear.jsx
│   │   │   └── ui/
│   │   │       ├── Button/
│   │   │       │   ├── Button.css
│   │   │       │   └── Button.jsx
│   │   │       ├── CheckBox/
│   │   │       │   ├── CheckBox.css
│   │   │       │   └── CheckBox.jsx
│   │   │       └── SearchView/
│   │   │           ├── SearchView.css
│   │   │           └── SearchView.jsx
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   └── tailwind.css
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── Routes.jsx
│   ├── .gitignore
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yml
├── DOCUMENTATION.md
├── package.json
└── README.md
```

### Data Flow Architecture

**Authentication Flow:**
1. User submits credentials via Login component
2. Request sent to `controllers/authentication/login.js`
3. Middleware `requireAuth.js` validates JWT token for protected routes
4. User data stored in SettingsContext for global access
5. Email verification handled by `verifyEmail.js` controller

**Calendar Creation Flow:**
1. User registers → `register.js` controller creates user
2. Default calendar auto-created via `createCalendar.js` controller
3. Calendar linked to user in `Calendar.js` model with userId reference
4. National holidays calendar populated via `holidaysPopulate.js`
5. User can create additional calendars through NewClendar popup component

**Event Management Flow:**
1. User creates event via BigCalendar (inline) or NewEvent popup (full form)
2. `createEvent.js` controller validates category and required fields
3. Event stored in `Event.js` model with calendar and creator references
4. `Notification.js` model handles scheduled notifications
5. Events displayed in appropriate view (Day/Week/Month/Year Calendar)
6. Updates reflected across all calendar views automatically

**Sharing and Collaboration:**
1. User initiates share via ShareCalendar or ShareEvent popup
2. `generateShareLink.js` creates unique shareable link
3. `shareCalendar.js` or `shareEvent.js` sends invitations
4. `inviteUser.js` controller handles email invitations
5. Shared access displayed in SharedCalendarView/SharedEventView
6. `getMembers.js` retrieves participants list
7. `removeMember.js` manages access control
8. Permission checks via `checkCalendarPermission.js` and `checkEventPermission.js` middleware

**Holiday Integration Flow:**
1. User region detected on registration
2. `hollidayFetch.js` controller queries external holiday API
3. `holidaysPopulate.js` creates holiday events in user's calendar
4. Holidays displayed with distinct styling in calendar views

---

## Main Components and Routes

### Backend API Routes

| Method | Endpoint | Controller | Middleware | Description |
|--------|----------|------------|------------|-------------|
| **Root** |
| GET | `/` | inline | - | Root endpoint check |
| GET | `/api/sessionUser` | inline | - | Get current session user |
| **Authentication** |
| POST | `/api/auth/register` | `authentication/register.js` | - | User registration |
| POST | `/api/auth/register/verify-email` | `authentication/verifyEmail.js` | - | Verify email token |
| POST | `/api/auth/login` | `authentication/login.js` | `requireEmailConfirmed` | User login |
| POST | `/api/auth/logout` | `authentication/logout.js` | `requireAuth` | User logout |
| GET | `/api/auth/me` | `authentication/me.js` | - | Get current user |
| POST | `/api/auth/password-reset` | `authentication/passwordReset.js` | - | Request password reset |
| POST | `/api/auth/password-reset/:confirm_token` | `authentication/passwordResetConfirm.js` | - | Confirm password reset |
| **Calendar** |
| GET | `/api/calendars` | `calendar/getCalendars.js` | `requireAuth` | Get all user calendars |
| POST | `/api/calendars` | `calendar/createCalendar.js` | `requireAuth` | Create new calendar |
| PATCH | `/api/calendars/:id` | `calendar/updateCalendar.js` | `requireAuth` | Update calendar |
| DELETE | `/api/calendars/:id` | `calendar/deleteCalendar.js` | `requireAuth` | Delete calendar |
| POST | `/api/calendars/:calendarId/share` | `calendar/shareCalendar.js` | `requireAuth` | Share calendar via email |
| POST | `/api/calendars/:calendarId/invite` | `calendar/inviteUser.js` | `requireAuth` | Invite user to calendar |
| GET | `/api/calendars/:calendarId/members` | `calendar/getMembers.js` | `requireAuth` | Get calendar members |
| POST | `/api/calendars/:calendarId/members/remove` | `calendar/removeMember.js` | `requireAuth` | Remove member from calendar |
| POST | `/api/calendars/:calendarId/generate-share-link` | `calendar/generateShareLink.js` | `requireAuth` | Generate shareable link |
| GET | `/api/calendars/shared/:shareToken` | `calendar/getSharedCalendar.js` | - | Access shared calendar (public) |
| **Event** |
| GET | `/api/events` | `event/getAllUserEvents.js` | `requireAuth` | Get all user events |
| GET | `/api/events/:calendarId` | `event/getEvents.js` | `requireAuth` | Get calendar-specific events |
| POST | `/api/calendars/:calendarId/events` | `event/createEvent.js` | `requireAuth` | Create new event in calendar |
| PATCH | `/api/events/:id` | `event/updateEvent.js` | `requireAuth` | Update event |
| DELETE | `/api/events/:id` | `event/deleteEvent.js` | `requireAuth` | Delete event |
| POST | `/api/events/:eventId/share` | `event/shareEvent.js` | `requireAuth` | Share event via email |
| POST | `/api/events/:eventId/generate-share-link` | `event/generateEventShareLink.js` | `requireAuth` | Generate event share link |
| GET | `/api/events/shared/:shareToken` | `event/getSharedEvent.js` | - | Access shared event (public) |
| **User** |
| GET | `/api/users/search` | `user/searchUsers.js` | `requireAuth` | Search users by query |
| PATCH | `/api/user/settings` | `user/updateSettings.js` | `requireAuth` | Update user settings |
| **Holidays** |
| GET | `/api/:userId/populate-holidays` | `holidays/holidaysPopulate.js` | `requireAuth` | Populate user holidays |

### Frontend Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Auth/Login/Login` | Landing page (redirects to login) |
| `/home` | `Auth/Login/Login` | Home/Login page |
| `/login` | `Auth/Login/Login` | User login |
| `/register` | `Auth/Register/Register` | User registration |
| `/verify-email` | `Auth/VerifyEmail/VerifyEmail` | Email verification |
| `/password-reset/:token` | `Auth/PasswordReset/PasswordReset` | Password reset with token |
| `/calendar` | `Calendar/Calendar` | Main calendar interface |
| `/event/shared/:shareToken` | `SharedEventView/SharedEventView` | View shared event (public) |
| `/calendar/shared/:shareToken` | `SharedCalendarView/SharedCalendarView` | View shared calendar (public) |

**Notes:** 
- Routes are managed by React Router (`Routes.jsx`)
- Particle background displayed on authentication routes (`/login`, `/register`, `/verify-email`, `/password-reset`)
- Most calendar interactions happen within `/calendar` route via modal popups
- Shared links are public (no auth required) for collaboration

---

## Installation and Running

### Prerequisites
- Node.js (>= 18.x)
- npm (>= 9.x)
- Docker and Docker Compose (latest version)
- MongoDB Compass

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone ssh://git@git.green-lms.app:22022/challenge-372/hpohosian-6505.git
   cd hpohosian-6505
   ```
   
   OR
   
   ```bash
   git clone git@github.com:herman-nott/chronos.git
   cd chronos
   ```

2. **Configure environment variables**  
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

3. **Start all services with Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   ```bash
   http://localhost:5173
   ```
   
### Manual Setup

1. **Clone the repository**

2. **Install dependencies and configure environment variables**  

	```bash
	cd chronos
	npm install
	cp .env.example .env
	npm run dev
	```

3. **Access the application**
   ```bash
   http://localhost:5173
   ```

---

## Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/chronos

SESSION_SECRET=your-secret-key-here

VITE_API_URL=http://localhost:3000

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
FROM_EMAIL=your-email@gmail.com
```

---

## Docker Setup

### Architecture
The application uses a multi-container Docker setup:
- **Frontend Container:** React app served by Vite dev server
- **Backend Container:** Node.js Express server
- **Database Container:** MongoDB

### Docker Compose Configuration
```yaml
version: '3.8'

services:
  mongo:
    image: mongo:8.0
    container_name: chronos-mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_DATABASE: chronos

  backend:
    build: ./backend
    container_name: chronos-backend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/chronos
      - SESSION_SECRET=${SESSION_SECRET}
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=${SMTP_PORT}
      - SMTP_SECURE=${SMTP_SECURE}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASS=${SMTP_PASS}
      - FROM_EMAIL=${FROM_EMAIL}
      - NODE_ENV=development
    depends_on:
      - mongo
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    container_name: chronos-frontend
    restart: unless-stopped
    ports:
      - "5173:5173"
    environment:
      - NODE_ENV=development
      - VITE_API_URL=http://localhost:3000
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  mongo-data:
 ```
 
### Individual Dockerfiles

**Backend Dockerfile:**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm install -g nodemon
CMD ["nodemon", "server.js"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
```

---

## Example User Flows

### Registration and First Calendar
1. User visits registration page
2. Fills in email, password, full name, and region
3. Submits form → Backend creates user account
4. Default calendar automatically created with user's name
5. National holidays calendar created based on region
6. Verification email sent (if enabled)
7. User redirected to dashboard with calendars ready

### Registration and First Calendar
1. User navigates to `/register` route
2. `Register.jsx` component displays registration form
3. User fills in email, password, full name, and region
4. Submits form → Backend `register.js` controller creates user account
5. Verification email sent via nodemailer
6. User receives email and clicks verification link
7. Redirected to `/verify-email` with token → `verifyEmail.js` validates
8. Default calendar automatically created with user's name
9. User can now log in at `/login` route
10. After login, redirected to `/calendar` - main calendar interface

### Creating an Event (Inline Method)
1. User logged in, viewing `/calendar` route
2. BigCalendar component displays Month/Week/Day view
3. User clicks on empty date/time cell
4. `CreateEvent.jsx` quick form appears inline (not a route change)
5. Selects category (arrangement/reminder/task)
6. Enters title and basic time information
7. Submits → POST request to `/api/calendars/:calendarId/events`
8. `createEvent.js` controller processes and validates
9. Event appears immediately in calendar view
10. User can click event to open `EventDetails.jsx` popup for full details

### Creating an Event (Full Page Method)
1. User clicks "New Event" button in LeftSide navigation
2. `NewEvent.jsx` popup modal appears (no route change, modal overlay)
3. Comprehensive form displayed with all options:
   - Calendar selection dropdown (from user's calendars)
   - Category type selector (arrangement/reminder/task)
   - Title and rich description textarea
   - Date and time pickers with duration selector
   - Location field (visible for arrangements)
   - Task-specific fields (visible for tasks)
   - Color picker for event customization
4. Can click "Invite Users" → Opens `InviteUsers.jsx` subcomponent
5. Fills all details and submits
6. POST to `/api/calendars/:calendarId/events`
7. `createEvent.js` controller validates category requirements
8. Event stored in Event model with calendar reference
9. Notification model creates scheduled notification entry
10. Popup closes, calendar view refreshes with new event
11. Email invitations sent if participants were added

### Sharing a Calendar
1. User viewing `/calendar`, selects calendar from LeftSide sidebar
2. Clicks calendar options menu (three dots icon)
3. Selects "Share Calendar" → `ShareCalendar.jsx` popup opens
4. Two sharing methods available:
   **Method A - Email Invitation:**
   - Enters email addresses in search field
   - `SearchView` component helps find users via `/api/users/search`
   - Selects role for each invitee (editor/viewer)
   - Clicks "Send Invitations"
   - POST to `/api/calendars/:calendarId/share`
   - `shareCalendar.js` controller sends emails via nodemailer
   - Recipients receive email with calendar details
   - Email contains acceptance link
   
   **Method B - Share Link:**
   - Clicks "Generate Link" button
   - POST to `/api/calendars/:calendarId/generate-share-link`
   - `generateShareLink.js` creates unique token
   - Shareable URL generated: `/calendar/shared/:shareToken`
   - User copies link to share via any channel
   
5. For email invitations:
   - POST to `/api/calendars/:calendarId/invite` for each user
   - `inviteUser.js` controller processes invitations
   - Recipients click email link
   - Redirected to `/calendar/shared/:shareToken`
   - `SharedCalendarView.jsx` component displays calendar
   - Can accept to add to their personal calendar list
   
6. Calendar owner can manage members:
   - Opens `ManageMembers.jsx` via calendar settings
   - GET `/api/calendars/:calendarId/members` loads member list
   - Can change roles or remove members
   - POST `/api/calendars/:calendarId/members/remove` to remove

7. Permission enforcement:
   - All calendar operations check `checkCalendarPermission.js` middleware
   - Editors can create/edit events
   - Viewers can only view, no modifications
   - Owners have full control including member management
   
### Searching and Managing Events
1. User types in `SearchView` component (ui/SearchView)
2. For user search (invitations):
   - GET `/api/users/search?q=${query}`
   - `searchUsers.js` controller returns matching users
   - Results displayed in dropdown for selection
   
3. For event management:
   - All user events loaded via GET `/api/events` (requireAuth)
   - `getAllUserEvents.js` returns events from all accessible calendars
   - Events displayed across calendar views
   
4. Filtering options in calendar interface:
   - Calendar selection (show/hide specific calendars)
   - Category checkboxes (arrangement/reminder/task)
   - Date range using SmallCalendar date picker
   - Text search within loaded events (client-side)
   
5. Event interaction:
   - Click event → `EventDetails.jsx` popup opens
   - Shows full details, participants, description
   - Edit button → `EditEvent.jsx` opens with pre-filled form
   - PATCH to `/api/events/:id` via `updateEvent.js`
   - Delete button → Confirmation dialog
   - DELETE to `/api/events/:id` via `deleteEvent.js`
   - Share button → `ShareEvent.jsx` popup
   - POST to `/api/events/:eventId/share` or generate link
   
6. Permission checks throughout:
   - `checkEventPermission.js` validates user's rights
   - Edit/delete only available if user has permission
   - Shared event access validated by token

---

## Future Improvements

### High Priority
- Implement recurring events (daily, weekly, monthly patterns)
- Advanced notification preferences

### Medium Priority
- Calendar templates for common use cases
- Event attachments and file sharing
- Time zone management for international teams
- User chat
- Export functionality (iCal, CSV)

### Low Priority
- Calendar analytics and insights
- Custom event categories

### Performance Optimizations
- Implement caching layer (Redis)
- Lazy loading for historical events
- Optimize database queries with indexes
- Add pagination for large event lists

---

## Conclusion

This document provides a comprehensive overview of the **CHRONOS** project, covering its architecture, implementation details, and integration with various technologies. The application demonstrates modern full-stack development practices with React, Node.js, MongoDB, and Docker, providing a robust and scalable event calendar solution suitable for both personal and collaborative use.
