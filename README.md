# 🌍 GlobeTrotter

### Empowering Personalized Travel Planning

> **Plan smarter. Travel better.**
>
> GlobeTrotter is a personalized travel-planning platform that helps travelers create, organize, visualize, budget, and share multi-city trips from one place.

---

## 📌 Overview

Planning a multi-city trip often means switching between multiple applications for destinations, activities, budgets, dates, and itineraries. GlobeTrotter brings these tasks together into a single interactive travel-planning experience.

Users can create customized trips, add multiple cities and travel stops, discover activities, assign them to specific days, estimate their expenses, visualize the complete journey, and share their itinerary with others.

The project is designed around the core vision of making travel planning **personalized, intelligent, collaborative, and easy to use**.

---

## 🎯 Problem Statement

GlobeTrotter aims to simplify the complexity of planning multi-city travel.

The application enables travelers to:

- Create customized multi-city itineraries
- Assign travel dates and durations
- Add activities to individual stops
- Discover cities and activities through search
- Estimate trip costs automatically
- View cost breakdowns
- Visualize trips using timelines and calendars
- Share travel plans publicly or with friends

The application also demonstrates the use of a **relational database** for storing and retrieving connected travel information such as users, trips, stops, activities, and estimated expenses.

---

## ✨ Key Features

### 🧳 Multi-City Trip Planning

Create a complete trip containing multiple destinations.

Each trip can contain:

- Trip name
- Start and end dates
- Description
- Multiple cities/stops
- Stop durations
- Activities for each destination

---

### 📍 Itinerary Builder

Build the trip step-by-step by adding cities and assigning dates.

Users can:

- Add travel stops
- Select cities
- Assign travel dates
- Add activities to stops
- Organize cities in the desired order

This forms the central planning experience of GlobeTrotter.

---

### 🔎 City & Activity Discovery

Explore destinations and things to do before adding them to the itinerary.

City discovery can provide information such as:

- Country/region
- Popularity
- Cost index

Activity discovery supports categories and useful information such as:

- Activity type
- Cost
- Duration
- Description

These capabilities are part of the application's intended discovery experience described in the problem statement.

---

### 🎯 Activity Planning

Activities can be attached to individual destinations and days.

Example:

```text
JAIPUR

Day 1
├── Amber Fort
├── City Palace
└── Hawa Mahal

Day 2
├── Local Food Tour
└── Jaipur Market
```

This transforms a list of destinations into a practical day-by-day travel plan.

---

### 💰 Smart Budget & Cost Breakdown

GlobeTrotter estimates the overall cost of a trip and provides a clear financial summary.

Example:

```text
Transport       ₹12,500
Accommodation   ₹18,000
Activities       ₹3,200
Food             ₹7,000
────────────────────────
Total           ₹40,700

Budget          ₹50,000
Remaining        ₹9,300
```

The budget system is designed around the problem statement's requested categories:

- Transport
- Accommodation/stay
- Activities
- Meals

It can also calculate:

- Total estimated cost
- Average cost per day
- Remaining budget
- Over-budget alerts

---

### 🧠 Smart Trip Insights

GlobeTrotter can provide simple rule-based insights based on itinerary and budget data.

Examples:

> 💡 **Smart Insight**
> Jaipur has the highest activity density in your trip. Consider spending an additional day there.

> 💰 **Budget Alert**
> Your daily spending is higher than your trip average.

The goal is to make the application feel more intelligent without requiring a complex AI system.

---

### 📅 Timeline & Itinerary Visualization

The completed trip can be presented as a structured day-by-day itinerary.

Example:

```text
MAY 12
━━━━━━━━━━━━━━━━━━━━
📍 JAIPUR

09:00  Amber Fort
       ₹500

13:00  Lunch
       ₹600

16:00  City Palace
       ₹300


MAY 13
━━━━━━━━━━━━━━━━━━━━
📍 JAIPUR

10:00  Hawa Mahal
       ₹200
```

The project follows the problem statement's requirement for:

- Day-wise layouts
- City headers
- Activity blocks
- Activity times
- Activity costs
- Calendar/list visualization

---

### 🔗 Shareable Trips

Completed itineraries can be shared through a public/read-only view.

Example:

```text
Your trip is ready! 🎉

[ Copy Public Link ]

GlobeTrotter / trip / rajasthan-explorer
```

The public itinerary concept supports:

- Public URL
- Trip summary
- Read-only itinerary
- Copy Trip functionality
- Social sharing

---

## 🚀 Core User Flow

The primary GlobeTrotter experience is:

