import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { calculatePayrollRecord } from '../utils/payrollCalculations';

class PayrollService {
  /**
   * Seeds sample payroll records for a given user UID into Firestore.
   */
  async seedSamplePayrollData(userId, userEmail = 'employee@dayflow.hr') {
    if (!userId) return [];
    try {
      const payrollRef = collection(db, 'payroll');
      const samplePeriods = [
        { period: '2026-08', periodLabel: 'August 2026', basicSalary: 75000, hra: 15000, transport: 4000, medical: 3000, bonus: 8000, tax: 9000, pf: 4500, insurance: 2000, status: 'PAID', currency: 'INR' },
        { period: '2026-07', periodLabel: 'July 2026', basicSalary: 75000, hra: 15000, transport: 4000, medical: 3000, bonus: 4000, tax: 9000, pf: 4500, insurance: 2000, status: 'PAID', currency: 'INR' },
        { period: '2026-06', periodLabel: 'June 2026', basicSalary: 72000, hra: 14400, transport: 4000, medical: 3000, bonus: 0, tax: 8500, pf: 4320, insurance: 2000, status: 'PAID', currency: 'INR' },
      ];

      const created = [];
      for (const item of samplePeriods) {
        const docRef = await addDoc(payrollRef, {
          userId,
          userEmail,
          employeeId: 'EMP-1001',
          employeeName: 'Sarah Jenkins',
          department: 'Engineering',
          designation: 'Senior Software Engineer',
          currency: 'INR',
          ...item,
          totalAllowances: item.hra + item.transport + item.medical + item.bonus,
          totalDeductions: item.tax + item.pf + item.insurance,
          grossSalary: item.basicSalary + item.hra + item.transport + item.medical + item.bonus,
          netSalary: item.basicSalary + item.hra + item.transport + item.medical + item.bonus - (item.tax + item.pf + item.insurance),
          createdAt: serverTimestamp(),
        });
        created.push(calculatePayrollRecord({ id: docRef.id, userId, ...item }));
      }
      return created;
    } catch (err) {
      console.warn('Auto-seeding sample payroll data failed:', err.message);
      return [];
    }
  }

  /**
   * Fetches all payroll records for HR/Admin, optionally filtered by period.
   */
  async getPayrollData(period = null) {
    try {
      const payrollRef = collection(db, 'payroll');
      const constraints = [];
      if (period) {
        constraints.push(where('period', '==', period));
      }
      const q = constraints.length > 0 ? query(payrollRef, ...constraints) : payrollRef;
      let snapshot = await getDocs(q);

      if (snapshot.empty) {
        const sampleDepts = [
          { employeeId: 'EMP-1001', employeeName: 'Sarah Jenkins', department: 'Engineering', designation: 'Senior Software Engineer', basicSalary: 75000, hra: 15000, transport: 4000, medical: 3000, bonus: 8000, tax: 9000, pf: 4500, insurance: 2000, status: 'PAID', currency: 'INR' },
          { employeeId: 'EMP-1002', employeeName: 'Marcus Vance', department: 'Product', designation: 'Product Manager', basicSalary: 85000, hra: 17000, transport: 4000, medical: 3000, bonus: 10000, tax: 11000, pf: 5100, insurance: 2000, status: 'APPROVED', currency: 'INR' },
          { employeeId: 'EMP-1003', employeeName: 'Elena Rostova', department: 'Design', designation: 'Lead UI/UX Designer', basicSalary: 70000, hra: 14000, transport: 4000, medical: 3000, bonus: 5000, tax: 8000, pf: 4200, insurance: 2000, status: 'CALCULATED', currency: 'INR' },
          { employeeId: 'EMP-1004', employeeName: 'David Kim', department: 'Marketing', designation: 'Growth Specialist', basicSalary: 62000, hra: 12400, transport: 4000, medical: 3000, bonus: 3000, tax: 7000, pf: 3720, insurance: 2000, status: 'DRAFT', currency: 'INR' },
        ];

        const targetPeriod = period || '2026-08';
        for (const item of sampleDepts) {
          await addDoc(payrollRef, {
            userId: item.employeeId,
            period: targetPeriod,
            periodLabel: 'August 2026',
            currency: 'INR',
            ...item,
            totalAllowances: item.hra + item.transport + item.medical + item.bonus,
            totalDeductions: item.tax + item.pf + item.insurance,
            grossSalary: item.basicSalary + item.hra + item.transport + item.medical + item.bonus,
            netSalary: item.basicSalary + item.hra + item.transport + item.medical + item.bonus - (item.tax + item.pf + item.insurance),
            createdAt: serverTimestamp(),
          });
        }
        snapshot = await getDocs(q);
      }

      const payrollData = [];
      snapshot.forEach((docSnap) => {
        const rawData = docSnap.data();
        payrollData.push(calculatePayrollRecord({ id: docSnap.id, ...rawData }));
      });

      return payrollData;
    } catch (error) {
      console.error('Error fetching payroll data:', error);
      throw error;
    }
  }

