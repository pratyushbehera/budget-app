# FinPal

FinPal is a comprehensive personal finance application designed to help users track their income, expenses, and savings. It features a modern, mobile-friendly interface with tabbed navigation, AI-powered insights, and collaborative tools for group expenses.

## Features

*   **Smart Budgeting:** Plan and track income, fixed needs, variable wants, savings, and annual/irregular expenses.
*   **Transaction Management:** Add, filter, search, and export transactions.
*   **Group Expenses:** Create groups, split bills, and track shared expenses with friends and family.
*   **Recurring Payments:** Manage subscriptions and regular bills with automated tracking.
*   **Visual Analytics:**
    *   Interactive dashboard with summary cards.
    *   "Needs vs Wants vs Savings" analysis (50/30/20 rule).
    *   Monthly spending trends.
*   **AI Insights:** Powered by **Google Gemini** to provide actionable financial advice based on your spending patterns.
*   **Offline Support (PWA):** Installable app that works offline and syncs when back online.

## Tech Stack

*   **Frontend:** React 18, Vite, Redux Toolkit, Tailwind CSS, Recharts.
*   **Backend:** Node.js, Express, Mongoose.
*   **AI:** Google Gemini API.
*   **Database:** MongoDB Atlas.

## Setup Instructions

### 1. Backend Setup

1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` directory with the following variables:
    ```env
    MONGODB_URI="your_mongodb_connection_string"
    GEMINI_API_KEY="your_gemini_api_key"
    JWT_SECRET="your_strong_secret_jwt_key"
    PORT=5001
    FRONTEND_URL="http://localhost:5173"
    ```
4.  Run the development server:
    ```bash
    npm run start
    ```

### 2. Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    The application will start at `http://localhost:5173`.

## Contributing

Please adhere to the rules defined in `agents.md` when contributing to this project.