```text
Dashboard
    ↓
Create Trip
    ↓
Add Cities
    ↓
Assign Dates
    ↓
Discover Activities
    ↓
Build Itinerary
    ↓
Calculate Budget
    ↓
View Timeline
    ↓
Share Trip
```

### Example

A user wants to plan:

```text
Mumbai → Jaipur → Delhi
7 Days
Budget: ₹50,000
```

They create the trip, add Jaipur and Delhi as stops, assign dates, select activities, and GlobeTrotter generates a structured itinerary with an estimated budget.

The final trip can then be viewed through the timeline and shared with others.

---

## 🗄️ Database Design

GlobeTrotter uses a relational data model to represent the relationships between users, trips, destinations, activities, and expenses.

### Core entities

```text
Users
  │
  └── Trips
       │
       ├── Trip Stops
       │      │
       │      └── Cities
       │
       ├── Activities
       │
       └── Expenses
```

A simplified relational structure:

```text
users
  ↓
trips
  ↓
trip_stops
  ↓
cities

trip_stops
  ↓
trip_activities
  ↓
activities

trips
  ↓
expenses
```

### Relationships

- A **User** can create multiple Trips.
- A **Trip** can contain multiple Stops.
- Each **Stop** belongs to a City.
- A **Stop** can contain multiple Activities.
- A **Trip** can contain multiple Expenses.
- Activities and expenses contribute to the trip's overall planning and budget calculations.

This relational approach directly supports the requirement to store user-specific itineraries, stops, activities, and estimated expenses.

---

## 🏗️ Project Architecture

```text
┌─────────────────────────────┐
│          Frontend           │
│                             │
│  Dashboard                  │
│  Trip Builder               │
│  Activity Search            │
│  Budget                     │
│  Timeline                   │
│  Sharing                    │
└──────────────┬──────────────┘
               │
               │ API Requests
               ▼
┌─────────────────────────────┐
│           Backend           │
│                             │
│  Trip APIs                  │
│  City APIs                  │
│  Activity APIs              │
│  Budget Logic               │
│  Sharing Logic              │
└──────────────┬──────────────┘
               │
               │ Database Queries
               ▼
┌─────────────────────────────┐
│      Relational Database    │
│                             │
│  Users                      │
│  Trips                      │
│  Stops                      │
│  Cities                     │
│  Activities                 │
│  Expenses                   │
└─────────────────────────────┘
```

---

## 📁 Project Structure

GlobeTrotter/
│
├── .gitignore
│
├── client/
│ ├── package.json
│ ├── package-lock.json
│ └── src/
│ │
│ ├── components/
│ │ ├── Navbar.jsx
│ │ ├── TripCard.jsx
│ │ ├── StopCard.jsx
│ │ ├── ActivityCard.jsx
│ │ ├── ActivityModal.jsx
│ │ ├── BudgetCard.jsx
│ │ └── Timeline.jsx
│ │
│ ├── pages/
│ │ ├── Dashboard.jsx
│ │ ├── CreateTrip.jsx
│ │ ├── ItineraryBuilder.jsx
│ │ ├── Budget.jsx
│ │ ├── Timeline.jsx
│ │ └── SharedTrip.jsx
│ │
│ ├── services/
│ │ └── api.js
│ │
│ ├── context/
│ │ └── TripContext.jsx
│ │
│ ├── utils/
│ │ ├── budget.js
│ │ └── date.js
│ │
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
│
├── server/
│ ├── package.json
│ ├── package-lock.json
│ ├── .env
│ ├── server.js
│ │
│ ├── config/
│ │ └── db.js
│ │
│ ├── routes/
│ │ ├── trips.js
│ │ ├── cities.js
│ │ ├── activities.js
│ │ └── public.js
│ │
│ ├── controllers/
│ │ ├── trips.js
│ │ ├── cities.js
│ │ └── activities.js
│ │
│ ├── services/
│ │ └── budget.js
│ │
│ └── middleware/
│ └── errorHandler.js
│
└── database/
├── schema.sql
└── seed.sql

---

## 🎨 Application Screens

The complete problem statement describes the following application areas:

| Screen             | Purpose                               |
| ------------------ | ------------------------------------- |
| Login / Signup     | User authentication                   |
| Dashboard / Home   | Trips, destinations and quick actions |
| Create Trip        | Start a personalized trip             |
| My Trips           | View and manage created trips         |
| Itinerary Builder  | Add cities, dates and activities      |
| Itinerary View     | Review the complete itinerary         |
| City Search        | Discover destinations                 |
| Activity Search    | Discover things to do                 |
| Trip Budget        | View costs and budget status          |
| Trip Timeline      | Visualize the journey                 |
| Shared Itinerary   | View/share a public trip              |
| Profile / Settings | Manage user preferences               |
| Admin / Analytics  | Optional platform analytics           |

