# CHRONOS APP

## Description:
**CHRONOS** is a comprehensive **full-stack event calendar application** designed to streamline event management, improve time organization, and enhance team collaboration.  
Built with **React.js** (frontend) and **Node.js** (backend), it provides a dynamic and responsive platform for creating, managing, and searching events with ease.

Users can:
- Register and authenticate with secure session management  
- Create and manage multiple calendars with custom settings  
- Schedule three types of events: **arrangements**, **reminders**, and **tasks**  
- Share calendars and collaborate with team members  
- Invite participants to events via email  
- View calendars in multiple formats (day, week, month, year)  
- Search and filter events efficiently  
- Receive email notifications  
- Access national holidays for their region  
- Manage user rights for shared calendars  

The interface includes:
- **Modern, responsive design** for desktop, tablet, and mobile  
- **Multiple calendar views** with intuitive navigation  
- **Inline and full-page event creation** options  
- **Comprehensive search and filtering** capabilities  
- **Particle background animation** on authentication pages
- **Dockerized deployment** for easy setup and scaling  

---

## Key Features

### User Management
- Secure registration and authentication with JWT
- Email verification system
- Password reset functionality
- User profile customization

### Calendar Management
- **Automatic default calendar** creation for new users
- **Multiple calendars** per user with individual settings
- **Calendar customization:** name, description, and event colors
- **National holidays calendar** integrated via API
- **Calendar sharing** with customizable user permissions
- **Hide/show calendars** without deletion

### Event Categories
1. **Arrangements** – Scheduled meetings with:
   - Start and end times (default duration: 1 hour)
   - Location information
   - Participant management
   - Email invitations

2. **Reminders** – Time-based notifications with:
   - Specific date and time
   - Description and priority level
   - Automatic alerts

3. **Tasks** – Action items featuring:
   - Due dates and deadlines
   - Completion status tracking
   - Task descriptions and notes

### Event Creation
- **Dual creation methods:**
  - Quick inline creation (click calendar cells)
  - Full-page detailed form (via navigation button)
- **Smart form validation** with error handling
- **Default duration settings** for efficiency
- **Color coding** per user in shared calendars

### Collaborative Features
- **Calendar sharing** with multiple users
- **Email invitations** to events and calendars
- **User permission levels:** owner, editor, viewer
- **Built-in member management** for shared calendars
- **Public share links** for easy access

### Views and Navigation
- **Day view** with hourly schedule
- **Week view** with week numbers (ISO standard)
- **Month view** with full date grid
- **Year view** for overview planning
- **Category filtering** (arrangements, reminders, tasks)
- **Advanced search** functionality
- **Mini calendar widget** for quick navigation
- **Current time indicator** in day/week views
- **Clickable events** with detail popups

### Notifications
- **Email notifications** for upcoming events
- **Invitation alerts** for shared events and calendars
- **Customizable notification settings**

---

## Technical Stack

### Frontend
- **React.js 18+** – Modern component-based UI
- **Vite** – Fast build tool and dev server
- **React Router** – Client-side routing
- **React Context API** – State management (SettingsContext)
- **CSS Modules** – Component-scoped styling
- **Tailwind CSS** – Utility-first CSS framework
- **Particles.js** – Animated background effects

### Backend
- **Node.js 18+** – JavaScript runtime
- **Express.js** – Web application framework
- **express-session** – Session management
- **MongoDB** – NoSQL database
- **Mongoose** – ODM for MongoDB
- **bcrypt** – Password hashing
- **Nodemailer** – Email service (for invitations)
- **crypto** – Token generation

### DevOps
- **Docker** – Containerization
- **Docker Compose** – Multi-container orchestration
- **MongoDB Atlas** – Cloud database (optional)
- **Nginx** – Production web server (optional)

### Third-Party APIs
- **Holiday API** (e.g., Calendarific) – National holidays
- **Email Service** (e.g., SendGrid, SMTP) – Notifications

---

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (>= 18.x)
- [npm](https://www.npmjs.com/) (>= 9.x)
- [Docker](https://www.docker.com/) and Docker Compose (latest)
- [MongoDB Compass](https://www.mongodb.com/products/compass)

### Installation

1. **Clone the repository**
   ```bash
   git clone git@git.green-lms.app:22022/challenge-372/hpohosian-6505.git
   cd hpohosian-6505
   ```
   
   OR
   
   ```bash
   git clone git@github.com:herman-nott/chronos.git
   cd chronos
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your credentials (see [Environment Variables](#environment-variables) section)

3. **Start with Docker Compose** (Recommended)
   ```bash
   docker-compose up --build
   ```
   
   This command will:
   - Build frontend and backend containers
   - Start MongoDB container
   - Set up networking between services
   - Start all services simultaneously

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

## Environment Variables (.env.example)

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

## Screenshots:
![Login Page](https://i.ibb.co/ksG4FDxg/login.png)
![Calendar Page](https://i.ibb.co/C3rHKDsw/calendar.png)
![Event Details](https://i.ibb.co/k61dJWT2/details.png)
![Event Creation](https://i.ibb.co/fVBsx1sN/creation.png)
![Event Search](https://i.ibb.co/yB5bjJ9k/search.png)
