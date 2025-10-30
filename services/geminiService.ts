
import { GoogleGenAI } from "@google/genai";
import { getTaskDataTool, updateTaskTool } from '../constants';
import { Task } from "../types";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function processUserRequest(prompt: string, taskContext: Task | null) {
  let systemInstruction = `You are the Task Manager Agent (TMA). Your role is to oversee a task management system, process requests from the Human Manager, and delegate work to specialized AI Sub-Agents (QwenDev, ClaudeDesigner).
      Analyze the Human Manager's request and determine the single best action:
      1. Retrieve Task Data: If the user asks about the status of a task or needs a list of tasks, use the get_task_data function.
      2. Assign or Update a Task: If the user is creating a new task, changing a status, or re-assigning, use the update_task_or_create_new function.
      3. Generate a Conversational Response: If the request is a general question, a greeting, or a request for a summary (which can be compiled from task data), respond directly and concisely.
      
      GUIDELINES:
      - Always use the provided functions when the request involves listing, retrieving, or modifying task data.
      - When using a function, DO NOT invent data in your final response. Just execute the function call and wait for the result.
      - If the user asks to "Assign a new task," infer the next available task ID (e.g., TSK-003 after TSK-002) and one of the available agents (QwenDev or ClaudeDesigner) if not specified.
      - Maintain a professional, efficient, and technical tone. Always confirm successful actions.`;

  if (taskContext) {
    systemInstruction += `\n\nIMPORTANT: The user is currently focused on a specific task. All subsequent commands or questions should be interpreted in the context of this task unless they explicitly mention another task ID or a general query.
    - Task ID: ${taskContext.id}
    - Title: "${taskContext.title}"
    - Description: "${taskContext.description}"
    - Current Status: ${taskContext.status}
    - Assigned Agent: ${taskContext.agent}
    For example, if the user says "mark it as complete", you should call \`update_task_or_create_new\` with \`task_id: "${taskContext.id}"\` and \`status: "Completed"\`.`;
  }
      
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
      tools: [{ functionDeclarations: [getTaskDataTool, updateTaskTool] }],
    }
  });

  const functionCalls = response.functionCalls;
  if (functionCalls && functionCalls.length > 0) {
    return { type: 'functionCall', data: functionCalls[0] };
  }
  
  return { type: 'text', data: response.text };
}
