// Shared mock data for the SwasthyaSetu prototype.
// Keep this as the single source of truth so all screens stay consistent.

export type RiskLevel = "high" | "moderate" | "stable"
export type ReferralPriority = "emergency" | "urgent" | "routine"

export const currentUser = {
  name: "Dr. Ananya Rao",
  shortName: "Dr. Ananya",
  role: "Medical Officer",
  initials: "AR",
  facility: "Dhanwantri Nagar Primary Health Centre",
  facilityType: "Primary Health Centre",
}

export interface Patient {
  id: string
  swasthyaId: string
  name: string
  age: number
  gender: "Male" | "Female" | "Other"
  primaryConcern: string
  risk: RiskLevel
  lastActivity: string
  lastVisitFacility: string
  phone: string
  village: string
  bloodGroup: string
  lastVisit: string
  activeReferral: string | null
  followUpDue: boolean
  recentlyScanned: boolean
}

export const patients: Patient[] = [
  {
    id: "p-meera",
    swasthyaId: "SW-4821-9034-1176",
    name: "Meera Sharma",
    age: 46,
    gender: "Female",
    primaryConcern: "Hypertension with Type 2 Diabetes",
    risk: "high",
    lastActivity: "Scanned 20 min ago",
    lastVisitFacility: "Dhanwantri Nagar PHC",
    phone: "+91 98765 43210",
    village: "Dhanwantri Nagar",
    bloodGroup: "O+",
    lastVisit: "Aug 29, 2026",
    activeReferral: "REF-847293 · Cardiology",
    followUpDue: true,
    recentlyScanned: true,
  },
  {
    id: "p-ramesh",
    swasthyaId: "SW-1290-7745-3321",
    name: "Ramesh Yadav",
    age: 58,
    gender: "Male",
    primaryConcern: "Uncontrolled hypertension",
    risk: "high",
    lastActivity: "Consultation 2 hrs ago",
    lastVisitFacility: "Sub-Centre Rampur",
    phone: "+91 90123 45678",
    village: "Rampur",
    bloodGroup: "O+",
    lastVisit: "Aug 29, 2026",
    activeReferral: "Emergency · District Hospital",
    followUpDue: false,
    recentlyScanned: false,
  },
  {
    id: "p-lakshmi",
    swasthyaId: "SW-8834-2201-9987",
    name: "Lakshmi Devi",
    age: 45,
    gender: "Female",
    primaryConcern: "Anemia follow-up",
    risk: "moderate",
    lastActivity: "Lab results 4 hrs ago",
    lastVisitFacility: "Dhanwantri Nagar PHC",
    phone: "+91 99887 66554",
    village: "Kishanganj",
    bloodGroup: "A+",
    lastVisit: "Aug 28, 2026",
    activeReferral: null,
    followUpDue: true,
    recentlyScanned: false,
  },
  {
    id: "p-arjun",
    swasthyaId: "SW-5567-1123-4408",
    name: "Arjun Kumar",
    age: 7,
    gender: "Male",
    primaryConcern: "Acute respiratory infection",
    risk: "moderate",
    lastActivity: "Registered today",
    lastVisitFacility: "Dhanwantri Nagar PHC",
    phone: "+91 91234 56780",
    village: "Dhanwantri Nagar",
    bloodGroup: "AB+",
    lastVisit: "Aug 29, 2026",
    activeReferral: "Routine · District Hospital",
    followUpDue: false,
    recentlyScanned: false,
  },
  {
    id: "p-fatima",
    swasthyaId: "SW-3345-9980-2214",
    name: "Fatima Begum",
    age: 29,
    gender: "Female",
    primaryConcern: "Routine antenatal check-up — 28 weeks",
    risk: "stable",
    lastActivity: "Visited yesterday",
    lastVisitFacility: "Sub-Centre Rampur",
    phone: "+91 93456 78901",
    village: "Rampur",
    bloodGroup: "O-",
    lastVisit: "Aug 28, 2026",
    activeReferral: null,
    followUpDue: true,
    recentlyScanned: false,
  },
  {
    id: "p-suresh",
    swasthyaId: "SW-6612-4450-8821",
    name: "Suresh Patel",
    age: 72,
    gender: "Male",
    primaryConcern: "Chronic arthritis with mobility issues",
    risk: "high",
    lastActivity: "Consultation yesterday",
    lastVisitFacility: "Dhanwantri Nagar PHC",
    phone: "+91 90011 22334",
    village: "Kishanganj",
    bloodGroup: "B+",
    lastVisit: "Aug 27, 2026",
    activeReferral: null,
    followUpDue: true,
    recentlyScanned: false,
  },
  {
    id: "p-anita",
    swasthyaId: "SW-7723-5561-9932",
    name: "Anita Verma",
    age: 31,
    gender: "Female",
    primaryConcern: "Pregnancy — 32 weeks, gestational diabetes screening",
    risk: "moderate",
    lastActivity: "Scanned 1 hr ago",
    lastVisitFacility: "Dhanwantri Nagar PHC",
    phone: "+91 94455 66778",
    village: "Dhanwantri Nagar",
    bloodGroup: "A-",
    lastVisit: "Aug 29, 2026",
    activeReferral: null,
    followUpDue: true,
    recentlyScanned: true,
  },
  {
    id: "p-vikram",
    swasthyaId: "SW-8834-6672-1043",
    name: "Vikram Singh",
    age: 54,
    gender: "Male",
    primaryConcern: "Type 2 Diabetes — poorly controlled",
    risk: "high",
    lastActivity: "Lab results 3 days ago",
    lastVisitFacility: "Sub-Centre Rampur",
    phone: "+91 95566 77889",
    village: "Rampur",
    bloodGroup: "O+",
    lastVisit: "Aug 26, 2026",
    activeReferral: "Urgent · CHC Mandalgarh",
    followUpDue: false,
    recentlyScanned: false,
  },
  {
    id: "p-priya",
    swasthyaId: "SW-9945-7783-2154",
    name: "Priya Nair",
    age: 24,
    gender: "Female",
    primaryConcern: "Routine check-up — no chronic conditions",
    risk: "stable",
    lastActivity: "Visited 3 days ago",
    lastVisitFacility: "Dhanwantri Nagar PHC",
    phone: "+91 96677 88990",
    village: "Kishanganj",
    bloodGroup: "AB-",
    lastVisit: "Aug 26, 2026",
    activeReferral: null,
    followUpDue: false,
    recentlyScanned: false,
  },
  {
    id: "p-mohan",
    swasthyaId: "SW-1056-8894-3265",
    name: "Mohan Lal",
    age: 63,
    gender: "Male",
    primaryConcern: "COPD with recurrent exacerbations",
    risk: "high",
    lastActivity: "Consultation 5 hrs ago",
    lastVisitFacility: "Dhanwantri Nagar PHC",
    phone: "+91 97788 99001",
    village: "Dhanwantri Nagar",
    bloodGroup: "B-",
    lastVisit: "Aug 29, 2026",
    activeReferral: null,
    followUpDue: true,
    recentlyScanned: false,
  },
  {
    id: "p-kavya",
    swasthyaId: "SW-2167-9905-4376",
    name: "Kavya Reddy",
    age: 5,
    gender: "Female",
    primaryConcern: "Vaccination due — DPT booster",
    risk: "stable",
    lastActivity: "Scanned 2 hrs ago",
    lastVisitFacility: "Sub-Centre Rampur",
    phone: "+91 98899 00112",
    village: "Rampur",
    bloodGroup: "A+",
    lastVisit: "Aug 29, 2026",
    activeReferral: null,
    followUpDue: true,
    recentlyScanned: true,
  },
  {
    id: "p-deepak",
    swasthyaId: "SW-3278-1016-5487",
    name: "Deepak Joshi",
    age: 41,
    gender: "Male",
    primaryConcern: "Mild hypertension — lifestyle managed",
    risk: "moderate",
    lastActivity: "Visited 1 week ago",
    lastVisitFacility: "Dhanwantri Nagar PHC",
    phone: "+91 99900 11223",
    village: "Kishanganj",
    bloodGroup: "O-",
    lastVisit: "Aug 22, 2026",
    activeReferral: null,
    followUpDue: false,
    recentlyScanned: false,
  },
]

