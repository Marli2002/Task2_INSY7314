# 💳 Secure Payment Management System (Task 2 – INSY7314 POE)

This project is a secure full-stack web application built for the INSY7314 Proof of Evidence (POE).  
It demonstrates strong implementation of backend security, frontend input validation, and DevSecOps automation using modern tools and best practices.

---

## 🧠 Overview

The system allows users to:

- Register, log in, and log out securely.
- Create new payment entries and view their existing payments.

All data is stored in a MongoDB database, and communication between the frontend and backend happens securely via HTTPS (SSL).

---

## 🛠️ Technologies Used

| Layer     | Technologies |
|----------|--------------|
| Frontend | React, Axios, HTML5, CSS3 |
| Backend  | Node.js, Express.js, Mongoose, bcrypt, JSON Web Tokens (JWT) |
| Database | MongoDB (local or MongoDB Atlas) |
| Security | HTTPS/SSL, bcrypt password hashing, JWT authentication, regex input validation, sanitization |
| DevSecOps | CircleCI (CI/CD), SonarCloud (code quality & security analysis), Docker (containerization) |

---

## ⚙️ Backend Implementation

**📁 Folder:** `/backend`

**Key Features**

### Authentication system
- User registration, login, and logout.
- Passwords are salted and hashed with bcrypt before storage.
- Secure session handling using JWT tokens.

### MongoDB Integration
- Connects via Mongoose to either a local or cloud MongoDB instance.

### SSL Configuration
- The backend runs over HTTPS, using a valid SSL certificate (self-signed or trusted CA).

### Security Protections
- Input sanitization to prevent NoSQL injections.
- Helmet and CORS middleware for additional protection.
- Validation for all incoming requests.

**Example API Endpoints**

| Endpoint         | Method | Description                     |
|-----------------|--------|---------------------------------|
| /api/register    | POST   | Register new user               |
| /api/login       | POST   | Login existing user             |
| /api/logout      | POST   | Logout user                     |
| /api/payments    | GET    | Fetch user’s payments           |
| /api/payments    | POST   | Create a new payment (default status: pending) |

---

## 💻 Frontend Implementation

**📁 Folder:** `/frontend`

**Key Features**
- Built with React.
- Communicates with backend API over HTTPS.
- Implements input whitelisting using regex:
  - Amount must be numeric.
  - Passwords follow NIST guidelines (minimum length, complexity).
- Protects against NoSQL/SQL injection by sanitizing all form inputs.
- Displays user’s payments and allows creation of new ones.

**Example Pages**
- `LoginPage.js` → User authentication
- `RegisterPage.js` → Create new account
- `PaymentsPage.js` → View and add payments

---

## 🔐 Security Features Summary

| Feature             | Description                                           |
|--------------------|-------------------------------------------------------|
| Password Hashing    | Passwords are salted + hashed with bcrypt.           |
| JWT Authentication  | Secure token-based authentication between client and server. |
| HTTPS Communication | Both frontend and backend are served over SSL.       |
| Input Validation    | Regex-based whitelisting prevents invalid data.      |
| Injection Protection| Inputs sanitized to block NoSQL/SQL injection attempts. |
| Helmet Middleware   | Adds HTTP headers for extra security.                |
| CORS Configuration  | Restricts API access to the frontend origin only.    |

---

## 🧰 DevSecOps Pipeline

### ⚙️ CircleCI Setup
A CI/CD pipeline is configured using CircleCI, located in `.circleci/config.yml`.

**Pipeline Workflow**
1. Build backend (`backend-build`)
2. Build frontend (`frontend-build`)
3. Build Docker images (`docker-build`)
4. Run SonarCloud scan (`sonarqube`)

**Example Flow**
- When code is pushed to GitHub:
  - CircleCI triggers automatically.
  - Runs unit tests, builds frontend/backend.
  - Builds Docker images.
  - Triggers a SonarCloud scan to analyze:
    - Code quality
    - Security vulnerabilities
    - Maintainability
    - Duplications

---

### 🧩 Environment Variables (in CircleCI)

| Variable             | Description                              |
|---------------------|------------------------------------------|
| SONAR_ORG            | Your SonarCloud organization (e.g., marli2002) |
| SONAR_PROJECT_KEY    | Your SonarCloud project key              |
| SONAR_TOKEN          | SonarCloud authentication token          |

---

### 🐳 Docker Setup

Both frontend and backend are containerized.  
Each folder (`frontend`, `backend`) contains its own Dockerfile.

**To build locally:**

bash
docker build -t task2_insy7314_frontend ./frontend
docker build -t task2_insy7314_backend ./backend

### 🚀 How to Run Locally

**1️⃣ Clone the repository**
- bash
- Copy code
- git clone https://github.com/Marli2002/Task2_INSY7314.git
- cd Task2_INSY7314

**2️⃣ Run Backend**
- bash
- Copy code
- cd backend
- npm install
- npm start

**3️⃣ Run Frontend**
- bash
- Copy code
- cd frontend
- npm install
- npm run dev

**4️⃣ Access**
- Frontend: https://localhost:5173

- Backend API: https://localhost:5000

---

### 🧪 SonarCloud Scan Results
After each push, the pipeline triggers a SonarCloud scan that reports:

- Security Rating (A–E)

- Maintainability

- Reliability

- Test Coverage

- Duplications

**Target:**

- ✅ Maintainability = A

- ✅ Reliability = A

- ✅ Security ≥ B

### 🏁 Conclusion
This project demonstrates:

  - Full-stack development with React, Node.js, and MongoDB.

  - Strong security implementation using best practices for hashing, HTTPS, and    input sanitization.

  - Integration of a DevSecOps pipeline using CircleCI, SonarCloud, and Docker,  ensuring continuous delivery and automated security scanning.

### 👩‍💻 Developed By
  - Team: Anke Bekker, Marli van Zyl, Michke van der Merwe

  - Module: INSY7314

  - Lecturer: Glynn Rudman

  - Year: 2025
