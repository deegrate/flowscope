import React, { useMemo } from 'react';
import { 
  MessageSquare, 
  Wrench, 
  Globe, 
  Zap, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle,
  Clock
} from 'lucide-react';

export interface RunStep {
  id: string;
  runId: string;
  index: number;
  type: 'llm' | 'tool' | 'http' | 'transform';
  name: string;
  status: 'success' | 'error' | 'degraded';
  startedAt: string;
  finishedAt: string;
  meta: Record<string, unknown>;
}

interface StepCardProps {
  step: RunStep;
  isSelected: boolean;
  onClick: () => void;
}

export const StepCard: React.FC<StepCardProps> = ({ step, isSelected, onClick }) => {
  // Calculate duration in ms
  const duration = useMemo(() => {
    const start = new Date(step.startedAt).getTime();
    const end = new Date(step.finishedAt).getTime();
    return end - start;
  }, [step.startedAt, step.finishedAt]);

  // Determine icon based on type
  const TypeIcon = {
    llm: MessageSquare,
    tool: Wrench,
    http: Globe,
    transform: Zap,
  }[step.type];

  // Helper to extract a relevant preview string from meta
  const previewText = useMemo(() => {
    const { meta, type } = step;
    switch (type) {
      case 'llm':
        return (meta.prompt || meta.input || meta.model || '') as string;
      case 'http':
        return (meta.url || meta.endpoint || '') as string;
      case 'tool':
        return (meta.toolName || meta.action || '') as string;
      case 'transform':
        return (meta.transformation || 'Data Mapping') as string;
      default:
        return '';
    }
  }, [step]);

  // Color mapping for status
  const statusConfig = {
    success: { color: 'text-[#2dd4bf]', icon: CheckCircle2, bg: 'bg-[#2dd4bf]/10' },
    error: { color: 'text-red-500', icon: AlertCircle, bg: 'bg-red-500/10' },
    degraded: { color: 'text-amber-500', icon: AlertTriangle, bg: 'bg-amber-500/10' },
  }[step.status];

  const StatusIcon = statusConfig.icon;

  return (
    <div
      onClick={onClick}
      className={`
        relative flex cursor-pointer flex-col gap-3 rounded-r-xl border border-y-white/5 border-r-white/5 p-4 transition-all duration-200
        ${isSelected ? 'bg-[#111118] border-l-4 border-l-[#2dd4bf]' : 'bg-[#0a0a0f] border-l-4 border-l-transparent hover:bg-white/[0.03]'}
        ${step.status === 'error' && !isSelected ? 'border-l-4 border-l-red-500/80' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Step Index Badge */}
          <span className="flex h-6 w-6 items-center justify-center rounded bg-white/5 font-mono text-[10px] font-bold text-white/40">
            {(step.index + 1).toString().padStart(2, '0')}
          </span>