// Dedicated demo patient for the Universal QR Scanner flow.
export interface ScanPatient {
  swasthyaId: string
  name: string
  age: number
  gender: "Male" | "Female" | "Other"
  bloodGroup: string
  village: string
  primaryConcern: string
  verified: boolean
  lastRecordUpdate: string
  linkedFacilities: number
}

export const scanDemoPatient: ScanPatient = {
  swasthyaId: "SWA-9284-1829",
  name: "Meera Sharma",
  age: 46,
  gender: "Female",
  bloodGroup: "O+",
  village: "Dhanwantri Nagar",
  primaryConcern: "Hypertension with Type 2 Diabetes — under evaluation",
  verified: true,
  lastRecordUpdate: "Updated 20 min ago",
  linkedFacilities: 4,
}

// Normalize a Swasthya ID string for tolerant matching.
export function normalizeSwasthyaId(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, "")
}

/* ------------------------------------------------------------------ *
 * Full longitudinal patient record — Meera Sharma (SWA-9284-1829).
 * Centerpiece data for the /patient/[swasthyaId] profile route.
 * ------------------------------------------------------------------ */

export type MedicationStatus = "active" | "past"
export type DiagnosticStatus = "normal" | "abnormal" | "review"

export interface Vital {
  key: string
  label: string
  value: string
  unit: string
  status: "normal" | "elevated" | "high"
  note: string
}

