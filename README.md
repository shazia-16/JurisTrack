# JurisTrack - Court Management System

A modern, full-stack court management system built with Next.js 16, Express.js, and MySQL. This application provides a complete solution for managing legal cases, hearings, clients, documents, and court administration with real database integration.

## Project Overview
<img width="1903" height="1034" alt="image" src="https://github.com/user-attachments/assets/0c9f66c3-a5bc-4dda-9c9f-d907a4197c62" />

JurisTrack is a comprehensive legal case management platform designed to streamline court operations. The system features a responsive web interface with real-time data synchronization, enabling law firms and court administrators to efficiently manage their caseload, schedule hearings, track clients, and organize documents.

## Features

### Core Functionality
- **Dashboard**: Real-time statistics and overview of all court activities with live data from MySQL database
- **Case Management**: Complete case lifecycle tracking with CRUD operations
- **Hearing Scheduling**: Calendar-based hearing management with judge and courtroom assignments
- **Client Management**: Comprehensive client database with categorization (Individual, Corporate, Government)
- **Document Management**: Secure document storage and organization with case association
- **Calendar View**: Interactive calendar for hearing schedules and upcoming events
- **Reports & Analytics**: Detailed reporting system with performance metrics
- **Admin Panel**: System administration and configuration management
- **Judges Management**: Database of judges with court assignments
- **Task Management**: Task tracking and assignment system

### Design Features
- **Glassmorphism UI**: Modern, professional design with glass-like effects
- **Responsive Layout**: Fully responsive design for all screen sizes
- **Component-Based**: Modular, reusable components with TypeScript
- **Real-time Data**: Live database integration with Express.js REST API
- **Custom Animations**: Smooth transitions and interactive feedback

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5.2.1** - Web framework for REST API
- **MySQL2 3.22.3** - MySQL database driver
- **CORS 2.8.6** - Cross-origin resource sharing middleware
- **body-parser 2.2.2** - Request body parsing middleware

### Frontend
- **Next.js 16.2.4** - React framework with App Router
- **React 19.2.5** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 3.3.0** - Utility-first CSS framework
- **Lucide React** - Icon library
- **clsx 2.0.0** - Conditional className utility
- **tailwind-merge 2.0.0** - Merge Tailwind classes intelligently
- **PostCSS 8** - CSS processing
- **Autoprefixer 10.0.1** - CSS vendor prefixing

### Database
- **MySQL 8.0** - Relational database management system

### Development Tools
- **ESLint 8** - Code linting
- **npm** - Package manager

## Architecture

JurisTrack follows a monorepo architecture with separate backend and frontend directories:

```
JurisTrack/
├── backend/              # Express.js API server (port 3000)
│   ├── server.js         # Main server file with REST API endpoints
│   └── *.js              # Database setup and test scripts
├── juristrack-nextjs/    # Next.js frontend (port 3001)
│   ├── src/
│   │   ├── app/          # Next.js App Router pages
│   │   ├── components/   # React components
│   │   └── lib/          # Utility functions
│   └── package.json
└── package.json          # Root package.json
```

## Folder Structure

### Backend Structure
```
backend/
├── server.js              # Express server with API endpoints
├── create-tables.js       # Database schema creation
├── setup-database.js      # Database initialization
└── test-*.js              # API endpoint testing scripts
```

### Frontend Structure
```
juristrack-nextjs/
├── src/
│   ├── app/
│   │   ├── api/           # Next.js API routes
│   │   │   ├── cases/     # Case management API
│   │   │   ├── clients/   # Client management API
│   │   │   ├── hearings/  # Hearing management API
│   │   │   ├── documents/ # Document management API
│   │   │   ├── judges/    # Judge management API
│   │   │   └── dashboard/ # Dashboard statistics API
│   │   ├── dashboard/
│   │   │   ├── page.tsx   # Main dashboard
│   │   │   ├── cases/     # Case management pages
│   │   │   ├── hearings/  # Hearing management pages
│   │   │   ├── clients/   # Client management pages
│   │   │   ├── documents/ # Document management pages
│   │   │   ├── calendar/  # Calendar view
│   │   │   ├── reports/   # Reports & analytics
│   │   │   ├── admin/     # Admin panel
│   │   │   ├── judges/    # Judge management
│   │   │   └── tasks/     # Task management
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/
│   │   ├── forms/         # Form components (CaseForm, HearingForm, etc.)
│   │   ├── layout/        # Layout components (Sidebar, Navbar)
│   │   └── ui/            # UI components (StatCard, Table, Modal)
│   └── lib/
│       └── utils.ts       # Utility functions
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── .env.local             # Environment variables
```

## Installation

### Prerequisites
- Node.js 18+ 
- MySQL 8.0
- npm or yarn

### Setup Instructions

1. **Clone the repository:**
```bash
git clone <repository-url>
cd JurisTrack
```

2. **Install backend dependencies:**
```bash
npm install
```

3. **Install frontend dependencies:**
```bash
cd juristrack-nextjs
npm install
cd ..
```

4. **Configure MySQL database:**
```bash
mysql -u root -p < juristrack-nextjs/database-schema.sql
```

5. **Configure environment variables:**
Create `.env.local` in `juristrack-nextjs/` directory with your database credentials.

## Environment Variables

Create a `.env.local` file in the `juristrack-nextjs/` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=juristrack

# Next.js Configuration
NODE_ENV=development
```

Update the database credentials in `backend/server.js` to match your MySQL setup:

```javascript
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "your_mysql_password",
    database: "juristrack"
});
```

## Database Setup

The project uses MySQL 8.0 as the database. The database schema includes:

- **clients**: Client information and contact details
- **judges**: Judge profiles and court assignments
- **cases**: Case information and status tracking
- **hearings**: Hearing schedules and courtroom assignments
- **documents**: Document metadata and file references

To set up the database:

1. Ensure MySQL is running
2. Run the schema file:
```bash
mysql -u root -p < juristrack-nextjs/database-schema.sql
```

The schema includes sample data for testing purposes.

## How to Run Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Start the Express.js server:
```bash
node server.js
```

The backend API will be available at `http://localhost:3000`

Available API endpoints:
- `GET /api/cases` - Get all cases
- `POST /api/cases` - Create new case
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create new client
- `GET /api/hearings` - Get all hearings
- `POST /api/hearings` - Create new hearing
- `GET /api/dashboard` - Get dashboard statistics
- `GET /api/judges` - Get all judges
- `GET /api/documents` - Get all documents

## How to Run Frontend

1. Navigate to the frontend directory:
```bash
cd juristrack-nextjs
```

2. Start the Next.js development server:
```bash
npm run dev
```

The frontend application will be available at `http://localhost:3001`

3. Open your browser and navigate to `http://localhost:3001`

### Build for Production

```bash
npm run build
npm start
```

## Screenshots

*Add screenshots of your application here to showcase the UI and key features.*

## Future Improvements

- [ ] User authentication and authorization system
- [ ] Real-time notifications for hearing reminders
- [ ] Advanced search and filtering capabilities
- [ ] Mobile-responsive PWA version
- [ ] Multi-language support (i18n)
- [ ] Advanced reporting with export to PDF/Excel
- [ ] Integration with external court systems
- [ ] Document OCR and text extraction
- [ ] Video conferencing integration for remote hearings
- [ ] Email notifications and automated reminders
- [ ] Role-based access control (RBAC)
- [ ] Audit logging for compliance

## Author

*Shazia*

---

**JurisTrack** - Modern Court Management System
Built with ❤️ using Next.js, Express.js, and MySQL
