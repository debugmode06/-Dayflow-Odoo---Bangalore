import { collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';

class PayrollService {
  /**
   * Fetches all payroll records.
   */
  async getPayrollData() {
    try {
      const payrollRef = collection(db, 'payroll');
      const snapshot = await getDocs(payrollRef);
      
      const payrollData = [];
      snapshot.forEach(doc => {
        payrollData.push({ id: doc.id, ...doc.data() });
      });
      
      return payrollData;
    } catch (error) {
      console.error('Error fetching payroll data:', error);
      throw error;
    }
  }

  /**
   * Updates an employee's salary record in Firestore.
   */
  async updateSalaryRecord(recordId, { basicSalary, allowances, deductions, netSalary }) {
    try {
      const recordRef = doc(db, 'payroll', recordId);
      await updateDoc(recordRef, {
        basicSalary: Number(basicSalary),
        allowances: Number(allowances),
        deductions: Number(deductions),
        netSalary: Number(netSalary),
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Error updating salary record:', error);
      throw error;
    }
  }
}

export const payrollService = new PayrollService();
