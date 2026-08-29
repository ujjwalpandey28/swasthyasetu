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
}

export const patients: Patient[] = [
  {
    id: "p-meera",
    swasthyaId: "SW-4821-9034-1176",
    name: "Meera Sharma",
    age: 34,
    gender: "Female",
    primaryConcern: "Gestational diabetes — 28 weeks",
    risk: "high",
    lastActivity: "Scanned 20 min ago",
    lastVisitFacility: "Dhanwantri Nagar PHC",
    phone: "+91 98765 43210",
    village: "Dhanwantri Nagar",
    bloodGroup: "B+",
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
  },
  {
    id: "p-fatima",
    swasthyaId: "SW-3345-9980-2214",
    name: "Fatima Begum",
    age: 29,
    gender: "Female",
    primaryConcern: "Routine antenatal check-up",
    risk: "stable",
    lastActivity: "Visited yesterday",
    lastVisitFacility: "Sub-Centre Rampur",
    phone: "+91 93456 78901",
    village: "Rampur",
    bloodGroup: "O-",
  },
]

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
