import React from 'react';
import { Download, CheckSquare, Square } from 'lucide-react';
import Button from '../shared/Button.jsx';

export default function BatchSelectionBar({
  selectedCount = 0,
  onSelectAll,
  onDeselectAll,
  onDownloadSelected,
  isZipping = false
}) {
  return (
    <div className="bg-bauhaus-surface text-bauhaus-ink p-3 border-2 border-bauhaus-border shadow-bauhaus mb-6 flex flex-wrap items-center justify-between gap-3 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-bauhaus-yellow">
          BATCH SELECTION:
        </span>
        <span className="font-mono text-xs font-black bg-bauhaus-blue text-bauhaus-canvas px-2 py-0.5 sharp">
          {selectedCount} SELECTED
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSelectAll}
          className="bg-bauhaus-canvas text-bauhaus-ink"
        >
          <CheckSquare size={14} />
          <span>SELECT FILTERED</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onDeselectAll}
          className="bg-bauhaus-canvas text-bauhaus-ink"
        >
          <Square size={14} />
          <span>DESELECT ALL</span>
        </Button>

        <Button
          variant="secondary"
          size="sm"
          disabled={selectedCount === 0 || isZipping}
          onClick={onDownloadSelected}
        >
          <Download size={14} />
          <span>{isZipping ? 'PACKAGING ZIP...' : `DOWNLOAD ZIP (${selectedCount})`}</span>
        </Button>
      </div>
    </div>
  );
}
