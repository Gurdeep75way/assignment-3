# Expense Tracker API

## 📌 Overview
This is a **RESTful API** for managing expenses, budgets, and categories for users. It allows users to track their spending, categorize expenses, and set budgets.

## 🚀 Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB** (Mongoose ORM)
- **JWT Authentication** (Access Token & Refresh Token)
- **Passport JWT** for authentication

## 📦 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Gurdeep75way/Inventory-Management-System.git
cd backend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and add the following:
```env
PORT=5000
MONGO_URI=MONGO URI
JWT_SECRET= JWT SECRET KEY
JWT_ACCESS_SECRET=JWT ACCESS SECRET
JWT_REFRESH_SECRET=JWT REFRESH SECRET
```

### 4️⃣ Start the Server
```bash
npm start
```

## 🔑 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|---------------|---------------------|
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | User login         |
| POST   | `/api/auth/refresh`  | Refresh access token |

### Users
| Method | Endpoint      | Description        |
|--------|--------------|--------------------|
| GET    | `/api/users/:id` | Get user by ID |


## 🛠 Running Tests
To run tests, use:
```bash
npm test
```

## 🤝 Contributing
1. Fork the repo and create your branch: `git checkout -b feature-branch`
2. Commit your changes: `git commit -m 'Added new feature'`
3. Push to the branch: `git push origin feature-branch`
4. Submit a pull request

## 📝 License
This project is licensed under the **MIT License**.

