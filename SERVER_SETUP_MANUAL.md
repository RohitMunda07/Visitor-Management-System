
---

# Visitor Management System (VMS) – Deployment & Run Manual

## 1. Introduction

The **Visitor Management System (VMS)** is a full-stack web application developed using the **MERN stack** to digitize and streamline visitor entry, approval, and gate pass generation in an organization.

The system supports **role-based access control** with the following roles:
- Employee
- Admin
- HOD (Head of Department)
- Security

Each role has clearly defined responsibilities to ensure secure, transparent, and efficient visitor handling.

---

## 2. Project Overview

- **Project Name:** Visitor Management System (VMS)
- **Architecture:** MERN Stack (MongoDB, Express.js, React.js, Node.js)
- **Frontend:** React + Vite
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **Authentication:** JWT (Access & Refresh Tokens)
- **Media Storage:** Cloudinary
- **Deployment Ready:** Yes (Vercel + Render)

---

## 3. Server & System Requirements

### Minimum Requirements
- **Node.js:** v18 or above
- **MongoDB:** v6.x or above
- **npm:** v9 or above
- **Git:** Installed
- **Internet Connection:** Required (Cloudinary, Email service)

## File and Folder Structure
```

Visitor-Management-System/
│
├── .git/                          # Git version control
│
├── Backend/
│   ├── Controllers/               # API controllers (business logic)
│   ├── DB/                        # Database connection & configuration
│   ├── Middlewares/               # Auth, role, error handling middlewares
│   ├── Models/                    # Mongoose schemas & models
│   ├── Public/
│   │   └── temp/                  # Temporary file storage (uploads)
│   ├── Routes/                    # Express route definitions
│   ├── Src/                       # Server bootstrap & app initialization
│   ├── Utils/                     # Helper utilities (JWT, Cloudinary, OTP)
│   │
│   ├── .gitignore
│   ├── .prettierignore
│   ├── .prettierrc
│   ├── package.json
│   ├── package-lock.json
│   └── TODO.txt
│
├── Frontend/
│   ├── public/
│   │   └── VMS.png                # Static assets
│   │
│   ├── src/
│   │   ├── api/                   # Axios API service files
│   │   ├── assets/                # Images, icons, static resources
│   │   ├── components/            # Reusable UI components
│   │   ├── constants/             # App constants (roles, sort types)
│   │   ├── context/               # Redux / Context API state management
│   │   ├── pages/                 # Page-level components
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx               # React entry point
│   │
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── TODO.txt
│   ├── vercel.json
│   └── vite.config.js
│
├── README.md                      # Project overview & usage
├── SERVER_SETUP_MANUAL.md         # Server deployment & setup guide
└── TODO.txt
```
## Prerequisites

Before running the project, ensure the following are installed on your system:

- Node.js (v18 or higher)
- npm (comes with Node.js)
- Git
- Stable internet connection
- A code editor (VS Code recommended)

To verify installation:
```bash
node -v
npm -v
git --version
```
## 4. Backend Setup Instructions

### 4.1 Navigate to Backend Folder
```bash
cd backend
````

### 4.2 Install Backend Dependencies

```bash
npm install
```

### 4.3 Backend Dependencies (with Versions)

| Package       | Version |
| ------------- | ------- |
| express       | ^5.2.1  |
| mongoose      | ^8.20.3 |
| mongodb       | ^6.21.0 |
| jsonwebtoken  | ^9.0.3  |
| bcrypt        | ^6.0.0  |
| multer        | ^2.0.2  |
| cloudinary    | ^2.8.0  |
| nodemailer    | ^7.0.12 |
| otp-generator | ^4.0.1  |
| cors          | ^2.8.5  |
| cookie-parser | ^1.4.7  |
| dotenv        | ^17.2.3 |

### 4.4 Backend Dev Dependencies

* nodemon ^3.1.11
* prettier ^3.7.4

---

## 5. Backend Configuration Setup

Create a `.env` file in the backend root directory:

---

## Backend Environment Variables Configuration

Create a `.env` file in the **backend root directory** and add the following variables:

```env
PORT=8080

FRONTEND_ORIGIN=https://visitor-management-system-git-de-fa3b55-dj240800-6382s-projects.vercel.app

MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<db-name>

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME

EMAIL_USER=your_gmail_id
EMAIL_PASS=your_gmail_app_password
```

---

## Explanation of Each Environment Variable

### 1. Server Configuration

| Variable          | Description                       |
| ----------------- | --------------------------------- |
| `PORT`            | Port on which backend server runs |
| `FRONTEND_ORIGIN` | Allowed frontend URL for CORS     |

---

### 2. Database Configuration

| Variable      | Description                     |
| ------------- | ------------------------------- |
| `MONGODB_URI` | MongoDB Atlas connection string |

**How to get MongoDB URI**

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a **Cluster**
3. Click **Connect → Drivers**
4. Copy the connection string
5. Replace `<username>` and `<password>`

## Database Initialization

This project uses MongoDB Atlas. No manual schema creation is required because:

- Mongoose automatically creates collections
- Default indexes are created on first run

However, ensure:
- Your MongoDB user has **read/write** access
- Network access allows connections from your IP (`0.0.0.0/0` for testing)


---

### 3. JWT Authentication

| Variable               | Description                  |
| ---------------------- | ---------------------------- |
| `ACCESS_TOKEN_SECRET`  | Secret key for access token  |
| `ACCESS_TOKEN_EXPIRY`  | Access token expiry time     |
| `REFRESH_TOKEN_SECRET` | Secret key for refresh token |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiry time    |

**Tip:**
Use strong random strings (can be generated using:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 4. Cloudinary Configuration (Image Upload)

Cloudinary is used to store **visitor images and profile photos** securely.

### Required Variables

| Variable                | Description             |
| ----------------------- | ----------------------- |
| `CLOUD_NAME`            | Cloudinary account name |
 | `CLOUDINARY_API_KEY`    | API Key                 |
| `CLOUDINARY_API_SECRET` | API Secret              |
| `CLOUDINARY_URL`        | Combined Cloudinary URL |

---

### How to Get Cloudinary Credentials (Step-by-Step)

1. Visit 👉 [https://cloudinary.com/](https://cloudinary.com/)
2. Sign up for a **free account**
3. Login to **Cloudinary Dashboard**
4. On the **Dashboard Home**, you will see:

```txt
Cloud Name
API Key
API Secret
```

5. Copy and paste them into `.env`

#### Example:

```env
CLOUD_NAME=dmqennj82
CLOUDINARY_API_KEY=957618884324771
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxx
```

---

### How to Get CLOUDINARY_URL

Cloudinary automatically supports this format:

```txt
cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

