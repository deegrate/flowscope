'use client'
import React, { useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export interface PromptVersion {
  id: string;
  label: string;
  content: string;
}

export interface VersionMetrics {
  successRate: number;
  avgLatency: number;
  avgCost: number;
}

interface PromptDiffPanelProps {
  leftVersion: PromptVersion;
  rightVersion: PromptVersion;
  leftMetrics: VersionMetrics;
  rightMetrics: VersionMetrics;
}

export const PromptDiffPanel: React.FC<PromptDiffPanelProps> = ({
  leftVersion,
  rightVersion,
  leftMetrics,
  rightMetrics,
}) => {
  const deltas = useMemo(() => {
    if (!rightMetrics || !leftMetrics) return null
    const success = rightMetrics.successRate - leftMetrics.successRate
    const latency = rightMetrics.avgLatency - leftMetrics.avgLatency
    const cost = rightMetrics.avgCost - leftMetrics.avgCost
    return {
      success: { val: success, isGood: success >= 0 },
      latency: { val: latency, isGood: latency <= 0 },
      cost: { val: cost, isGood: cost <= 0 },
    };
  }, [leftMetrics, rightMetrics]);

  const diffLines = useMemo(() => {
    const leftLines = ((leftVersion as any).promptText ?? '').split('\n');
    const rightLines = ((rightVersion as any).promptText ?? '').split('\n');
    const maxLines = Math.max(leftLines.length, rightLines.length);
    const result = [];
    for (let i = 0; i < maxLines; i++) {
      const left = leftLines[i] || '';
      const right = rightLines[i] || '';
      result.push({ left, right, isDiff: left !== right });
    }
    return result;
  }, [leftVersion, rightVersion]);

  const MetricBox = ({ label, left, right, delta, isGood }: any) => (
    <div className="flex flex-col p-3 bg-white/5 rounded-lg border border-white/10">
      <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{label}</span>
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-white">{right}</span>
          <span className="text-xs text-white/30 line-through">{left}</span>
        </div>
        <div className={`flex items-center text-xs font-bold ${isGood ? 'text-[#2dd4bf]' : 'text-red-400'}`}>
          {delta > 0 ? '+' : ''}{typeof delta === 'number' ? delta.toFixed(delta < 1 ? 4 : 0) : delta}
          {isGood ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] text-white overflow-hidden">

      {/* Header / Selectors */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0f]/50 backdrop-blur-md">
        <div className="flex items-center gap-4 w-full">
          <div className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-md text-sm text-white/60">
            Source: <span className="text-white font-medium">{leftVersion.label}</span>
          </div>
          <Minus className="text-white/20 rotate-90 md:rotate-0" />
          <div className="flex-1 px-3 py-2 bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 rounded-md text-sm text-[#2dd4bf]">
            Target: <span className="font-bold">{rightVersion.label}</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      {deltas && leftMetrics && rightMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-b border-white/10 bg-black/20">
          <MetricBox
            label="Success Rate"
            left={`${leftMetrics.successRate}%`}
            right={`${rightMetrics.successRate}%`}
            delta={deltas.success.val}
            isGood={deltas.success.isGood}
          />
          <MetricBox
            label="Avg Latency"
            left={`${leftMetrics.avgLatency}ms`}
            right={`${rightMetrics.avgLatency}ms`}
            delta={deltas.latency.val}
            isGood={deltas.latency.isGood}
          />
          <MetricBox
            label="Avg Cost"
            left={leftMetrics.avgCost.toFixed(4)}
            right={rightMetrics.avgCost.toFixed(4)}
            delta={deltas.cost.val}
            isGood={deltas.cost.isGood}
          />
        </div>
      )}

      {/* Diff Viewer Area */}
      <div className="flex-1 overflow-auto font-mono text-sm">
        <table className="w-full border-collapse">
          <tbody>
            {diffLines.map((line, idx) => (
              <tr key={idx} className="group border-b border-white/[0.02] hover:bg-white/[0.02]">
                <td className="w-10 text-center py-1 text-white/20 select-none border-r border-white/5">{idx + 1}</td>
                <td className={`p-2 w-1/2 align-top transition-colors ${line.isDiff && line.left ? 'bg-red-500/10 text-red-200/80' : 'text-white/40'}`}>
                  {line.left || <span className="opacity-0">.</span>}
                </td>
                <td className={`p-2 w-1/2 align-top border-l border-white/5 transition-colors ${line.isDiff && line.right ? 'bg-[#2dd4bf]/10 text-[#2dd4bf]' : 'text-white/40'}`}>
                  {line.right || <span className="opacity-0">.</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};