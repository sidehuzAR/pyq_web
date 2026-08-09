import React from 'react';

export default function SortControl({ sortBy, setSortBy, resultCount = 0 }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 font-mono text-xs font-bold text-bauhaus-ink uppercase tracking-wider">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 bg-bauhaus-red sharp inline-block"></span>
        <span>SHOWING {resultCount} {resultCount === 1 ? 'PAPER' : 'PAPERS'}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-bauhaus-muted">SORT BY:</span>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="bg-bauhaus-surface border-2 border-bauhaus-border text-bauhaus-ink px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider sharp cursor-pointer focus:ring-2 focus:ring-bauhaus-yellow focus:border-bauhaus-yellow shadow-sm transition-colors duration-200"
        >
          <option value="year-desc">YEAR (NEW TO OLD)</option>
          <option value="year-asc">YEAR (OLD TO NEW)</option>
          <option value="code-asc">COURSE CODE (A-Z)</option>
        </select>
      </div>
    </div>
  );
}
