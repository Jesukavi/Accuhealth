import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Define the schema inline since we're having import issues
const hepatitisSchema = new mongoose.Schema(
  {
    governorate: String,
    wilayat: String,
    institution: String,
    reportingDate: Date,
    patientId: String,
    civilId: String,
    expiryDate: Date,
    dob: Date,
    age: Number,
    term: String,
    passportNo: String,
    nationality: String,
    firstName: String,
    secondName: String,
    thirdName: String,
    fourthName: String,
    gender: String,
    tribe: String,
    sheikhName: String,
    mobileNo: String,
    nextOfKinMobile: String,
    patientGovernorate: String,
    patientWilayat: String,
    village: String,
    subLocality: String,
    symptoms: [{ name: String, value: String, duration: String }],
    hevIgM: String,
    hevIgG: String,
    hevPcr: String,
    hevPcrValue: String,
    alt: String,
    ast: String,
    outcome: String,
    remarks: String,
    onsetOfSymptomsDate: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const HevNotification = mongoose.model("HevNotification", hepatitisSchema);

const mockHEVData = [
  {
    governorate: "Muscat",
    wilayat: "Muscat",
    institution: "Royal Hospital",
    reportingDate: new Date("2024-01-15"),
    patientId: "HEV001",
    civilId: "12345678",
    dob: new Date("1985-03-20"),
    age: 39,
    term: "Years",
    nationality: "Omani",
    firstName: "Ahmed",
    secondName: "Mohammed",
    thirdName: "Ali",
    fourthName: "Al-Balushi",
    gender: "Male",
    mobileNo: "+96891234567",
    patientGovernorate: "Muscat",
    patientWilayat: "Muscat",
    village: "Al Khuwair",
    subLocality: "Al Khuwair South",
    onsetOfSymptomsDate: new Date("2024-01-10"),
    symptoms: [
      { name: "Fever", value: "Yes", duration: "5 days" },
      { name: "Jaundice", value: "Yes", duration: "3 days" },
      { name: "Nausea / Vomiting", value: "Yes", duration: "4 days" },
      { name: "Fatigue / Malaise", value: "Yes", duration: "7 days" },
    ],
    hevIgM: "Positive",
    hevIgG: "Negative",
    hevPcr: "Positive",
    hevPcrValue: "1.2 x 10^5",
    alt: "450",
    ast: "380",
    outcome: "Recovered",
    remarks: "Patient responded well to supportive treatment",
  },
  {
    governorate: "Dhofar",
    wilayat: "Salalah",
    institution: "Salalah Hospital",
    reportingDate: new Date("2024-01-20"),
    patientId: "HEV002",
    civilId: "87654321",
    dob: new Date("1992-07-15"),
    age: 32,
    term: "Years",
    nationality: "Indian",
    firstName: "Priya",
    secondName: "Kumar",
    thirdName: "Sharma",
    gender: "Female",
    mobileNo: "+96892345678",
    patientGovernorate: "Dhofar",
    patientWilayat: "Salalah",
    village: "Al Dahariz",
    onsetOfSymptomsDate: new Date("2024-01-16"),
    symptoms: [
      { name: "Fever", value: "Yes", duration: "3 days" },
      { name: "Jaundice", value: "Yes", duration: "2 days" },
      { name: "Abdominal Pain (RUQ)", value: "Yes", duration: "4 days" },
      { name: "Anorexia", value: "Yes", duration: "5 days" },
    ],
    hevIgM: "Positive",
    hevIgG: "Positive",
    hevPcr: "Positive",
    hevPcrValue: "8.5 x 10^4",
    alt: "520",
    ast: "410",
    outcome: "Under Treatment",
    remarks: "Patient is pregnant, close monitoring required",
  },
  {
    governorate: "Al Batinah North",
    wilayat: "Sohar",
    institution: "Sohar Hospital",
    reportingDate: new Date("2024-02-01"),
    patientId: "HEV003",
    civilId: "11223344",
    dob: new Date("1978-11-30"),
    age: 45,
    term: "Years",
    nationality: "Pakistani",
    firstName: "Hassan",
    secondName: "Ali",
    thirdName: "Khan",
    gender: "Male",
    mobileNo: "+96893456789",
    patientGovernorate: "Al Batinah North",
    patientWilayat: "Sohar",
    village: "Falaj Al Qabail",
    onsetOfSymptomsDate: new Date("2024-01-28"),
    symptoms: [
      { name: "Fever", value: "Yes", duration: "4 days" },
      { name: "Jaundice", value: "Yes", duration: "2 days" },
      { name: "Pale Stools", value: "Yes", duration: "3 days" },
      { name: "Diarrhea", value: "Yes", duration: "2 days" },
    ],
    hevIgM: "Positive",
    hevIgG: "Negative",
    hevPcr: "Positive",
    hevPcrValue: "3.2 x 10^5",
    alt: "680",
    ast: "590",
    outcome: "Under Treatment",
    remarks: "Patient works in food industry, possible occupational exposure",
  },
  {
    governorate: "Al Sharqiyah North",
    wilayat: "Ibra",
    institution: "Ibra Hospital",
    reportingDate: new Date("2024-02-05"),
    patientId: "HEV004",
    civilId: "55667788",
    dob: new Date("2000-05-10"),
    age: 24,
    term: "Years",
    nationality: "Omani",
    firstName: "Fatima",
    secondName: "Salem",
    thirdName: "Abdullah",
    fourthName: "Al-Hinai",
    gender: "Female",
    mobileNo: "+96894567890",
    patientGovernorate: "Al Sharqiyah North",
    patientWilayat: "Ibra",
    village: "Al Minzafah",
    subLocality: "Al Minzafah West",
    onsetOfSymptomsDate: new Date("2024-02-01"),
    symptoms: [
      { name: "Fever", value: "Yes", duration: "2 days" },
      { name: "Jaundice", value: "Yes", duration: "1 day" },
      { name: "Nausea / Vomiting", value: "Yes", duration: "3 days" },
      { name: "Fatigue / Malaise", value: "Yes", duration: "4 days" },
      { name: "Pruritus", value: "Yes", duration: "2 days" },
    ],
    hevIgM: "Positive",
    hevIgG: "Negative",
    hevPcr: "Positive",
    hevPcrValue: "2.1 x 10^4",
    alt: "390",
    ast: "320",
    outcome: "Recovered",
    remarks: "Mild case, recovered with supportive care",
  },
  {
    governorate: "Muscat",
    wilayat: "Bawshar",
    institution: "Khoula Hospital",
    reportingDate: new Date("2024-02-10"),
    patientId: "HEV005",
    civilId: "99887766",
    dob: new Date("1995-09-25"),
    age: 29,
    term: "Years",
    nationality: "Bangladeshi",
    firstName: "Rahman",
    secondName: "Abdul",
    thirdName: "Karim",
    gender: "Male",
    mobileNo: "+96895678901",
    patientGovernorate: "Muscat",
    patientWilayat: "Bawshar",
    village: "Al Khoudh",
    onsetOfSymptomsDate: new Date("2024-02-06"),
    symptoms: [
      { name: "Fever", value: "Yes", duration: "6 days" },
      { name: "Jaundice", value: "Yes", duration: "4 days" },
      { name: "Abdominal Pain (RUQ)", value: "Yes", duration: "5 days" },
      { name: "Arthralgia / Myalgia", value: "Yes", duration: "3 days" },
    ],
    hevIgM: "Positive",
    hevIgG: "Positive",
    hevPcr: "Positive",
    hevPcrValue: "5.8 x 10^5",
    alt: "720",
    ast: "650",
    outcome: "Under Treatment",
    remarks: "Severe case, hospitalized for monitoring",
  },
];

async function seedHEVData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing HEV data (optional - comment out if you want to keep existing data)
    await HevNotification.deleteMany({});
    console.log("🗑️  Cleared existing HEV data");

    // Insert mock data
    const result = await HevNotification.insertMany(mockHEVData);
    console.log(
      `\n✅ Successfully inserted ${result.length} HEV notification records\n`,
    );

    // Display the inserted records
    result.forEach((record, index) => {
      console.log(
        `${index + 1}. ${record.firstName} ${record.secondName} (${record.patientId})`,
      );
      console.log(`   📍 Institution: ${record.institution}`);
      console.log(
        `   📅 Reporting Date: ${record.reportingDate.toLocaleDateString()}`,
      );
      console.log(`   🏥 Outcome: ${record.outcome}\n`);
    });

    await mongoose.connection.close();
    console.log("✅ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding HEV data:", error);
    process.exit(1);
  }
}

seedHEVData();
