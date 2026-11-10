# CoreStock - Professional Product Management System (MERN Stack)

A modern, responsive, SaaS-grade **Product Management System** built with the complete **MERN Stack** (React.js + Vite, Node.js + Express.js, MongoDB + Mongoose, and Lucide React icons). Features a clean SaaS aesthetic with navy blue (`#0f172a`) and indigo (`#4f46e5`) accents, complete Indian Rupee (`₹`) currency localization, and real-time Date & Time auditing.

---

## 🚀 Key Features

- **Dashboard Intelligence**:
  - Live KPI cards: Total Products, Total Categories, Total Inventory Valuation (₹), and Stock Attention Alerts.
  - Interactive multi-segment **Stock Health Visualizer** (In Stock %, Low Stock %, Out of Stock %).
  - Department-level Category breakdown cards with volume and Rupee valuation.
  - Recently added products table with live Date & Time auditing and quick actions.

- **Product Inventory Management (Full CRUD)**:
  - **Create**: Add new products with real-time field validation, character countdowns, and a dynamic **Live Catalog Card Preview**.
  - **Read**: Fast, responsive table with search by name/SKU/description, category filtering, stock status filters (`In Stock`, `Low Stock`, `Out of Stock`), multi-field sorting, and pagination.
  - **Update**: Dedicated Edit view with pre-populated form, preserving history and updating timestamps.
  - **Delete**: Confirmation dialog displaying product details and warning before permanent deletion from MongoDB.
  - **Quick Detail Inspector**: View full specifications, SKU, retail value in ₹, and creation/update timestamps in a clean modal overlay.

- **Currency & Date/Time Localization**:
  - All pricing formatted in **Indian Rupees (₹)** using the standard Indian numbering system (`₹1,99,900.00`).
  - Top navigation bar features a **Live Date & Time Widget** ticking in real time.
  - Dedicated **Date & Time Added** column on both catalog and dashboard tables.

- **Robust Backend Architecture**:
  - Modular Express routes, controllers, and validation middlewares.
  - Permanent persistence in MongoDB via Mongoose.
  - Built-in status automation (auto-calculates `In Stock`, `Low Stock` for $\le 5$ units, and `Out of Stock` for $0$ units).
  - Standalone seeding script with realistic, high-quality sample data across multiple departments.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React.js 18 + Vite |
| **Iconography** | Lucide React |
| **Styling** | Modern Vanilla CSS (Design Tokens, Responsive Flex/Grid) |
| **Backend Runtime** | Node.js (v18+) + Express.js 4 |
| **Database** | MongoDB (v6.0+) with Mongoose 8 ORM |
| **Deployment Targets** | Vercel (Frontend SPA) + Render (Backend Node API) + MongoDB Atlas |

---

## 📁 Project Folder Structure

```text
mern-product-management/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection using Mongoose
│   ├── controllers/
│   │   └── productController.js  # CRUD operations, aggregations, seeding
│   ├── middleware/
│   │   ├── errorMiddleware.js    # 404 & global exception handler
│   │   └── validateProduct.js    # Strict validation rules for request body
│   ├── models/
│   │   └── Product.js            # Mongoose Schema with auto-status hooks
│   ├── routes/
│   │   └── productRoutes.js      # REST API route declarations
│   ├── seed/
│   │   └── seedData.js           # CLI seeding script with sample products
│   ├── .env                      # Local environment configuration (git ignored)
│   ├── .env.example              # Environment template
│   ├── .gitignore                # Backend-specific ignore rules
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express application entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── productService.js # Fetch-based REST API client (supports VITE_API_URL)
│   │   ├── components/
│   │   │   ├── ConfirmModal.jsx  # Delete confirmation dialog
│   │   │   ├── EmptyState.jsx    # Empty state UI with actions
│   │   │   ├── LoadingSpinner.jsx# Spinner and loading state
│   │   │   ├── Navbar.jsx        # Top sticky navbar with search, alerts & live clock
│   │   │   ├── ProductDetailModal.jsx # Product viewer modal
│   │   │   ├── ProductForm.jsx   # Add/Edit form with live preview in ₹
│   │   │   ├── Sidebar.jsx       # SaaS navy sidebar with icons & status
│   │   │   ├── StatCard.jsx      # Metric cards with badges
│   │   │   └── Toast.jsx         # Auto-dismiss toast notifications
│   │   ├── pages/
│   │   │   ├── AddProductPage.jsx# Add new product view
│   │   │   ├── CategoriesPage.jsx# Department breakdown & filter hub
│   │   │   ├── DashboardPage.jsx # Analytics, stock health visualizer & KPIs
│   │   │   ├── EditProductPage.jsx# Edit product view
│   │   │   └── ProductsPage.jsx  # Inventory data table view with Date & Time
│   │   ├── utils/
│   │   │   └── formatters.js     # Currency (₹) and Date-Time formatters
│   │   ├── App.jsx               # Top-level state and view router
│   │   ├── index.css             # SaaS design system (Navy #0f172a & Indigo #4f46e5)
│   │   └── main.jsx              # React DOM root entry
│   ├── .env.example              # Frontend environment template
│   ├── .gitignore                # Frontend-specific ignore rules
│   ├── index.html                # HTML template with Inter font
│   ├── package.json              # Frontend dependencies
│   ├── vercel.json               # Vercel SPA rewrite configuration
│   └── vite.config.js            # Vite config with /api reverse proxy
├── .gitignore                    # Global repository gitignore
├── package.json                  # Root runner scripts
└── README.md                     # Comprehensive documentation
```

