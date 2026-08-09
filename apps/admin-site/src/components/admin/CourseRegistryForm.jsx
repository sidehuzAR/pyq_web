import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import Button from '../shared/Button.jsx';

export default function CourseRegistryForm({ onAddCourse, onToast }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      onToast('Please enter both course code and subject name.', 'warning');
      return;
    }

    const newCode = code.trim().toUpperCase();
    const newName = name.trim();

    onAddCourse({ course_code: newCode, subject_name: newName });
    onToast(`Added ${newCode} - ${newName} to course registry!`, 'success');

    setCode('');
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-bauhaus-surface border-2 border-bauhaus-border p-5 shadow-bauhaus space-y-4 sharp">
      <div className="bg-bauhaus-elevated text-bauhaus-ink border border-bauhaus-border p-2.5 sharp font-mono text-xs font-bold uppercase tracking-wider">
        ADD NEW COURSE TO REGISTRY
      </div>

      <div>
        <label className="block text-xs font-mono font-bold uppercase text-bauhaus-ink mb-1">
          COURSE CODE *
        </label>
        <input
          type="text"
          required
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="e.g. BCSE301L"
          className="w-full p-2.5 bg-bauhaus-canvas border-2 border-bauhaus-border text-xs font-mono font-bold uppercase text-bauhaus-ink placeholder-[#8B949E] sharp focus:ring-2 focus:ring-bauhaus-yellow focus:border-bauhaus-yellow"
        />
      </div>

      <div>
        <label className="block text-xs font-mono font-bold uppercase text-bauhaus-ink mb-1">
          SUBJECT NAME *
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Software Engineering"
          className="w-full p-2.5 bg-bauhaus-canvas border-2 border-bauhaus-border text-xs font-bold text-bauhaus-ink placeholder-[#8B949E] sharp focus:ring-2 focus:ring-bauhaus-yellow focus:border-bauhaus-yellow"
        />
      </div>

      <Button variant="secondary" size="md" className="w-full" type="submit">
        <PlusCircle size={16} />
        <span>ADD TO COURSE REGISTRY</span>
      </Button>
    </form>
  );
}
