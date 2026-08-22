import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { calculateNetSalary } from '../lib/calculations';
import '../styles/payroll.css';

export const SalaryEditor = ({ record, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    basicSalary: 0,
    allowances: 0,
    deductions: 0
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form when a record is selected or modal opens
  useEffect(() => {
    if (record && isOpen) {
      setFormData({
        basicSalary: record.basicSalary || 0,
        allowances: record.allowances || 0,
        deductions: record.deductions || 0
      });
      setErrors({});
    }
  }, [record, isOpen]);

  // Derived live preview
  const liveNetSalary = calculateNetSalary(
    formData.basicSalary,
    formData.allowances,
    formData.deductions
  );

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: record?.currency || 'USD'
    }).format(val || 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Allow empty string for backspacing, otherwise parse float
    const val = value === '' ? '' : Number(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (formData.basicSalary === '' || Number(formData.basicSalary) < 0) {
      newErrors.basicSalary = 'Basic salary cannot be negative.';
    }
    if (formData.allowances === '' || Number(formData.allowances) < 0) {
      newErrors.allowances = 'Allowances cannot be negative.';
    }
    if (formData.deductions === '' || Number(formData.deductions) < 0) {
      newErrors.deductions = 'Deductions cannot be negative.';
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
        basicSalary: Number(formData.basicSalary),
        allowances: Number(formData.allowances),
        deductions: Number(formData.deductions),
        netSalary: liveNetSalary
      };
      
      await onSave(record.id, updatedData);
      onClose(); // Close modal on success
    } catch (error) {
      console.error('Save failed', error);
      setErrors({ submit: 'Failed to save changes. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !record) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" role="dialog" aria-modal="true">
        
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Edit Salary Details</h2>
            <p className="text-sm text-slate-500 mt-1">{record.employeeName} ({record.department})</p>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          <form id="salary-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="basicSalary">Basic Salary</label>
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

            <div className="form-group">
              <label className="form-label" htmlFor="allowances">Allowances</label>
              <div className="form-input-wrapper">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  id="allowances"
                  name="allowances"
                  className={`form-input ${errors.allowances ? 'border-red-500' : ''}`}
                  value={formData.allowances}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.allowances && <div className="form-error">{errors.allowances}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="deductions">Deductions</label>
              <div className="form-input-wrapper">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  id="deductions"
                  name="deductions"
                  className={`form-input ${errors.deductions ? 'border-red-500' : ''}`}
                  value={formData.deductions}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.deductions && <div className="form-error">{errors.deductions}</div>}
            </div>
          </form>

          <div className="preview-box">
            <div className="preview-row">
              <span>Basic Salary</span>
              <span>{formatCurrency(Number(formData.basicSalary) || 0)}</span>
            </div>
            <div className="preview-row">
              <span>Allowances</span>
              <span className="text-emerald-600">+{formatCurrency(Number(formData.allowances) || 0)}</span>
            </div>
            <div className="preview-row">
              <span>Deductions</span>
              <span className="text-rose-600">-{formatCurrency(Number(formData.deductions) || 0)}</span>
            </div>
            <div className="preview-row-total">
              <span>Net Salary</span>
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
              'Save Changes'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
