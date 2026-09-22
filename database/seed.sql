-- Seed Data for SIGNX
-- IMPORTANT: Do not use this in production. Passwords should be securely hashed.

INSERT INTO users (name, email, password_hash, preferred_language)
VALUES 
    ('Demo User', 'demo@signx.ai', '$2b$12$KIXA.K1/l912tXvY04I1b.M02xN3F3QoT0.83597/rL60/y2Vp7Uu', 'en')
ON CONFLICT (email) DO NOTHING;
