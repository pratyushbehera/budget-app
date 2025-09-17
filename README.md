# Monthly Budget App

This is a full-stack personal finance application designed to help users track their income, expenses, and savings. It features a modern, mobile-friendly interface with tabbed navigation, AI-powered insights, and user authentication with data persistence to MongoDB.

## Features

*   **User Authentication:** Secure signup and login with email and password. User data is stored in MongoDB.
*   **Monthly Budgeting:** Plan and track income, fixed needs, variable wants, savings, and annual/irregular expenses for each month and year.
*   **Transaction Management:** Add, view, filter, search, and delete individual transactions.
*   **Summary & Charts:**
    *   Dashboard view with summary cards showing total income, expenses, and savings.
    *   "Needs vs Wants vs Savings" pie chart based on a 50/20/30 rule.
    *   "Monthly Spend Trend" bar chart to visualize income and expenses over time.
*   **AI-Powered Insights:** Generate actionable insights based on your planned vs. actual spending using the OpenRouter API.
*   **Data Persistence:** All user data (transactions, plans, insights) is stored in a MongoDB Atlas database.
*   **Offline Capabilities (PWA):**
    *   The application is a Progressive Web App (PWA) and can be installed.
    *   Caches app assets for offline use.
    *   Queues offline actions (add/delete transactions, update plans) in local storage and syncs them to MongoDB when online.
*   **CSV Export:** Export monthly transactions for the current month as a CSV file.

## Technologies Used

*   **Frontend:** React.js, Tailwind CSS, Recharts (for charts), React Markdown (for AI insights).
*   **Backend:** Node.js, Express.js, Mongoose (ODM for MongoDB), bcryptjs (for password hashing), jsonwebtoken (for authentication), dotenv.
*   **Database:** MongoDB Atlas
*   **AI Integration:** OpenRouter API (using `deepseek/deepseek-chat-v3-0324:free` model)

## Setup Instructions

### 1. Backend Setup

1.  **Navigate to the `server` directory:**
    ```bash
    cd server
    ```
2.  **Install backend dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file:**
    In the `server` directory, create a file named `.env` and add the following environment variables:
    ```
    MONGODB_URI="your_mongodb_connection_string"
    OPENROUTER_API_KEY="your_openrouter_api_key"
    JWT_SECRET="your_strong_secret_jwt_key"
    PORT=5001 # Or your preferred port
    ```
    *   Replace `"your_mongodb_connection_string"` with your MongoDB Atlas connection string.
    *   Replace `"your_openrouter_api_key"` with your actual OpenRouter API key.
    *   Replace `"your_strong_secret_jwt_key"` with a long, random string for JWT signing.
4.  **Run the backend server:**
    ```bash
    node server.js
    ```
    The server will start on `http://localhost:5001` (or your specified `PORT`).

### 2. Frontend Setup

1.  **Navigate to the project root directory:**
    ```bash
    cd ..
    ```
    (If you are still in the `server` directory, otherwise you should already be in `/Users/pratyushbehera/budget-app/`)
2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```
3.  **Run the frontend development server:**
    ```bash
    npm start
    ```
    The application will open in your browser, usually at `http://localhost:3000`.

## Usage

1.  **Sign Up / Log In:** Upon launching the app, create a new account or log in with existing credentials.
2.  **Dashboard:** View your overall financial summary and charts.
3.  **Transactions:** Add new transactions, view a list of all transactions, and filter/search them.
4.  **Plans:** Set your monthly budget by planning amounts for different categories. Use the "Copy Previous Month Plan" feature to quickly set up new months.
5.  **Insights:** Generate AI-powered insights into your spending habits by clicking the "Generate Insights" button. The insights are saved per month and will load automatically on subsequent visits to the tab for that month.
6.  **Month/Year Selector:** Use the dropdowns in the header to navigate between different months and years.
7.  **Export CSV:** Download your transactions for the current month as a CSV file.
