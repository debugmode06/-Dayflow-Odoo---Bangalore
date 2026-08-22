import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import {
  safeNum,
  calculateAllowancesBreakdown,
  calculateDeductionsBreakdown,
  calculateGrossSalary,
  calculateNetSalary,
} from '../lib/calculations';
import '../styles/payroll.css';

export const SalaryEditor = ({ record, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    basicSalary: 0,
    hra: 0,
    transport: 0,
    medical: 0,
    bonus: 0,
    otherAllowance: 0,
    tax: 0,
    pf: 0,
    insurance: 0,
    otherDeductions: 0,
    status: 'PAID',
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form when a record is selected or modal opens
  useEffect(() => {
    if (record && isOpen) {
      setFormData({
        basicSalary: record.basicSalary || 0,
        hra: record.hra || 0,
        transport: record.transport || 0,
        medical: record.medical || 0,
        bonus: record.bonus || 0,
        otherAllowance: record.otherAllowance || record.allowances || 0,
        tax: record.tax || 0,
        pf: record.pf || 0,
        insurance: record.insurance || 0,
        otherDeductions: record.otherDeductions || record.deductions || 0,
        status: record.status || 'PAID',
      });
      setErrors({});
    }
  }, [record, isOpen]);

  // Derived live preview calculations
  const totalAllowances =
    safeNum(formData.hra) +
    safeNum(formData.transport) +
    safeNum(formData.medical) +
    safeNum(formData.bonus) +
    safeNum(formData.otherAllowance);

  const totalDeductions =
    safeNum(formData.tax) +
    safeNum(formData.pf) +
    safeNum(formData.insurance) +
    safeNum(formData.otherDeductions);

  const liveGrossSalary = calculateGrossSalary(formData.basicSalary, totalAllowances);
  const liveNetSalary = calculateNetSalary(formData.basicSalary, totalAllowances, totalDeductions);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: record?.currency || 'USD',
    }).format(safeNum(val));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'status') {
      setFormData((prev) => ({ ...prev, status: value }));
      return;
    }

    const val = value === '' ? '' : Math.max(0, Number(value));

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (formData.basicSalary === '' || Number(formData.basicSalary) < 0) {
      newErrors.basicSalary = 'Basic salary cannot be negative.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    try {
      const updatedData = {
        basicSalary: safeNum(formData.basicSalary),
        hra: safeNum(formData.hra),
        transport: safeNum(formData.transport),
        medical: safeNum(formData.medical),
        bonus: safeNum(formData.bonus),
        otherAllowance: safeNum(formData.otherAllowance),
        allowances: totalAllowances,
        tax: safeNum(formData.tax),
        pf: safeNum(formData.pf),
        insurance: safeNum(formData.insurance),
        otherDeductions: safeNum(formData.otherDeductions),
        deductions: totalDeductions,
        grossSalary: liveGrossSalary,
        netSalary: liveNetSalary,
        status: formData.status,
      };

      await onSave(record.id, updatedData);
      onClose();
    } catch (error) {
      console.error('Save failed', error);
      setErrors({ submit: error.message || 'Failed to save salary changes. Please check permissions.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !record) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px', width: '100%' }} role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Edit Salary & Payroll Structure</h2>
            <p className="text-sm text-slate-500 mt-1">
              {record.employeeName} ({record.department}) — {record.employeeId || 'EMP-1001'}
            </p>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          <form id="salary-form" onSubmit={handleSubmit}>
            {/* Status Workflow Selector */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Payroll Status Workflow</label>
              <select
                name="status"
                className="form-input"
                value={formData.status}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              >
                <option value="DRAFT">DRAFT — Initial Preparation</option>
                <option value="CALCULATED">CALCULATED — Allowances & Tax Derived</option>
                <option value="APPROVED">APPROVED — HR Authorization Granted</option>
                <option value="PAID">PAID — Disbursement Completed</option>
              </select>
            </div>

            {/* Basic Salary */}
            <div className="form-group">
              <label className="form-label" htmlFor="basicSalary">Base Salary</label>
              <div className="form-input-wrapper">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  id="basicSalary"
                  name="basicSalary"
                  className={`form-input ${errors.basicSalary ? 'border-red-500' : ''}`}
                  value={formData.basicSalary}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.basicSalary && <div className="form-error">{errors.basicSalary}</div>}
            </div>

            {/* Allowances Section */}
            <div style={{ marginTop: '16px', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px', color: '#16a34a' }}>
              + ALLOWANCES
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="hra">HRA (Housing)</label>
                <input
                  type="number"
                  id="hra"
                  name="hra"
                  className="form-input"
                  value={formData.hra}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="transport">Transport</label>
                <input
                  type="number"
                  id="transport"
                  name="transport"
                  className="form-input"
                  value={formData.transport}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="medical">Medical</label>
                <input
                  type="number"
                  id="medical"
                  name="medical"
                  className="form-input"
                  value={formData.medical}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="bonus">Bonus</label>
                <input
                  type="number"
                  id="bonus"
                  name="bonus"
                  className="form-input"
                  value={formData.bonus}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>

            {/* Deductions Section */}
            <div style={{ marginTop: '16px', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px', color: '#dc2626' }}>
              - DEDUCTIONS
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="tax">Income Tax</label>
                <input
                  type="number"
                  id="tax"
                  name="tax"
                  className="form-input"
                  value={formData.tax}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="pf">Provident Fund (PF)</label>
                <input
                  type="number"
                  id="pf"
                  name="pf"
                  className="form-input"
                  value={formData.pf}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="insurance">Health Insurance</label>
                <input
                  type="number"
                  id="insurance"
                  name="insurance"
                  className="form-input"
                  value={formData.insurance}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="otherDeductions">Other Deductions</label>
                <input
                  type="number"
                  id="otherDeductions"
                  name="otherDeductions"
                  className="form-input"
                  value={formData.otherDeductions}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>
          </form>

          {/* Real-time Calculation Summary Box */}
          <div className="preview-box" style={{ marginTop: '20px' }}>
            <div className="preview-row">
              <span>Basic Salary</span>
              <span>{formatCurrency(formData.basicSalary)}</span>
            </div>
            <div className="preview-row">
              <span>Total Allowances</span>
              <span className="text-emerald-600">+{formatCurrency(totalAllowances)}</span>
            </div>
            <div className="preview-row">
              <span>Gross Salary</span>
              <span style={{ fontWeight: '600' }}>{formatCurrency(liveGrossSalary)}</span>
            </div>
            <div className="preview-row">
              <span>Total Deductions</span>
              <span className="text-rose-600">-{formatCurrency(totalDeductions)}</span>
            </div>
            <div className="preview-row-total">
              <span>Net Take-Home Pay</span>
              <span className="text-indigo-600">{formatCurrency(liveNetSalary)}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose} disabled={isSaving}>
            Cancel
          </button>
          <button type="submit" form="salary-form" className="btn-save" disabled={isSaving}>
            {isSaving ? (
              <span className="flex items-center">
                <Loader2 size={16} className="animate-spin mr-2" /> Saving...
              </span>
            ) : (
              'Save & Update Salary'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
