# 🏏 MKCC — Maa Kali Cricket Club

> **"Where Cricket Meets Culture and Unity"**  
> Patuli, Olaver, Odisha, India

A full-stack MERN web application for MKCC — a village sports and cultural club featuring cricket events, gallery, team management, and an admin dashboard.

---

## 📁 Project Structure

```
mkcc/
├── client/                    # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar/        # Sticky navbar with mobile menu
│   │   │   ├── Footer/        # Footer with links & WhatsApp
│   │   │   ├── Logo/          # Custom SVG shield logo (MKCCLogo.jsx)
│   │   │   ├── EventCard/     # Event display card
│   │   │   ├── TeamCard/      # Player/member card
│   │   │   ├── GalleryGrid/   # Photo grid with lightbox
│   │   │   └── AdminSidebar/  # Admin navigation sidebar
│   │   ├── pages/
│   │   │   ├── Home/          # Landing page
│   │   │   ├── About/         # Club history, mission, Ganesh Puja
│   │   │   ├── Team/          # Players & leadership
│   │   │   ├── Events/        # Upcoming & past events
│   │   │   ├── Gallery/       # Photo gallery with filters
│   │   │   ├── Contact/       # Join form + contact info
│   │   │   └── Admin/         # Admin dashboard + all managers
│   │   ├── context/           # AuthContext for admin auth
│   │   ├── utils/api.js       # Axios API + dummy data
│   │   ├── App.jsx            # Router + layout
│   │   └── index.css          # Tailwind + custom styles
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vercel.json
│
└── server/                    # Node.js + Express backend
    ├── models/
    │   ├── Member.js           # Member schema
    │   ├── Event.js            # Event schema
    │   └── index.js            # Gallery, Announcement, JoinRequest, User
    ├── routes/
    │   ├── auth.js             # Login, setup, /me
    │   ├── events.js           # CRUD events
    │   ├── members.js          # CRUD members
    │   ├── gallery.js          # CRUD gallery
    │   ├── announcements.js    # CRUD announcements
    │   └── join.js             # Membership requests
    ├── middleware/auth.js      # JWT middleware
    └── server.js               # Express app + MongoDB connect
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone & Install

```bash
git clone https://github.com/your-username/mkcc.git
cd mkcc

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### 2. Configure Environment

**Server** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/mkcc
JWT_SECRET=your_super_secret_key_here
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Create Admin User

Start the server once, then call:
```
POST http://localhost:5000/api/auth/setup
```
This creates default admin: `username: admin` / `password: mkcc@admin2024`

> ⚠️ Change the password immediately after first login.

### 4. Run Development

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

---

## 🌐 API Endpoints

### Public Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events (filter: `?status=upcoming`) |
| GET | `/api/events/:id` | Get single event |
| GET | `/api/members` | Get all active members |
| GET | `/api/gallery` | Get gallery (filter: `?category=Cricket`) |
| GET | `/api/announcements` | Get active announcements |
| POST | `/api/join` | Submit membership request |
| GET | `/api/health` | Health check |

### Protected Routes (require `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events` | Create event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |
| POST | `/api/members` | Add member |
| PUT | `/api/members/:id` | Update member |
| DELETE | `/api/members/:id` | Delete member |
| POST | `/api/gallery` | Add photo |
| DELETE | `/api/gallery/:id` | Delete photo |
| POST | `/api/announcements` | Create announcement |
| PUT | `/api/announcements/:id` | Update announcement |
| DELETE | `/api/announcements/:id` | Delete announcement |
| GET | `/api/join` | Get all membership requests |
| PUT | `/api/join/:id` | Update request status |

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login → returns JWT |
| POST | `/api/auth/setup` | Create default admin (run once) |
| GET | `/api/auth/me` | Get current user |

---

## 🗄️ MongoDB Schemas

### Member
```js
{ name, role, photo, jerseyNumber, battingStyle, bowlingStyle, village, bio, isActive, order }
```

### Event
```js
{ title, date, endDate, description, category, images, venue, status, highlights, isFeatured }
```