export interface TimelineEvent {
  id: string
  year: number
  date: string // display date
  facility: string
  facilityType: string
  kind:
    | "Consultation"
    | "Diagnostic Test"
    | "Referral Completed"
    | "Routine Consultation"
  title: string
  summary: string
  symptoms?: string
  diagnosis?: string
  vitals?: { label: string; value: string }[]
  medications?: string[]
  notes?: string
  reports?: { name: string; type: string }[]
}

export interface MedicationRecord {
  id: string
  name: string
  dosage: string
  frequency: string
  facility: string
  startDate: string
  status: MedicationStatus
}

export interface DiagnosticRecord {
  id: string
  name: string
  date: string
  facility: string
  status: DiagnosticStatus
  summary: string
  results: { label: string; value: string; range: string; flag: "normal" | "high" | "low" }[]
}

export interface PatientReferral {
  id: string
  from: string
  to: string
  specialty: string
  priority: ReferralPriority
  reason: string
  status: string
  raisedAt: string
  active: boolean
}

export interface PatientProfile {
  swasthyaId: string
  name: string
  age: number
  gender: "Male" | "Female" | "Other"
  bloodGroup: string
  verified: boolean
  lastRecordUpdate: string
  currentFacility: string
  linkedFacilities: number
  phoneMasked: string
  emergencyContactMasked: string
  allergies: string[]
  highRiskConditions: string[]
  activeConditions: { name: string; since: string; control: string; tone: RiskLevel }[]
  currentMedications: { name: string; dose: string }[]
  vitals: Vital[]
  bpTrend: { label: string; systolic: number; diastolic: number }[]
  recentActivity: { id: string; title: string; detail: string; time: string }[]
  upcomingFollowUp: { title: string; date: string; facility: string; note: string }
  timeline: TimelineEvent[]
  medications: MedicationRecord[]
  diagnostics: DiagnosticRecord[]
  referrals: PatientReferral[]
}

