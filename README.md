![Bookstore-Management-System](https://socialify.git.ci/vippium/Bookstore-Management-System/image?custom_language=Vite&description=1&font=Jost&language=1&name=1&pattern=Transparent&theme=Auto)

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
Bookstore-Management-System/
├── bookstore-backend/
│   ├── .env.example
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── ratingController.js
│   │   └── wishlistController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── bookModel.js
│   │   ├── cartModel.js
│   │   ├── orderModel.js
│   │   ├── ratingModel.js
│   │   ├── userModel.js
│   │   └── wishlistModel.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── ratingRoutes.js
│   │   └── wishlistRoutes.js
│   ├── server.js
│   └── utils/
│       ├── emailTemplates.js
│       └── sendEmail.js
├── bookstore-frontend/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── public/
│   │   ├── empty-box 1.png
│   │   ├── empty-box.png
│   │   ├── placeholder 1.jpeg
│   │   └── placeholder.jpeg
│   ├── README.md
│   ├── src/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets/
│   │   │   ├── react 1.svg
│   │   │   └── react.svg
│   │   ├── components/
│   │   │   ├── AdminOrderPanel.jsx
│   │   │   ├── BookForm.jsx
│   │   │   ├── BookManager.jsx
│   │   │   ├── Breadcrumb.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── InvoiceCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── OrdersChart.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SalesChart.jsx
│   │   │   ├── StarRating.jsx
│   │   │   ├── toastUtils.js
│   │   │   ├── TopGenresChart.jsx
│   │   │   └── UserOrdersChart.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── WishlistContext.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages/
│   │   │   ├── AddBook.jsx
│   │   │   ├── BookDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── MyOrders.jsx
│   │   │   │   ├── OrderSummary.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── UserInfo.jsx
│   │   │   ├── EditBook.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── OrderSuccess.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── VerifyOtp.jsx
│   │   │   └── Wishlist.jsx
│   │   └── services/
│   │       ├── authService.js
│   │       ├── axios.js
│   │       ├── cartApi.js
│   │       ├── ratingApi.js
│   │       ├── useAnalytics.js
│   │       └──wishlistService.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
├── Instructions Guide.pdf
├── LICENSE
├── .gitignore
├── package-lock.json
├── postman/
│   └── bookstore-api.postman_collection.json
└── README.md

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

## 📘 API Documentation (Swagger UI)

The **Bookstore Management API** is fully documented with **Swagger UI**, providing an interactive and developer-friendly interface to explore all endpoints.

### 🌐 Live API Docs

- **Deployed URL**:

```
https://bookstore-z02o.onrender.com/api-docs
```

- **Local URL**:

```
http://localhost:5000/api-docs
```

### 📑 Includes:
- Complete endpoint listing (Auth, Books, Orders, Cart, Wishlist, Ratings, Analytics).
- JWT Authentication support.
- Ready-made example requests and responses.
- Developer-friendly schemas and models.
- Built-in **“Try It Out”** testing directly from the browser.

---

## 🙌 Acknowledgments

I've used these platforms and libraries in my project:

- **MongoDB Atlas** – Hosted NoSQL database for scalable data storage.
- **Render** – Cloud platform used for deploying the backend Node.js server.
- **Vercel** – Optimized deployment platform for hosting the frontend React application.
- **PDFKit** – Generates PDF invoices after successful orders.
- **TailwindCSS** – Utility-first CSS framework for responsive UI.
- **React Hot Toast** – Lightweight toast notifications.
- **Framer Motion** – Smooth animations and transitions.
- **Lucide Icons** – Elegant icon set for consistent visuals.
- **JWT (JSON Web Token)** – Secure authentication and user sessions.
- **Express.js** – Backend framework used for building RESTful APIs.

---

## 🎗 License

This project is protected under the [MIT](https://choosealicense.com/licenses/mit/) License. For more details, refer to the [LICENSE](https://github.com/vippium/Bookstore-Management-System/blob/main/LICENSE).