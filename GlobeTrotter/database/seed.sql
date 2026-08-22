-- ============================================
-- GlobeTrotter Seed Data
-- ============================================

USE globetrotter;


-- ============================================
-- DEMO USER
-- ============================================

INSERT INTO users (id, name, email, password)
VALUES
(1, 'Demo User', 'demo@globetrotter.com', NULL)
ON DUPLICATE KEY UPDATE
    name = VALUES(name);


-- ============================================
-- CITIES
-- ============================================

INSERT INTO cities
(id, name, country, region, cost_index, image_url)
VALUES

(1, 'Mumbai', 'India', 'Maharashtra', 1.20, NULL),

(2, 'Jaipur', 'India', 'Rajasthan', 0.85, NULL),

(3, 'Delhi', 'India', 'Delhi', 1.00, NULL),

(4, 'Goa', 'India', 'Goa', 1.15, NULL),

(5, 'Udaipur', 'India', 'Rajasthan', 0.90, NULL),

(6, 'Ahmedabad', 'India', 'Gujarat', 0.80, NULL),

(7, 'Paris', 'France', 'Île-de-France', 2.50, NULL),

(8, 'London', 'United Kingdom', 'England', 2.80, NULL),

(9, 'Dubai', 'United Arab Emirates', 'Dubai', 2.40, NULL),

(10, 'Tokyo', 'Japan', 'Kanto', 2.30, NULL)

ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    country = VALUES(country),
    region = VALUES(region),
    cost_index = VALUES(cost_index);


-- ============================================
-- MUMBAI ACTIVITIES
-- ============================================

INSERT INTO activities
(id, city_id, name, description, category, duration_hours, estimated_cost)
VALUES

(1, 1, 'Gateway of India',
 'Visit Mumbai''s iconic waterfront landmark.',
 'Sightseeing', 2.00, 0.00),

(2, 1, 'Marine Drive',
 'Walk along Mumbai''s famous seaside promenade.',
 'Sightseeing', 2.00, 0.00),

(3, 1, 'Elephanta Caves',
 'Explore the historic rock-cut cave temples.',
 'Culture', 5.00, 500.00),

(4, 1, 'Colaba Walking Tour',
 'Explore historic streets, markets and architecture.',
 'Culture', 3.00, 800.00),

(5, 1, 'Mumbai Food Tour',
 'Taste popular local Mumbai street food.',
 'Food', 3.00, 1000.00);


-- ============================================
-- JAIPUR ACTIVITIES
-- ============================================

INSERT INTO activities
(id, city_id, name, description, category, duration_hours, estimated_cost)
VALUES

(6, 2, 'Amber Fort',
 'Explore the historic hilltop fort of Jaipur.',
 'Sightseeing', 3.00, 500.00),

(7, 2, 'City Palace',
 'Visit the royal palace complex in Jaipur.',
 'Culture', 2.00, 300.00),

(8, 2, 'Hawa Mahal',
 'See Jaipur''s famous Palace of Winds.',
 'Sightseeing', 1.50, 200.00),

(9, 2, 'Jaipur Food Tour',
 'Discover traditional Rajasthani food.',
 'Food', 3.00, 800.00),

(10, 2, 'Nahargarh Fort',
 'Enjoy panoramic views over Jaipur.',
 'Sightseeing', 3.00, 350.00),

(11, 2, 'Jantar Mantar',
 'Explore the historic astronomical observatory.',
 'Culture', 1.50, 200.00);


-- ============================================
-- DELHI ACTIVITIES
-- ============================================

INSERT INTO activities
(id, city_id, name, description, category, duration_hours, estimated_cost)
VALUES

(12, 3, 'Red Fort',
 'Explore the historic Mughal-era fort.',
 'Culture', 3.00, 500.00),

(13, 3, 'India Gate',
 'Visit Delhi''s famous war memorial.',
 'Sightseeing', 1.50, 0.00),

(14, 3, 'Qutub Minar',
 'Explore the UNESCO World Heritage monument.',
 'Culture', 2.50, 400.00),

(15, 3, 'Lotus Temple',
 'Visit the distinctive lotus-shaped temple.',
 'Culture', 2.00, 0.00),

