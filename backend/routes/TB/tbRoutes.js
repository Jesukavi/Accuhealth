import express from 'express';
import db from '../../config/db.js';
import { authenticateToken } from '../../middleware/authMiddleware.js';

const router = express.Router();

// POST - Create new TB notification
router.post('/', authenticateToken, (req, res) => {
  console.log('Received TB notification data:', req.body);
  const formData = req.body;

  // Required field validation
  const requiredFields = {
    institution: formData.institution,
    patientId: formData.patientId,
    dob: formData.dob,
    nationality: formData.nationality,
    firstName: formData.firstName,
    gender: formData.gender,
    occupations: formData.occupations,
    placeOfWork: formData.placeOfWork,
    patientGovernorate: formData.patientGovernorate,
    patientWilayat: formData.patientWilayat,
    village: formData.village,
    firstSymptom: formData.firstSymptom,
    onsetSymptom: formData.onsetSymptom,
    classification: formData.classification,
    outcome: formData.outcome,
    outcomeDate: formData.outcomeDate,
    confirmedTB: formData.confirmedTB
  };

  const missingFields = Object.keys(requiredFields).filter(field => !requiredFields[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Missing required fields',
      missingFields
    });
  }

  // Map frontend field names to database column names
  const fieldMap = {
    // Notification Info
    governorate: 'governorate',
    wilayat: 'wilayat',
    institution: 'institution',
    reportingDate: 'reporting_date',

    // Patient Info
    patientId: 'patient_id',
    civilId: 'civil_id',
    expiryDate: 'expiry_date',
    dob: 'dob',
    age: 'age',
    term: 'term',
    passportNo: 'passport_no',
    nationality: 'nationality',
    firstName: 'first_name',
    secondName: 'second_name',
    thirdName: 'third_name',
    gender: 'gender',
    tribe: 'tribe',
    sheikhName: 'sheikh_name',
    mobileNo: 'mobile_no',
    nextOfKinMobile: 'next_of_kin_mobile',
    maritalStatus: 'marital_status',
    education: 'education',
    workStatus: 'work_status',
    occupations: 'occupations',
    placeOfWork: 'place_of_work',
    monthlyIncome: 'monthly_income',
    patientGovernorate: 'patient_governorate',
    patientWilayat: 'patient_wilayat',
    village: 'village',
    latitude: 'latitude',
    longitude: 'longitude',

    // Clinical Details
    firstSymptom: 'first_symptom',
    onsetSymptom: 'onset_symptom',
    diagnosedDate: 'diagnosed_date',
    tbTreatmentDate: 'tb_treatment_date',
    patientReferred: 'patient_referred',
    previousTB: 'previous_tb',
    familyTB: 'family_tb',
    contactTB: 'contact_tb',
    travelHistory: 'travel_history',
    signsSymptoms: 'signs_symptoms',
    riskFactors: 'risk_factors',

    // Tests Results
    igraDate: 'igra_date',
    igraResult: 'igra_result',
    igraRemarks: 'igra_remarks',
    mantouxDate: 'mantoux_date',
    mantouxReading: 'mantoux_reading',
    mantouxResult: 'mantoux_result',
    mantouxRemarks: 'mantoux_remarks',
    hivDate: 'hiv_date',
    hivResult: 'hiv_result',
    hivRemarks: 'hiv_remarks',

    // Lab Investigation
    labTests: 'lab_tests',
    radiologyTests: 'radiology_tests',
    drugSensitivityTests: 'drug_sensitivity_tests',

    // Classification & Outcome
    classification: 'classification',
    outcome: 'outcome',
    outcomeDate: 'outcome_date',
    confirmedTB: 'confirmed_tb',
    finalOutcome: 'final_outcome',
    finalOutcomeDate: 'final_outcome_date',
    attachments: 'attachments'
  };

  // Build dynamic query
  const columns = [];
  const placeholders = [];
  const values = [];

  Object.keys(fieldMap).forEach(field => {
    if (formData[field] !== undefined && formData[field] !== '') {
      columns.push(fieldMap[field]);
      placeholders.push('?');

      // Handle array fields - convert to JSON string
      if (['signsSymptoms', 'riskFactors', 'labTests', 'radiologyTests', 'drugSensitivityTests', 'attachments'].includes(field)) {
        values.push(JSON.stringify(formData[field] || []));
      } else {
        values.push(formData[field]);
      }
    }
  });

  if (columns.length === 0) {
    return res.status(400).json({
      error: 'No data provided'
    });
  }

  const query = `INSERT INTO tb_notifications (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;

  console.log('TB Notification Query:', query);
  console.log('Values count:', values.length);
  console.log('Values:', values);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error creating TB notification:', err);
      return res.status(500).json({
        error: 'Failed to create TB notification',
        details: err.message,
        sqlMessage: err.sqlMessage
      });
    }

    console.log('TB Notification created successfully with ID:', result.insertId);

    res.status(201).json({
      message: 'TB Notification created successfully',
      notificationId: result.insertId,
      id: result.insertId
    });
  });
});

// GET - Get all TB notifications with pagination and filtering
router.get('/', authenticateToken, (req, res) => {
  try {
    const {
      page = 1,
      limit = 35,
      search,
      institution,
      governorate,
      startDate,
      endDate,
      status
    } = req.query;

    console.log('Fetching TB notifications with query:', req.query);

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];

    // Build WHERE conditions for search
    if (search) {
      whereConditions.push('(first_name LIKE ? OR patient_id LIKE ? OR civil_id LIKE ? OR institution LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (institution && institution !== 'all') {
      whereConditions.push('institution = ?');
      queryParams.push(institution);
    }

    if (governorate && governorate !== 'all') {
      whereConditions.push('governorate = ?');
      queryParams.push(governorate);
    }

    if (startDate && endDate) {
      whereConditions.push('DATE(created_at) BETWEEN ? AND ?');
      queryParams.push(startDate, endDate);
    }

    // Status filter based on outcome
    if (status && status !== 'all') {
      if (status === 'cured') {
        whereConditions.push('outcome IN (?, ?)');
        queryParams.push('Cured', 'Treatment completed');
      } else if (status === 'died') {
        whereConditions.push('outcome = ?');
        queryParams.push('Died');
      } else if (status === 'lost') {
        whereConditions.push('outcome = ?');
        queryParams.push('Lost to follow-up');
      } else if (status === 'pending') {
        whereConditions.push('(outcome IS NULL OR outcome = ?)');
        queryParams.push('Not evaluated');
      }
    }

    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // First get total count
    const countQuery = `SELECT COUNT(*) as total FROM tb_notifications ${whereClause}`;

    console.log('Count query:', countQuery);
    console.log('Count params:', queryParams);

    db.query(countQuery, queryParams, (err, countResult) => {
      if (err) {
        console.error('Error counting TB notifications:', err);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch TB notifications',
          details: err.message
        });
      }

      // Then get paginated TB notifications
      const notificationsQuery = `
        SELECT
          id,
          governorate,
          wilayat,
          institution,
          reporting_date,
          patient_id,
          civil_id,
          expiry_date,
          dob,
          age,
          term,
          passport_no,
          nationality,
          first_name,
          second_name,
          third_name,
          gender,
          tribe,
          sheikh_name,
          mobile_no,
          next_of_kin_mobile,
          marital_status,
          education,
          work_status,
          occupations,
          place_of_work,
          monthly_income,
          patient_governorate,
          patient_wilayat,
          village,
          latitude,
          longitude,
          first_symptom,
          onset_symptom,
          diagnosed_date,
          tb_treatment_date,
          patient_referred,
          previous_tb,
          family_tb,
          contact_tb,
          travel_history,
          signs_symptoms,
          risk_factors,
          igra_date,
          igra_result,
          igra_remarks,
          mantoux_date,
          mantoux_reading,
          mantoux_result,
          mantoux_remarks,
          hiv_date,
          hiv_result,
          hiv_remarks,
          lab_tests,
          radiology_tests,
          drug_sensitivity_tests,
          classification,
          outcome,
          outcome_date,
          confirmed_tb,
          final_outcome,
          final_outcome_date,
          attachments,
          created_at,
          updated_at
        FROM tb_notifications
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;

      const notificationParams = [...queryParams, parseInt(limit), offset];

      console.log('TB Notifications query:', notificationsQuery);
      console.log('TB Notifications params:', notificationParams);

      db.query(notificationsQuery, notificationParams, (err, notifications) => {
        if (err) {
          console.error('Error fetching TB notifications:', err);
          return res.status(500).json({
            success: false,
            error: 'Failed to fetch TB notifications',
            details: err.message
          });
        }

        console.log(`Found ${notifications.length} TB notifications`);

        // Transform data for frontend
        const transformedNotifications = notifications.map(notification => {
          const transformed = { ...notification };

          // Parse JSON fields
          ['signs_symptoms', 'risk_factors', 'lab_tests', 'radiology_tests', 'drug_sensitivity_tests', 'attachments'].forEach(field => {
            if (transformed[field]) {
              try {
                transformed[field] = JSON.parse(transformed[field]);
              } catch (e) {
                transformed[field] = [];
              }
            }
          });

          return transformed;
        });

        res.json({
          success: true,
          notifications: transformedNotifications,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(countResult[0].total / limit),
            totalItems: countResult[0].total,
            itemsPerPage: parseInt(limit)
          },
          filters: {
            search,
            institution,
            governorate,
            startDate,
            endDate,
            status
          }
        });
      });
    });

  } catch (error) {
    console.error('Unexpected error in TB notifications route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

// GET - Get available filter options
router.get('/filters/options', authenticateToken, (req, res) => {
  const queries = {
    institutions: 'SELECT DISTINCT institution FROM tb_notifications WHERE institution IS NOT NULL ORDER BY institution',
    governorates: 'SELECT DISTINCT governorate FROM tb_notifications WHERE governorate IS NOT NULL ORDER BY governorate',
    outcomes: 'SELECT DISTINCT outcome FROM tb_notifications WHERE outcome IS NOT NULL ORDER BY outcome'
  };

  const results = {};
  let completed = 0;
  const total = Object.keys(queries).length;

  Object.keys(queries).forEach(key => {
    db.query(queries[key], (err, data) => {
      if (err) {
        console.error(`Error fetching ${key}:`, err);
        results[key] = [];
      } else {
        results[key] = data.map(item => item[key.split('s')[0]]);
      }

      completed++;
      if (completed === total) {
        res.json({
          success: true,
          filters: results
        });
      }
    });
  });
});

// GET - Check if table exists
router.get('/check-table', authenticateToken, (req, res) => {
  const query = `
    SELECT COUNT(*) as table_exists
    FROM information_schema.tables
    WHERE table_schema = ? AND table_name = 'tb_notifications'
  `;

  db.query(query, [process.env.DB_NAME || 'malaria_system'], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: 'Error checking table',
        details: err.message
      });
    }

    const tableExists = results[0].table_exists > 0;

    res.json({
      tableExists: tableExists,
      database: process.env.DB_NAME || 'malaria_system',
      table: 'tb_notifications'
    });
  });
});