export const patientProfile: PatientProfile = {
  swasthyaId: "SWA-9284-1829",
  name: "Meera Sharma",
  age: 46,
  gender: "Female",
  bloodGroup: "O+",
  verified: true,
  lastRecordUpdate: "Updated 20 min ago",
  currentFacility: "Dhanwantri Nagar PHC",
  linkedFacilities: 4,
  phoneMasked: "+91 •••• •• 3210",
  emergencyContactMasked: "+91 •••• •• 8842 · Spouse",
  allergies: ["Penicillin"],
  highRiskConditions: ["Hypertension", "Type 2 Diabetes"],
  activeConditions: [
    { name: "Hypertension", since: "Since Oct 2025", control: "Under evaluation", tone: "high" },
    { name: "Type 2 Diabetes", since: "Since 2022", control: "Moderately controlled", tone: "moderate" },
  ],
  currentMedications: [
    { name: "Amlodipine", dose: "5 mg · once daily" },
    { name: "Metformin", dose: "500 mg · twice daily" },
  ],
  vitals: [
    { key: "bp", label: "Blood Pressure", value: "148/92", unit: "mmHg", status: "high", note: "Above target" },
    { key: "hr", label: "Heart Rate", value: "84", unit: "bpm", status: "normal", note: "Within range" },
    { key: "glucose", label: "Blood Glucose", value: "138", unit: "mg/dL", status: "elevated", note: "Post-prandial" },
    { key: "temp", label: "Temperature", value: "98.4", unit: "°F", status: "normal", note: "Afebrile" },
  ],
  bpTrend: [
    { label: "Oct '25", systolic: 158, diastolic: 98 },
    { label: "Dec '25", systolic: 152, diastolic: 96 },
    { label: "Feb '26", systolic: 150, diastolic: 94 },
    { label: "Apr '26", systolic: 146, diastolic: 92 },
    { label: "Jun '26", systolic: 149, diastolic: 93 },
    { label: "Aug '26", systolic: 148, diastolic: 92 },
  ],
  recentActivity: [
    { id: "pa-1", title: "Consultation recorded", detail: "Chest discomfort, elevated BP — Amlodipine continued", time: "20 min ago · Dhanwantri Nagar PHC" },
    { id: "pa-2", title: "Lab results uploaded", detail: "Blood glucose & lipid profile completed", time: "Aug 12 · City Diagnostic Centre" },
    { id: "pa-3", title: "Referral accepted", detail: "Cardiology evaluation → District Hospital", time: "Aug 29 · Dhanwantri Nagar PHC" },
  ],
  upcomingFollowUp: {
    title: "PHC Follow-Up",
    date: "September 5, 2026",
    facility: "Dhanwantri Nagar PHC",
    note: "Blood pressure review & medication titration",
  },
  timeline: [
    {
      id: "t-2026-08-29",
      year: 2026,
      date: "Aug 29, 2026",
      facility: "Dhanwantri Nagar PHC",
      facilityType: "Primary Health Centre",
      kind: "Consultation",
      title: "Consultation — Hypertension review",
      summary: "Chest discomfort and elevated blood pressure evaluated.",
      symptoms: "Chest discomfort, intermittent breathlessness, elevated blood pressure over two weeks.",
      diagnosis: "Hypertension under evaluation. Cardiac cause to be ruled out via specialist review.",
      vitals: [
        { label: "Blood Pressure", value: "148/92 mmHg" },
        { label: "Heart Rate", value: "84 bpm" },
        { label: "Blood Glucose", value: "138 mg/dL" },
      ],
      medications: ["Amlodipine 5 mg — continued", "Metformin 500 mg — continued"],
      notes: "Advised salt restriction and home BP monitoring. Referred to Cardiology at District Hospital.",
      reports: [{ name: "Consultation Note", type: "Clinical note" }],
    },
    {
      id: "t-2026-08-12",
      year: 2026,
      date: "Aug 12, 2026",
      facility: "City Diagnostic Centre",
      facilityType: "Diagnostic Lab",
      kind: "Diagnostic Test",
      title: "Diagnostic Test — Metabolic panel",
      summary: "Blood glucose and lipid profile completed.",
      diagnosis: "Elevated fasting glucose and borderline LDL cholesterol.",
      vitals: [{ label: "Fasting Glucose", value: "132 mg/dL" }],
      notes: "Results shared with referring PHC. Dietary counselling recommended.",
      reports: [
        { name: "Blood Glucose Report", type: "Lab report" },
        { name: "Lipid Profile", type: "Lab report" },
      ],
    },
    {
      id: "t-2025-12-18",
      year: 2025,
      date: "Dec 18, 2025",
      facility: "District Hospital",
      facilityType: "District Hospital",
      kind: "Referral Completed",
      title: "Referral Completed — Cardiovascular evaluation",
      summary: "Referred for specialist cardiovascular evaluation.",
      diagnosis: "No acute cardiac abnormality. Continue antihypertensive therapy.",
      vitals: [{ label: "Blood Pressure", value: "152/96 mmHg" }],
      medications: ["Amlodipine 5 mg — initiated"],
      notes: "ECG and echocardiography within normal limits. Follow-up at PHC advised.",
      reports: [{ name: "Cardiology Summary", type: "Specialist report" }],
    },
    {
      id: "t-2025-10-02",
      year: 2025,
      date: "Oct 02, 2025",
      facility: "Dhanwantri Nagar Sub-Centre",
      facilityType: "Sub-Centre",
      kind: "Routine Consultation",
      title: "Routine Consultation — Hypertension identified",
      summary: "High blood pressure first identified during routine visit.",
      symptoms: "Occasional headaches, no chest pain. Detected on routine screening.",
      diagnosis: "New-onset hypertension. Lifestyle modification advised.",
      vitals: [{ label: "Blood Pressure", value: "158/98 mmHg" }],
      notes: "Baseline record created. Advised follow-up and monitoring.",
    },
  ],
  medications: [
    { id: "m-1", name: "Amlodipine", dosage: "5 mg", frequency: "Once daily", facility: "Dhanwantri Nagar PHC", startDate: "Dec 18, 2025", status: "active" },
    { id: "m-2", name: "Metformin", dosage: "500 mg", frequency: "Twice daily", facility: "District Hospital", startDate: "Mar 2022", status: "active" },
    { id: "m-3", name: "Hydrochlorothiazide", dosage: "12.5 mg", frequency: "Once daily", facility: "Dhanwantri Nagar Sub-Centre", startDate: "Oct 02, 2025", status: "past" },
    { id: "m-4", name: "Aspirin", dosage: "75 mg", frequency: "Once daily", facility: "District Hospital", startDate: "Dec 2025", status: "past" },
  ],
  diagnostics: [
    {
      id: "d-cbc",
      name: "Complete Blood Count (CBC)",
      date: "Aug 12, 2026",
      facility: "City Diagnostic Centre",
      status: "normal",
      summary: "All parameters within normal reference range.",
      results: [
        { label: "Hemoglobin", value: "12.8 g/dL", range: "12.0–15.5", flag: "normal" },
        { label: "WBC", value: "7,200 /µL", range: "4,000–11,000", flag: "normal" },
        { label: "Platelets", value: "2.6 L/µL", range: "1.5–4.1", flag: "normal" },
      ],
    },
    {
      id: "d-glucose",
      name: "Blood Glucose",
      date: "Aug 12, 2026",
      facility: "City Diagnostic Centre",
      status: "abnormal",
      summary: "Fasting and post-prandial glucose above target.",
      results: [
        { label: "Fasting Glucose", value: "132 mg/dL", range: "70–100", flag: "high" },
        { label: "Post-prandial", value: "186 mg/dL", range: "<140", flag: "high" },
        { label: "HbA1c", value: "7.2 %", range: "<6.5", flag: "high" },
      ],
    },
    {
      id: "d-lipid",
      name: "Lipid Profile",
      date: "Aug 12, 2026",
      facility: "City Diagnostic Centre",
      status: "review",
      summary: "Borderline LDL cholesterol; recheck advised.",
      results: [
        { label: "Total Cholesterol", value: "212 mg/dL", range: "<200", flag: "high" },
        { label: "LDL", value: "138 mg/dL", range: "<100", flag: "high" },
        { label: "HDL", value: "44 mg/dL", range: ">40", flag: "normal" },
      ],
    },
    {
      id: "d-ecg",
      name: "ECG",
      date: "Dec 18, 2025",
      facility: "District Hospital",
      status: "normal",
      summary: "Normal sinus rhythm. No ischemic changes.",
      results: [
        { label: "Rhythm", value: "Sinus", range: "Normal", flag: "normal" },
        { label: "Heart Rate", value: "78 bpm", range: "60–100", flag: "normal" },
        { label: "QTc", value: "412 ms", range: "<440", flag: "normal" },
      ],
    },
  ],
  referrals: [
    {
      id: "REF-847293",
      from: "Dhanwantri Nagar PHC",
      to: "District Hospital",
      specialty: "Cardiology",
      priority: "urgent",
      reason: "Chest discomfort with hypertension",
      status: "Accepted by Receiving Facility",
      raisedAt: "Aug 29, 2026",
      active: true,
    },
    {
      id: "REF-712004",
      from: "Dhanwantri Nagar Sub-Centre",
      to: "District Hospital",
      specialty: "Cardiology",
      priority: "routine",
      reason: "Baseline cardiovascular evaluation",
      status: "Completed",
      raisedAt: "Dec 10, 2025",
      active: false,
    },
  ],
}

