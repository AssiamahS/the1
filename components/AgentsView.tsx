import React from 'react';
import { Task, Agent, Status } from '../types';
import { AGENT_COLORS, STATUS_COLORS } from '../constants';

const QwenDevIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

const ClaudeDesignerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 013.388-1.62m0 0a15.998 15.998 0 013.388-1.62m0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 013.388-1.62m0 0a15.998 15.998 0 003.388-1.62" />
    </svg>
);

const AGENT_DETAILS = {
  [Agent.QWEN_DEV]: {
    icon: QwenDevIcon,
    description: "Specializes in backend logic, database management, and API integrations. Handles all development and debugging tasks."
  },
  [Agent.CLAUDE_DESIGNER]: {
    icon: ClaudeDesignerIcon,
    description: "Focuses on user interface, user experience, and visual design. Creates mockups, wireframes, and design systems."
  },
};

interface AgentTaskItemProps {
    task: Task;
}

const AgentTaskItem: React.FC<AgentTaskItemProps> = ({ task }) => {
    const statusColor = STATUS_COLORS[task.status];
    return (
        <div className="bg-card-hover border border-border rounded-md p-3 flex justify-between items-center">
            <div>
                <p className="font-semibold text-text-primary text-sm">{task.id}: {task.title}</p>
                <p className="text-text-secondary text-xs mt-1 line-clamp-1">{task.description}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-4">
                <span className={`h-2.5 w-2.5 rounded-full ${statusColor}`}></span>
                <span className="text-xs text-text-secondary">{task.status}</span>
            </div>
        </div>
    )
};


interface AgentsViewProps {
    tasks: Task[];
}

export const AgentsView: React.FC<AgentsViewProps> = ({ tasks }) => {
    const agents = [Agent.QWEN_DEV, Agent.CLAUDE_DESIGNER];

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <header className="flex-shrink-0 p-6 border-b border-border">
                <h1 className="text-2xl font-bold text-text-primary">AI Agents</h1>
                <p className="text-text-secondary mt-1">Meet your specialized AI sub-agents.</p>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {agents.map(agentName => {
                    const agentTasks = tasks.filter(t => t.agent === agentName && !t.archived);
                    const details = AGENT_DETAILS[agentName];
                    const agentColor = AGENT_COLORS[agentName];
                    const Icon = details.icon;
                    return (
                        <div key={agentName} className="bg-card border border-border rounded-lg overflow-hidden">
                            <div className="p-5 border-b border-border">
                                <div className="flex items-center gap-4">
                                    <Icon className={`w-8 h-8 ${agentColor.split(' ')[1]}`}/>
                                    <div>
                                        <h2 className="text-xl font-bold text-text-primary">{agentName}</h2>
                                        <p className="text-sm text-text-secondary">{details.description}</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-6 text-sm">
                                    <p><span className="font-bold text-lg text-text-primary">{agentTasks.length}</span> <span className="text-text-secondary">Active Tasks</span></p>
                                    <p><span className="font-bold text-lg text-text-primary">{agentTasks.filter(t => t.status === Status.IN_PROGRESS).length}</span> <span className="text-text-secondary">In Progress</span></p>
                                </div>
                            </div>
                            <div className="p-5 bg-background/50">
                                <h3 className="text-sm font-semibold text-text-secondary mb-3">Assigned Tasks</h3>
                                {agentTasks.length > 0 ? (
                                    <div className="space-y-2">
                                        {agentTasks.map(task => <AgentTaskItem key={task.id} task={task} />)}
                                    </div>
                                ) : (
                                    <p className="text-text-secondary text-sm text-center py-4">No active tasks assigned.</p>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};
