# Reverse Networking

A full-stack web application designed to facilitate networking through skill sharing and mentorship. This platform allows users to create offers for their skills, book sessions with others, and manage their professional connections.

## Features

- **User Authentication**: Secure signup and login functionality using JWT.
- **Dashboard**: personalized dashboard to manage activities.
- **Profile Management**: Comprehensive user profiles allowing users to showcase their skills, bio, and track their community stats (Credits, Give Score, Hours Given/Received).
- **Offer Management**: Users can create, edit, and delete offers for skills they want to share.
- **Booking System**: Complete booking lifecycle management including accepting, rejecting, and completing networking sessions.
- **Leaderboard**: Recognizes top contributors in the community based on their engagement and "Give Score".
- **Review System**: Users can leave reviews for sessions they've attended, building trust and reputation.
- **Responsive Design**: Built with Tailwind CSS for a modern, responsive user interface.

## Tech Stack

### Frontend
- **Framework**: React (v19) with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management & Data Fetching**: React Hooks, Axios
- **Routing**: React Router DOM
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt
- **Testing**: Jest with Supertest

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB (Local or Atlas connection string)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/reverse-networking.git
    cd reverse-networking
    ```

2.  **Backend Setup**
    Navigate to the `Backend` directory and install dependencies:
    ```bash
    cd Backend
    npm install
    ```

    Create a `.env` file in the `Backend` directory with the following variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```

3.  **Frontend Setup**
    Navigate to the `Frontend` directory and install dependencies:
    ```bash
    cd ../Frontend
    npm install
    ```

## Running the Application

### Start the Backend Server
From the `Backend` directory:
```bash
npm run dev
```
The server will start on `http://localhost:5000` (or your defined PORT).

### Start the Frontend Application
From the `Frontend` directory:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## Folder Structure

```
Reverse Networking/
├── Backend/                 # Node.js & Express Backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── server.ts       # Entry point
│   ├── .env                # Environment variables
│   └── package.json
│
├── Frontend/                # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Application pages
│   │   └── App.tsx         # Main component
│   ├── vite.config.ts      # Vite configuration
│   └── package.json
│
└── README.md               # Project Documentation
```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the ISC License.
