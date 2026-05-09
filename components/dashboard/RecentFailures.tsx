import React from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowUpRight, Inbox } from 'lucide-react';

interface Run {
  id: string;
  workflowName: string;
  errorSnippet: string;
  createdAt: string;
}

interface RecentFailuresProps {
  failures: (Run & { workflowName: string; errorSnippet: string })[];
}

export const RecentFailures: React.FC<RecentFailuresProps> = ({ failures }) => {
  const displayFailures = failures.slice(0, 5);

  return (
    <div className="rounded-xl border border-white/5 bg-[#111118] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/5 p-4 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">
            Recent Incidents
          </h2>
        </div>
        <span className="text-[10px] font-medium text-white/30 bg-white/5 px-2 py-0.5 rounded">
          Last 24h
        </span>
      </div>

      <div className="divide-y divide-white/5">
        {displayFailures.length > 0 ? (
          displayFailures.map((failure) => (
            <Link 
              key={failure.id} 
              href={`/runs/${failure.id}`}
              className="group flex items-center justify-between p-4 transition-colors hover:bg-white/[0.03]"
            >
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">
                    {failure.workflowName}
                  </span>
                  <code className="text-[10px] font-mono text-white/30 bg-white/5 px-1.5 py-0.5 rounded leading-none">
                    {failure.id.substring(0, 8)}
                  </code>
                </div>
                <p className="text-xs text-red-400/80 truncate font-mono bg-red-400/5 rounded p-1 inline-block w-fit max-w-full border border-red-400/10">
                  {failure.errorSnippet}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2 ml-4">
                <span className="text-[11px] text-white/40 whitespace-nowrap">
                  {failure.createdAt}
                </span>
                <ArrowUpRight size={14} className="text-white/20 group-hover:text-[#2dd4bf] transition-colors" />
              </div>
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="rounded-full bg-white/5 p-3 mb-3">
              <Inbox className="text-white/20" size={24} />
            </div>
            <p className="text-sm text-white/40 font-medium">No failures detected</p>
            <p className="text-xs text-white/20 mt-1">System is performing within normal parameters.</p>
          </div>
        )}
      </div>

      {displayFailures.length > 0 && (
        <div className="p-3 bg-white/[0.01] border-t border-white/5">
          <Link 
            href="/runs?status=failed" 
            className="block text-center text-[11px] font-bold uppercase tracking-tighter text-white/40 hover:text-white transition-colors"
          >
            View All Failures
          </Link>
        </div>
      )}
    </div>
  );
};