The official problem statement lists the Admin/Analytics dashboard as optional.

---

## 🛠️ Tech Stack

> Replace/add exact versions according to the technologies used in your final implementation.

### Frontend

- React
- JavaScript
- CSS
- Responsive UI components

### Backend

- Node.js
- Express.js
- REST APIs

### Database

- Relational database
- SQL-based data modeling

### Development

- Git & GitHub
- VS Code
- REST API testing tools

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd GlobeTrotter
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Configure environment variables

Create a `.env` file in the backend directory.

Example:

```env
PORT=5000
DATABASE_URL=your_database_url
```

Add any additional variables required by your implementation.

### 5. Start the backend

```bash
npm run dev
```

### 6. Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

The application will then be available at the local development URL shown by your frontend development server.

---

## 🧪 Example Demo Scenario

### Trip

**Rajasthan Explorer**

```text
Mumbai → Jaipur → Delhi

May 12 – May 18

Budget: ₹50,000
```

### Stops

```text
📍 Jaipur
May 12 – May 15

📍 Delhi
May 15 – May 18
```

### Activities

```text
Jaipur
├── Amber Fort
├── City Palace
└── Hawa Mahal

Delhi
├── India Gate
├── Red Fort
└── Chandni Chowk Food Tour
```

### Budget

```text
Transport       ₹12,500
Accommodation   ₹18,000
Activities       ₹3,200
Food             ₹7,000
────────────────────────
Estimated       ₹40,700

Budget          ₹50,000
Remaining        ₹9,300
```

### Result

```text
Trip Created ✓
Itinerary Ready ✓
Budget Calculated ✓
Timeline Generated ✓
Trip Shareable ✓
```

---

## 💡 Why GlobeTrotter?

GlobeTrotter combines several common travel-planning tasks into one workflow:

```text
Discover
   ↓
Plan
   ↓
Organize
   ↓
Budget
   ↓
Visualize
   ↓
Share
```

Instead of simply displaying travel information, GlobeTrotter focuses on helping users **turn travel ideas into an organized, actionable itinerary**.

---

## 🧠 Smart Planning Logic

The application can derive useful insights from existing trip data without requiring expensive AI infrastructure.

Example rules:

```javascript
if (dailyCost > averageDailyCost * 1.3) {
  showBudgetAlert();
}

if (totalCost > tripBudget) {
  showOverBudgetWarning();
}

if (activitiesPerDay > 3) {
  showActivityDensityInsight();
}
```

This provides a foundation for future intelligent recommendations while keeping the hackathon implementation lightweight and reliable.

---

## 📱 Responsive Experience

GlobeTrotter is designed with a responsive experience in mind so travelers can interact with their itinerary across desktop and mobile layouts.

Important interfaces include:

- Dashboard
- Trip cards
- Itinerary builder
- Activity cards
- Budget summary
- Timeline
- Shared itinerary

The problem statement explicitly calls for a user-friendly experience across desktop and mobile platforms.

---

## 🔮 Future Scope

GlobeTrotter can be extended into a full travel ecosystem with:

- AI-powered itinerary recommendations
- Real-time flight and hotel data
- Live destination pricing
- Weather-aware itinerary suggestions
- Route optimization
- Collaborative trip editing
- Map-based itinerary visualization
- Advanced expense tracking
- Social travel communities
- Personalized destination recommendations
- Real-time notifications
- Advanced analytics dashboard

These extensions build toward the broader vision of GlobeTrotter as a personalized, intelligent, and collaborative travel-planning platform.

---

## 🏆 Hackathon Focus

For the hackathon MVP, GlobeTrotter focuses on delivering one polished end-to-end journey:

```text
Dashboard
     ↓
Create Trip
     ↓
Add Cities
     ↓
Add Activities
     ↓
Budget Calculation
     ↓
Timeline
     ↓
Share
```

Rather than building many disconnected screens, the goal is to demonstrate a **complete working travel-planning experience**.

---

## 👥 Team

**GlobeTrotter Hackathon Team**

Built with ❤️ for smarter and simpler travel planning.

---

## 📄 Project Brief

This project is based on the GlobeTrotter hackathon problem statement:

**“GlobeTrotter – Empowering Personalized Travel Planning”**

The brief defines GlobeTrotter as an end-to-end platform for creating multi-city itineraries, discovering destinations and activities, estimating budgets, visualizing journeys, and sharing travel plans.

---

## ⭐ Project Vision

> **Make travel planning as exciting as the trip itself.**

GlobeTrotter brings destinations, experiences, budgets, schedules, and people together so travelers can spend less time organizing their trip and more time looking forward to it.
