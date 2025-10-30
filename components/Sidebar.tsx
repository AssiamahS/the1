import React from 'react';

const TasksIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
    </svg>
);
const AgentsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.513-.96 1.487-1.593 2.571-1.82m-2.571 1.82a3 3 0 00-2.134 2.134m2.134-2.134a3 3 0 012.134-2.134M15.75 5.25a3 3 0 01-3 3m3-3a3 3 0 00-3-3m-3.75 3a3 3 0 013-3m-3 3a3 3 0 00-3 3m6.75 0a3 3 0 013-3m-3.75 3a3 3 0 01-3-3m3-3a3 3 0 00-3 3m-3 3a3 3 0 01-3-3m3 3a3 3 0 003 3" />
    </svg>
);
const WorkflowsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
);
const ArchivedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4" />
    </svg>
);
const PinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M16.5 3.75a.75.75 0 0 1 .75.75v10.19l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 1 1 1.06-1.06l2.47 2.47V4.5a.75.75 0 0 1 .75-.75Zm-6.195 3.285a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 1 1 1.06-1.06l2.47 2.47V4.5a.75.75 0 0 1 1.5 0v6.435l2.47-2.47a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
  </svg>
);
const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-accent" {...props}>
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 15.9371 4.28045 19.2453 7.5 20.9056" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const CollapseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
  </svg>
);


interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isCollapsed, onToggleCollapse }) => {
  const navItems = [
    { id: 'tasks', label: 'Tasks', icon: <TasksIcon className="w-6 h-6"/> },
    { id: 'pinned', label: 'Pinned', icon: <PinIcon className="w-6 h-6"/> },
    { id: 'agents', label: 'Agents', icon: <AgentsIcon className="w-6 h-6"/> },
    { id: 'workflows', label: 'Workflows', icon: <WorkflowsIcon className="w-6 h-6"/> },
    { id: 'archived', label: 'Archived', icon: <ArchivedIcon className="w-6 h-6"/> },
  ];

  return (
    <nav className={`bg-sidebar border-r border-border p-4 flex flex-col items-center transition-all duration-300 ${isCollapsed ? 'w-24' : 'w-64'}`}>
        <div className={`flex items-center justify-between w-full mb-10 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className={`flex items-center gap-2 ${isCollapsed ? 'hidden' : 'flex'}`}>
            <LogoIcon />
            <span className="font-bold text-lg">Lobe</span>
          </div>
          <button onClick={onToggleCollapse} className="text-text-secondary hover:text-text-primary p-1 rounded-full">
            <CollapseIcon className="w-6 h-6" />
          </button>
        </div>
        <ul className="space-y-2 w-full">
          {navItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => setActiveView(item.id)}
                className={`flex items-center p-3 rounded-lg transition-colors w-full group ${
                  activeView === item.id 
                    ? 'bg-accent text-white' 
                    : 'text-text-secondary hover:bg-card-hover hover:text-text-primary'
                } ${isCollapsed ? 'justify-center' : ''}`}
                aria-current={activeView === item.id}
                title={item.label}
              >
                {item.icon}
                {!isCollapsed && <span className="ml-4 font-semibold">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
    </nav>
  );
};