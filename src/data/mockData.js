// Realistic Indian enterprise data for Dayflow HRMS fallback

export const mockUsers = [
  {
    uid: "EMP1001",
    email: "mohan@dayflow.demo",
    // Real email aliases — any of these can be used to log in
    emailAliases: ["mr.mohan.s143@gmail.com", "mohan@dayflow.demo"],
    role: "employee",
    employeeId: "EMP-1001",
    firstName: "Mohan",
    lastName: "S",
    name: "Mohan S",
    department: "Engineering",
    designation: "Software Developer",
    phone: "+91 98765 43210",
    status: "active",
    joiningDate: "2026-06-10",
    managerId: "HR1001",
    photoUrl: null
  },
  {
    uid: "HR1001",
    email: "hr@dayflow.demo",
    role: "hr",
    employeeId: "HR-1001",
    firstName: "Priya",
    lastName: "Sharma",
    name: "Priya Sharma",
    department: "Human Resources",
    designation: "HR Manager",
    phone: "+91 98765 43211",
    status: "active",
    joiningDate: "2024-01-15",
    managerId: null,
    photoUrl: null
  },
  {
    uid: "EMP1002",
    email: "vikram@dayflow.demo",
    role: "employee",
    employeeId: "EMP-1002",
    firstName: "Vikram",
    lastName: "Singh",
    name: "Vikram Singh",
    department: "Sales",
    designation: "Sales Executive",
    phone: "+91 98765 43212",
    status: "active",
    joiningDate: "2025-03-20",
    managerId: "HR1001",
    photoUrl: null
  }
];

export const mockLeaves = [
  {
    id: "LEAVE-001",
    userId: "EMP1001",
    userName: "Mohan S",
    type: "Vacation",
    startDate: "2026-09-01",
    endDate: "2026-09-03",
    duration: 3,
    reason: "Family trip to Kerala",
    status: "approved",
    createdAt: new Date().toISOString()
  },
  {
    id: "LEAVE-002",
    userId: "EMP1002",
    userName: "Vikram Singh",
    type: "Sick",
    startDate: "2026-08-20",
    endDate: "2026-08-21",
    duration: 2,
    reason: "Viral fever",
    status: "approved",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

export const mockAttendance = [
  {
    id: "ATT-001",
    userId: "EMP1001",
    date: new Date().toISOString().split('T')[0],
    checkIn: "09:05:00",
    checkOut: null,
    status: "present",
    workingHours: 0
  },
  {
    id: "ATT-002",
    userId: "EMP1002",
    date: new Date().toISOString().split('T')[0],
    checkIn: "09:45:00",
    checkOut: null,
    status: "late",
    workingHours: 0
  }
];

export const mockPayroll = [
  {
    id: "PAY-001",
    userId: "EMP1001",
    month: "August 2026",
    basicSalary: 60000,
    allowances: 15000,
    deductions: 4500,
    netSalary: 70500,
    status: "processed",
    payDate: "2026-08-31"
  }
];

export const mockAnnouncements = [
  {
    id: "ANN-001",
    title: "Diwali Bonus Announcement",
    description: "The management is pleased to announce a performance bonus for all active employees this Diwali.",
    priority: "high",
    targetAudience: "All Employees",
    createdAt: new Date().toISOString(),
    author: "HR Department"
  },
  {
    id: "ANN-002",
    title: "Q3 Townhall Meeting",
    description: "Join us for the Q3 virtual townhall this Friday at 4 PM.",
    priority: "normal",
    targetAudience: "All Employees",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    author: "Management"
  }
];

export const mockNotifications = [
  {
    id: "NOTIF-001",
    userId: "EMP1001",
    title: "Leave Approved",
    message: "Your vacation request for Sep 1 to Sep 3 has been approved.",
    type: "leave",
    isRead: false,
    createdAt: new Date().toISOString()
  }
];

export const initialMockState = {
  users: mockUsers,
  leaves: mockLeaves,
  attendance: mockAttendance,
  payroll: mockPayroll,
  announcements: mockAnnouncements,
  notifications: mockNotifications
};
