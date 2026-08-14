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
      console.error('Upload error:', error);
      let errMsg = error.message || 'An unexpected error occurred.';
      
      // Clean up raw database errors for the frontend
      if (errMsg.includes('Failed to register new course')) {
        if (errMsg.includes('row-level security') || errMsg.includes('RLS') || errMsg.includes('security policy')) {
          errMsg = 'Cannot register new subject due to security policies. Please ensure the Supabase "courses" table allows public inserts, or select an existing subject from the list.';
        } else {
          errMsg = 'Failed to register the new course in registry. Please check your inputs or try selecting an existing course.';
        }
      } else if (errMsg.includes('foreign key constraint') || errMsg.includes('violates foreign key')) {
        if (errMsg.includes('course_code')) {
           errMsg = 'Invalid course code. Please select a valid course from the list or check "SUBJECT NOT FOUND? ENTER MANUALLY" if your subject is missing.';
        } else {
           errMsg = 'Invalid reference data provided. Please check your inputs.';
        }
      } else if (errMsg.includes('duplicate key')) {
        errMsg = 'A paper with these exact details has already been uploaded.';
      } else if (errMsg.includes('row-level security') || errMsg.includes('RLS')) {
        errMsg = 'Upload denied due to security policies. You do not have permission to perform this action.';
      } else {
        errMsg = 'An unexpected error occurred during upload. Please try again.';
      }
      
      onToast('Upload failed: ' + errMsg, 'error');
    } else {
      if (payload.is_new_course) {
        onToast('Paper scan & course registration request submitted for admin moderation!', 'success');
      } else {
        onToast('Paper scan submitted for admin moderation!', 'success');
      }
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
