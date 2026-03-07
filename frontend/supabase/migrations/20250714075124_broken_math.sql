-- AccuHealth Database Schema

CREATE DATABASE IF NOT EXISTS accuhealth;
USE accuhealth;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  description VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  notification_id VARCHAR(255) UNIQUE NOT NULL,
  patient_name VARCHAR(255) NOT NULL,
  patient_no VARCHAR(100),
  gsm_no VARCHAR(20),
  sex ENUM('M', 'F') NOT NULL,
  age INT,
  marital_status VARCHAR(50),
  nationality VARCHAR(100),
  patient_governorate VARCHAR(100),
  governorate VARCHAR(100),
  wilayat VARCHAR(100),
  reporting_institute VARCHAR(255),
  final_outcome VARCHAR(100),
  reporting_date DATE,
  final_outcome_date DATE,
  case_detected_visa BOOLEAN DEFAULT FALSE,
  lab_confirmed_case BOOLEAN DEFAULT FALSE,
  species VARCHAR(100),
  past_malaria_history BOOLEAN DEFAULT FALSE,
  travel_history BOOLEAN DEFAULT FALSE,
  classification VARCHAR(100),
  hospital_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Master data tables
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS governorates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(10),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS wilayats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  governorate_id INT,
  code VARCHAR(10),
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (governorate_id) REFERENCES governorates(id)
);

-- Insert sample data
INSERT INTO users (name, email, password, description) VALUES
('John Doe', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin user'),
('Ariv', 'ariv@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Harry', 'harry@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

INSERT INTO governorates (name, code) VALUES
('Khartoum', 'KRT'),
('Aljazeera', 'AJZ'),
('Kassala', 'KSL'),
('Elgedarf', 'EGD'),
('Kordofan', 'KRD'),
('Darfur', 'DRF'),
('Port Sudan', 'PSD');

INSERT INTO roles (name, description) VALUES
('Administrator', 'Full system access'),
('Doctor', 'Medical professional'),
('Nurse', 'Healthcare assistant'),
('Data Entry', 'Data entry operator');