---

## 💻 Local Development Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- **MongoDB**: Local MongoDB community service running on port 27017, or a MongoDB Atlas URI

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file (copy from `.env.example`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/product_management_db
   NODE_ENV=development
   ```
4. Seed the database with sample products in Indian Rupees:
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   # Backend runs at http://localhost:5000
   ```

### 3. Frontend Setup
1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   # Application opens at http://localhost:5173
   ```

---

## 🌐 Production Deployment Guide

### A. Deploy Backend to Render

1. Create a free account at [render.com](https://render.com).
2. Click **New +** $\rightarrow$ **Web Service**.
3. Connect your GitHub repository: `product-management-system`.
4. Configure the Web Service settings:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (Render will override automatically with its own port)
   - `MONGODB_URI`: *Your MongoDB Atlas connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/product_management_db?retryWrites=true&w=majority`)*
6. Click **Deploy Web Service**.
7. Once deployed, note down your live Render backend URL:
   `https://<your-backend-name>.onrender.com`

---

### B. Deploy Frontend to Vercel

1. Create a free account at [vercel.com](https://vercel.com).
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import your GitHub repository: `product-management-system`.
4. In the project configuration:
   - **Root Directory:** Click `Edit` and select `frontend`.
   - **Framework Preset:** `Vite` (automatically detected).
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Under **Environment Variables**, add:
   - `VITE_API_URL`: *Your Render backend URL (e.g., `https://<your-backend-name>.onrender.com`)*
6. Click **Deploy**.
7. Vercel will build and assign you a live production URL:
   `https://<your-project-name>.vercel.app`

---

## 📡 REST API Reference

All endpoints are prefixed with `/api/products`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check and server status |
| `GET` | `/api/products` | Retrieve products with search, category, status, sort, and pagination |
| `GET` | `/api/products/stats` | Aggregated dashboard metrics, category statistics, and recent items |
| `GET` | `/api/products/categories` | Distinct list of product categories |
| `GET` | `/api/products/:id` | Fetch single product by ID |
| `POST` | `/api/products` | Create a new product (validates all fields) |
| `PUT` | `/api/products/:id` | Update an existing product |
| `DELETE`| `/api/products/:id` | Delete product permanently |
| `POST` | `/api/products/seed` | Seed initial sample catalog data |

---

## 🛡️ Input Validation Rules

- **Name**: Required, 2 – 120 characters, automatically trimmed.
- **Description**: Required, 5 – 1000 characters.
- **Price**: Required, numeric, must be $> ₹0.00$.
- **Category**: Required non-empty string.
- **Quantity**: Required non-negative integer ($\ge 0$).
- **Status Automation**:
  - `0` units $\rightarrow$ `Out of Stock`
  - `1 - 5` units $\rightarrow$ `Low Stock`
  - `> 5` units $\rightarrow$ `In Stock`

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
