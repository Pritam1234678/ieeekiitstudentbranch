-- Production-Ready Event Management System
-- Database Schema for Events Table

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS events;

-- Create events table with optimized structure
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(500),
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_time_range CHECK (end_time > start_time),
    
    -- Indexes for performance
    INDEX idx_start_time (start_time),
    INDEX idx_end_time (end_time),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample events (adjust dates as needed)
INSERT INTO events (title, image_url, description, start_time, end_time) VALUES
(
    'IEEE Tech Summit 2026',
    'https://example.com/images/tech-summit.jpg',
    'Annual technology summit featuring AI, IoT, and emerging tech trends.',
    '2026-03-15 09:00:00',
    '2026-03-15 18:00:00'
),
(
    'Hackathon: Code for Change',
    'https://example.com/images/hackathon.jpg',
    '24-hour hackathon focused on solving real-world problems with technology.',
    '2026-02-20 10:00:00',
    '2026-02-21 10:00:00'
),
(
    'Web Development Workshop',
    'https://example.com/images/web-workshop.jpg',
    'Hands-on workshop covering modern web development with React and Node.js.',
    '2026-01-10 14:00:00',
    '2026-01-10 17:00:00'
),
(
    'AI/ML Guest Lecture',
    'https://example.com/images/ai-lecture.jpg',
    'Distinguished guest lecture on Machine Learning and its applications.',
    '2026-02-12 15:00:00',
    '2026-02-12 17:00:00'
);
