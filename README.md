# Revest Sales App

The **Revest Sales App** is a fullstack application for managing **sales orders and products**. The application supports **user registration and authentication**, displays **cross-sell products**.

The backend is built with:
- **Backend:** Node.js (Express) + PostgreSQL
- **Frontend:** Angular 18
- **Authentication:** JWT-based secure login

---

## 📚 Table of Contents

- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Authentication & Security](#authentication--security)
- [Testing](#testing)
- [Technologies](#technologies)

---

## 📁 Project Structure

```bash
.
├── backend
│   ├── src
│   │   ├── config
│   │   │   ├── data-source.ts
│   │   │   └── repositories.ts
│   │   ├── controllers
│   │   │   ├── auth.controller.ts
│   │   │   ├── products.controller.ts
│   │   │   └── salesOrder.controller.ts
│   │   ├── entities
│   │   │   ├── products.entity.ts
│   │   │   ├── salesOrder.entity.ts
│   │   │   └── user.entity.ts
│   │   ├── routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── product.routes.ts
│   │   │   └── salesOrder.routes.ts
│   │   ├── middlewares
│   │   │   └── jwt.middleware.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── frontend
│   ├── src
│   │   ├── app
│   │   │   ├── dashboard
│   │   │   │   ├── header/
│   │   │   │   ├── footer/
│   │   │   │   ├── hero/
│   │   │   │   ├── cross-sell/
│   │   │   │   └── home/
│   │   │   ├── auth
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── auth.interface.ts
│   │   │   ├── models/
│   │   │   ├── shared/
│   │   │   │   ├── guards/
│   │   │   │   ├── loader-interceptor/
│   │   │   │   └── password-validator/
│   │   │   └── app.routes.ts
│   │   ├── assets/
│   │   │   ├── hero images/
│   │   │   └── product images/
│   │   ├── index.html
│   │   └── main.ts
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## 🛠 Environment Variables

Create a `.env` file in the `backend` directory with the required environment variables.

⚠️ **Note:** Sensitive credentials (database passwords, JWT secrets) are shared separately by email (please check attached file in the email).

Contact ME:
- Email: [okasha.i.anas@gmail.com](mailto:okasha.i.anas@gmail.com)
- LinkedIn: [Anas Okasha](https://www.linkedin.com/in/anas-okasha/)

---

### ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Anas-i-okasha/revest-sales-assignment.git
```

### 2. Install Backend dependencies

```bash
cd backend/
npm install
```

### 3. Run database migrations

```bash
npm run migration:run
```

### 4. Start Backend Server

```bash
npm run dev
```

### 5. Install Frontend dependencies

```bash
cd frontend/
npm install
```

### 6. Start Frontend Server

```bash
npm run start
```

---

## 🚀 Usage

Once the backend and frontend are running, users can:

- Register or login
- Browse products and add items to the cart

---

## 🔌 API Documentation

All API endpoints with request/response examples are available on API Documentation:

[**Documentation**](https://documenter.getpostman.com/view/12996171/2sBXVhCqnF)

---

## 🔐 Authentication & Security

### JWT Authentication

- Users log in via the `/auth/login` endpoint
- A **JWT token** is returned on successful login
- Protected routes require a valid JWT in the `Authorization` header
- Tokens are verified server-side for secure access

---
