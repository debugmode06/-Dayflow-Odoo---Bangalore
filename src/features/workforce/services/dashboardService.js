import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../config/firebase';

class DashboardService {
  /**
   * Fetches workforce dashboard statistics
   */
  async getDashboardStats() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Fetch all employees to get the total count and check for incomplete profiles
      const employeesRef = collection(db, 'employees');
      const employeesSnapshot = await getDocs(employeesRef);
      const totalEmployees = employeesSnapshot.size;

      const employees = [];
      const incompleteProfiles = [];
      employeesSnapshot.forEach(doc => {
        const data = doc.data();
        employees.push({ id: doc.id, ...data });
        if (!data.department || !data.designation || !data.email) {
          incompleteProfiles.push({ id: doc.id, name: data.name || 'Unknown Employee', ...data });
        }
      });

      // Fetch today's attendance
      const attendanceRef = collection(db, 'attendance');
      const attendanceSnapshot = await getDocs(attendanceRef);
      
      let presentToday = 0;
      let absentToday = 0;
      const attendanceAlerts = [];
      const attendanceRecords = [];

      // Helper to handle both Firebase Timestamp and ISO strings safely
      const parseDate = (val) => {
        if (!val) return null;
        if (typeof val.toDate === 'function') return val.toDate();
        return new Date(val);
      };

      const isSameDay = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
      };

      attendanceSnapshot.forEach(doc => {
        const data = doc.data();
        const attendanceDate = parseDate(data.date);
        
        if (attendanceDate && isSameDay(attendanceDate, today)) {
          if (data.status === 'Present') {
            presentToday++;
            if (data.checkInTime && data.late) {
              attendanceAlerts.push({ id: doc.id, message: `${data.employeeName || 'An employee'} arrived late.` });
            }
          } else if (data.status === 'Absent') {
            absentToday++;
            if (!data.excused) {
              attendanceAlerts.push({ id: doc.id, message: `${data.employeeName || 'An employee'} is absent without leave.` });
            }
          }
        }
      });

      // Fetch today's leaves (and pending leaves)
      const leavesRef = collection(db, 'leaves');
      const leavesSnapshot = await getDocs(leavesRef);
      
      let onLeaveToday = 0;
      const pendingLeaveRequests = [];
      const leavesToday = [];

      leavesSnapshot.forEach(doc => {
        const data = doc.data();
        // Check if leave is pending
        if (data.status === 'Pending') {
          pendingLeaveRequests.push({ id: doc.id, employeeName: data.employeeName || 'Unknown', type: data.type || 'Leave', ...data });
        }
        
        // Check if on leave today
        if (data.status === 'Approved') {
          const startDate = parseDate(data.fromDate);
          const endDate = parseDate(data.toDate);
          
          if (startDate && endDate) {
            // Strip time for accurate day comparison
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            const todayStripped = new Date(today);
            todayStripped.setHours(0, 0, 0, 0);
            
            if (todayStripped >= startDate && todayStripped <= endDate) {
              onLeaveToday++;
              leavesToday.push({ id: doc.id, ...data });
            }
          }
        }
      });

      const accountedFor = presentToday + onLeaveToday + absentToday;
      if (accountedFor < totalEmployees) {
        absentToday += (totalEmployees - accountedFor);
      }

      const totalAccountedPercentage = totalEmployees > 0 
        ? Math.round(((presentToday + onLeaveToday) / totalEmployees) * 100) 
        : 0;

      return {
        totalEmployees,
        presentToday,
        absentToday,
        onLeaveToday,
        totalAccountedPercentage,
        pendingLeaveRequests,
        attendanceAlerts,
        incompleteProfiles,
        employees,
        attendanceRecords,
        leavesToday
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
