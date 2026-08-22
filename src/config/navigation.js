import {
  LayoutDashboard,
  UserCheck,
  Clock,
  CalendarDays,
  CreditCard,
  Activity,
  Users,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export const EMPLOYEE_NAV_ITEMS = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'My Profile (360°)',
    path: '/profile',
    icon: UserCheck,
  },
  {
    title: 'Attendance',
    path: '/attendance',
    icon: Clock,
  },
  {
    title: 'Leave & Time-Off',
    path: '/leave',
    icon: CalendarDays,
  },
  {
    title: 'My Payroll',
    path: '/payroll',
    icon: CreditCard,
  },
];

export const HR_NAV_ITEMS = [
  {
    title: 'HR Command Center',
    path: '/hr/dashboard',
    icon: ShieldCheck,
  },
  {
    title: 'Employee Directory',
    path: '/hr/employees',
    icon: Users,
  },
  {
    title: 'Attendance Monitor',
    path: '/hr/attendance',
    icon: Clock,
  },
  {
    title: 'Leave Approvals',
    path: '/hr/leave',
    icon: CalendarDays,
  },
  {
    title: 'Payroll Control',
    path: '/hr/payroll',
    icon: CreditCard,
  },
  {
    title: 'Workforce Pulse',
    path: '/hr/workforce-pulse',
    icon: Activity,
  },
];
