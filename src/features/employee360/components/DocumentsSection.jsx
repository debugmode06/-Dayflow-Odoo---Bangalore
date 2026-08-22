import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  File,
  Image,
  AlertCircle,
  Loader2,
  FolderOpen,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { isHRRole } from '../utils/profilePermissions';
import {
  uploadEmployeeDocument,
  deleteEmployeeDocument,
} from '../services/employeeProfileService';
import { writeDocumentUploadedEvent } from '../services/activityTimelineService';
import { validateDocumentFile } from '../utils/profileValidation';
import { updateEmployeeProfile } from '../services/employeeProfileService';

const DOCUMENT_CATEGORIES = [
  'ID Proof',
  'Offer Letter',
  'Employment Contract',
  'Education Certificate',
  'Experience Certificate',
  'Tax Document',
  'Other',
];

const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (value) => {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};

const FileTypeIcon = ({ type }) => {
  if (type?.startsWith('image/')) return <Image size={16} color="var(--color-info-text)" />;
  if (type === 'application/pdf') return <FileText size={16} color="var(--color-danger-text)" />;
  return <File size={16} color="var(--text-tertiary)" />;
};

/**
 * Documents Section — upload, view, and delete employee documents.
 * HR can manage any employee's documents.
 * Employee can upload their own documents.
 * Access to files is controlled by Firebase Storage rules.
 */
const DocumentsSection = ({
  profile,
  currentRole,
  currentUid,
  onProfilePatch,
  onTimelineRefresh,
}) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Other');
  const [uploadError, setUploadError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const targetUid = profile?.uid || profile?.id;
  const canUpload = currentUid === targetUid || isHRRole(currentRole);
  const canDelete = isHRRole(currentRole);

  const documents = profile?.documents || [];

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    const validationError = validateDocumentFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    try {
      const docMeta = await uploadEmployeeDocument(
        targetUid,
        file,
        selectedCategory,
        (p) => setUploadProgress(p)
      );

      const updatedDocs = [...documents, { ...docMeta, id: Date.now().toString() }];
      await updateEmployeeProfile(targetUid, { documents: updatedDocs });
      onProfilePatch({ documents: updatedDocs });

      await writeDocumentUploadedEvent(
        targetUid,
        currentUid,
        currentRole,
        file.name,
        selectedCategory
      );
      if (onTimelineRefresh) onTimelineRefresh();
    } catch (err) {
      setUploadError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (doc_) => {
    if (!canDelete) return;
    setDeletingId(doc_.id);
    try {
      if (doc_.storagePath) {
        await deleteEmployeeDocument(doc_.storagePath);
      }
      const updatedDocs = documents.filter((d) => d.id !== doc_.id);
      await updateEmployeeProfile(targetUid, { documents: updatedDocs });
      onProfilePatch({ documents: updatedDocs });
    } catch (err) {
      console.error('Delete document failed:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card
      title="Documents"
      subtitle="Employee files and certificates"
      headerAction={
        canUpload && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={uploading}
              aria-label="Document category"
              style={{
                fontSize: 'var(--font-size-xs)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 8px',
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-surface)',
                outline: 'none',
              }}
            >
              {DOCUMENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              icon={Upload}
              isLoading={uploading}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload document"
            >
              Upload
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              aria-hidden="true"
            />
          </div>
        )
      }
    >
      {uploadError && (
        <div
          style={{
            marginBottom: 'var(--space-3)',
            padding: 'var(--space-3)',
            backgroundColor: 'var(--color-danger-bg)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
          role="alert"
        >
          <AlertCircle size={14} color="var(--color-danger-text)" />
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger-text)' }}>
            {uploadError}
          </span>
        </div>
      )}

      {uploading && (
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
              Uploading…
            </span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
              {uploadProgress}%
            </span>
          </div>
          <div style={{ height: '4px', backgroundColor: 'var(--bg-surface-tertiary)', borderRadius: '2px' }}>
            <div
              style={{
                height: '100%',
                width: `${uploadProgress}%`,
                backgroundColor: 'var(--color-primary)',
                borderRadius: '2px',
                transition: 'width 200ms ease',
              }}
            />
          </div>
        </div>
      )}

      {documents.length === 0 ? (
        <div
          style={{
            padding: 'var(--space-8)',
            textAlign: 'center',
            color: 'var(--text-tertiary)',
          }}
        >
          <FolderOpen size={32} style={{ margin: '0 auto var(--space-2)', opacity: 0.4 }} />
          <p style={{ fontSize: 'var(--font-size-sm)' }}>No documents uploaded yet.</p>
          {canUpload && (
            <p style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-1)' }}>
              Use the Upload button above to add documents.
            </p>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {documents.map((doc_) => (
            <div
              key={doc_.id || doc_.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color-subtle)',
                backgroundColor: 'var(--bg-surface-secondary)',
                transition: 'border-color var(--transition-fast)',
              }}
            >
              <FileTypeIcon type={doc_.type} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {doc_.name}
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: '2px', flexWrap: 'wrap' }}>
                  <Badge variant="default" size="sm">
                    {doc_.category || 'General'}
                  </Badge>
                  {doc_.size && (
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                      {formatFileSize(doc_.size)}
                    </span>
                  )}
                  {doc_.uploadedAt && (
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                      {formatDate(doc_.uploadedAt)}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-1)', flexShrink: 0 }}>
                {doc_.url && (
                  <a
                    href={doc_.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Download ${doc_.name}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-primary)',
                      textDecoration: 'none',
                      transition: 'background-color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary-light)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Download size={14} />
                  </a>
                )}
                {canDelete && (
                  <button
                    onClick={() => handleDelete(doc_)}
                    disabled={deletingId === doc_.id}
                    aria-label={`Delete ${doc_.name}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-danger-text)',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: deletingId === doc_.id ? 'not-allowed' : 'pointer',
                      transition: 'background-color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-danger-bg)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {deletingId === doc_.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default DocumentsSection;
