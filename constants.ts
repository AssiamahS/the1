import { Task, Agent, Status } from './types';
import { FunctionDeclaration, Type } from '@google/genai';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'TSK-001',
    title: 'Fix Cloudflare DNS 1014 error',
    description: 'Investigate and fix the intermittent DNS 1014 CNAME cross-user banned error affecting production.',
    agent: Agent.QWEN_DEV,
    status: Status.IN_PROGRESS,
    pinned: true,
    archived: false,
  },
  {
    id: 'TSK-002',
    title: 'Design mobile onboarding flow',
    description: 'Create high-fidelity mockups for the new user dashboard, focusing on data visualization and usability.',
    agent: Agent.CLAUDE_DESIGNER,
    status: Status.IN_PROGRESS,
    pinned: false,
    archived: false,
  },
  {
    id: 'TSK-003',
    title: 'Design mobile flow',
    description: 'Low-fidelity wireframes for the new mobile checkout experience.',
    agent: Agent.CLAUDE_DESIGNER,
    status: Status.BACKLOG,
    pinned: false,
    archived: false,
  },
  {
    id: 'TSK-004',
    title: 'Database migration to Supabase',
    description: 'Plan and execute the migration of the user database from Heroku Postgres to Supabase.',
    agent: Agent.QWEN_DEV,
    status: Status.BLOCKED,
    pinned: false,
    archived: false,
  },
];

export const AGENT_COLORS: { [key in Agent]: string } = {
  [Agent.QWEN_DEV]: 'bg-blue/20 text-blue ring-blue/40',
  [Agent.CLAUDE_DESIGNER]: 'bg-purple-500/20 text-purple-300 ring-purple-500/40',
  [Agent.UNASSIGNED]: 'bg-gray/20 text-gray ring-gray/40',
};

export const STATUS_COLORS: { [key in Status]: string } = {
  [Status.BACKLOG]: 'bg-gray',
  [Status.IN_PROGRESS]: 'bg-blue',
  [Status.BLOCKED]: 'bg-red',
  [Status.COMPLETED]: 'bg-green',
};

export const getTaskDataTool: FunctionDeclaration = {
  name: 'get_task_data',
  description: 'Retrieves task data from the database. Use this function for all read and view operations, including filtering by status or agent. Returns a list of matching task objects.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      task_id: {
        type: Type.STRING,
        description: 'Optional. The specific task ID to retrieve (e.g., "TSK-001").',
      },
      status_filter: {
        type: Type.STRING,
        description: 'Optional. Filter tasks by status (e.g., "In Progress", "Backlog", "Completed").',
      },
      assigned_agent: {
        type: Type.STRING,
        description: 'Optional. Filter tasks by the assigned agent\'s name (e.g., "QwenDev").',
      },
    },
  },
};

export const updateTaskTool: FunctionDeclaration = {
  name: 'update_task_or_create_new',
  description: 'Creates a new task or updates an existing task\'s attributes (title, status, assigned agent, description). The task_id is mandatory. Use this for all write operations.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      task_id: {
        type: Type.STRING,
        description: 'The unique ID of the task to update (e.g., "TSK-001"). If creating a new task, this must be a new, unused ID.',
      },
      title: {
        type: Type.STRING,
        description: 'The short title of the task. Required for new tasks.',
      },
      status: {
        type: Type.STRING,
        description: 'The new status for the task (e.g., "In Progress", "Completed", "Blocked").',
      },
      assigned_agent: {
        type: Type.STRING,
        description: 'The agent the task should be assigned to (e.g., "QwenDev", "ClaudeDesigner").',
      },
      description: {
        type: Type.STRING,
        description: 'The detailed description of the task. Required for new tasks.',
      },
    },
    required: ['task_id'],
  },
};
