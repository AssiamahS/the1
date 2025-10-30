
import React, { useRef } from 'react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onSelectTask: (task: Task) => void;
  onOpenTaskChat: (task: Task) => void;
  activeTaskId: string | null;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks, onSelectTask, onOpenTaskChat, activeTaskId }) => {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    
    const tasksCopy = [...tasks];
    const draggedItemContent = tasksCopy.splice(dragItem.current, 1)[0];
    tasksCopy.splice(dragOverItem.current, 0, draggedItemContent);
    
    dragItem.current = null;
    dragOverItem.current = null;
    
    setTasks(tasksCopy);
  };

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-secondary">
        <p>No tasks to display.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          draggable
          onDragStart={() => dragItem.current = index}
          onDragEnter={() => dragOverItem.current = index}
          onDragEnd={handleDragSort}
          onDragOver={(e) => e.preventDefault()}
          className="cursor-move"
        >
          <TaskCard 
            task={task} 
            onSelectTask={onSelectTask}
            onOpenTaskChat={onOpenTaskChat}
            isActive={task.id === activeTaskId}
          />
        </div>
      ))}
    </div>
  );
};
