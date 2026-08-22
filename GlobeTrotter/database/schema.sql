-- ============================================
-- GlobeTrotter Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS globetrotter;

USE globetrotter;

-- ============================================
-- USERS
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- TRIPS
-- ============================================

CREATE TABLE IF NOT EXISTS trips (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DECIMAL(10, 2) DEFAULT 0.00,
    is_public BOOLEAN DEFAULT FALSE,
    share_token VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================
-- CITIES
-- ============================================

CREATE TABLE IF NOT EXISTS cities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    cost_index DECIMAL(5, 2) DEFAULT 1.00,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- TRIP STOPS
-- A trip can contain multiple cities.
-- Example:
-- Trip → Mumbai → Jaipur → Delhi
-- ============================================

CREATE TABLE IF NOT EXISTS trip_stops (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trip_id INT NOT NULL,
    city_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    stop_order INT DEFAULT 0,

    FOREIGN KEY (trip_id)
        REFERENCES trips(id)
        ON DELETE CASCADE,

    FOREIGN KEY (city_id)
        REFERENCES cities(id)
        ON DELETE RESTRICT
);


-- ============================================
-- ACTIVITIES
-- Activities belong to a city.
-- ============================================

CREATE TABLE IF NOT EXISTS activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    city_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    duration_hours DECIMAL(4, 2) DEFAULT 1.00,
    estimated_cost DECIMAL(10, 2) DEFAULT 0.00,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (city_id)
        REFERENCES cities(id)
        ON DELETE CASCADE
);


-- ============================================
-- TRIP ACTIVITIES
-- Activities selected for a particular trip stop.
-- ============================================

CREATE TABLE IF NOT EXISTS trip_activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trip_stop_id INT NOT NULL,
    activity_id INT NOT NULL,
    activity_date DATE NOT NULL,
    start_time TIME NULL,

    FOREIGN KEY (trip_stop_id)
        REFERENCES trip_stops(id)
        ON DELETE CASCADE,

    FOREIGN KEY (activity_id)
        REFERENCES activities(id)
        ON DELETE CASCADE
);


-- ============================================
-- EXPENSES
-- Used for budget breakdown:
-- Transport
-- Accommodation
-- Food
-- Other
-- ============================================

CREATE TABLE IF NOT EXISTS expenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trip_id INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (trip_id)
        REFERENCES trips(id)
        ON DELETE CASCADE
);


-- ============================================
-- INDEXES
-- These make common searches faster.
-- ============================================

CREATE INDEX idx_trips_user
ON trips(user_id);

CREATE INDEX idx_trip_stops_trip
ON trip_stops(trip_id);

CREATE INDEX idx_trip_stops_city
ON trip_stops(city_id);

CREATE INDEX idx_activities_city
ON activities(city_id);

CREATE INDEX idx_activities_category
ON activities(category);

CREATE INDEX idx_trip_activities_stop
ON trip_activities(trip_stop_id);

CREATE INDEX idx_expenses_trip
ON expenses(trip_id);

CREATE INDEX idx_cities_name
ON cities(name);
