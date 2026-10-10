// ---------------------------------------------------------------------------
// Mock data layer for the MediCare admin dashboard.
// In production this module is replaced by API calls — the query engine in
// src/utils/query.js already mirrors the server-side ?search=&filter= contract.
// ---------------------------------------------------------------------------

// Deterministic PRNG so demo data is stable between reloads.
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(20261010)
const pick = (arr) => arr[Math.floor(rand() * arr.length)]
const between = (min, max) => Math.floor(rand() * (max - min + 1)) + min

const FIRST = [
  'Adaeze', 'Chinedu', 'Aisha', 'Emeka', 'Funmilayo', 'Ibrahim', 'Ngozi',
  'Tunde', 'Zainab', 'Obinna', 'Halima', 'Segun', 'Chiamaka', 'Musa',
  'Oluwaseun', 'Amina', 'Kelechi', 'Bisi', 'Sadiq', 'Yemisi', 'Uche',
  'Fatima', 'Dayo', 'Amara', 'Bolaji', 'Hauwa', 'Femi', 'Nneka',
]
const LAST = [
  'Okafor', 'Eze', 'Bello', 'Obi', 'Adeyemi', 'Musa', 'Okonkwo', 'Bakare',
  'Abubakar', 'Nwosu', 'Adebayo', 'Ibrahim', 'Chukwu', 'Lawal', 'Ogunleye',
  'Balogun', 'Umeh', 'Danladi', 'Afolabi', 'Ekwueme', 'Suleiman', 'Ojo',
]

const CITIES = ['Abuja', 'Lagos', 'Kano', 'Ibadan', 'Port Harcourt', 'Enugu', 'Kaduna', 'Benin City', 'Jos', 'Uyo']
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const DEPARTMENTS = [
  'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics',
  'General Medicine', 'Dermatology', 'Obstetrics & Gynecology', 'Oncology',
]

const DOCTOR_STATUSES = ['Available', 'With Patient', 'In Surgery', 'On Leave']
const PATIENT_STATUSES = ['Admitted', 'Outpatient', 'Discharged', 'Critical']
const APPT_STATUSES = ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'No-Show']
const APPT_TYPES = ['In-Person', 'Telehealth', 'Follow-Up', 'Emergency']
const INVOICE_STATUSES = ['Paid', 'Pending', 'Overdue', 'Partially Paid', 'Refunded']
const PAY_METHODS = ['Card', 'Cash', 'Insurance', 'Bank Transfer']
const MED_CATEGORIES = ['Analgesic', 'Antibiotic', 'Antihistamine', 'Antimalarial', 'Cardiovascular', 'Diabetes', 'Respiratory', 'Supplement']
const STAFF_ROLES = ['Administrator', 'Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'Lab Technician', 'Accountant']

const iso = (d) => d.toISOString().slice(0, 10)
const daysAgo = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}
const daysAhead = (n) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d
}

// --- Doctors ---------------------------------------------------------------
export const doctors = Array.from({ length: 14 }, (_, i) => {
  const first = pick(FIRST)
  const last = pick(LAST)
  const dept = DEPARTMENTS[i % DEPARTMENTS.length]
  return {
    id: `DR-${String(1001 + i)}`,
    name: `Dr. ${first} ${last}`,
    gender: rand() > 0.5 ? 'Male' : 'Female',
    specialty: dept,
    department: dept,
    email: `${first}.${last}@medicare.ng`.toLowerCase(),
    phone: `+234 80${between(10, 99)} ${between(100, 999)} ${between(1000, 9999)}`,
    status: pick(DOCTOR_STATUSES),
    experience: between(3, 28),
    patients: between(18, 140),
    rating: (between(32, 50) / 10).toFixed(1),
  }
})

// --- Patients ---------------------------------------------------------------
export const patients = Array.from({ length: 48 }, (_, i) => {
  const first = pick(FIRST)
  const last = pick(LAST)
  const gender = rand() > 0.5 ? 'Male' : 'Female'
  const age = between(1, 88)
  const registered = daysAgo(between(0, 720))
  return {
    id: `PT-${String(2001 + i)}`,
    name: `${first} ${last}`,
    gender,
    age,
    dob: iso(daysAgo(age * 365 + between(0, 300))),
    bloodGroup: pick(BLOOD_GROUPS),
    phone: `+234 80${between(10, 99)} ${between(100, 999)} ${between(1000, 9999)}`,
    email: `${first}.${last}@gmail.com`.toLowerCase(),
    city: pick(CITIES),
    status: pick(PATIENT_STATUSES),
    doctorId: pick(doctors).id,
    registeredDate: iso(registered),
    lastVisit: iso(daysAgo(between(0, 90))),
  }
})