  /**
   * Fetches an individual employee's payroll records for request.auth.uid securely.
   */
  async getEmployeePayroll(userId, period = null) {
    if (!userId) throw new Error('User ID required for employee payroll query');
    try {
      const payrollRef = collection(db, 'payroll');
      const constraints = [where('userId', '==', userId)];
      if (period) {
        constraints.push(where('period', '==', period));
      }
      const q = query(payrollRef, ...constraints);
      let snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Auto-seed sample records for this authenticated user so UI displays sample statement
        const seeded = await this.seedSamplePayrollData(userId);
        if (seeded.length > 0) {
          const filtered = period ? seeded.filter((r) => r.period === period) : seeded;
          if (filtered.length > 0) return filtered;
        }
      }

      const records = [];
      snapshot.forEach((docSnap) => {
        records.push(calculatePayrollRecord({ id: docSnap.id, ...docSnap.data() }));
      });

      return records;
    } catch (error) {
      console.error('Error fetching employee payroll:', error);
      throw error;
    }
  }

  /**
   * Updates an employee's salary record in Firestore and appends an audit log.
   */
  async updateSalaryRecord(recordId, updatedData, updatedBy = 'HR_ADMIN') {
    try {
      const recordRef = doc(db, 'payroll', recordId);
      const payload = {
        ...updatedData,
        updatedAt: serverTimestamp(),
        updatedBy,
      };

      await updateDoc(recordRef, payload);

      // Audit Log Subcollection
      try {
        const auditRef = collection(db, `payroll/${recordId}/auditLog`);
        await addDoc(auditRef, {
          event: 'SALARY_MODIFIED',
          performedBy: updatedBy,
          performedAt: serverTimestamp(),
          details: 'Salary structure updated by HR Admin',
          changes: updatedData,
        });
      } catch (auditErr) {
        console.warn('Audit log write skipped:', auditErr.message);
      }

      return true;
    } catch (error) {
      console.error('Error updating salary record:', error);
      throw error;
    }
  }

  /**
   * Transition payroll status workflow (DRAFT -> CALCULATED -> APPROVED -> PAID).
   */
  async updatePayrollStatus(recordId, newStatus, performedBy = 'HR_ADMIN') {
    try {
      const recordRef = doc(db, 'payroll', recordId);
      const updatePayload = {
        status: newStatus,
        updatedAt: serverTimestamp(),
        updatedBy: performedBy,
      };

      if (newStatus === 'APPROVED') {
        updatePayload.approvedAt = serverTimestamp();
        updatePayload.approvedBy = performedBy;
      } else if (newStatus === 'PAID') {
        updatePayload.paidAt = serverTimestamp();
        updatePayload.paidBy = performedBy;
      }

      await updateDoc(recordRef, updatePayload);
      return true;
    } catch (error) {
      console.error('Error updating payroll status:', error);
      throw error;
    }
  }
}

export const payrollService = new PayrollService();
