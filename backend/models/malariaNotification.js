import db from "../config/db.js";

// Convert empty strings to null for DATE columns
const d = (v) => (v && v.trim() !== "" ? v : null);
// Convert empty strings to null for INT columns
const n = (v) =>
  v === "" || v === null || v === undefined ? null : Number(v) || null;

class Notification {
  static async create(notificationData) {
    const {
      // Notification Info
      governorate,
      wilayat,
      institution,
      reportingDate,

      // Patient Info
      patientId,
      civilId,
      expiryDate,
      age,
      firstName,
      secondName,
      dob,
      term,
      mobileNo,
      nextOfKinMobileNo,
      education,
      passportNo,
      placeOfWork,
      monthlyIncome,
      patientGovernorate,
      nationality,
      longitude,
      maritalStatus,
      patientWilayat,
      gender,
      workStatus,

      // Source Details
      treatment,
      treatmentStartDate,
      treatmentDose,
      primaquine,
      outcome,
      outcomeDate,
      remarks,

      // History Details
      dateOfOnset,
      symptoms,
      pastHistoryOfMalaria,
      bloodTransfusionWithinPast3Months,

      // Lab Results
      rdtReportedDate,
      species,
      density,
      stages,
      parasiteCount,
      relapse,

      // Other Details
      otherTreatment,
      otherTreatmentStartDate,
      treatmentEndDate,
      otherTreatmentDose,
      otherPrimaquine,
      otherOutcome,
      otherOutcomeDate,
      otherRemarks,
    } = notificationData;

    // Generate unique notification ID
    const notificationId =
      "MAL" + Date.now() + Math.floor(Math.random() * 1000);

    const query = `
      INSERT INTO malaria_notifications (
        notification_id, governorate, wilayat, institution, reporting_date,
        patient_id, civil_id, expiry_date, age, first_name, second_name, dob, term,
        mobile_no, next_of_kin_mobile_no, education, passport_no, place_of_work,
        monthly_income, patient_governorate, nationality, longitude, marital_status,
        patient_wilayat, gender, work_status, treatment, treatment_start_date,
        treatment_dose, primaquine, outcome, outcome_date, remarks, date_of_onset,
        symptoms, past_history_of_malaria, blood_transfusion_within_past_3_months,
        rdt_reported_date, species, density, stages, parasite_count, relapse,
        other_treatment, other_treatment_start_date, treatment_end_date,
        other_treatment_dose, other_primaquine, other_outcome, other_outcome_date,
        other_remarks, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Saved', NOW())
    `;

    const values = [
      notificationId,
      governorate,
      wilayat,
      institution,
      d(reportingDate),
      patientId,
      civilId,
      d(expiryDate),
      n(age),
      firstName,
      secondName,
      d(dob),
      term,
      mobileNo,
      nextOfKinMobileNo,
      education,
      passportNo,
      placeOfWork,
      monthlyIncome,
      patientGovernorate,
      nationality,
      longitude,
      maritalStatus,
      patientWilayat,
      gender,
      workStatus,
      treatment,
      d(treatmentStartDate),
      treatmentDose,
      primaquine,
      outcome,
      d(outcomeDate),
      remarks,
      d(dateOfOnset),
      JSON.stringify(symptoms || []),
      pastHistoryOfMalaria,
      bloodTransfusionWithinPast3Months,
      d(rdtReportedDate),
      JSON.stringify(species || []),
      density,
      JSON.stringify(stages || []),
      n(parasiteCount),
      relapse,
      otherTreatment,
      d(otherTreatmentStartDate),
      d(treatmentEndDate),
      otherTreatmentDose,
      otherPrimaquine,
      otherOutcome,
      d(otherOutcomeDate),
      otherRemarks,
    ];

    try {
      const [result] = await db.execute(query, values);
      return {
        id: result.insertId,
        notificationId,
        message: "Notification created successfully",
      };
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  static async findAll() {
    const query = `
      SELECT 
        id,
        notification_id as notificationId,
        DATE_FORMAT(reporting_date, '%d/%m/%y') as reportingDate,
        CONCAT(first_name, ' ', COALESCE(second_name, '')) as patientName,
        patient_id as patientNo,
        age,
        gender as sex,
        institution as reportingInstitute,
        status,
        created_at
      FROM malaria_notifications 
      ORDER BY created_at DESC
    `;

    try {
      const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  static async findById(id) {
    const query = `
      SELECT * FROM malaria_notifications WHERE id = ?
    `;

    try {
      const [rows] = await db.execute(query, [id]);
      if (rows.length > 0) {
        const notification = rows[0];
        // Parse JSON fields
        if (notification.symptoms) {
          notification.symptoms = JSON.parse(notification.symptoms);
        }
        if (notification.species) {
          notification.species = JSON.parse(notification.species);
        }
        if (notification.stages) {
          notification.stages = JSON.parse(notification.stages);
        }
        return notification;
      }
      return null;
    } catch (error) {
      console.error("Error fetching notification by ID:", error);
      throw error;
    }
  }

  static async update(id, updateData) {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        if (Array.isArray(updateData[key])) {
          values.push(JSON.stringify(updateData[key]));
        } else {
          values.push(updateData[key]);
        }
      }
    });

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE malaria_notifications SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`;

    try {
      const [result] = await db.execute(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating notification:", error);
      throw error;
    }
  }

  static async delete(id) {
    const query = `DELETE FROM malaria_notifications WHERE id = ?`;

    try {
      const [result] = await db.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }

  static async search(searchParams) {
    let query = `
      SELECT 
        id,
        notification_id as notificationId,
        DATE_FORMAT(reporting_date, '%d/%m/%y') as reportingDate,
        CONCAT(first_name, ' ', COALESCE(second_name, '')) as patientName,
        patient_id as patientNo,
        age,
        gender as sex,
        institution as reportingInstitute,
        status,
        created_at
      FROM malaria_notifications WHERE 1=1
    `;

    const values = [];
    const conditions = [];

    // Add search conditions
    if (searchParams.patientId) {
      conditions.push("patient_id LIKE ?");
      values.push(`%${searchParams.patientId}%`);
    }

    if (searchParams.name) {
      conditions.push("(first_name LIKE ? OR second_name LIKE ?)");
      values.push(`%${searchParams.name}%`, `%${searchParams.name}%`);
    }

    if (searchParams.notificationId) {
      conditions.push("notification_id LIKE ?");
      values.push(`%${searchParams.notificationId}%`);
    }

    if (searchParams.reportingDateFrom) {
      conditions.push("reporting_date >= ?");
      values.push(searchParams.reportingDateFrom);
    }

    if (searchParams.reportingDateTo) {
      conditions.push("reporting_date <= ?");
      values.push(searchParams.reportingDateTo);
    }

    if (searchParams.governorate) {
      conditions.push("governorate = ?");
      values.push(searchParams.governorate);
    }

    if (searchParams.institution) {
      conditions.push("institution LIKE ?");
      values.push(`%${searchParams.institution}%`);
    }

    if (searchParams.gender) {
      conditions.push("gender = ?");
      values.push(searchParams.gender);
    }

    if (searchParams.status) {
      conditions.push("status = ?");
      values.push(searchParams.status);
    }

    if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
    }

    query += " ORDER BY created_at DESC";

    try {
      const [rows] = await db.execute(query, values);
      return rows;
    } catch (error) {
      console.error("Error searching notifications:", error);
      throw error;
    }
  }

  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS malaria_notifications (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        notification_id VARCHAR(50)  UNIQUE,
        governorate     VARCHAR(100),
        wilayat         VARCHAR(100),
        institution     VARCHAR(200),
        reporting_date  DATE,
        patient_id      VARCHAR(50),
        civil_id        VARCHAR(50),
        expiry_date     DATE,
        age             INT,
        first_name      VARCHAR(100),
        second_name     VARCHAR(100),
        dob             DATE,
        term            VARCHAR(20)  DEFAULT 'Years',
        mobile_no       VARCHAR(20),
        next_of_kin_mobile_no VARCHAR(20),
        education       VARCHAR(50),
        passport_no     VARCHAR(50),
        place_of_work   VARCHAR(200),
        monthly_income  VARCHAR(50),
        patient_governorate VARCHAR(100),
        nationality     VARCHAR(100),
        longitude       VARCHAR(50),
        marital_status  VARCHAR(30),
        patient_wilayat VARCHAR(100),
        gender          VARCHAR(10),
        work_status     VARCHAR(50),
        treatment       VARCHAR(200),
        treatment_start_date DATE,
        treatment_dose  VARCHAR(100),
        primaquine      VARCHAR(20),
        outcome         VARCHAR(100),
        outcome_date    DATE,
        remarks         TEXT,
        date_of_onset   DATE,
        symptoms        TEXT,
        past_history_of_malaria VARCHAR(5),
        blood_transfusion_within_past_3_months VARCHAR(5),
        rdt_reported_date DATE,
        species         TEXT,
        density         VARCHAR(10),
        stages          TEXT,
        parasite_count  VARCHAR(50),
        relapse         VARCHAR(5),
        other_treatment VARCHAR(200),
        other_treatment_start_date DATE,
        treatment_end_date DATE,
        other_treatment_dose VARCHAR(100),
        other_primaquine VARCHAR(20),
        other_outcome   VARCHAR(100),
        other_outcome_date DATE,
        other_remarks   TEXT,
        status          VARCHAR(20) DEFAULT 'Saved',
        created_by      VARCHAR(50),
        created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    try {
      await db.execute(query);
      console.log("✅ malaria_notifications table ready");
    } catch (error) {
      console.error("Error creating malaria_notifications table:", error);
      throw error;
    }
  }

  static async seed() {
    // Only seed if table is empty
    const [[{ count }]] = await db.execute(
      "SELECT COUNT(*) as count FROM malaria_notifications",
    );
    if (parseInt(count) > 0) return;

    const mockRows = [
      {
        notificationId: "MAL" + Date.now() + "001",
        governorate: "Muscat",
        wilayat: "Muscat",
        institution: "Royal Hospital",
        reportingDate: "2026-01-15",
        patientId: "MAL-001",
        firstName: "Ahmed",
        secondName: "Al-Rashidi",
        dob: "1990-06-12",
        age: 35,
        gender: "Male",
        nationality: "Omani",
        species: JSON.stringify(["P.vivax"]),
        density: "+2",
        outcome: "Recovered",
        status: "Saved",
      },
      {
        notificationId: "MAL" + (Date.now() + 1) + "002",
        governorate: "Dhofar",
        wilayat: "Salalah",
        institution: "Salalah Hospital",
        reportingDate: "2026-01-22",
        patientId: "MAL-002",
        firstName: "Ravi",
        secondName: "Kumar",
        dob: "1985-03-20",
        age: 40,
        gender: "Male",
        nationality: "Indian",
        species: JSON.stringify(["P.falciparum"]),
        density: "+3",
        outcome: "Recovered",
        status: "Saved",
      },
      {
        notificationId: "MAL" + (Date.now() + 2) + "003",
        governorate: "North Al Batinah",
        wilayat: "Sohar",
        institution: "Sohar Hospital",
        reportingDate: "2026-02-05",
        patientId: "MAL-003",
        firstName: "Fatima",
        secondName: "Al-Zaabi",
        dob: "1998-11-08",
        age: 27,
        gender: "Female",
        nationality: "Omani",
        species: JSON.stringify(["P.malariae"]),
        density: "+1",
        outcome: "Recovered",
        status: "Saved",
      },
    ];

    for (const row of mockRows) {
      await db.execute(
        `
        INSERT INTO malaria_notifications
          (notification_id, governorate, wilayat, institution, reporting_date,
           patient_id, first_name, second_name, dob, age, gender, nationality,
           species, density, outcome, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `,
        [
          row.notificationId,
          row.governorate,
          row.wilayat,
          row.institution,
          row.reportingDate,
          row.patientId,
          row.firstName,
          row.secondName,
          row.dob,
          row.age,
          row.gender,
          row.nationality,
          row.species,
          row.density,
          row.outcome,
          row.status,
        ],
      );
    }
    console.log("✅ Seeded 3 mock malaria notifications");
  }
}

export default Notification;
