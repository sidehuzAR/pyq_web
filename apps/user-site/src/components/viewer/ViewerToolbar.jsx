import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, Download, Share2, Check } from 'lucide-react';
import Button from '../shared/Button.jsx';

export default function ViewerToolbar({
  zoom = 1,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  isFullscreen = false,
  onToggleFullscreen,
  onDownload,
  onShareLink
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    onShareLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-bauhaus-elevated text-bauhaus-ink p-3 border-b-2 border-bauhaus-border flex flex-wrap items-center justify-between gap-3">
      {/* Zoom Controls */}
      <div className="flex items-center gap-1.5">
        <Button variant="outline" size="sm" onClick={onZoomIn} className="bg-bauhaus-canvas text-bauhaus-ink" title="Zoom In (+)">
          <ZoomIn size={14} />
        </Button>
        <Button variant="outline" size="sm" onClick={onZoomOut} className="bg-bauhaus-canvas text-bauhaus-ink" title="Zoom Out (-)">
          <ZoomOut size={14} />
        </Button>
        <Button variant="outline" size="sm" onClick={onResetZoom} className="bg-bauhaus-canvas text-bauhaus-ink" title="Reset Zoom">
          <RotateCcw size={14} />
        </Button>
        <span className="font-mono text-xs font-bold text-bauhaus-yellow ml-2">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFullscreen}
          className="bg-bauhaus-canvas text-bauhaus-ink"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onDownload}
          title="Download Paper File"
        >
          <Download size={14} />
          <span>DOWNLOAD</span>
        </Button>

        <Button
          variant={copied ? 'tertiary' : 'primary'}
          size="sm"
          onClick={handleShare}
          title="Share Direct Link"
        >
          {copied ? <Check size={14} /> : <Share2 size={14} />}
          <span>{copied ? 'LINK COPIED' : 'SHARE LINK'}</span>
        </Button>
      </div>
    </div>
  );
}
