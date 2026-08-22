/**
 * Calculates the net salary based on basic salary, allowances, and deductions.
 * 
 * @param {number} basicSalary - The base salary amount.
 * @param {number} allowances - The total allowances amount.
 * @param {number} deductions - The total deductions amount.
 * @returns {number} The calculated net salary.
 */
export const calculateNetSalary = (basicSalary = 0, allowances = 0, deductions = 0) => {
  const basic = Number(basicSalary) || 0;
  const allow = Number(allowances) || 0;
  const deduct = Number(deductions) || 0;
  
  const net = basic + allow - deduct;
  
  return net > 0 ? net : 0;
};
