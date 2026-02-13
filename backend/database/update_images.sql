-- Update events with Unsplash images
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80' WHERE id = 1;
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80' WHERE id = 2;
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80' WHERE id = 3;
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80' WHERE id = 4;

-- Add more events with images
INSERT INTO events (title, image_url, description, start_time, end_time) VALUES
(
    'Robotics Workshop 2026',
    'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=800&q=80',
    'Hands-on robotics workshop with Arduino and Raspberry Pi projects.',
    '2026-03-25 10:00:00',
    '2026-03-25 16:00:00'
),
(
    'Cloud Computing Seminar',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    'Learn about AWS, Azure, and Google Cloud platforms.',
    '2026-02-28 14:00:00',
    '2026-02-28 17:00:00'
),
(
    'Cybersecurity Bootcamp',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    'Intensive training on ethical hacking and network security.',
    '2026-04-10 09:00:00',
    '2026-04-12 18:00:00'
),
(
    'IEEE Student Day',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
    'Celebrating innovation and technology with students worldwide.',
    '2026-02-11 10:00:00',
    '2026-02-11 15:00:00'
);

SELECT 'Images updated successfully!' as status;
