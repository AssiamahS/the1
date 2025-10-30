import React from 'react';
import { Task } from '../types';

interface ArchivedViewProps {
    tasks: Task[];
    onRestoreTask: (taskId: string) => void;
}

export const ArchivedView: React.FC<ArchivedViewProps> = ({ tasks, onRestoreTask }) => {
    return (
        <div className="flex-1 flex flex-col overflow-hidden">
             <header className="flex-shrink-0 p-6 border-b border-border">
                <h1 className="text-2xl font-bold text-text-primary">Archived Tasks</h1>
                <p className="text-text-secondary mt-1">View and restore archived tasks here.</p>
             </header>
             <div className="flex-1 overflow-y-auto p-6">
                {tasks.length === 0 ? (
                    <div className="text-center text-text-secondary py-10">No archived tasks.</div>
                ) : (
                    <div className="space-y-3">
                        {tasks.map(task => (
                            <div key={task.id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-text-primary">{task.id}: {task.title}</h3>
                                    <p className="text-sm text-text-secondary">{task.description}</p>
                                </div>
                                <button
                                    onClick={() => onRestoreTask(task.id)}
                                    className="px-4 py-2 bg-accent text-white font-semibold rounded-md hover:bg-accent-hover focus:ring-2 focus:ring-accent focus:outline-none transition-colors"
                                >
                                    Restore
                                </button>
                            </div>
                        ))}
                    </div>
                )}
             </div>
        </div>
    );
};
