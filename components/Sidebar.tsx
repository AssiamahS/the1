import React from 'react';

const HamburgerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const TasksIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const AgentsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM3.75 4.875c0-1.036.84-1.875 1.875-1.875h.375c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-.375A1.875 1.875 0 013.75 4.875zM12.75 8.625c0-1.036.84-1.875 1.875-1.875h.375c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-.375a1.875 1.875 0 01-1.875-1.875z" />
    </svg>
);

const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-1.226a2.25 2.25 0 012.58 0c.55.219 1.02.684 1.11 1.226l.094.542-.094.542c-.09.542-.56 1.007-1.11 1.226a2.25 2.25 0 01-2.58 0c-.55-.219-1.02-.684-1.11-1.226L9.5 4.482l.094-.542zM9.5 10.482l.094.542c.09.542.56 1.007 1.11 1.226a2.25 2.25 0 012.58 0c.55.219 1.02.684 1.11 1.226l.094.542-.094.542c-.09.542-.56 1.007-1.11 1.226a2.25 2.25 0 01-2.58 0c-.55-.219-1.02-.684-1.11-1.226L9.5 11.022l.094-.542zM9.5 17.022l.094.542c.09.542.56 1.007 1.11 1.226a2.25 2.25 0 012.58 0c.55.219 1.02.684 1.11 1.226l.094.542-.094.542c-.09.542-.56 1.007-1.11 1.226a2.25 2.25 0 01-2.58 0c-.55-.219-1.02-.684-1.11-1.226L9.5 17.562l.094-.542z" />
    </svg>
);


interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive }) => (
    <a href="#" className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-accent/20 text-accent' : 'text-text-secondary hover:bg-card hover:text-text-primary'}`}>
        {icon}
        <span>{label}</span>
    </a>
);

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-sidebar border-r border-border flex-shrink-0 flex flex-col p-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-full"></div>
            <h2 className="font-bold text-lg text-text-primary">Workspace</h2>
        </div>
        <button className="text-text-secondary hover:text-text-primary">
            <HamburgerIcon className="w-6 h-6"/>
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        <NavItem icon={<TasksIcon className="w-5 h-5"/>} label="Tasks" isActive />
        <NavItem icon={<AgentsIcon className="w-5 h-5"/>} label="Agents" />
        <NavItem icon={<SettingsIcon className="w-5 h-5"/>} label="Settings" />
      </nav>

      <div className="mt-auto">
        {/* User profile section could go here */}
      </div>
    </aside>
  );
};