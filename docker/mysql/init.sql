CREATE DATABASE IF NOT EXISTS notifications_db;
USE notifications_db;

CREATE TABLE IF NOT EXISTS notification_templates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    type ENUM('EMAIL', 'SMS', 'PUSH') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO notification_templates (id, name, subject, body, type) VALUES 
('1', 'welcome-email', 'Welcome to our Service!', 'Hi {name}, welcome aboard!', 'EMAIL'), 
('2', 'otp-sms', 'Your OTP Code', 'Your code is {code}. Do not share it.', 'SMS'), 
('3', 'order-update', 'Order Status', 'Your order #{orderId} is {status}.', 'PUSH');