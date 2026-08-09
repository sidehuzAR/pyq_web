import React, { useState } from 'react';
import SectionHeading from '../components/shared/SectionHeading.jsx';
import UploadForm from '../components/upload/UploadForm.jsx';
import { useUploadPaper } from '../hooks/usePapers.js';

export default function UploadPage({ courses = [], onToast }) {
  const { uploadPaper } = useUploadPaper();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (payload) => {
    if (!payload.file) {
      onToast('Please attach a file.', 'error');
      return;
    }
    setSubmitting(true);
    onToast('Uploading paper... please wait.', 'info');
    const { error } = await uploadPaper(payload);
    setSubmitting(false);

    if (error) {
      onToast('Failed to upload paper: ' + error.message, 'error');
    } else {
      onToast('Paper scan submitted for admin moderation!', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <SectionHeading
        number="03"
        title="CONTRIBUTE EXAM PAPER"
        subtitle="Submit previous year exam papers to expand the VIT student archive. Uploads undergo admin moderation before going live."
        accentColor="yellow"
      />

      <div className={submitting ? 'opacity-50 pointer-events-none' : ''}>
        <UploadForm
          courses={courses}
          onSubmitUpload={handleSubmit}
          onToast={onToast}
        />
      </div>
    </div>
  );
}
