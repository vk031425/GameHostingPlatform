# Game Hoster

A full-stack game distribution platform that allows developers to upload and monetize their games while enabling players to discover, purchase, download, and interact with games through a modern web interface.

The platform provides secure game hosting, developer dashboards, payment processing, user profiles, ratings, reviews, wishlists, favorites, and cloud-based storage for game assets.

---

# Features

## User Features

* User Registration & Authentication
* Secure JWT-based Login System
* Profile Management
* Favorite Games System
* Wishlist Management
* Recently Played Games Tracking
* Purchased Games Library
* Game Ratings & Reviews
* Comment System
* Game Download Tracking
* Game Play Tracking

---

## Game Features

* Browse Available Games
* Game Detail Pages
* Game Categories
* Search & Discovery
* Featured Games Section
* Premium & Free Games
* Screenshots & Trailer Support
* Game Ratings
* Downloadable Games
* Cloud-hosted Game Files

---

## Developer Features

* Developer Dashboard
* Upload New Games
* Edit Existing Games
* Delete Games
* Track Views
* Track Downloads
* Track Plays
* Revenue Analytics
* Upload Screenshots & Media
* Version Management
* Game Status Management

---

## Payment System

* Razorpay Integration
* Secure Order Creation
* Payment Verification
* Purchase History Tracking
* Revenue Distribution Logic
* Premium Game Purchases
* Duplicate Purchase Prevention

---

## Cloud Storage

* Cloudflare R2 Object Storage
* Secure Pre-Signed Upload URLs
* Direct Browser-to-Cloud Uploads
* Reduced Backend Bandwidth Usage
* Game Package Storage
* Screenshot Storage
* Thumbnail Storage

---

#  System Architecture

## Frontend

* React.js
* React Router
* Axios
* Vite

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Authentication

* JWT Authentication
* HTTP-only Cookies
* Protected Routes
* Role-based Access Control

## Payments

* Razorpay

## Storage

* Cloudflare R2
* AWS SDK v3

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
├── uploads/
├── index.js
└── package.json
```

---

# Database Design

## User

Stores:

* Account Information
* Authentication Data
* Purchased Games
* Wishlist
* Favorites
* Recently Played Games
* Statistics

## Game

Stores:

* Game Metadata
* Developer Information
* Pricing
* Downloads
* Plays
* Views
* Ratings
* Screenshots
* Cloud Storage References

## Purchase

Stores:

* Payment Records
* Revenue Tracking
* Purchase Status
* Razorpay Order IDs

## Comment

Stores:

* User Comments
* Game Discussions

---

# Security Measures

## Authentication Security

* Password Hashing using bcrypt
* JWT Authentication
* HTTP-only Cookies
* Protected APIs

## Payment Security

* Razorpay Signature Verification
* Server-side Payment Validation
* Duplicate Purchase Prevention

## Upload Security

* Pre-Signed Upload URLs
* Ownership Verification
* Protected Upload APIs

---

# Installation & Setup

## 1. Clone Repository

```bash
git clone <repository-url>
cd project-folder
```

---

## 2. Backend Setup

```bash
cd Backend
npm install
```

### Create .env

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

### Create .env

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

1. Create an account
2. Upload game information
3. Upload screenshots and media
4. Upload game package to Cloudflare R2
5. Publish game
6. Track analytics and revenue

## For Players

1. Create an account
2. Browse games
3. Add to wishlist or favorites
4. Purchase premium games
5. Download or play games
6. Rate and comment on games

---

# Testing Strategy

The platform was tested using:

## Backend Testing

* Manual API Testing
* Authentication Testing
* Payment Flow Testing
* Database Validation
* Upload Flow Verification
* Error Handling Validation

## Frontend Testing

* User Authentication Flow
* Game Upload Flow
* Payment Flow
* Developer Dashboard
* Responsive UI Validation
* API Integration Testing

## End-to-End Testing

* User Registration
* Login/Logout
* Game Upload
* Game Purchase
* Download Flow
* Ratings & Comments

---

# Current Platform Capabilities

* 8 Open Source Games Hosted
* Cloud-Based File Storage
* Premium Game Monetization
* Developer Dashboard
* Secure Authentication
* Payment Integration
* User Engagement Features
* Analytics Tracking

---

# Assumptions Made During Development

1. Developers are responsible for owning the rights to uploaded games.
2. Uploaded game packages are valid and safe to distribute.
3. Cloudflare R2 provides sufficient scalability for storage requirements.
4. Razorpay handles all payment processing and settlement.
5. Users have stable internet connectivity for large file downloads.
6. Initial moderation is handled manually by platform administrators.

---

# Future Enhancements

## Short-Term

* Game Search Filters
* Genre Recommendations
* Better Mobile Responsiveness
* User Notifications
* Download Progress Tracking

## Medium-Term

* Admin Dashboard
* Automated Game Moderation
* Game Approval Workflow
* Revenue Withdrawal System
* Email Verification
* Password Recovery

## Long-Term

* Multiplayer Hosting Support
* Real-Time Chat
* Achievement System
* Leaderboards
* Subscription Plans
* AI-Based Game Recommendations
* CDN Optimization
* Developer Analytics Dashboard
* Mobile Application

---

# Scalability Considerations

The platform is designed to scale through:

* Stateless Backend APIs
* MongoDB Database Architecture
* Cloudflare R2 Object Storage
* Independent Frontend Deployment
* Secure Cloud-Based File Distribution

---

# Author

**Vinay Kumar**

Built as a full-stack game distribution platform to explore scalable software architecture, cloud storage integration, payment systems, and developer-focused game publishing workflows.

---

# License

This project is intended for educational, portfolio, and commercial experimentation purposes. Developers are responsible for ensuring compliance with game licensing and copyright requirements before distributing content through the platform.
