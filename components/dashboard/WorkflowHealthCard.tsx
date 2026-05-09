import React from 'react';
import Link from 'next/link';
import { Activity, Clock, ChevronRight, Timer } from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  description: string;
}

interface WorkflowHealthCardProps {
  workflow: Workflow;
  successRate: number;
  avgDuration: number;
  lastRunAt: string;
}

export const WorkflowHealthCard: React.FC<WorkflowHealthCardProps> = ({
  workflow,
  successRate,
  avgDuration,
  lastRunAt,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#111118] p-5 transition-all hover:border-[#2dd4bf]/30">
      {/* Background Glow Effect */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#2dd4bf]/5 blur-3xl transition-opacity group-hover:opacity-100" />

      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white group-hover:text-[#2dd4bf] transition-colors">
            {workflow.name}
          </h3>
          <p className="mt-1 text-sm text-white/50 line-clamp-1">
            {workflow.description}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/40 bg-white/5 px-2 py-1 rounded-md">
          <Clock size={12} />
          {lastRunAt}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {/* Success Rate Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-white/60">Success Rate</span>
            <span className="font-mono font-medium text-[#2dd4bf]">{successRate}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div 
              className="h-full bg-[#2dd4bf] shadow-[0_0_8px_rgba(45,212,191,0.4)] transition-all duration-1000" 
              style={{ width: `${successRate}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-[#2dd4bf]/10 p-2 text-[#2dd4bf]">
              <Timer size={16} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/40">Avg Duration</p>
              <p className="text-sm font-medium text-white">{avgDuration}ms</p>
            </div>
          </div>

          <Link 
            href={`/runs?workflowId=${workflow.id}`}
            className="flex items-center gap-1 text-xs font-medium text-[#2dd4bf] opacity-0 transition-all group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
          >
            View Runs
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};