export interface Referral {
  id: string
  patientName: string
  priority: ReferralPriority
  from: string
  to: string
  reason: string
  raisedAt: string
  status: "pending" | "accepted" | "in-transit" | "completed"
}

export const referrals: Referral[] = [
  {
    id: "r-1",
    patientName: "Ramesh Yadav",
    priority: "emergency",
    from: "Sub-Centre Rampur",
    to: "District Hospital, Bhilwara",
    reason: "Hypertensive crisis, BP 210/120",
    raisedAt: "35 min ago",
    status: "in-transit",
  },
  {
    id: "r-2",
    patientName: "Meera Sharma",
    priority: "urgent",
    from: "Dhanwantri Nagar PHC",
    to: "Community Health Centre, Mandalgarh",
    reason: "High-risk pregnancy, elevated glucose",
    raisedAt: "1 hr ago",
    status: "accepted",
  },
  {
    id: "r-3",
    patientName: "Arjun Kumar",
    priority: "routine",
    from: "Dhanwantri Nagar PHC",
    to: "District Hospital, Bhilwara",
    reason: "Pediatric X-ray for persistent cough",
    raisedAt: "3 hrs ago",
    status: "pending",
  },
]

export interface ActivityItem {
  id: string
  type: "scan" | "consultation" | "referral" | "lab" | "registration"
  title: string
  detail: string
  time: string
}

