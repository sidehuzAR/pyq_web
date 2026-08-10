import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import PaperCanvas from '../components/viewer/PaperCanvas.jsx';
import ViewerToolbar from '../components/viewer/ViewerToolbar.jsx';
import MetadataBar from '../components/viewer/MetadataBar.jsx';
import ReportModal from '../components/viewer/ReportModal.jsx';
import Button from '../components/shared/Button.jsx';
import { downloadPaperAsPdf } from '../lib/pdf.js';

export default function ViewerPage({
  paper: modalPaper = null,
  approvedPapers = [],
  onCloseModal = null,
  onDownloadPaper,
  onToast
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const paper = modalPaper || approvedPapers.find(p => p.id === id);

  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  if (!paper) {
    return (
      <div className="max-w-xl mx-auto my-16 bg-bauhaus-surface border-4 border-bauhaus-border p-8 text-center shadow-bauhaus sharp">
        <h3 className="text-xl font-black uppercase text-bauhaus-red mb-2">
          PAPER NOT FOUND
        </h3>
        <p className="text-xs font-mono text-bauhaus-muted font-bold uppercase mb-4">
          THE REQUESTED QUESTION PAPER COULD NOT BE FOUND OR HAS BEEN MODERATED.
        </p>
        <Button variant="primary" size="md" onClick={() => navigate('/catalogue')}>
          RETURN TO CATALOGUE
        </Button>
      </div>
    );
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  const handleShareLink = () => {
    const shareUrl = `${window.location.origin}/#paper=${paper.id}`;
    navigator.clipboard.writeText(shareUrl);
    onToast('Direct paper link copied to clipboard!', 'success');
  };

  const handleDownload = async () => {
    if (onDownloadPaper) {
      onDownloadPaper(paper);
    } else {
      onToast(`Downloading ${paper.course_code}...`, 'info');
      try {
        await downloadPaperAsPdf(paper);
      } catch (e) {
        onToast('Download failed.', 'error');
      }
    }
  };

  const isModal = Boolean(onCloseModal);

  const content = (
    <div className={`flex flex-col bg-bauhaus-surface border-4 border-bauhaus-border shadow-bauhaus-lg sharp ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none border-0' : isModal ? 'max-w-5xl w-full max-h-[90vh] h-[85vh]' : 'max-w-6xl mx-auto my-6 min-h-[75vh]'
    }`}>
      {/* Top Title Bar (if modal) */}
      {isModal && (
        <div className="bg-bauhaus-elevated text-bauhaus-ink px-4 py-2 border-b border-bauhaus-border flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-bauhaus-yellow">
            PYARCHIVE INSPECTOR — {paper.course_code}
          </span>
          <button onClick={onCloseModal} className="hover:text-bauhaus-red text-bauhaus-muted font-mono text-lg font-bold">
            <X size={20} />
          </button>
        </div>
      )}

      {/* Toolbar */}
      <ViewerToolbar
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        onDownload={handleDownload}
        onShareLink={handleShareLink}
      />

      {/* Canvas */}
      <PaperCanvas
        fileUrl={paper.file_url}
        title={paper.subject_name}
        zoom={zoom}
      />

      {/* Metadata Bar */}
      <MetadataBar
        paper={paper}
        onOpenReport={() => setShowReportModal(true)}
      />

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          paperId={paper.id}
          onClose={() => setShowReportModal(false)}
          onToast={onToast}
        />
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-bauhaus-canvas/85 backdrop-blur-sm flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/catalogue')}>
          <ArrowLeft size={14} />
          <span>BACK TO CATALOGUE</span>
        </Button>
      </div>
      {content}
    </div>
  );
}
