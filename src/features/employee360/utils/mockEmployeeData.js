/**
 * mockEmployeeData.js
 *
 * Realistic sample data for Employee 360° demo mode.
 * Used when Firebase data is unavailable (document not found, rules not deployed, etc.)
 *
 * This is UI-only data — nothing is read from or written to Firebase when using this.
 */

export const MOCK_PROFILE = {
  id: 'demo-uid',
  uid: 'demo-uid',
  employeeId: 'EMP-001',
  displayName: 'Arjun Mehta',
  firstName: 'Arjun',
  lastName: 'Mehta',
  email: 'arjun.mehta@dayflow.in',
  phone: '+91 98765 43210',
  address: '42, 3rd Cross, Koramangala 5th Block, Bengaluru, Karnataka 560095',
  department: 'Engineering',
  designation: 'Senior Software Engineer',
  role: 'employee',
  status: 'active',
  employmentType: 'Full-Time',
  joiningDate: '2023-04-01',
  reportingManager: 'Priya Sharma',
  location: 'Bengaluru HQ',
  profilePicture: null,
  emailVerified: true,

  // Salary Structure
  salary: {
    basic: 85000,
    hra: 34000,
    transportAllowance: 3200,
    medicalAllowance: 1500,
    specialAllowance: 12300,
    providentFund: 10200,
    professionalTax: 200,
    incomeTax: 8500,
  },

  // Documents
  documents: [
    {
      name: 'Offer Letter.pdf',
      type: 'application/pdf',
      category: 'Offer Letter',
      uploadedAt: '2023-03-28T10:00:00Z',
      url: null,
    },
    {
      name: 'Aadhaar Card.pdf',
      type: 'application/pdf',
      category: 'ID Proof',
      uploadedAt: '2023-04-01T09:30:00Z',
      url: null,
    },
    {
      name: 'PAN Card.pdf',
      type: 'application/pdf',
      category: 'ID Proof',
      uploadedAt: '2023-04-01T09:35:00Z',
      url: null,
    },
    {
      name: 'Degree Certificate.pdf',
      type: 'application/pdf',
      category: 'Education',
      uploadedAt: '2023-04-02T11:00:00Z',
      url: null,
    },
  ],

  createdAt: { toDate: () => new Date('2023-04-01T09:00:00Z') },
  updatedAt: { toDate: () => new Date('2024-11-15T14:30:00Z') },
};

export const MOCK_TIMELINE = [
  {
    id: 'evt-1',
    type: 'JOINED_COMPANY',
    title: 'Joined company',
    description: 'Employee profile was verified and activated.',
    actorId: 'system',
    actorRole: 'hr',
    timestamp: { toDate: () => new Date('2023-04-01T09:00:00Z') },
  },
  {
    id: 'evt-2',
    type: 'PROFILE_CREATED',
    title: 'Profile created',
    description: 'Employee profile was created in the system.',
    actorId: 'system',
    actorRole: 'hr',
    timestamp: { toDate: () => new Date('2023-04-01T09:05:00Z') },
  },
  {
    id: 'evt-3',
    type: 'DOCUMENT_UPLOADED',
    title: 'Document uploaded',
    description: '"Offer Letter.pdf" was uploaded under Offer Letter.',
    actorId: 'system',
    actorRole: 'employee',
    timestamp: { toDate: () => new Date('2023-04-01T10:20:00Z') },
  },
  {
    id: 'evt-4',
    type: 'PROFILE_UPDATED',
    title: 'Profile updated',
    description: 'Updated: phone, address.',
    actorId: 'system',
    actorRole: 'employee',
    timestamp: { toDate: () => new Date('2023-06-15T14:00:00Z') },
  },
  {
    id: 'evt-5',
    type: 'SALARY_UPDATED',
    title: 'Salary structure updated',
    description: 'Compensation structure was updated by HR.',
    actorId: 'system',
    actorRole: 'hr',
    timestamp: { toDate: () => new Date('2024-04-01T10:00:00Z') },
  },
];

export const MOCK_ATTENDANCE_SUMMARY = {
  present: 22,
  absent: 2,
  halfDay: 1,
  late: 3,
  total: 25,
  percentage: 90,
};

export const MOCK_LEAVE_HISTORY = [
  {
    id: 'leave-1',
    leaveType: 'Casual Leave',
    startDate: '2024-11-04',
    endDate: '2024-11-05',
    duration: 2,
    status: 'approved',
    reason: 'Personal work',
  },
  {
    id: 'leave-2',
    leaveType: 'Sick Leave',
    startDate: '2024-09-18',
    endDate: '2024-09-18',
    duration: 1,
    status: 'approved',
    reason: 'Medical appointment',
  },
  {
    id: 'leave-3',
    leaveType: 'Earned Leave',
    startDate: '2024-07-22',
    endDate: '2024-07-26',
    duration: 5,
    status: 'approved',
    reason: 'Annual vacation',
  },
];
