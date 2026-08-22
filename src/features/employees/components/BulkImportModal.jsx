import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { UploadCloud, CheckCircle2, AlertCircle, FileSpreadsheet } from 'lucide-react';

export const BulkImportModal = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState('upload'); // upload -> validating -> result
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleUpload = () => {
    setStep('validating');
    setIsSimulating(true);
    
    // Simulate validation and processing
    setTimeout(() => {
      setResult({
        total: 15,
        valid: 12,
        invalid: 2,
        duplicate: 1
      });
      setStep('result');
      setIsSimulating(false);
    }, 1500);
  };

  const handleConfirm = () => {
    // In a real app, this would commit the valid records to the database.
    // For this demo, we'll just close it and trigger a refresh.
    onComplete();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Import Employees" size="md">
      {step === 'upload' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ padding: '32px', border: '2px dashed #E8EAF0', borderRadius: '16px', backgroundColor: '#F7F8FA', textAlign: 'center', cursor: 'pointer' }} onClick={handleUpload}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <UploadCloud size={24} color="#4f46e5" />
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600, color: '#17191C' }}>Click to upload or drag and drop</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#6F7580' }}>CSV, XLS, or XLSX up to 10MB</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
            <FileSpreadsheet size={20} color="#3b82f6" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e3a8a' }}>Need a template?</div>
              <div style={{ fontSize: '12px', color: '#1e3a8a', opacity: 0.8 }}>Download our standard template to ensure smooth import.</div>
            </div>
            <Button variant="outline" size="sm">Download</Button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #E8EAF0', paddingTop: '16px' }}>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      )}

      {step === 'validating' && (
        <div style={{ padding: '48px 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '24px' }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600, color: '#17191C' }}>Validating Data...</h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#6F7580' }}>Checking for formatting errors and duplicates.</p>
        </div>
      )}

      {step === 'result' && result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={28} color="#10b981" />
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#17191C' }}>Validation Complete</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#6F7580' }}>Found {result.total} records in the uploaded file.</p>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid #E8EAF0', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#17191C' }}><CheckCircle2 size={16} color="#10b981"/> Ready to import</div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#17191C' }}>{result.valid}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid #E8EAF0', borderRadius: '12px', backgroundColor: '#fef2f2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#ef4444' }}><AlertCircle size={16} /> Invalid format</div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#ef4444' }}>{result.invalid}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid #E8EAF0', borderRadius: '12px', backgroundColor: '#fffbeb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#f59e0b' }}><AlertCircle size={16} /> Duplicates skipped</div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#f59e0b' }}>{result.duplicate}</span>
            </div>
          </div>
          
          <div style={{ fontSize: '13px', color: '#6F7580', backgroundColor: '#F7F8FA', padding: '12px', borderRadius: '8px' }}>
            Note: Invalid and duplicate records will be safely skipped. Only the <strong>{result.valid} valid records</strong> will be imported into the directory.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #E8EAF0', paddingTop: '16px' }}>
            <Button variant="outline" onClick={() => setStep('upload')}>Start Over</Button>
            <Button variant="primary" onClick={handleConfirm}>Import {result.valid} Employees</Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default BulkImportModal;
