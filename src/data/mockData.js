// Realistic Indian enterprise data for OdooSphere HRMS fallback

export const mockUsers = [
  {
    uid: "EMP1001", email: "mohan@odoosphere.demo", emailAliases: ["mr.mohan.s143@gmail.com", "mohan@odoosphere.demo"],
    role: "employee", employeeId: "EMP-1001", firstName: "Mohan", lastName: "S", name: "Mohan S",
    department: "Engineering", designation: "Senior Software Developer", location: "Bangalore",
    phone: "+91 98765 43210", status: "active", joiningDate: "2024-06-10", managerId: "HR1001",
    profileHealth: 95, profileMissing: [], photoUrl: null, attendanceHealth: 92, leaveBalance: 12, leaveUsed: 4, type: "Full-time"
  },
  {
    uid: "HR1001", email: "hr@odoosphere.demo", role: "hr", employeeId: "HR-1001",
    firstName: "Priya", lastName: "Sharma", name: "Priya Sharma",
    department: "Human Resources", designation: "HR Manager", location: "Mumbai",
    phone: "+91 98765 43211", status: "active", joiningDate: "2023-01-15", managerId: null,
    profileHealth: 100, profileMissing: [], photoUrl: null, attendanceHealth: 98, leaveBalance: 18, leaveUsed: 2, type: "Full-time"
  },
  {
    uid: "EMP1002", email: "vikram@odoosphere.demo", role: "employee", employeeId: "EMP-1002",
    firstName: "Vikram", lastName: "Singh", name: "Vikram Singh",
    department: "Sales", designation: "Sales Executive", location: "Delhi",
    phone: "+91 98765 43212", status: "active", joiningDate: "2025-03-20", managerId: "HR1001",
    profileHealth: 100, profileMissing: [], photoUrl: null, attendanceHealth: 88, leaveBalance: 8, leaveUsed: 6, type: "Full-time"
  },
  {
    uid: "EMP1003", email: "neha.patel@odoosphere.demo", role: "employee", employeeId: "EMP-1003",
    firstName: "Neha", lastName: "Patel", name: "Neha Patel",
    department: "Product", designation: "Product Manager", location: "Bangalore",
    phone: "+91 98765 43213", status: "on-leave", joiningDate: "2022-11-05", managerId: "EMP1001",
    profileHealth: 100, profileMissing: [], photoUrl: null, attendanceHealth: 95, leaveBalance: 4, leaveUsed: 14, type: "Full-time"
  },
  {
    uid: "EMP1004", email: "arjun.rao@odoosphere.demo", role: "employee", employeeId: "EMP-1004",
    firstName: "Arjun", lastName: "Rao", name: "Arjun Rao",
    department: "Engineering", designation: "Frontend Engineer", location: "Hyderabad",
    phone: "+91 98765 43214", status: "probation", joiningDate: "2026-07-15", managerId: "EMP1001",
    profileHealth: 65, profileMissing: ["Emergency Contact", "Bank Details"], photoUrl: null, attendanceHealth: 100, leaveBalance: 2, leaveUsed: 0, type: "Contract"
  },
  {
    uid: "EMP1005", email: "ananya.d@odoosphere.demo", role: "employee", employeeId: "EMP-1005",
    firstName: "Ananya", lastName: "Desai", name: "Ananya Desai",
    department: "Marketing", designation: "Marketing Specialist", location: "Mumbai",
    phone: "+91 98765 43215", status: "active", joiningDate: "2024-02-10", managerId: "HR1001",
    profileHealth: 100, profileMissing: [], photoUrl: null, attendanceHealth: 91, leaveBalance: 15, leaveUsed: 3, type: "Full-time"
  },
  {
    uid: "EMP1006", email: "rahul.v@odoosphere.demo", role: "employee", employeeId: "EMP-1006",
    firstName: "Rahul", lastName: "Verma", name: "Rahul Verma",
    department: "Engineering", designation: "DevOps Engineer", location: "Bangalore",
    phone: "+91 98765 43216", status: "active", joiningDate: "2026-08-01", managerId: "EMP1001",
    profileHealth: 80, profileMissing: ["ID Document"], photoUrl: null, attendanceHealth: 99, leaveBalance: 1, leaveUsed: 0, type: "Full-time"
  },
  {
    uid: "EMP1007", email: "meera.k@odoosphere.demo", role: "employee", employeeId: "EMP-1007",
    firstName: "Meera", lastName: "Kapoor", name: "Meera Kapoor",
    department: "Design", designation: "Lead UI/UX Designer", location: "Pune",
    phone: "+91 98765 43217", status: "notice-period", joiningDate: "2021-05-18", managerId: "EMP1003",
    profileHealth: 100, profileMissing: [], photoUrl: null, attendanceHealth: 78, leaveBalance: 0, leaveUsed: 22, type: "Full-time"
  },
  {
    uid: "EMP1008", email: "karan.m@odoosphere.demo", role: "employee", employeeId: "EMP-1008",
    firstName: "Karan", lastName: "Malhotra", name: "Karan Malhotra",
    department: "Sales", designation: "Account Executive", location: "Delhi",
    phone: "+91 98765 43218", status: "inactive", joiningDate: "2023-09-12", managerId: "EMP1002",
    profileHealth: 100, profileMissing: [], photoUrl: null, attendanceHealth: 0, leaveBalance: 0, leaveUsed: 0, type: "Full-time"
  },
  {
    uid: "EMP1009", email: "sneha.iyer@odoosphere.demo", role: "employee", employeeId: "EMP-1009",
    firstName: "Sneha", lastName: "Iyer", name: "Sneha Iyer",
    department: "Engineering", designation: "QA Engineer", location: "Chennai",
    phone: "+91 98765 43219", status: "active", joiningDate: "2025-11-20", managerId: "EMP1001",
    profileHealth: 90, profileMissing: ["Tax Declaration"], photoUrl: null, attendanceHealth: 96, leaveBalance: 14, leaveUsed: 5, type: "Full-time"
  },
  {
    uid: "EMP1010", email: "rohit.s@odoosphere.demo", role: "employee", employeeId: "EMP-1010",
    firstName: "Rohit", lastName: "Sinha", name: "Rohit Sinha",
    department: "Finance", designation: "Financial Analyst", location: "Mumbai",
    phone: "+91 98765 43220", status: "active", joiningDate: "2024-04-05", managerId: "HR1001",
    profileHealth: 100, profileMissing: [], photoUrl: null, attendanceHealth: 98, leaveBalance: 20, leaveUsed: 1, type: "Full-time"
  },
  {
    uid: "EMP1011", email: "divya.n@odoosphere.demo", role: "employee", employeeId: "EMP-1011",
    firstName: "Divya", lastName: "Nair", name: "Divya Nair",
    department: "Human Resources", designation: "Talent Acquisition", location: "Bangalore",
    phone: "+91 98765 43221", status: "probation", joiningDate: "2026-08-10", managerId: "HR1001",
    profileHealth: 50, profileMissing: ["Emergency Contact", "Bank Details", "Aadhar Card"], photoUrl: null, attendanceHealth: 100, leaveBalance: 0, leaveUsed: 0, type: "Full-time"
  },
  {
    uid: "EMP1012", email: "sanjay.g@odoosphere.demo", role: "employee", employeeId: "EMP-1012",
    firstName: "Sanjay", lastName: "Gupta", name: "Sanjay Gupta",
    department: "Operations", designation: "Operations Head", location: "Delhi",
    phone: "+91 98765 43222", status: "active", joiningDate: "2020-01-10", managerId: null,
    profileHealth: 100, profileMissing: [], photoUrl: null, attendanceHealth: 94, leaveBalance: 25, leaveUsed: 10, type: "Full-time"
  },
  {
    uid: "EMP1013", email: "amit.kumar@odoosphere.demo", role: "employee", employeeId: "EMP-1013",
    firstName: "Amit", lastName: "Kumar", name: "Amit Kumar",
    department: "Engineering", designation: "Backend Engineer", location: "Pune",
    phone: "+91 98765 43223", status: "suspended", joiningDate: "2023-06-15", managerId: "EMP1001",
    profileHealth: 100, profileMissing: [], photoUrl: null, attendanceHealth: 40, leaveBalance: 5, leaveUsed: 15, type: "Full-time"
  },
  {
    uid: "EMP1014", email: "pooja.c@odoosphere.demo", role: "employee", employeeId: "EMP-1014",
    firstName: "Pooja", lastName: "Chawla", name: "Pooja Chawla",
    department: "Design", designation: "Graphic Designer", location: "Bangalore",
    phone: "+91 98765 43224", status: "active", joiningDate: "2026-07-22", managerId: "EMP1007",
    profileHealth: 85, profileMissing: ["Address Proof"], photoUrl: null, attendanceHealth: 97, leaveBalance: 1, leaveUsed: 1, type: "Full-time"
  },
  {
    uid: "EMP1015", email: "tarun.b@odoosphere.demo", role: "employee", employeeId: "EMP-1015",
    firstName: "Tarun", lastName: "Bhatia", name: "Tarun Bhatia",
    department: "Sales", designation: "Business Development", location: "Mumbai",
    phone: "+91 98765 43225", status: "terminated", joiningDate: "2022-08-11", managerId: "EMP1002",
    profileHealth: 100, profileMissing: [], photoUrl: null, attendanceHealth: 0, leaveBalance: 0, leaveUsed: 0, type: "Contract"
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
