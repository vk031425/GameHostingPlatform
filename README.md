# Game Hoster

A full-stack game distribution platform that enables developers to upload, manage, and monetize games while allowing players to discover, purchase, download, and interact with games through a modern web interface.

Game Hoster provides secure game hosting, cloud-based storage, payment processing, developer analytics, user engagement features, and scalable infrastructure for digital game distribution.

---

## Live Demo

**URL:** https://game-hosting-platform-coral.vercel.app

---

## Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose

### Authentication
- JWT Authentication
- HTTP-only Cookies
- bcrypt Password Hashing

### Cloud Storage
- Cloudflare R2
- AWS SDK v3

### Payments
- Razorpay

### Deployment
- Vercel (Frontend)
- Google Cloud Platform (Backend)

---

# System Architecture

```text
┌────────────────────┐
│      Browser       │
│     (React App)    │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│      Vercel        │
│   Frontend Host    │
└─────────┬──────────┘
          │ API Calls
          ▼
┌────────────────────┐
│    Node.js API     │
│   Express Server   │
│      (GCP VM)      │
└──────┬─────┬───────┘
       │     │
       │     │
       ▼     ▼
┌─────────┐ ┌──────────┐
│ MongoDB │ │ Razorpay │
│  Atlas  │ │ Payments │
└─────────┘ └──────────┘
       │
       │
       ▼
┌────────────────────┐
│   Cloudflare R2    │
│ Game Files & Media │
└────────────────────┘
```

---

# Game Upload Flow

```text
Developer
    │
    ▼
Upload Game
    │
    ▼
Frontend (React)
    │
    ▼
Request Upload URL
    │
    ▼
Backend (Express)
    │
    ▼
Generate Pre-Signed URL
    │
    ▼
Cloudflare R2
    │
    ▼
Direct File Upload
    │
    ▼
Save Metadata
    │
    ▼
MongoDB Atlas
    │
    ▼
Game Published
```

### Why Direct Upload?

Instead of routing large game files through the backend server, Game Hoster generates pre-signed Cloudflare R2 URLs. The browser uploads files directly to cloud storage, reducing server load, improving scalability, and lowering bandwidth costs.

---

# Payment Flow

```text
Player
   │
   ▼
Purchase Game
   │
   ▼
Frontend (React)
   │
   ▼
Create Order
   │
   ▼
Backend (Express)
   │
   ▼
Razorpay
   │
   ▼
Payment Success
   │
   ▼
Verify Signature
   │
   ▼
MongoDB Atlas
   │
   ▼
Grant Ownership
   │
   ▼
Game Added To Library
```

### Payment Security

- Razorpay Order Creation
- Server-side Signature Verification
- Duplicate Purchase Prevention
- Purchase History Tracking
- Secure Ownership Assignment

---

# Features

## User Features

- User Registration & Authentication
- Secure JWT-based Login System
- Profile Management
- Favorite Games System
- Wishlist Management
- Recently Played Games Tracking
- Purchased Games Library
- Game Ratings & Reviews
- Comment System
- Game Download Tracking
- Game Play Tracking

---

## Game Features

- Browse Available Games
- Game Detail Pages
- Game Categories
- Search & Discovery
- Featured Games Section
- Premium & Free Games
- Screenshots & Trailer Support
- Game Ratings
- Downloadable Games
- Cloud-hosted Game Files

---

## Developer Features

- Developer Dashboard
- Upload New Games
- Edit Existing Games
- Delete Games
- Track Views
- Track Downloads
- Track Plays
- Revenue Analytics
- Upload Screenshots & Media
- Version Management
- Game Status Management

---

## Payment Features

- Razorpay Integration
- Secure Order Creation
- Payment Verification
- Purchase History Tracking
- Premium Game Purchases
- Revenue Tracking
- Duplicate Purchase Prevention

---

## ☁️ Cloud Storage Features

- Cloudflare R2 Object Storage
- Secure Pre-Signed Upload URLs
- Direct Browser-to-Cloud Uploads
- Reduced Backend Bandwidth Usage
- Game Package Storage
- Screenshot Storage
- Thumbnail Storage

---

# Why This Project?

Most indie developers struggle with game distribution, hosting, payment collection, and analytics.

Game Hoster was built to provide:

- Game Hosting
- Digital Distribution
- Secure Payments
- Developer Analytics
- Cloud Storage
- Community Interaction

within a single platform.

The goal is to create a scalable ecosystem where developers can publish games and players can easily discover and enjoy them.

