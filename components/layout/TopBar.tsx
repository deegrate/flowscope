import React from 'react';
import { Search, Upload, Bell } from 'lucide-react';

interface TopBarProps {
  title?: string;
}

/**
 * TopBar Component for FlowScope
 * Horizontal header containing the current page title, search, and primary actions.
 */
export const TopBar: React.FC<TopBarProps> = ({ title = "Dashboard" }) => {
  return (
    <header className="h-14 w-full bg-[#111118] border-b border-white/10 flex items-center justify-between px-6 z-30">
      {/* Left Section: Page Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-bold tracking-wider text-white uppercase">
          {title}
        </h1>
      </div>

      {/* Right Section: Search & Actions */}
      <div className="flex items-center gap-4 flex-1 justify-end max-w-2xl">
        {/* Search UI Component (Non-functional) */}
        <div className="relative w-full max-w-sm hidden md:block">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/30">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search traces, workflows, or logs..."
            readOnly
            className="w-full h-9 bg-[#0a0a0f] border border-white/5 rounded-lg pl-10 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#2dd4bf]/50 transition-colors cursor-default"
          />
        </div>

        {/* Global Notifications (Visual only) */}
        <button className="p-2 text-white/40 hover:text-white transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#2dd4bf] rounded-full shadow-[0_0_8px_#2dd4bf]" />
        </button>

        {/* Import Trace Button */}
        <button
          disabled
          className="flex items-center gap-2 bg-[#2dd4bf] text-[#0a0a0f] px-4 h-9 rounded-lg text-xs font-bold hover:bg-[#2dd4bf]/90 transition-all opacity-90 cursor-not-allowed active:scale-95 shadow-[0_0_15px_rgba(45,212,191,0.1)]"
        >
          <Upload size={14} />
          <span className="hidden sm:inline">Import Trace</span>
        </button>
      </div>
    </header>
  );
};