<p align="center"><img src="https://socialify.git.ci/vippium/Bookstore-Management-System/image?custom_description=&amp;custom_language=React&amp;description=1&amp;font=Jost&amp;language=1&amp;name=1&amp;pattern=Transparent&amp;theme=Auto" alt="project-image"></p>

<p id="description">A full-featured Bookstore web application built with the MERN stack (MongoDB, Express.js, React, Node.js). It offers robust features for customers to explore and purchase books, and for admins to manage inventory and orders. Includes email notifications with PDF invoices, real-time UI feedback, and a polished, responsive interface..</p>


## 👾 Features

- 🔐 User authentication with JWT (Login, Register, Logout)
- 📚 Browse books with search, filter, pagination
- 🛒 Add to Cart / Buy Now (guest + logged in)
- 📦 Checkout with PDF invoice & email
- 💬 Reviews & ratings system
- ❤️ Wishlist management
- 📊 Admin dashboard (books, users, orders)
- 🧑‍💻 Profile page with edit, password reset, delete
- 🌈 Fully animated UI (fade, swipe, hover, modal transitions)
- 📬 Email integration via `nodemailer`
- 📄 Deployment on Render (Backend) & Vercel (Frontend)

---

## 📁 Project Structure

```sh
└── Bookstore-Management-System/
    ├── LICENSE
    ├── README.md
    ├── bookstore-backend
    │   ├── .env.example
    │   ├── config
    │   ├── controllers
    │   ├── middleware
    │   ├── models
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── routes
    │   ├── server.js
    │   └── utils
    ├── bookstore-frontend
    │   ├── .gitignore
    │   ├── README.md
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── postcss.config.js
    │   ├── public
    │   ├── src
    │   ├── tailwind.config.js
    │   └── vite.config.js
    └── package-lock.json
```

---
## 🚀 Getting Started

### ☑️ Prerequisites

Before getting started with Bookstore-Management-System, ensure your runtime environment meets the following requirements:

- Node.js
- MongoDB Atlas database
- Render account (for backend deployment)
- Vercel account (for frontend deployment

## 🚀 Usage

To run the **Bookstore Management System** locally, follow the steps below for both frontend and backend:

### 🔧 Backend Setup

```bash
cd bookstore-backend
npm install
npm start dev
```
### 🎨 Frontend Setup

``` bash
cd bookstore-frontend
npm install
npm run dev
```

---
## 📌 Project Roadmap

- ✅ Authentication (Login / Register)
- ✅ Book management (CRUD)
- ✅ Cart (guest + user)
- ✅ Wishlist for Logged-In users.
- ✅ Checkout + Email support.
- ✅ Reviews & Ratings.
- ✅ Admin panel (only for Admins).
- ✅ Filtering, Pagination.
- ✅ Full animations & polish.
- ✅ Deployment
- ✅ README & Documentation.

---

## 🙌 Acknowledgments

I've used these platforms and libraries in my project :

- **MongoDB Atlas** – Hosted NoSQL database for scalable and flexible data storage.
- **Render** – Cloud platform used for deploying the backend Node.js server.
- **Vercel** – Optimized deployment platform for hosting the frontend React application.
- **PDFKit** – Enables dynamic generation of PDF invoices after successful orders.
- **TailwindCSS** – Utility-first CSS framework for building clean, responsive user interfaces.
- **React Hot Toast** – Lightweight toast notifications for instant user feedback.
- **Framer Motion** – Animations and transitions for smooth UI interactions.
- **Lucide Icons** – Elegant and consistent icon set used across the app.
- **JWT (JSON Web Token)** – Secure authentication and user session management.
- **Express.js** – Backend framework used for building RESTful APIs.

---

## 📬 API Testing (Postman)

You can find the Postman collection for testing all backend API endpoints in the [`postman/`](./postman) directory.

> Import it in Postman for ready-to-use request sets.

---

## 🎗 License

This project is protected under the [MIT](https://choosealicense.com/licenses) License. For more details, refer to the [LICENSE](https://choosealicense.com/licenses/) file.

