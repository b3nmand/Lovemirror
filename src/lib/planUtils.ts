import { DevelopmentPlan } from '../types/assessment';

/**
 * Parses a development plan string or object into a structured format
 * @param planData - The development plan data (string or object)
 * @returns A structured object with plan sections
 */
export function parseDevelopmentPlan(planData: string | object): any {
  // Ensure we have a string to work with
  const planString = typeof planData === 'string' ? planData : JSON.stringify(planData);
  
  // Extract sections using regex
  const sections: Record<string, any> = {};
  
  // Extract action plan
  const actionPlanMatch = planString.match(/# 🎯 30-Day Action Plan([\s\S]*?)(?=# 💪|$)/);
  if (actionPlanMatch) {
    sections.actionPlan = actionPlanMatch[1].trim();
  }
  
  // Extract strengths
  const strengthsMatch = planString.match(/# 💪 Building on Strengths([\s\S]*?)(?=# 📈|$)/);
  if (strengthsMatch) {
    sections.strengths = strengthsMatch[1].trim();
  }
  
  // Extract progress tracking
  const progressMatch = planString.match(/# 📈 Progress Tracking([\s\S]*?)(?=# 🌟|$)/);
  if (progressMatch) {
    sections.progress = progressMatch[1].trim();
  }
  
  // Extract daily habits
  const habitsMatch = planString.match(/# 🌟 Daily Habits([\s\S]*?)(?=$)/);
  if (habitsMatch) {
    sections.habits = habitsMatch[1].trim();
  }
  
  return sections;
}

/**
 * Extracts tasks from a development plan
 * @param planData - The development plan data
 * @returns An array of tasks with completion status
 */
export function extractTasks(planData: string | object): Array<{text: string, completed: boolean}> {
  // Ensure we have a string to work with
  const planString = typeof planData === 'string' ? planData : JSON.stringify(planData);
  
  // Find all checkbox items
  const taskRegex = /- \[([ x])\] (.*?)(?=\n|$)/g;
  const tasks: Array<{text: string, completed: boolean}> = [];
  
  let match;
  while ((match = taskRegex.exec(planString)) !== null) {
    tasks.push({
      text: match[2].trim(),
      completed: match[1] === 'x'
    });
  }
  
  return tasks;
}

/**
 * Calculates the implementation progress percentage
 * @param planData - The development plan data
 * @returns A number between 0-100 representing completion percentage
 */
export function calculateImplementationProgress(planData: string | object): number {
  const tasks = extractTasks(planData);
  
  if (tasks.length === 0) return 0;
  
  const completedTasks = tasks.filter(task => task.completed).length;
  return (completedTasks / tasks.length) * 100;
}

/**
 * Updates a task's completion status in the plan
 * @param planData - The original plan data
 * @param taskText - The text of the task to update
 * @param completed - The new completion status
 * @returns The updated plan string
 */
export function updateTaskStatus(
  planData: string, 
  taskText: string, 
  completed: boolean
): string {
  const checkbox = completed ? '[x]' : '[ ]';
  
  // Escape special regex characters in the task text
  const escapedText = taskText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Create regex to find the task
  const taskRegex = new RegExp(`- \\[[ x]\\] ${escapedText}`, 'g');
  
  // Replace the task with updated checkbox
  return planData.replace(taskRegex, `- ${checkbox} ${taskText}`);
}