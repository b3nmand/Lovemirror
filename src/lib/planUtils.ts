import { DevelopmentPlan } from '../types/assessment';

/**
<<<<<<< HEAD
=======
 * Logs the structure of a development plan for debugging
 * @param planData - The development plan data
 */
export function debugPlan(planData: string | object): void {
  console.log('Plan data type:', typeof planData);
  console.log('Plan data structure:', JSON.stringify(planData).substring(0, 100) + '...');
  
  if (typeof planData === 'string') {
    console.log('Plan data length:', planData.length);
    console.log('Plan data preview:', planData.substring(0, 200) + '...');
    
    // Check for markdown sections
    const sections = [
      '# 🎯 30-Day Action Plan',
      '# 💪 Building on Strengths',
      '# 📈 Progress Tracking',
      '# 🌟 Daily Habits'
    ];
    
    sections.forEach(section => {
      console.log(`Contains "${section}":`, planData.includes(section));
    });
    
    // Check for tasks
    const taskMatches = planData.match(/- \[([ x])\]/g);
    console.log('Number of tasks found:', taskMatches?.length || 0);
  } else if (planData && typeof planData === 'object' && 'plan' in planData) {
    // If it's an object with a plan property
    const planContent = (planData as any).plan;
    console.log('Plan content type:', typeof planContent);
    console.log('Plan content preview:', typeof planContent === 'string' 
      ? planContent.substring(0, 200) + '...' 
      : JSON.stringify(planContent).substring(0, 200) + '...');
    
    // Check for markdown sections
    const sections = [
      '# 🎯 30-Day Action Plan',
      '# 💪 Building on Strengths',
      '# 📈 Progress Tracking',
      '# 🌟 Daily Habits'
    ];
    
    sections.forEach(section => {
      console.log(`Contains "${section}":`, planContent.includes(section));
    });
    
    // Check for tasks
    const taskMatches = planContent.match(/- \[([ x])\]/g);
    console.log('Number of tasks found:', taskMatches?.length || 0);
  } else {
    console.log('Plan data as object:', planData);
  }
}

/**
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
 * Parses a development plan string or object into a structured format
 * @param planData - The development plan data (string or object)
 * @returns A structured object with plan sections
 */
export function parseDevelopmentPlan(planData: string | object): any {
  // Ensure we have a string to work with
  const planString = typeof planData === 'string' ? planData : JSON.stringify(planData);
<<<<<<< HEAD
=======
  console.log('parseDevelopmentPlan - planString type:', typeof planString);
  console.log('parseDevelopmentPlan - planString preview:', planString.substring(0, 100) + '...');
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
  
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
<<<<<<< HEAD
  const planString = typeof planData === 'string' ? planData : JSON.stringify(planData);
  
  // Find all checkbox items
  const taskRegex = /- \[([ x])\] (.*?)(?=\n|$)/g;
=======
  let planString = '';
  
  if (!planData) {
    return [];
  } else if (typeof planData === 'string') {
    planString = planData;
  } else if (planData && typeof planData === 'object') {
    // Check if it has a plan property that's a string
    if ('plan' in planData) {
      const planValue = (planData as any).plan;
      if (typeof planValue === 'string') {
        planString = planValue;
      } else if (planValue && typeof planValue === 'object') {
        try {
          planString = JSON.stringify(planValue);
        } catch (err) {
          console.error('Error stringifying plan value:', err);
          return [];
        }
      }
    } else {
      try {
        planString = JSON.stringify(planData);
      } catch (err) {
        console.error('Error stringifying plan data:', err);
        return [];
      }
    }
  }
  
  console.log('extractTasks - planString type:', typeof planString);
  console.log('extractTasks - planString preview:', planString.substring(0, 100) + '...');
  
  // Find all checkbox items
  const taskRegex = /- \[([ xX])\] (.*?)(?=\n|$)/g;
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
  const tasks: Array<{text: string, completed: boolean}> = [];
  
  let match;
  while ((match = taskRegex.exec(planString)) !== null) {
    tasks.push({
      text: match[2].trim(),
<<<<<<< HEAD
      completed: match[1] === 'x'
    });
  }
  
=======
      completed: match[1] === 'x' || match[1] === 'X'
    });
  }
  
  console.log('extractTasks - found tasks:', tasks.length);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
  return tasks;
}

/**
 * Calculates the implementation progress percentage
 * @param planData - The development plan data
 * @returns A number between 0-100 representing completion percentage
 */
export function calculateImplementationProgress(planData: string | object): number {
  const tasks = extractTasks(planData);
<<<<<<< HEAD
=======
  console.log('calculateImplementationProgress - found tasks:', tasks.length);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
  
  if (tasks.length === 0) return 0;
  
  const completedTasks = tasks.filter(task => task.completed).length;
<<<<<<< HEAD
=======
  console.log('calculateImplementationProgress - completed tasks:', completedTasks);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
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
<<<<<<< HEAD
=======
  if (!planData || !taskText) {
    return planData || '';
  }
  
  console.log('updateTaskStatus - updating task:', taskText, 'to', completed ? 'completed' : 'not completed');
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
  const checkbox = completed ? '[x]' : '[ ]';
  
  // Escape special regex characters in the task text
  const escapedText = taskText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Create regex to find the task
  const taskRegex = new RegExp(`- \\[[ x]\\] ${escapedText}`, 'g');
<<<<<<< HEAD
  
  // Replace the task with updated checkbox
  return planData.replace(taskRegex, `- ${checkbox} ${taskText}`);
=======
  console.log('updateTaskStatus - regex pattern:', taskRegex);
  
  // Replace the task with updated checkbox
  const updatedPlan = planData.replace(taskRegex, `- ${checkbox} ${taskText}`);
  console.log('updateTaskStatus - plan updated:', updatedPlan !== planData);
  return updatedPlan;
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
}