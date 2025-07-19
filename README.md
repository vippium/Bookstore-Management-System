<p align="center"><img src="https://socialify.git.ci/vippium/Bookstore-Management-System/image?custom_description=&amp;custom_language=React&amp;description=1&amp;font=Jost&amp;language=1&amp;name=1&amp;pattern=Transparent&amp;theme=Auto" alt="project-image"></p>


## 👾 Features

- 🔐 **JWT Authentication** – Secure login, register, and logout flow with protected routes  
- 📩 **Email OTP Verification** – Verify account via 6-digit OTP sent after registration 
- 📚 **Book Browsing** – Search, filter, and paginate through available books  
- 🛒 **Cart & Checkout** – Add to cart or buy instantly (only for verified logged-in users)  
- 🧾 **Order System** – Place orders with auto-generated PDF invoices + email confirmation  
- 💬 **Reviews & Ratings** – Share and view book reviews and star ratings  
- ❤️ **Wishlist Management** – Save favorite books to your personal wishlist  
- 📊 **Admin Dashboard** – Manage users, orders, and books with real-time data & analytics  
- 👤 **User Profile** – Edit profile, change password, or delete account securely  
- 🌈 **Polished UI/UX** – Smooth transitions, modals, animations, and responsive design  
- 📬 **Email Notifications** – OTP and order confirmations via Nodemailer  
- ☁️ **Deploy-Ready** – Hosted on **Render** (backend) & **Vercel** (frontend)  


---

## 📁 Project Structure

```sh
└── Bookstore-Management-System/
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
    ├── postman
    │   ├── bookstore-api.postman_collection.json
    ├── LICENSE
    ├── README.md
    └── package-lock.json
```

---
## 🚀 Getting Started

### ☑️ Prerequisites

Before getting started with Bookstore-Management-System, ensure your runtime environment meets the following requirements:

- Node.js
- MongoDB Atlas database
- Render account (for backend deployment)
- Vercel account (for frontend deployment)

## 🚀 Usage

To run the **Bookstore Management System** locally, follow the steps below for both frontend and backend:

### 🔧 Backend Setup

```bash
cd bookstore-backend
npm install
npm run dev
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

This project is protected under the [MIT](https://choosealicense.com/licenses/mit/) License. For more details, refer to the [LICENSE](https://github.com/vippium/Bookstore-Management-System/blob/8354ac12755e2cc51595e89f86e562243e2fd562/LICENSE) file.