(16, 3, 'Chandni Chowk Food Tour',
 'Taste famous food in Old Delhi.',
 'Food', 3.00, 900.00);


-- ============================================
-- GOA ACTIVITIES
-- ============================================

INSERT INTO activities
(id, city_id, name, description, category, duration_hours, estimated_cost)
VALUES

(17, 4, 'Baga Beach',
 'Relax at one of Goa''s most popular beaches.',
 'Beach', 3.00, 0.00),

(18, 4, 'Fort Aguada',
 'Explore the historic Portuguese fort.',
 'Culture', 2.00, 100.00),

(19, 4, 'Dudhsagar Falls',
 'Take a day trip to the famous waterfall.',
 'Adventure', 7.00, 1500.00),

(20, 4, 'Goa Sunset Cruise',
 'Enjoy a sunset cruise along the coast.',
 'Adventure', 2.00, 1200.00);


-- ============================================
-- UDAIPUR ACTIVITIES
-- ============================================

INSERT INTO activities
(id, city_id, name, description, category, duration_hours, estimated_cost)
VALUES

(21, 5, 'City Palace Udaipur',
 'Explore the grand palace overlooking Lake Pichola.',
 'Culture', 3.00, 400.00),

(22, 5, 'Lake Pichola Boat Ride',
 'Enjoy a scenic boat ride across the lake.',
 'Adventure', 2.00, 700.00),

(23, 5, 'Jagdish Temple',
 'Visit the historic Hindu temple in Udaipur.',
 'Culture', 1.00, 0.00),

(24, 5, 'Bagore Ki Haveli',
 'Experience traditional Rajasthani culture and performances.',
 'Culture', 2.00, 250.00);


-- ============================================
-- AHMEDABAD ACTIVITIES
-- ============================================

INSERT INTO activities
(id, city_id, name, description, category, duration_hours, estimated_cost)
VALUES

(25, 6, 'Sabarmati Ashram',
 'Visit the historic ashram on the Sabarmati river.',
 'Culture', 2.00, 0.00),

(26, 6, 'Adalaj Stepwell',
 'Explore the historic Adalaj stepwell.',
 'Culture', 1.50, 50.00),

(27, 6, 'Kankaria Lake',
 'Enjoy activities around the large urban lake.',
 'Adventure', 3.00, 200.00),

(28, 6, 'Ahmedabad Food Walk',
 'Try traditional Gujarati cuisine.',
 'Food', 3.00, 700.00);


-- ============================================
-- PARIS ACTIVITIES
-- ============================================

INSERT INTO activities
(id, city_id, name, description, category, duration_hours, estimated_cost)
VALUES

(29, 7, 'Eiffel Tower',
 'Visit Paris''s most famous landmark.',
 'Sightseeing', 3.00, 2500.00),

(30, 7, 'Louvre Museum',
 'Explore one of the world''s largest museums.',
 'Culture', 4.00, 1800.00),

(31, 7, 'Seine River Cruise',
 'Take a scenic cruise through central Paris.',
 'Adventure', 2.00, 1200.00);


-- ============================================
-- LONDON ACTIVITIES
-- ============================================

INSERT INTO activities
(id, city_id, name, description, category, duration_hours, estimated_cost)
VALUES

(32, 8, 'Tower of London',
 'Explore the historic castle on the River Thames.',
 'Culture', 3.00, 3000.00),

(33, 8, 'London Eye',
 'Enjoy panoramic views across London.',
 'Sightseeing', 2.00, 2500.00),

(34, 8, 'British Museum',
 'Explore one of the world''s major museums.',
 'Culture', 3.00, 0.00);


-- ============================================
-- DUBAI ACTIVITIES
-- ============================================

INSERT INTO activities
(id, city_id, name, description, category, duration_hours, estimated_cost)
VALUES

(35, 9, 'Burj Khalifa',
 'Visit the world''s tallest building.',
 'Sightseeing', 3.00, 3500.00),

(36, 9, 'Dubai Mall',
 'Explore one of the world''s largest shopping malls.',
 'Shopping', 4.00, 0.00),

(37, 9, 'Desert Safari',
 'Experience dune bashing and a desert camp.',
 'Adventure', 6.00, 4000.00);