### Gallery
```js
{ title, imageUrl, category, caption, isFeatured, eventRef }
```

### Announcement
```js
{ title, content, type, isActive, expiresAt }
```

### JoinRequest
```js
{ name, phone, village, role, message, status }
```

---

## 🎨 Design System

### Color Palette
| Name | Hex | Usage |
|------|-----|-------|
| Deep Red | `#C41E3A` | Primary actions, accent |
| Crimson | `#8B0000` | Dark red backgrounds |
| Gold | `#D4AF37` | Headings, highlights |
| Amber | `#FFB800` | Gold accents |
| Black | `#0A0A0A` | Page background |
| Dark | `#111111` | Section backgrounds |
| Card | `#1A1A1A` | Card backgrounds |

### Typography
- **Display**: Bebas Neue (headings, large text)
- **Heading**: Rajdhani (subheadings, labels)
- **Body**: Exo 2 (body text, descriptions)

### Custom CSS Classes
- `.btn-primary` — Red filled button with glow
- `.btn-gold` — Gold gradient button
- `.btn-outline` — Gold outline button
- `.card-glow` — Card with red glow on hover
- `.card-gold` — Card with gold glow on hover
- `.text-gradient-gold` — Gold gradient text
- `.text-gradient-red` — Red gradient text
- `.section-title` — Large Bebas Neue section heading
- `.divider-red` / `.divider-gold` — Gradient horizontal dividers

---

## 🚢 Deployment

### Frontend → Vercel

```bash
cd client
npm run build

# Push to GitHub, connect to Vercel
# Set environment variable: VITE_API_URL=https://your-backend.onrender.com/api
```

### Backend → Render

1. Create new **Web Service** on Render
2. Connect GitHub repo, set root to `server/`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables:
   ```
   MONGODB_URI=your_atlas_uri
   JWT_SECRET=your_secret
   FRONTEND_URL=https://your-vercel-app.vercel.app
   NODE_ENV=production
   ```

### MongoDB Atlas Setup

1. Create free cluster at [atlas.mongodb.com](https://atlas.mongodb.com)
2. Create database user with read/write access
3. Whitelist `0.0.0.0/0` in Network Access (for Render)
4. Copy connection string → set as `MONGODB_URI`

---

## 🔐 Admin Dashboard

Access: `http://localhost:5173/admin`

Default credentials:
- Username: `admin`
- Password: `mkcc@admin2024`

**Features:**
- 📊 Dashboard overview with stats
- 📅 Events Manager (add/edit/delete)
- 🖼️ Gallery Manager (add/delete photos)
- 👥 Team Manager (add/edit/remove members)
- 📋 Membership Requests (approve/reject)
- 📢 Announcements (create/manage)

---

## 📱 Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, About, Events, Gallery, Join form |
| `/about` | About | Club history, timeline, mission, Ganesh Puja |
| `/team` | Team | Leadership & players grid |
| `/events` | Events | Upcoming & past events with filters |
| `/gallery` | Gallery | Photo grid with categories & lightbox |
| `/contact` | Contact | Join form, contact info, Google map |
| `/admin` | Admin | Protected dashboard |

---

## 🏏 Features

- ✅ Mobile-first responsive design
- ✅ Dark sports/esports theme (Deep Red + Black + Gold)
- ✅ Custom SVG shield logo (crossed bats, flame ball, Maa Kali eyes, trishul)
- ✅ Framer Motion page transitions & scroll animations
- ✅ Announcement ticker (marquee)
- ✅ Gallery with lightbox
- ✅ Membership join form
- ✅ WhatsApp group join button
- ✅ JWT-protected admin panel
- ✅ Full CRUD via REST API
- ✅ Dummy data fallback (works without backend)
- ✅ Deployment-ready (Vercel + Render)

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Fonts | Bebas Neue, Rajdhani, Exo 2 (Google Fonts) |
| Deploy | Vercel (frontend), Render (backend) |

---

## 🙏 Credits

Built with devotion to **Maa Kali** and love for the youth of **Patuli, Olaver, Odisha**.

> **Jai Maa Kali! 🏏**
