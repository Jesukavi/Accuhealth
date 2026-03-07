-- Create malaria_notifications table
CREATE TABLE IF NOT EXISTS malaria_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  notification_id VARCHAR(255) UNIQUE NOT NULL,
  
  -- Notification Info
  governorate VARCHAR(100),
  wilayat VARCHAR(100),
  institution VARCHAR(255),
  reporting_date DATE,
  
  -- Patient Info
  patient_id VARCHAR(100),
  civil_id VARCHAR(100),
  expiry_date DATE,
  age INT,
  first_name VARCHAR(255),
  second_name VARCHAR(255),
  dob DATE,
  term VARCHAR(50) DEFAULT 'Years',
  mobile_no VARCHAR(20),
  next_of_kin_mobile_no VARCHAR(20),
  education VARCHAR(100),
  passport_no VARCHAR(100),
  place_of_work VARCHAR(255),
  monthly_income DECIMAL(10,2),
  patient_governorate VARCHAR(100),
  nationality VARCHAR(100),
  longitude VARCHAR(100),
  marital_status VARCHAR(50),
  patient_wilayat VARCHAR(100),
  gender ENUM('M', 'F'),
  work_status VARCHAR(100),
  
  -- Source Details
  treatment VARCHAR(255),
  treatment_start_date VARCHAR(100),
  treatment_dose VARCHAR(255),
  primaquine ENUM('Given', 'Not Given') DEFAULT 'Given',
  outcome VARCHAR(100),
  outcome_date DATE,
  remarks TEXT,
  
  -- History Details
  date_of_onset DATE,
  symptoms JSON,
  past_history_of_malaria ENUM('Yes', 'No') DEFAULT 'No',
  blood_transfusion_within_past_3_months ENUM('Yes', 'No') DEFAULT 'No',
  
  -- Lab Results
  rdt_reported_date DATE,
  species JSON,
  density VARCHAR(10),
  stages JSON,
  parasite_count VARCHAR(255),
  relapse ENUM('Yes', 'No') DEFAULT 'No',
  
  -- Other Details
  other_treatment VARCHAR(255),
  other_treatment_start_date DATE,
  treatment_end_date DATE,
  other_treatment_dose VARCHAR(255),
  other_primaquine ENUM('Given', 'Not Given') DEFAULT 'Given',
  other_outcome VARCHAR(100),
  other_outcome_date DATE,
  other_remarks TEXT,
  
  -- System fields
  status VARCHAR(50) DEFAULT 'Saved',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_notification_id (notification_id),
  INDEX idx_patient_id (patient_id),
  INDEX idx_reporting_date (reporting_date),
  INDEX idx_governorate (governorate),
  INDEX idx_institution (institution),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Create notification_attachments table for file uploads
CREATE TABLE IF NOT EXISTS notification_attachments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  notification_id INT,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT,
  file_type VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (notification_id) REFERENCES malaria_notifications(id) ON DELETE CASCADE,
  INDEX idx_notification_id (notification_id)
);

-- Create notification_history table for tracking changes
CREATE TABLE IF NOT EXISTS notification_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  notification_id INT,
  action VARCHAR(50) NOT NULL,
  changed_fields JSON,
  old_values JSON,
  new_values JSON,
  changed_by INT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (notification_id) REFERENCES malaria_notifications(id) ON DELETE CASCADE,
  INDEX idx_notification_id (notification_id),
  INDEX idx_changed_at (changed_at)
);

-- Insert sample data for testing
INSERT INTO malaria_notifications (
  notification_id, governorate, wilayat, institution, reporting_date,
  patient_id, first_name, second_name, age, gender, place_of_work,
  patient_governorate, nationality, patient_wilayat, status
) VALUES 
(
  'MAL202401001', 'khartoum', 'khartoum', 'Central Hospital', '2024-01-15',
  'P001', 'Ahmed', 'Mohamed', 35, 'M', 'Government Office',
  'khartoum', 'sudanese', 'khartoum', 'Saved'
),
(
  'MAL202401002', 'kassala', 'kassala', 'Kassala Health Center', '2024-01-16',
  'P002', 'Fatima', 'Ali', 28, 'F', 'School Teacher',
  'kassala', 'sudanese', 'kassala', 'Saved'
);

-- Create views for reporting
CREATE OR REPLACE VIEW notification_summary AS
SELECT 
  DATE_FORMAT(reporting_date, '%Y-%m') as month,
  governorate,
  institution,
  COUNT(*) as total_notifications,
  COUNT(CASE WHEN status = 'Saved' THEN 1 END) as saved_count,
  COUNT(CASE WHEN status = 'Rejected' THEN 1 END) as rejected_count,
  COUNT(CASE WHEN outcome = 'cured' THEN 1 END) as cured_count,
  COUNT(CASE WHEN outcome = 'died' THEN 1 END) as death_count
FROM malaria_notifications
GROUP BY DATE_FORMAT(reporting_date, '%Y-%m'), governorate, institution;

-- Create view for patient demographics
CREATE OR REPLACE VIEW patient_demographics AS
SELECT 
  governorate,
  patient_governorate,
  gender,
  CASE 
    WHEN age < 5 THEN 'Under 5'
    WHEN age BETWEEN 5 AND 14 THEN '5-14'
    WHEN age BETWEEN 15 AND 49 THEN '15-49'
    WHEN age >= 50 THEN '50+'
    ELSE 'Unknown'
  END as age_group,
  COUNT(*) as count
FROM malaria_notifications
WHERE age IS NOT NULL
GROUP BY governorate, patient_governorate, gender, age_group;