export const recentActivity: ActivityItem[] = [
  {
    id: "a-1",
    type: "scan",
    title: "Meera Sharma scanned",
    detail: "QR verified at reception desk",
    time: "20 min ago",
  },
  {
    id: "a-2",
    type: "referral",
    title: "Emergency referral raised",
    detail: "Ramesh Yadav → District Hospital, Bhilwara",
    time: "35 min ago",
  },
  {
    id: "a-3",
    type: "lab",
    title: "Lab results uploaded",
    detail: "Lakshmi Devi — Hemoglobin 9.2 g/dL",
    time: "4 hrs ago",
  },
  {
    id: "a-4",
    type: "consultation",
    title: "Consultation completed",
    detail: "Ramesh Yadav — medication adjusted",
    time: "2 hrs ago",
  },
  {
    id: "a-5",
    type: "registration",
    title: "New patient registered",
    detail: "Arjun Kumar — Swasthya ID issued",
    time: "5 hrs ago",
  },
]

export const dashboardKpis = [
  {
    key: "scanned",
    label: "Patients Scanned Today",
    value: 42,
    delta: "+8 vs. yesterday",
    trend: "up" as const,
  },
  {
    key: "referrals",
    label: "Active Referrals",
    value: 6,
    delta: "2 emergency",
    trend: "flat" as const,
  },
  {
    key: "high-risk",
    label: "High-Risk Patients",
    value: 11,
    delta: "3 need follow-up",
    trend: "up" as const,
  },
  {
    key: "follow-ups",
    label: "Pending Follow-Ups",
    value: 9,
    delta: "Due this week",
    trend: "down" as const,
  },
]

