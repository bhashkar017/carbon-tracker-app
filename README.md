# Carbon Footprint Tracker 🌍🌱
A full-stack MERN application designed to help users track and reduce their personal carbon footprint by logging daily activities. 
This project features a secure authentication system, a dynamic user dashboard, and a real-time calculation engine.

**Live Demo:** :  https://carbontrackingapp.netlify.app/

-----

## Features

  * **Secure User Authentication:** Users can register for a new account and log in securely. The system uses JWT (JSON Web Tokens) for session management.
  * **Dynamic Dashboard:** After logging in, users are greeted with a dashboard summarizing their carbon footprint, including total CO₂, activities logged, and achievements unlocked.
  * **Activity Logging:** An intuitive form allows users to log activities across various categories like Transport, Electricity, and Food.
  * **Real-time Calculation Engine:** The backend processes activity data and calculates the estimated carbon footprint in real-time.
  * **Data Visualization:** The dashboard features a weekly trend chart to help users visualize their progress over time.
  * **Personalized Suggestions:** A rule-based suggestion engine provides actionable tips to help users reduce their environmental impact.
  * **Leaderboard:** A competitive leaderboard showcases the top users with the lowest carbon footprints, encouraging positive change.

-----

## Tech Stack

This project is built using the MERN stack and deployed on modern hosting platforms.

  * **Frontend:**
      * React.js
      * Tailwind CSS (via CDN)
      * Axios (for API requests)
      * Recharts (for data visualization)
  * **Backend:**
      * Node.js
      * Express.js
  * **Database:**
      * MongoDB (with MongoDB Atlas for cloud hosting)
  * **Deployment:**
      * **Backend API:** Deployed on [Render](https://render.com/)
      * **Frontend App:** Deployed on [Netlify](https://www.netlify.com/)

-----

## Local Setup and Installation

To run this project on your local machine, follow these steps:

**Prerequisites:**

  * Node.js and npm
  * A MongoDB Atlas account and connection string

**1. Clone the repository:**

```
git clone https://github.com/bhashkar017/carbon-tracker-app.git
cd carbon-tracker-app
```

**2. Set up the Backend:**

```
cd server
npm install
```

  * Create a `.env` file in the `server` directory and add your `MONGO_URI` and `JWT_SECRET`.

<!-- end list -->

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_secret_key
```

  * Start the backend server:

<!-- end list -->

```
npm run dev
```

The backend will be running on `http://localhost:5000`.

**3. Set up the Frontend:**

```
cd client
npm install
```

  * Start the frontend application:

<!-- end list -->

```
npm start
```

The frontend will open in your browser at `http://localhost:3000`.

-----

## Author

  * **Bhashkar Anand**
      * [LinkedIn Profile](https://www.linkedin.com/in/bhashkar-anand-a21569284/)
      * [GitHub Profile](https://www.google.com/search?q=https://github.com/bhashkar017)