-- ============================================
-- TOKYO ACTIVITIES
-- ============================================

INSERT INTO activities
(id, city_id, name, description, category, duration_hours, estimated_cost)
VALUES

(38, 10, 'Tokyo Skytree',
 'Enjoy panoramic views across Tokyo.',
 'Sightseeing', 2.00, 2200.00),

(39, 10, 'Senso-ji Temple',
 'Visit Tokyo''s famous ancient Buddhist temple.',
 'Culture', 2.00, 0.00),

(40, 10, 'Shibuya Crossing',
 'Experience Tokyo''s iconic pedestrian crossing.',
 'Sightseeing', 1.50, 0.00),

(41, 10, 'Tokyo Food Tour',
 'Explore Japanese food and local markets.',
 'Food', 3.00, 2500.00);


-- ============================================
-- DEMO TRIP
-- Rajasthan Explorer
-- ============================================

INSERT INTO trips
(
    id,
    user_id,
    name,
    description,
    start_date,
    end_date,
    budget,
    is_public,
    share_token
)
VALUES
(
    1,
    1,
    'Rajasthan Explorer',
    'A 7-day journey through Jaipur and Delhi.',
    '2026-09-10',
    '2026-09-16',
    50000.00,
    TRUE,
    'rajasthan-demo-123'
)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description),
    budget = VALUES(budget),
    is_public = VALUES(is_public),
    share_token = VALUES(share_token);


-- ============================================
-- TRIP STOPS
-- ============================================

INSERT INTO trip_stops
(
    id,
    trip_id,
    city_id,
    start_date,
    end_date,
    stop_order
)
VALUES

(
    1,
    1,
    2,
    '2026-09-10',
    '2026-09-13',
    1
),

(
    2,
    1,
    3,
    '2026-09-13',
    '2026-09-16',
    2
)

ON DUPLICATE KEY UPDATE
    start_date = VALUES(start_date),
    end_date = VALUES(end_date),
    stop_order = VALUES(stop_order);


-- ============================================
-- ACTIVITIES FOR JAIPUR
-- ============================================

INSERT INTO trip_activities
(
    id,
    trip_stop_id,
    activity_id,
    activity_date,
    start_time
)
VALUES

(
    1,
    1,
    6,
    '2026-09-10',
    '09:00:00'
),

(
    2,
    1,
    7,
    '2026-09-10',
    '14:00:00'
),

(
    3,
    1,
    8,
    '2026-09-11',
    '10:00:00'
),

(
    4,
    1,
    9,
    '2026-09-11',
    '18:00:00'
),

(
    5,
    1,
    10,
    '2026-09-12',
    '16:00:00'
);


-- ============================================
-- ACTIVITIES FOR DELHI
-- ============================================

INSERT INTO trip_activities
(
    id,
    trip_stop_id,
    activity_id,
    activity_date,
    start_time
)
VALUES

(
    6,
    2,
    12,
    '2026-09-13',
    '10:00:00'
),

(
    7,
    2,
    13,
    '2026-09-13',
    '16:00:00'
),

(
    8,
    2,
    14,
    '2026-09-14',
    '10:00:00'
),

(
    9,
    2,
    16,
    '2026-09-14',
    '18:00:00'
),

(
    10,
    2,
    15,
    '2026-09-15',
    '11:00:00'
);


-- ============================================
-- DEMO EXPENSES
-- ============================================

INSERT INTO expenses
(
    id,
    trip_id,
    category,
    description,
    amount
)
VALUES

(
    1,
    1,
    'Transport',
    'Mumbai to Jaipur flight',
    8500.00
),

(
    2,
    1,
    'Transport',
    'Jaipur to Delhi train',
    1800.00
),

(
    3,
    1,
    'Accommodation',
    'Jaipur hotel - 3 nights',
    9000.00
),

(
    4,
    1,
    'Accommodation',
    'Delhi hotel - 3 nights',
    9000.00
),

(
    5,
    1,
    'Food',
    'Meals and local food',
    7000.00
),

(
    6,
    1,
    'Other',
    'Local transport and miscellaneous',
    2500.00
);
