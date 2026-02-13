-- Database Schema for Societies Table

-- Drop table if exists
DROP TABLE IF EXISTS societies;

-- Create societies table
CREATE TABLE societies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    chair_name VARCHAR(255),
    description TEXT,
    source_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert initial society data
INSERT INTO societies (id, name, logo_url, chair_name, description, source_url) VALUES
(
    1,
    'IEEE Computer Society KIIT Student Branch Chapter',
    '/mainlogo.png',
    'Prajwal Panth',
    'A student-led society focused on technical excellence, collaborative learning, and research-driven innovation in computing.',
    'https://ieeecskiit.vercel.app/'
),
(
    2,
    'IEEE Antennas & Propagation Society KIIT Student Branch Chapter',
    '/mainlogo.png',
    'Arunya Paul',
    'A community centered on antennas, propagation, and RF innovation with hands-on projects and events.',
    'https://www.linkedin.com/posts/ieee-antennas-propagation-society-kiit-branch-chapter_merrychristmas-happynewyear-ieee-activity-7277701473969295360-2IEA'
),
(
    3,
    'IEEE Industry Applications Society KIIT Student Branch Chapter',
    '/mainlogo.png',
    'To be announced',
    'Industry-focused society connecting students with real-world applications, systems, and professional practice.',
    'https://news.kiit.ac.in/achievements/ieee-kiit-student-branch-stb15681-receives-best-student-chapter-2023/'
),
(
    4,
    'IEEE Consumer Technology Society KIIT Student Branch Chapter',
    '/mainlogo.png',
    'To be announced',
    'Focuses on consumer technologies, product innovation, and practical tech adoption for society.',
    'https://news.kiit.ac.in/achievements/ieee-kiit-student-branch-stb15681-receives-best-student-chapter-2023/'
),
(
    5,
    'IEEE Computational Intelligence Society KIIT Student Branch Chapter',
    '/mainlogo.png',
    'To be announced',
    'Explores AI, machine learning, and intelligent systems through projects, talks, and research.',
    'https://news.kiit.ac.in/achievements/ieee-kiit-student-branch-stb15681-receives-best-student-chapter-2023/'
);
