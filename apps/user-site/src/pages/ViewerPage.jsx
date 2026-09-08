import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const isModal = Boolean(onCloseModal);
  const [localPaperId, setLocalPaperId] = useState(modalPaper?.id || id);

  React.useEffect(() => {
    setLocalPaperId(modalPaper?.id || id);
  }, [modalPaper?.id, id]);

  const paper = approvedPapers.find(p => p.id === localPaperId) || modalPaper;

  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Swipe logic
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50 && hasNext) handleNext();
    if (distance < -50 && hasPrev) handlePrev();
  };

  const relatedPapers = paper ? approvedPapers.filter(p => p.course_code === paper.course_code).sort((a, b) => b.academic_year.localeCompare(a.academic_year) || a.exam_type.localeCompare(b.exam_type) || a.slot_tag.localeCompare(b.slot_tag)) : [];
  const currentIndex = paper ? relatedPapers.findIndex(p => p.id === paper.id) : -1;
  const hasNext = currentIndex !== -1 && currentIndex < relatedPapers.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNext = () => {
    if (hasNext) {
      const nextId = relatedPapers[currentIndex + 1].id;
      if (isModal) setLocalPaperId(nextId);
      else navigate(`/paper/${nextId}`);
    }
  };

  const handlePrev = () => {
    if (hasPrev) {
      const prevId = relatedPapers[currentIndex - 1].id;
      if (isModal) setLocalPaperId(prevId);
      else navigate(`/paper/${prevId}`);
    }
  };

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

      {/* Canvas Area with Navigation */}
      <div 
        className="relative flex-1 overflow-hidden flex flex-col"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEndHandler}
      >
        {hasPrev && (
          <button 
            onClick={handlePrev} 
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-bauhaus-canvas/80 border-2 border-bauhaus-border hover:bg-bauhaus-yellow hover:text-bauhaus-canvas sharp text-bauhaus-ink transition-colors cursor-pointer flex items-center justify-center rounded-full shadow-bauhaus-sm"
            title="Previous Paper"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <PaperCanvas
          fileUrl={paper.file_url}
          title={paper.subject_name}
          zoom={zoom}
        />
        {hasNext && (
          <button 
            onClick={handleNext} 
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-bauhaus-canvas/80 border-2 border-bauhaus-border hover:bg-bauhaus-yellow hover:text-bauhaus-canvas sharp text-bauhaus-ink transition-colors cursor-pointer flex items-center justify-center rounded-full shadow-bauhaus-sm"
            title="Next Paper"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

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
