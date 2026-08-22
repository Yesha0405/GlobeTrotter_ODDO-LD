-- ============================================
-- GlobeTrotter Seed Data
-- ============================================

USE globetrotter;

-- ============================================
-- DEMO USER
-- ============================================

INSERT INTO users
(id, name, email, password)
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
    cost_index = VALUES(cost_index),
    image_url = VALUES(image_url);


-- ============================================
-- ACTIVITIES
-- ============================================

INSERT INTO activities
(id, city_id, name, description, category, duration_hours, estimated_cost)
VALUES

-- Mumbai
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
 'Food', 3.00, 1000.00),

-- Jaipur
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
 'Culture', 1.50, 200.00),

-- Delhi
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
 'Food', 3.00, 900.00),

-- Goa
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
 'Adventure', 2.00, 1200.00),

-- Udaipur
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
 'Culture', 2.00, 250.00),

-- Ahmedabad
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
 'Food', 3.00, 700.00),

-- Paris
(29, 7, 'Eiffel Tower',
 'Visit Paris''s most famous landmark.',
 'Sightseeing', 3.00, 2500.00),

(30, 7, 'Louvre Museum',
 'Explore one of the world''s largest museums.',
 'Culture', 4.00, 1800.00),

(31, 7, 'Seine River Cruise',
 'Take a scenic cruise through central Paris.',
 'Adventure', 2.00, 1200.00),

-- London
(32, 8, 'Tower of London',
 'Explore the historic castle on the River Thames.',
 'Culture', 3.00, 3000.00),

(33, 8, 'London Eye',
 'Enjoy panoramic views across London.',
 'Sightseeing', 2.00, 2500.00),

(34, 8, 'British Museum',
 'Explore one of the world''s major museums.',
 'Culture', 3.00, 0.00),

-- Dubai
(35, 9, 'Burj Khalifa',
 'Visit the world''s tallest building.',
 'Sightseeing', 3.00, 3500.00),

(36, 9, 'Dubai Mall',
 'Explore one of the world''s largest shopping malls.',
 'Shopping', 4.00, 0.00),

(37, 9, 'Desert Safari',
 'Experience dune bashing and a desert camp.',
 'Adventure', 6.00, 4000.00),

-- Tokyo
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
 'Food', 3.00, 2500.00)

ON DUPLICATE KEY UPDATE
    city_id = VALUES(city_id),
    name = VALUES(name),
    description = VALUES(description),
    category = VALUES(category),
    duration_hours = VALUES(duration_hours),
    estimated_cost = VALUES(estimated_cost);


-- ============================================
-- REMOVE OLD DEMO TRIP
-- ============================================
-- Because trip_stops, trip_activities and
-- expenses use ON DELETE CASCADE.

DELETE FROM trips
WHERE share_token = 'rajasthan-demo-123';


-- ============================================
-- CREATE DEMO TRIP
-- ============================================

INSERT INTO trips
(
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
    'Rajasthan Explorer',
    'A 7-day journey through Jaipur and Delhi.',
    '2026-09-10',
    '2026-09-16',
    50000.00,
    TRUE,
    'rajasthan-demo-123'
);

SET @trip_id = LAST_INSERT_ID();


-- ============================================
-- TRIP STOPS
-- Jaipur: Sep 10-13
-- Delhi: Sep 13-16
-- ============================================

INSERT INTO trip_stops
(
    trip_id,
    city_id,
    start_date,
    end_date,
    stop_order
)
VALUES
(
    @trip_id,
    2,
    '2026-09-10',
    '2026-09-13',
    1
),
(
    @trip_id,
    3,
    '2026-09-13',
    '2026-09-16',
    2
);

-- Get stop IDs
SELECT id
INTO @jaipur_stop_id
FROM trip_stops
WHERE trip_id = @trip_id
AND city_id = 2
ORDER BY id DESC
LIMIT 1;

SELECT id
INTO @delhi_stop_id
FROM trip_stops
WHERE trip_id = @trip_id
AND city_id = 3
ORDER BY id DESC
LIMIT 1;


-- ============================================
-- JAIPUR ACTIVITIES
-- ============================================

INSERT INTO trip_activities
(
    trip_stop_id,
    activity_id,
    activity_date,
    start_time
)
VALUES

-- Day 1 - Jaipur
(@jaipur_stop_id, 6, '2026-09-10', '09:00:00'),
(@jaipur_stop_id, 7, '2026-09-10', '14:00:00'),

-- Day 2 - Jaipur
(@jaipur_stop_id, 8, '2026-09-11', '10:00:00'),
(@jaipur_stop_id, 9, '2026-09-11', '18:00:00'),

-- Day 3 - Jaipur
(@jaipur_stop_id, 10, '2026-09-12', '10:00:00'),
(@jaipur_stop_id, 11, '2026-09-12', '15:00:00');


-- ============================================
-- DELHI ACTIVITIES
-- ============================================

INSERT INTO trip_activities
(
    trip_stop_id,
    activity_id,
    activity_date,
    start_time
)
VALUES

-- Day 4 - Delhi
(@delhi_stop_id, 12, '2026-09-13', '10:00:00'),
(@delhi_stop_id, 13, '2026-09-13', '16:00:00'),

-- Day 5 - Delhi
(@delhi_stop_id, 14, '2026-09-14', '10:00:00'),
(@delhi_stop_id, 16, '2026-09-14', '18:00:00'),

-- Day 6 - Delhi
(@delhi_stop_id, 15, '2026-09-15', '11:00:00'),

-- Day 7 - Delhi
(@delhi_stop_id, 13, '2026-09-16', '09:00:00');


-- ============================================
-- DEMO EXPENSES
-- ============================================

INSERT INTO expenses
(
    trip_id,
    category,
    description,
    amount
)
VALUES
(
    @trip_id,
    'Transport',
    'Mumbai to Jaipur flight',
    8500.00
),
(
    @trip_id,
    'Transport',
    'Jaipur to Delhi train',
    1800.00
),
(
    @trip_id,
    'Accommodation',
    'Jaipur hotel - 3 nights',
    9000.00
),
(
    @trip_id,
    'Accommodation',
    'Delhi hotel - 3 nights',
    9000.00
),
(
    @trip_id,
    'Food',
    'Meals and local food',
    7000.00
),
(
    @trip_id,
    'Activities',
    'Tickets and sightseeing',
    3950.00
),
(
    @trip_id,
    'Other',
    'Local transport and miscellaneous',
    2500.00
);


-- ============================================
-- VERIFY SEED
-- ============================================

SELECT
    id,
    name,
    start_date,
    end_date,
    budget,
    share_token
FROM trips
WHERE share_token = 'rajasthan-demo-123';

SELECT
    ts.id,
    c.name AS city,
    ts.start_date,
    ts.end_date,
    ts.stop_order
FROM trip_stops ts
JOIN cities c
    ON c.id = ts.city_id
WHERE ts.trip_id = @trip_id
ORDER BY ts.stop_order;

SELECT
    ta.activity_date,
    ta.start_time,
    c.name AS city,
    a.name AS activity,
    a.category,
    a.estimated_cost
FROM trip_activities ta
JOIN activities a
    ON a.id = ta.activity_id
JOIN trip_stops ts
    ON ts.id = ta.trip_stop_id
JOIN cities c
    ON c.id = ts.city_id
WHERE ts.trip_id = @trip_id
ORDER BY ta.activity_date, ta.start_time;

SELECT
    category,
    SUM(amount) AS total
FROM expenses
WHERE trip_id = @trip_id
GROUP BY category
ORDER BY category;