// --- Appointments -----------------------------------------------------------
const TIME_SLOTS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00']
export const appointments = Array.from({ length: 72 }, (_, i) => {
  const patient = pick(patients)
  const doctor = pick(doctors)
  // ~1/3 past, ~1/3 today, ~1/3 upcoming → date-range filters have data.
  const offset = i % 3 === 0 ? -between(1, 45) : i % 3 === 1 ? 0 : between(1, 30)
  const status = offset < 0 ? pick(['Completed', 'Cancelled', 'No-Show']) : offset === 0 ? pick(['Scheduled', 'In Progress', 'Completed']) : pick(['Scheduled', 'Scheduled', 'Cancelled'])
  return {
    id: `APT-${String(3001 + i)}`,
    patientId: patient.id,
    patientName: patient.name,
    doctorId: doctor.id,
    doctorName: doctor.name,
    department: doctor.department,
    date: iso(new Date(Date.now() + offset * 86400000)),
    time: pick(TIME_SLOTS),
    type: pick(APPT_TYPES),
    status,
    reason: pick(['General consultation', 'Routine check-up', 'Post-surgery review', 'Lab results review', 'Persistent headache', 'Chest pain evaluation', 'Vaccination', 'Prenatal visit']),
  }
})

// --- Invoices / Billing -----------------------------------------------------
export const invoices = Array.from({ length: 52 }, (_, i) => {
  const patient = pick(patients)
  const issued = daysAgo(between(0, 120))
  const due = new Date(issued)
  due.setDate(due.getDate() + 14)
  const status = pick(INVOICE_STATUSES)
  return {
    id: `INV-${String(4001 + i)}`,
    patientId: patient.id,
    patientName: patient.name,
    description: pick(['Consultation fee', 'Laboratory tests', 'Pharmacy dispense', 'Surgical procedure', 'Ward admission (2 nights)', 'Imaging — X-ray', 'Imaging — MRI', 'Physiotherapy session']),
    issueDate: iso(issued),
    dueDate: iso(due),
    amount: between(8, 480) * 500, // NGN
    status,
    method: status === 'Paid' || status === 'Partially Paid' ? pick(PAY_METHODS) : '—',
  }
})

// --- Pharmacy / Inventory ---------------------------------------------------
const MED_NAMES = [
  ['Paracetamol 500mg', 'Analgesic'], ['Ibuprofen 400mg', 'Analgesic'], ['Tramadol 50mg', 'Analgesic'],
  ['Amoxicillin 250mg', 'Antibiotic'], ['Ciprofloxacin 500mg', 'Antibiotic'], ['Azithromycin 500mg', 'Antibiotic'],
  ['Ceftriaxone 1g', 'Antibiotic'], ['Loratadine 10mg', 'Antihistamine'], ['Chlorpheniramine 4mg', 'Antihistamine'],
  ['Artemether-Lumefantrine', 'Antimalarial'], ['Sulfadoxine-Pyrimethamine', 'Antimalarial'],
  ['Amlodipine 5mg', 'Cardiovascular'], ['Lisinopril 10mg', 'Cardiovascular'], ['Atorvastatin 20mg', 'Cardiovascular'],
  ['Metformin 500mg', 'Diabetes'], ['Glimepiride 2mg', 'Diabetes'], ['Insulin Glargine', 'Diabetes'],
  ['Salbutamol Inhaler', 'Respiratory'], ['Montelukast 10mg', 'Respiratory'], ['Guaifenesin Syrup', 'Respiratory'],
  ['Vitamin C 1000mg', 'Supplement'], ['Folic Acid 5mg', 'Supplement'], ['Multivitamin Plus', 'Supplement'],
  ['Omeprazole 20mg', 'Supplement'], ['ORS Sachets', 'Supplement'],
]
export const medications = MED_NAMES.map(([name, category], i) => {
  const stock = between(0, 500)
  const reorderLevel = between(40, 120)
  return {
    id: `MED-${String(501 + i)}`,
    name,
    category,
    sku: `SKU-${String(9000 + i)}`,
    supplier: pick(['Emzor Pharma', 'Fidson Healthcare', 'May & Baker', 'GlaxoSmithKline', 'Swiss Pharma']),
    stock,
    reorderLevel,
    stockStatus: stock === 0 ? 'Out of Stock' : stock <= reorderLevel ? 'Low Stock' : 'In Stock',
    unitPrice: between(5, 220) * 100, // NGN
    expiry: iso(daysAhead(between(-30, 540))),
  }
})

// --- Staff ------------------------------------------------------------------
export const staff = Array.from({ length: 22 }, (_, i) => {
  const first = pick(FIRST)
  const last = pick(LAST)
  return {
    id: `STF-${String(601 + i)}`,
    name: `${first} ${last}`,
    role: i < 3 ? 'Administrator' : pick(STAFF_ROLES.slice(1)),
    department: pick(DEPARTMENTS),
    email: `${first}.${last}@medicare.ng`.toLowerCase(),
    phone: `+234 80${between(10, 99)} ${between(100, 999)} ${between(1000, 9999)}`,
    status: pick(['Active', 'Active', 'Active', 'On Leave', 'Inactive']),
    joinDate: iso(daysAgo(between(90, 1800))),
  }
})

// --- Lookup helpers ---------------------------------------------------------
export const doctorById = Object.fromEntries(doctors.map((d) => [d.id, d]))
export const patientById = Object.fromEntries(patients.map((p) => [p.id, p]))

export const TODAY_ISO = iso(new Date())
