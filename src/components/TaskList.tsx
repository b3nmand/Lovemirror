import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { extractTasks, updateTaskStatus } from '@/lib/planUtils';
import { CheckCircle, Circle } from 'lucide-react';

interface TaskListProps {
  planData: string | object;
  onTaskUpdate?: (updatedPlan: string) => void;
}

export function TaskList({ planData, onTaskUpdate }: TaskListProps) {
  const [tasks, setTasks] = useState<Array<{text: string, completed: boolean}>>([]);
  
  useEffect(() => {
    if (planData) {
      const extractedTasks = extractTasks(planData);
      setTasks(extractedTasks);
    }
  }, [planData]);
  
  const handleTaskToggle = (taskText: string, completed: boolean) => {
    // Update local state
    setTasks(prev => 
      prev.map(task => 
        task.text === taskText ? { ...task, completed } : task
      )
    );
    
    // Update the plan if callback provided
    if (onTaskUpdate && typeof planData === 'string') {
      const updatedPlan = updateTaskStatus(planData, taskText, completed);
      onTaskUpdate(updatedPlan);
    }
  };
  
  // Group tasks by category (extracted from task text)
  const groupedTasks: Record<string, Array<{text: string, completed: boolean}>> = {};
  
  tasks.forEach(task => {
    // Look for category in parentheses at the end of the task
    const categoryMatch = task.text.match(/\(([^)]+)\)$/);
    const category = categoryMatch ? categoryMatch[1] : 'General';
    const taskText = categoryMatch ? task.text.replace(/\([^)]+\)$/, '').trim() : task.text;
    
    if (!groupedTasks[category]) {
      groupedTasks[category] = [];
    }
    
    groupedTasks[category].push({
      text: taskText,
      completed: task.completed
    });
  });
  
  return (
    <div className="space-y-6">
      {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
        <Card key={category} className="overflow-hidden">
          <CardHeader className="bg-muted/50 py-3">
            <CardTitle className="text-lg flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2" />
              {category}
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {categoryTasks.filter(t => t.completed).length}/{categoryTasks.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              {categoryTasks.map((task, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Checkbox 
                    id={`task-${category}-${index}`}
                    checked={task.completed}
                    onCheckedChange={(checked) => 
                      handleTaskToggle(task.text, checked === true)
                    }
                    className="mt-1"
                  />
                  <label 
                    htmlFor={`task-${category}-${index}`}
                    className={`${task.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {task.text}
                  </label>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
      
      {Object.keys(groupedTasks).length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No tasks found in the development plan
        </div>
      )}
    </div>
  );
}