Example:

```env
CLOUDINARY_URL=cloudinary://957618884324771:API_SECRET@dmqennj82
```

---

## 5. Email Configuration (OTP / Password Reset)

Email service is used for:

* OTP verification
* Forgot password functionality

### Required Variables

| Variable     | Description        |
| ------------ | ------------------ |
| `EMAIL_USER` | Gmail ID           |
| `EMAIL_PASS` | Gmail App Password |

---

### How to Get Gmail App Password

1. Go to **Google Account**
2. Enable **2-Step Verification**
3. Navigate to **Security → App Passwords**
4. Select:

   * App: Mail
   * Device: Other
5. Generate password
6. Copy the **16-character password**

⚠️ **Do NOT use your Gmail login password**

Example:

```env
EMAIL_USER=example@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

---

## Security Best Practices

* ❌ Never commit `.env` file to GitHub
* ✅ Add `.env` to `.gitignore`
* ✅ Rotate secrets periodically
* ✅ Use different secrets for development & production

---

## Summary

This environment setup enables:

* Secure authentication using JWT
* Image uploads via Cloudinary
* Email OTP verification
* Database connectivity
* CORS protection



> ⚠️ **Important:** Use a Gmail **App Password**, not your regular Gmail password.

---

## 6. Start Backend Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Backend will run on:

```
http://localhost:8080
```

---

## 7. Frontend Setup Instructions

### 7.1 Navigate to Frontend Folder

```bash
cd frontend
```

### 7.2 Install Frontend Dependencies

```bash
npm install
```

### 7.3 Frontend Dependencies (with Versions)

| Package          | Version  |
| ---------------- | -------- |
| react            | ^19.2.0  |
| react-dom        | ^19.2.0  |
| react-router-dom | ^7.11.0  |
| redux            | ^5.0.1   |
| react-redux      | ^9.2.0   |
| @reduxjs/toolkit | ^2.11.2  |
| axios            | ^1.13.2  |
| tailwindcss      | ^4.1.18  |
| lucide-react     | ^0.562.0 |

### 7.4 Frontend Dev Dependencies

* vite ^7.2.4
* eslint ^9.39.1
* @vitejs/plugin-react ^5.1.1

---

## 8. Frontend Configuration

Create a `.env` file in frontend root:

```env
VITE_BACKEND_URL=http://localhost:8080/api/v1
```

---

## 9. Start Frontend Server

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## 10. Application Workflow (Brief)

1. **Employee**

   * Registers visitor details
   * Submits request for approval

2. **HOD**

   * Reviews and approves visitor request

3. **Security**

   * Verifies approved visitors
   * Generates Gate Pass
   * Downloads Gate Pass (with image)

4. **Admin**

   * Manages users (Add / Update / Delete)
   * Monitors visitor records

---

## 11. Demo Credentials (Testing Only)

```txt
Role      | Email                  | Password
----------|------------------------|----------
Employee  | employee@gmail.com     | 123
HOD       | hod@gmail.com          | hod123
Admin     | admin@gmail.com        | admin123
Security  | security@gmail.com     | security123
```

---

## 12. Additional Tools Used

* **Postman** – API Testing
* **MongoDB Compass** – Database inspection
* **Cloudinary Dashboard** – Media management
* **Render / Vercel** – Deployment

---

## 13. Troubleshooting

### Common Issues & Fixes

**1. Server not starting**

* Check `.env` file
* Ensure MongoDB connection string is correct

**2. Image upload error**

* Verify Cloudinary credentials
* Check file size (max 5MB)

**3. OTP email not received**

* Ensure Gmail App Password is configured
* Check spam folder

**4. CORS error**

* Verify frontend URL is allowed in backend CORS config

---

## 14. Conclusion

This manual provides a complete step-by-step guide to **install, configure, and run** the Visitor Management System on a local or production server.
The system is scalable, secure, and designed following real-world enterprise requirements.

---

## 15. References

* Node.js Documentation – [https://nodejs.org](https://nodejs.org)
* MongoDB Documentation – [https://www.mongodb.com/docs](https://www.mongodb.com/docs)
* React Documentation – [https://react.dev](https://react.dev)
* Cloudinary Documentation – [https://cloudinary.com/documentation](https://cloudinary.com/documentation)

---

© 2026 – Visitor Management System
Developed as an Internship Project

