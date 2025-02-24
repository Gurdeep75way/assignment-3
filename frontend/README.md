# Frontend - Inventory Management System

## 📌 Project Overview
This is the **frontend** of the Inventory Management System, built using modern web technologies to provide a seamless and responsive user experience for managing inventory, tracking stock levels, and generating reports.

## 🚀 Tech Stack
- **Framework:** React + Vite
- **State Management:** Redux Toolkit (RTK)
- **Styling:** Tailwind CSS / SCSS
- **Routing:** React Router
- **API Handling:** Axios
- **Authentication:** JWT-based authentication (Access Token & Refresh Token with Passport JWT)
- **Data Management:** Dummy data for inventory, but with proper state management using RTK

## 📂 Project Structure
```
frontend/
├── public/            # Static files (favicon, manifest, etc.)
├── src/
│   ├── assets/        # Images, icons, and styles
│   ├── components/    # Reusable UI components
│   ├── pages/         # Application pages
│   ├── store/         # Redux store setup
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API service functions
│   ├── utils/         # Helper functions
│   ├── App.tsx        # Main App component
│   ├── main.tsx       # Entry point for React
│   ├── vite.config.ts # Vite configuration
├── .env               # Environment variables (ignored in Git)
├── package.json       # Project dependencies
├── tsconfig.json      # TypeScript configuration
└── README.md          # Project documentation
```

## 📦 Installation & Setup
Make sure you have **Node.js (v18 or later)** installed.

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Gurdeep75way/inventory-management.git
cd inventory-management/frontend
```

### 2️⃣ Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 3️⃣ Start Development Server
```bash
npm run dev
```

### 4️⃣ Build for Production
```bash
npm run build
```

## 🔑 Environment Variables
Create a `.env` file in the root of the **frontend** folder and configure the necessary variables:
```env
VITE_API_URL=Backend-api
```

## 🚀 Features
✅ Real-time Stock Level Tracking UI  
✅ Multi-Warehouse Support with Filtering  
✅ Low-Stock Alerts with Reorder Suggestions  
✅ Interactive Reporting Tools with Data Export Options  
✅ JWT Authentication (Access & Refresh Token)  
✅ Secure API Calls with Token Handling  
✅ Responsive UI with Modern Styling  

## 🤝 Contributing
1. Fork the repo and create your branch: `git checkout -b feature-branch`
2. Commit your changes: `git commit -m 'Added new feature'`
3. Push to the branch: `git push origin feature-branch`
4. Submit a pull request

## 📝 License
This project is licensed under the **MIT License**.