export const riskConfig: Record<
  RiskLevel,
  { label: string; className: string; dot: string }
> = {
  high: {
    label: "High Risk",
    className: "bg-urgent-muted text-urgent",
    dot: "bg-urgent",
  },
  moderate: {
    label: "Moderate",
    className: "bg-warning-muted text-warning-foreground",
    dot: "bg-warning",
  },
  stable: {
    label: "Stable",
    className: "bg-success-muted text-success",
    dot: "bg-success",
  },
}

export const priorityConfig: Record<
  ReferralPriority,
  { label: string; className: string; dot: string }
> = {
  emergency: {
    label: "Emergency",
    className: "bg-urgent-muted text-urgent",
    dot: "bg-urgent",
  },
  urgent: {
    label: "Urgent",
    className: "bg-warning-muted text-warning-foreground",
    dot: "bg-warning",
  },
  routine: {
    label: "Routine",
    className: "bg-teal-muted text-teal",
    dot: "bg-teal",
  },
}

/* ------------------------------------------------------------------ *
 * Facility dashboard data
 * ------------------------------------------------------------------ */

export interface QueuePatient {
  id: string
  name: string
  concern: string
  waitMin: number
  status: "waiting" | "in-progress" | "ready"
}

export const currentQueue: QueuePatient[] = [
  { id: "q-1", name: "Mohan Lal", concern: "COPD follow-up", waitMin: 5, status: "in-progress" },
  { id: "q-2", name: "Anita Verma", concern: "Antenatal check-up", waitMin: 12, status: "waiting" },
  { id: "q-3", name: "Kavya Reddy", concern: "Vaccination", waitMin: 18, status: "waiting" },
  { id: "q-4", name: "Deepak Joshi", concern: "BP review", waitMin: 25, status: "waiting" },
  { id: "q-5", name: "Lakshmi Devi", concern: "Anemia results", waitMin: 32, status: "waiting" },
]

export interface DoctorAvailability {
  id: string
  name: string
  specialty: string
  status: "available" | "busy" | "off-duty"
  currentPatient: string | null
}

export const availableDoctors: DoctorAvailability[] = [
  { id: "d-1", name: "Dr. Ananya Rao", specialty: "Medical Officer", status: "busy", currentPatient: "Mohan Lal" },
  { id: "d-2", name: "Dr. Vikas Gupta", specialty: "General Physician", status: "available", currentPatient: null },
  { id: "d-3", name: "Sunita Devi", specialty: "ANM / Nursing", status: "available", currentPatient: null },
  { id: "d-4", name: "Dr. Priya Singh", specialty: "Obstetrics (visiting)", status: "off-duty", currentPatient: null },
]

export interface BedStatus {
  total: number
  occupied: number
  available: number
  type: string
}