---

# Project Structure

```text
Frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
│
└── public/

Backend/
├── config/
├── middlewares/
├── models/
├── routes/
├── services/
├── uploads/
├── index.js
└── package.json
```

---

# Database Design

## User

Stores:

- Account Information
- Authentication Data
- Purchased Games
- Wishlist
- Favorites
- Recently Played Games
- User Statistics

## Game

Stores:

- Game Metadata
- Developer Information
- Pricing
- Downloads
- Views
- Plays
- Ratings
- Screenshots
- Cloud Storage References

## Purchase

Stores:

- Payment Records
- Revenue Information
- Purchase Status
- Razorpay Order IDs

## Comment

Stores:

- User Comments
- Community Discussions

---

# Security Measures

## Authentication Security

- Password Hashing using bcrypt
- JWT Authentication
- HTTP-only Cookies
- Protected Routes
- Role-Based Access Control

## Payment Security

- Razorpay Signature Verification
- Server-side Payment Validation
- Duplicate Purchase Prevention

## Upload Security

- Pre-Signed Upload URLs
- Ownership Verification
- Protected Upload APIs

---

# ⚙️ Installation & Setup

## 1. Clone Repository

```bash
git clone <repository-url>
cd game-hoster
```

---

## 2. Backend Setup

```bash
cd Backend
npm install
```

### Create `.env`

```env
PORT=8080

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET=your_bucket_name

CLIENT_URL=http://localhost:5173
```

### Start Backend

```bash
npm start
```

---

## 3. Frontend Setup

```bash
cd Frontend
npm install
```

### Create `.env`

```env
VITE_API_URL=http://localhost:8080/api
```

### Start Frontend

```bash
npm run dev
```

---

# How the Platform Works

## For Developers

1. Create an account.
2. Upload game information.
3. Upload screenshots and media.
4. Upload game package to Cloudflare R2.
5. Publish the game.
6. Track analytics and revenue.

## For Players

1. Create an account.
2. Browse available games.
3. Add games to wishlist or favorites.
4. Purchase premium games.
5. Download or play owned games.
6. Rate and comment on games.

---

# Testing Strategy

The platform was tested using a combination of manual and end-to-end testing approaches.

## Backend Testing

- API Endpoint Testing
- Authentication Testing
- Payment Flow Validation
- Database Validation
- Upload Flow Verification
- Error Handling Validation

## Frontend Testing

- Authentication Flows
- Developer Dashboard
- Game Upload Workflow
- Purchase Workflow
- Responsive UI Validation
- API Integration Testing

## End-to-End Testing

- User Registration
- Login / Logout
- Game Upload
- Game Purchase
- Download Flow
- Ratings & Comments

---

# 📊 Current Platform Capabilities

- 8 Open Source Games Hosted
- Cloud-Based File Storage
- Premium Game Monetization
- Developer Dashboard
- Secure Authentication
- Payment Integration
- User Engagement Features
- Analytics Tracking

---

# Assumptions Made During Development

1. Developers own the rights to uploaded content.
2. Uploaded game packages are safe to distribute.
3. Cloudflare R2 provides scalable object storage.
4. Razorpay handles payment processing securely.
5. Users have stable internet access for large downloads.
6. Initial moderation is handled manually.

---

# Future Enhancements

## Short-Term

- Advanced Search Filters
- Genre Recommendations
- Better Mobile Responsiveness
- User Notifications
- Download Progress Tracking

## Medium-Term

- Admin Dashboard
- Automated Content Moderation
- Game Approval Workflow
- Revenue Withdrawal System
- Email Verification
- Password Recovery

## Long-Term

- Multiplayer Hosting Support
- Real-Time Chat
- Achievement System
- Leaderboards
- Subscription Plans
- AI-Based Game Recommendations
- CDN Optimization
- Advanced Developer Analytics
- Mobile Applications

---

# Scalability Considerations

The platform is designed to scale using:

- Stateless Backend APIs
- MongoDB Atlas
- Cloudflare R2 Object Storage
- Independent Frontend Deployment
- Cloud-Based Infrastructure
- Direct Browser-to-Cloud Uploads

---

# Author

**Vinay Kumar**

Built as a full-stack game distribution platform to explore scalable software architecture, cloud storage integration, payment systems, and developer-focused publishing workflows.

---

# License

This project is intended for educational, portfolio, and commercial experimentation purposes.

Developers are responsible for ensuring compliance with licensing, copyright, and distribution rights for any content uploaded to the platform.