// GET - Get single TB notification by ID
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM tb_notifications WHERE id = ?';

  db.query(query, [id], (err, notifications) => {
    if (err) {
      console.error('Error fetching TB notification:', err);
      return res.status(500).json({
        error: 'Failed to fetch TB notification',
        details: err.message
      });
    }

    if (notifications.length === 0) {
      return res.status(404).json({
        error: 'TB Notification not found'
      });
    }

    const notification = notifications[0];

    // Parse JSON fields
    ['signs_symptoms', 'risk_factors', 'lab_tests', 'radiology_tests', 'drug_sensitivity_tests', 'attachments'].forEach(field => {
      if (notification[field]) {
        try {
          notification[field] = JSON.parse(notification[field]);
        } catch (e) {
          notification[field] = [];
        }
      }
    });

    res.json(notification);
  });
});

// PUT - Update TB notification
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if notification exists
  const checkQuery = 'SELECT id FROM tb_notifications WHERE id = ?';

  db.query(checkQuery, [id], (err, existing) => {
    if (err) {
      console.error('Error checking TB notification:', err);
      return res.status(500).json({
        error: 'Failed to update TB notification',
        details: err.message
      });
    }

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'TB Notification not found'
      });
    }

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];

    Object.keys(updateData).forEach(key => {
      if (key !== 'id') {
        const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        updateFields.push(`${dbField} = ?`);

        // Handle JSON fields
        if (['signsSymptoms', 'riskFactors', 'labTests', 'radiologyTests', 'drugSensitivityTests', 'attachments'].includes(key)) {
          updateValues.push(JSON.stringify(updateData[key] || []));
        } else {
          updateValues.push(updateData[key]);
        }
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'No fields to update'
      });
    }

    updateValues.push(id);

    const updateQuery = `
      UPDATE tb_notifications
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    db.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        console.error('Error updating TB notification:', err);
        return res.status(500).json({
          error: 'Failed to update TB notification',
          details: err.message
        });
      }

      res.json({
        message: 'TB Notification updated successfully'
      });
    });
  });
});

// DELETE - Delete TB notification
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM tb_notifications WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting TB notification:', err);
      return res.status(500).json({
        error: 'Failed to delete TB notification',
        details: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'TB Notification not found'
      });
    }

    res.json({
      message: 'TB Notification deleted successfully'
    });
  });
});

// GET - Test database connection
router.get('/test/db', authenticateToken, (req, res) => {
  db.query('SELECT 1 as test', (err, results) => {
    if (err) {
      return res.status(500).json({
        error: 'Database connection failed',
        details: err.message
      });
    }
    res.json({
      message: 'Database connection successful',
      data: results
    });
  });
});

// GET - Check table structure
router.get('/table-structure', authenticateToken, (req, res) => {
  const query = `
    SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'tb_notifications'
    ORDER BY ORDINAL_POSITION
  `;

  db.query(query, [process.env.DB_NAME || 'malaria_system'], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: 'Error checking table structure',
        details: err.message
      });
    }

    res.json({
      columnCount: results.length,
      columns: results
    });
  });
});



// POST - Create new TB screening
router.post('/tb-screening', authenticateToken, (req, res) => {
  const formData = req.body;

  // Required field validation
  const requiredFields = {
    institution: formData.institution,
    patientId: formData.patientId,
    dob: formData.dob,
    nationality: formData.nationality,
    firstName: formData.firstName,
    gender: formData.gender,
    occupations: formData.occupations,
    placeOfWork: formData.placeOfWork,
    patientGovernorate: formData.patientGovernorate,
    patientWilayat: formData.patientWilayat,
    village: formData.village,
    firstSymptom: formData.firstSymptom,
    onsetSymptom: formData.onsetSymptom,
    screeningOutcome: formData.screeningOutcome
  };

  console.log('TB Screening Required Fields:', requiredFields);

  const missingFields = Object.keys(requiredFields).filter(field => !requiredFields[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Missing required fields',
      missingFields
    });
  }

  // Map frontend field names to database column names
  const fieldMap = {
    // Basic Info
    governorate: 'governorate',
    wilayat: 'wilayat',
    institution: 'institution',
    reportingDate: 'reporting_date',

    // Patient Info
    patientId: 'patient_id',
    civilId: 'civil_id',
    expiryDate: 'expiry_date',
    dob: 'dob',
    age: 'age',
    term: 'term',
    passportNo: 'passport_no',
    nationality: 'nationality',
    firstName: 'first_name',
    secondName: 'second_name',
    thirdName: 'third_name',
    gender: 'gender',
    tribe: 'tribe',
    sheikhName: 'sheikh_name',
    mobileNo: 'mobile_no',
    nextOfKinMobile: 'next_of_kin_mobile',
    maritalStatus: 'marital_status',
    education: 'education',
    workStatus: 'work_status',
    occupations: 'occupations',
    placeOfWork: 'place_of_work',
    monthlyIncome: 'monthly_income',
    patientGovernorate: 'patient_governorate',
    patientWilayat: 'patient_wilayat',
    village: 'village',
    latitude: 'latitude',
    longitude: 'longitude',

    // Clinical Details
    firstSymptom: 'first_symptom',
    onsetSymptom: 'onset_symptom',
    diagnosedDate: 'diagnosed_date',
    tbTreatmentDate: 'tb_treatment_date',
    patientReferred: 'patient_referred',
    previousTB: 'previous_tb',
    familyTB: 'family_tb',
    contactTB: 'contact_tb',
    travelHistory: 'travel_history',
    signsSymptoms: 'signs_symptoms',
    riskFactors: 'risk_factors',

    // Mantoux Test
    mantouxDate: 'mantoux_date',
    mantouxReading: 'mantoux_reading',
    mantouxResult: 'mantoux_result',
    mantouxRemarks: 'mantoux_remarks',

    // Lab Investigation
    screeningOutcome: 'screening_outcome',
    screeningRemarks: 'screening_remarks',
    screeningType: 'screening_type'
  };

  // Build dynamic query
  const columns = [];
  const placeholders = [];
  const values = [];

  Object.keys(fieldMap).forEach(field => {
    if (formData[field] !== undefined && formData[field] !== '') {
      columns.push(fieldMap[field]);
      placeholders.push('?');

      // Handle array fields
      if (['signsSymptoms', 'riskFactors'].includes(field) && Array.isArray(formData[field])) {
        values.push(formData[field].join(','));
      } else {
        values.push(formData[field]);
      }
    }
  });

  if (columns.length === 0) {
    return res.status(400).json({
      error: 'No data provided'
    });
  }

  const query = `INSERT INTO tb_screening (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;

  console.log('Query:', query);
  console.log('Values count:', values.length);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error creating TB screening:', err);
      return res.status(500).json({
        error: 'Failed to create TB screening',
        details: err.message,
        sqlMessage: err.sqlMessage
      });
    }

    console.log('TB screening created successfully with ID:', result.insertId);

    res.status(201).json({
      message: 'TB screening created successfully',
      screeningId: result.insertId,
      id: result.insertId
    });
  });
});