export const bedStatus: BedStatus[] = [
  { total: 10, occupied: 7, available: 3, type: "General Ward" },
  { total: 4, occupied: 2, available: 2, type: "Observation" },
  { total: 2, occupied: 2, available: 0, type: "Labour Room" },
  { total: 1, occupied: 0, available: 1, type: "Emergency" },
]

export type StockLevel = "available" | "low" | "unavailable"

export interface MedicineStock {
  name: string
  level: StockLevel
  quantity: string
}

export const medicineStock: MedicineStock[] = [
  { name: "Paracetamol", level: "available", quantity: "1,240 tablets" },
  { name: "Amlodipine", level: "available", quantity: "560 tablets" },
  { name: "Metformin", level: "low", quantity: "85 tablets" },
  { name: "Insulin", level: "low", quantity: "12 vials" },
  { name: "Amoxicillin", level: "unavailable", quantity: "0 tablets" },
]

export interface DiagnosticAvailability {
  name: string
  level: StockLevel
  note: string
}

export const diagnosticAvailability: DiagnosticAvailability[] = [
  { name: "Blood Tests", level: "available", note: "CBC, glucose, lipid profile" },
  { name: "ECG", level: "available", note: "12-lead available" },
  { name: "X-Ray", level: "low", note: "Technician on call — limited slots" },
  { name: "Ultrasound", level: "unavailable", note: "Referred to CHC Mandalgarh" },
]

export interface ReferralCapacityStat {
  direction: "incoming" | "outgoing"
  total: number
  pending: number
  accepted: number
  completed: number
}

export const referralCapacity: ReferralCapacityStat[] = [
  { direction: "outgoing", total: 14, pending: 3, accepted: 6, completed: 5 },
  { direction: "incoming", total: 8, pending: 2, accepted: 4, completed: 2 },
]

/* ------------------------------------------------------------------ *
 * Analytics data (Demo Data)
 * ------------------------------------------------------------------ */

export const patientAccessTrend = [
  { month: "Mar", scans: 180, consultations: 142 },
  { month: "Apr", scans: 210, consultations: 168 },
  { month: "May", scans: 195, consultations: 175 },
  { month: "Jun", scans: 248, consultations: 210 },
  { month: "Jul", scans: 272, consultations: 235 },
  { month: "Aug", scans: 310, consultations: 268 },
]

export const referralCompletionRate = [
  { month: "Mar", completed: 8, total: 12 },
  { month: "Apr", completed: 10, total: 14 },
  { month: "May", completed: 9, total: 11 },
  { month: "Jun", completed: 14, total: 16 },
  { month: "Jul", completed: 12, total: 15 },
  { month: "Aug", completed: 16, total: 18 },
]

export const avgReferralJourneyTime = [
  { facility: "District Hospital", hours: 3.2 },
  { facility: "Govt Medical College", hours: 5.8 },
  { facility: "CHC Mandalgarh", hours: 2.1 },
  { facility: "Specialist Clinic", hours: 4.5 },
]

export const highRiskDistribution = [
  { name: "Hypertension", value: 38 },
  { name: "Diabetes", value: 27 },
  { name: "Cardiac", value: 14 },
  { name: "Respiratory", value: 11 },
  { name: "Pregnancy-related", value: 10 },
]

export const commonConditions = [
  { condition: "Hypertension", count: 142 },
  { condition: "Diabetes Type 2", count: 98 },
  { condition: "Respiratory Infection", count: 76 },
  { condition: "Anemia", count: 64 },
  { condition: "Antenatal", count: 52 },
  { condition: "Arthritis", count: 38 },
]

export const followUpCompletion = [
  { month: "Mar", scheduled: 18, completed: 14 },
  { month: "Apr", scheduled: 22, completed: 19 },
  { month: "May", scheduled: 20, completed: 16 },
  { month: "Jun", scheduled: 25, completed: 22 },
  { month: "Jul", scheduled: 28, completed: 24 },
  { month: "Aug", scheduled: 30, completed: 27 },
]
