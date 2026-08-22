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
      // Assuming attendance is stored with a date field or timestamp
      const attendanceRef = collection(db, 'attendance');
      // Note: A composite index might be needed depending on the real query structure, 
      // but for this example we'll fetch today's attendance.
      // If we don't have indexes, we can just fetch all and filter client side if small,
      // or assume a date string format like 'YYYY-MM-DD'.
      const todayString = today.toISOString().split('T')[0];
      const attendanceQuery = query(attendanceRef, where('date', '==', todayString));
      const attendanceSnapshot = await getDocs(attendanceQuery);
      
      let presentToday = 0;
      let absentToday = 0;
      const attendanceAlerts = [];
      const attendanceRecords = [];

      attendanceSnapshot.forEach(doc => {
        const data = doc.data();
        attendanceRecords.push({ id: doc.id, ...data });
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
          const startDate = data.startDate ? new Date(data.startDate) : null;
          const endDate = data.endDate ? new Date(data.endDate) : null;
          
          if (startDate && endDate) {
            // Strip time for accurate day comparison
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            
            if (today >= startDate && today <= endDate) {
              onLeaveToday++;
              leavesToday.push({ id: doc.id, ...data });
            }
          }
        }
      });

      // Fallback calculation for absent if not explicitly marked in attendance
      // Total = Present + OnLeave + Absent (Wait, absent might be unmarked people)
      // If the attendance collection only stores 'Present', then Absent = Total - Present - OnLeave.
      // But we will rely on explicit absent count + (total - present - onLeave) if we want a full picture.
      const accountedFor = presentToday + onLeaveToday + absentToday;
      if (accountedFor < totalEmployees) {
        // Assume people who haven't checked in and aren't on leave are absent
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
        // Raw arrays for Workforce Pulse
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
