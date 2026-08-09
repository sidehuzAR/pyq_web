import React from 'react';
import { SLOT_TAGS } from '../../constants/enums.js';

export default function SlotSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full p-2.5 bg-bauhaus-canvas border-2 border-bauhaus-border text-xs font-bold font-mono text-bauhaus-ink uppercase tracking-wider sharp focus:ring-2 focus:ring-bauhaus-yellow focus:border-bauhaus-yellow cursor-pointer"
    >
      <optgroup label="THEORY SLOTS">
        {SLOT_TAGS.theory.map(slot => (
          <option key={slot} value={slot}>
            {slot}
          </option>
        ))}
      </optgroup>
      <optgroup label="TUTORIAL SLOTS">
        {SLOT_TAGS.tutorial.map(slot => (
          <option key={slot} value={slot}>
            {slot}
          </option>
        ))}
      </optgroup>
      <optgroup label="LAB SLOTS">
        {SLOT_TAGS.lab.map(slot => (
          <option key={slot} value={slot}>
            {slot}
          </option>
        ))}
      </optgroup>
    </select>
  );
}