// GET - Get all TB screenings with pagination and filtering
router.get('/', authenticateToken, (req, res) => {
  try {
    const {
      page = 1,
      limit = 35,
      governorate,
      wilayat,
      reportingInstitute,
      notificationId,
      reportingDateFrom,
      reportingDateTo,
      classification,
      status,
      finalOutcome,
      finalOutcomeDateFrom,
      finalOutcomeDateTo,
      tbContact,
      confirmedTB,
      mode,
      hospitalType,
      includeGovernorate,
      riskFactors
    } = req.query;

    console.log('Fetching TB screenings with query:', req.query);

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];

    // Build WHERE conditions for filters
    if (governorate && governorate !== '') {
      whereConditions.push('governorate = ?');
      queryParams.push(governorate);
    }

    if (wilayat && wilayat !== '') {
      whereConditions.push('wilayat = ?');
      queryParams.push(wilayat);
    }

    if (reportingInstitute && reportingInstitute !== '') {
      whereConditions.push('institution = ?');
      queryParams.push(reportingInstitute);
    }

    if (notificationId && notificationId !== '') {
      whereConditions.push('patient_id LIKE ?');
      queryParams.push(`%${notificationId}%`);
    }

    if (reportingDateFrom && reportingDateTo) {
      whereConditions.push('DATE(reporting_date) BETWEEN ? AND ?');
      queryParams.push(reportingDateFrom, reportingDateTo);
    }

    if (classification && classification !== '') {
      whereConditions.push('screening_type = ?');
      queryParams.push(classification);
    }

    if (status && status !== '') {
      whereConditions.push('screening_outcome = ?');
      queryParams.push(status);
    }

    if (finalOutcome && finalOutcome !== '') {
      whereConditions.push('screening_outcome = ?');
      queryParams.push(finalOutcome);
    }

    if (finalOutcomeDateFrom && finalOutcomeDateTo) {
      whereConditions.push('DATE(created_at) BETWEEN ? AND ?');
      queryParams.push(finalOutcomeDateFrom, finalOutcomeDateTo);
    }

    if (tbContact && tbContact !== '') {
      whereConditions.push('contact_tb = ?');
      queryParams.push(tbContact);
    }

    if (confirmedTB && confirmedTB !== '') {
      whereConditions.push('previous_tb = ?');
      queryParams.push(confirmedTB);
    }

    if (riskFactors && riskFactors !== '') {
      whereConditions.push('risk_factors LIKE ?');
      queryParams.push(`%${riskFactors}%`);
    }

    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // First get total count
    const countQuery = `SELECT COUNT(*) as total FROM tb_screening ${whereClause}`;

    console.log('Count query:', countQuery);
    console.log('Count params:', queryParams);

    db.query(countQuery, queryParams, (err, countResult) => {
      if (err) {
        console.error('Error counting TB screenings:', err);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch TB screenings',
          details: err.message
        });
      }

      // Then get paginated TB screenings
      const screeningsQuery = `
        SELECT
          id,
          patient_id,
          civil_id,
          first_name,
          second_name,
          third_name,
          institution,
          governorate,
          wilayat,
          reporting_date,
          dob,
          age,
          term,
          gender,
          nationality,
          mobile_no,
          place_of_work,
          patient_governorate,
          patient_wilayat,
          village,
          occupations,
          screening_outcome,
          screening_type,
          first_symptom,
          onset_symptom,
          previous_tb,
          contact_tb,
          screening_remarks,
          created_at,
          updated_at
        FROM tb_screening
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;

      const screeningParams = [...queryParams, parseInt(limit), offset];

      console.log('TB screenings query:', screeningsQuery);
      console.log('TB screenings params:', screeningParams);

      db.query(screeningsQuery, screeningParams, (err, screenings) => {
        if (err) {
          console.error('Error fetching TB screenings:', err);
          return res.status(500).json({
            success: false,
            error: 'Failed to fetch TB screenings',
            details: err.message
          });
        }

        console.log(`Found ${screenings.length} TB screenings`);

        // Transform data for frontend
        const transformedScreenings = screenings.map(screening => ({
          id: screening.id,
          notificationId: screening.patient_id,
          reportingDate: screening.reporting_date,
          patientName: `${screening.first_name || ''} ${screening.second_name || ''} ${screening.third_name || ''}`.trim(),
          patientNo: screening.patient_id,
          reportingGovernorate: screening.governorate,
          reportingInstitute: screening.institution,
          status: screening.screening_outcome,
          finalOutcome: screening.screening_outcome,
          governorate: screening.patient_governorate,
          wilayat: screening.patient_wilayat,
          village: screening.village,
          gender: screening.gender,
          age: screening.age,
          nationality: screening.nationality,
          occupation: screening.occupations,
          screeningType: screening.screening_type,
          created_at: screening.created_at,
          updated_at: screening.updated_at
        }));

        res.json({
          success: true,
          screenings: transformedScreenings,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(countResult[0].total / limit),
            totalItems: countResult[0].total,
            itemsPerPage: parseInt(limit)
          },
          filters: {
            governorate,
            wilayat,
            reportingInstitute,
            notificationId,
            reportingDateFrom,
            reportingDateTo,
            classification,
            status,
            finalOutcome
          }
        });
      });
    });

  } catch (error) {
    console.error('Unexpected error in TB screening route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

// GET - Get available filter options
router.get('/filters/options', authenticateToken, (req, res) => {
  const queries = {
    institutions: 'SELECT DISTINCT institution FROM tb_screening WHERE institution IS NOT NULL ORDER BY institution',
    governorates: 'SELECT DISTINCT governorate FROM tb_screening WHERE governorate IS NOT NULL ORDER BY governorate',
    wilayats: 'SELECT DISTINCT wilayat FROM tb_screening WHERE wilayat IS NOT NULL ORDER BY wilayat',
    outcomes: 'SELECT DISTINCT screening_outcome FROM tb_screening WHERE screening_outcome IS NOT NULL ORDER BY screening_outcome',
    screeningTypes: 'SELECT DISTINCT screening_type FROM tb_screening WHERE screening_type IS NOT NULL ORDER BY screening_type'
  };

  const results = {};
  let completed = 0;
  const total = Object.keys(queries).length;

  Object.keys(queries).forEach(key => {
    db.query(queries[key], (err, data) => {
      if (err) {
        console.error(`Error fetching ${key}:`, err);
        results[key] = [];
      } else {
        results[key] = data.map(item => Object.values(item)[0]);
      }

      completed++;
      if (completed === total) {
        res.json({
          success: true,
          filters: results
        });
      }
    });
  });
});

// GET - Get single TB screening by ID
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM tb_screening WHERE id = ?';

  db.query(query, [id], (err, screenings) => {
    if (err) {
      console.error('Error fetching TB screening:', err);
      return res.status(500).json({
        error: 'Failed to fetch TB screening',
        details: err.message
      });
    }

    if (screenings.length === 0) {
      return res.status(404).json({
        error: 'TB screening not found'
      });
    }

    const screening = screenings[0];

    // Parse comma-separated fields to arrays
    if (screening.signs_symptoms) {
      screening.signs_symptoms = screening.signs_symptoms.split(',');
    }
    if (screening.risk_factors) {
      screening.risk_factors = screening.risk_factors.split(',');
    }

    res.json(screening);
  });
});

// PUT - Update TB screening
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // First check if TB screening exists
  const checkQuery = 'SELECT id FROM tb_screening WHERE id = ?';

  db.query(checkQuery, [id], (err, existing) => {
    if (err) {
      console.error('Error checking TB screening:', err);
      return res.status(500).json({
        error: 'Failed to update TB screening',
        details: err.message
      });
    }

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'TB screening not found'
      });
    }

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];

    Object.keys(updateData).forEach(key => {
      if (key !== 'id') {
        const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        updateFields.push(`${dbField} = ?`);

        // Handle array fields
        if (['signsSymptoms', 'riskFactors'].includes(key)) {
          updateValues.push(Array.isArray(updateData[key]) ? updateData[key].join(',') : updateData[key]);
        } else {
          updateValues.push(updateData[key]);
        }
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'No fields to update'
      });
    }

    updateValues.push(id);

    const updateQuery = `
      UPDATE tb_screening
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    db.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        console.error('Error updating TB screening:', err);
        return res.status(500).json({
          error: 'Failed to update TB screening',
          details: err.message
        });
      }

      res.json({
        message: 'TB screening updated successfully'
      });
    });
  });
});

// DELETE - Delete TB screening
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM tb_screening WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting TB screening:', err);
      return res.status(500).json({
        error: 'Failed to delete TB screening',
        details: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'TB screening not found'
      });
    }

    res.json({
      message: 'TB screening deleted successfully'
    });
  });
});




export default router;
