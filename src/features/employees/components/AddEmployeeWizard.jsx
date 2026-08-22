import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Check, User, Briefcase, Mail, FileText, CheckCircle } from 'lucide-react';
import { mockHelpers } from '@/lib/demoMode';

const steps = [
  { id: 'basic', label: 'Basic Info', icon: User },
  { id: 'employment', label: 'Employment', icon: Briefcase },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'account', label: 'Account', icon: FileText }
];

export const AddEmployeeWizard = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: '',
    location: 'Bangalore',
    type: 'Full-time',
    joiningDate: new Date().toISOString().split('T')[0],
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateStep = () => {
    const newErrors = {};
    if (currentStep === 0) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
    }
    if (currentStep === 1) {
      if (!formData.designation) newErrors.designation = 'Designation is required';
    }
    if (currentStep === 2) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (validateStep()) {
      setIsSubmitting(true);
      try {
        const uid = `EMP${Date.now().toString().slice(-4)}`;
        const newUser = {
          uid,
          employeeId: `EMP-${Date.now().toString().slice(-4)}`,
          name: `${formData.firstName} ${formData.lastName}`,
          role: 'employee',
          status: 'active',
          profileHealth: 50,
          profileMissing: ["Emergency Contact", "Bank Details"],
          ...formData
        };
        // Simulated API delay
        await new Promise(r => setTimeout(r, 1000));
        mockHelpers.updateDocument('users', uid, newUser);
        onComplete();
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
              <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} />
            </div>
          </div>
        );
      case 1:
        return (
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#17191C', marginBottom: '8px' }}>Department</label>
                <select name="department" value={formData.department} onChange={handleChange} style={{ width: '100%', padding: '10px 16px', borderRadius: '12px', border: '1px solid #E8EAF0', fontSize: '14px', outline: 'none' }}>
                  {['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Operations'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <Input label="Designation" name="designation" value={formData.designation} onChange={handleChange} error={errors.designation} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#17191C', marginBottom: '8px' }}>Employment Type</label>
                <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '10px 16px', borderRadius: '12px', border: '1px solid #E8EAF0', fontSize: '14px', outline: 'none' }}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <Input label="Joining Date" type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />
            </div>
          </div>
        );
      case 2:
        return (
          <div style={{ display: 'grid', gap: '16px' }}>
            <Input label="Work Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
            <Input label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
            <Input label="Location" name="location" value={formData.location} onChange={handleChange} />
          </div>
        );
      case 3:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <CheckCircle size={32} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0', color: '#17191C' }}>Ready to Add Employee</h3>
            <p style={{ fontSize: '14px', color: '#6F7580', maxWidth: '300px' }}>
              An invitation email will be sent to <strong>{formData.email || 'the provided email'}</strong> with setup instructions.
            </p>
          </div>
        );
      default: return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Employee" size="lg">
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '16px', left: '0', right: '0', height: '2px', background: '#E8EAF0', zIndex: 0 }} />
          <div style={{ position: 'absolute', top: '16px', left: '0', height: '2px', background: '#4f46e5', zIndex: 1, width: `${(currentStep / (steps.length - 1)) * 100}%`, transition: 'width 0.3s' }} />
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            return (
              <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, gap: '8px', background: '#FFFFFF', padding: '0 8px' }}>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isCompleted ? '#4f46e5' : isCurrent ? '#FFFFFF' : '#F7F8FA',
                  border: `2px solid ${isCompleted || isCurrent ? '#4f46e5' : '#E8EAF0'}`,
                  color: isCompleted ? '#FFFFFF' : isCurrent ? '#4f46e5' : '#9CA1AA',
                  transition: 'all 0.3s'
                }}>
                  {isCompleted ? <Check size={16} /> : <Icon size={14} />}
                </div>
                <div style={{ fontSize: '12px', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? '#17191C' : '#9CA1AA' }}>{step.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ minHeight: '240px' }}>
        {renderStepContent()}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #E8EAF0' }}>
        <Button variant="outline" onClick={currentStep === 0 ? onClose : handleBack} isDisabled={isSubmitting}>
          {currentStep === 0 ? 'Cancel' : 'Back'}
        </Button>
        {currentStep === steps.length - 1 ? (
          <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>Complete Setup</Button>
        ) : (
          <Button variant="primary" onClick={handleNext}>Continue</Button>
        )}
      </div>
    </Modal>
  );
};

export default AddEmployeeWizard;
