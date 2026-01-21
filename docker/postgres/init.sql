-- Connect to the database defined in docker-compose
\c notifications_db;

-- Create the Enum Type
DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('EMAIL', 'SMS', 'PUSH');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS notification_templates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    type notification_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seeding Data
INSERT INTO notification_templates (id, name, subject, body, type) VALUES
('1', 'welcome-email', 'Welcome to our Service!', 'Hi {name}, welcome aboard!', 'EMAIL'),
('2', 'otp-sms', 'Your OTP Code', 'Your code is {code}. Do not share it.', 'SMS'),
('3', 'order-update', 'Order Status', 'Your order #{orderId} is {status}.', 'PUSH')
ON CONFLICT (id) DO NOTHING;