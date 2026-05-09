import React from 'react';
import { Clock, CheckCircle2, Zap, DollarSign } from 'lucide-react';

interface PromptVersionCardProps {
  version: string;
  createdAt: string;
  isCurrent: boolean;
  successRate: number;
  avgLatency: number;npm run dev
  
  avgCost: number;
  isSelected: boolean;
  onSelect: () => void;
}

export const PromptVersionCard: React.FC<PromptVersionCardProps> = ({
  version,
  createdAt,
  isCurrent,
  successRate,
  avgLatency,
  avgCost,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`
        relative cursor-pointer rounded-xl border p-4 transition-all duration-200
        ${isSelected 
          ? 'border-[#2dd4bf] bg-[#2dd4bf]/5 shadow-[0_0_15px_rgba(45,212,191,0.1)]' 
          : 'border-white/10 bg-[#0a0a0f] hover:border-white/20'
        }
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${isSelected ? 'text-[#2dd4bf]' : 'text-white'}`}>
            {version}
          </span>
          {isCurrent && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#2dd4bf] text-[#0a0a0f] rounded-full">
              Current
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-white/40">
          <Clock size={12} />
          {createdAt}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-white/40 mb-1 flex items-center gap-1">
            <CheckCircle2 size={10} /> Success
          </span>
          <span className={`text-sm font-medium ${successRate > 90 ? 'text-[#2dd4bf]' : 'text-white'}`}>
            {successRate}%
          </span>
        </div>
        <div className="flex flex-col border-x border-white/5 px-2">
          <span className="text-[10px] uppercase text-white/40 mb-1 flex items-center gap-1">
            <Zap size={10} /> Latency
          </span>
          <span className="text-sm font-medium text-white">
            {avgLatency}ms
          </span>
        </div>
        <div className="flex flex-col pl-1">
          <span className="text-[10px] uppercase text-white/40 mb-1 flex items-center gap-1">
            <DollarSign size={10} /> Cost
          </span>
          <span className="text-sm font-medium text-white">
            ${avgCost.toFixed(4)}
          </span>
        </div>
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-pulse" />
        </div>
      )}
    </div>
  );
};