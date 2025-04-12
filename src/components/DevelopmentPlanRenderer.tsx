import React from 'react';
import { marked } from 'marked';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, Target, Calendar, Brain, Sparkles } from 'lucide-react';

interface DevelopmentPlanRendererProps {
  planData: string | object;
  className?: string;
}

export function DevelopmentPlanRenderer({ planData, className = '' }: DevelopmentPlanRendererProps) {
  // Ensure we have a string to work with
  const planString = typeof planData === 'string' ? planData : JSON.stringify(planData);
  
  // Parse the markdown content
  const parsedHtml = marked(planString);
  
  // Process the HTML to make checkboxes interactive
  const processedHtml = parsedHtml.replace(
    /- \[([ x])\] (.*?)(?=<\/li>|$)/g, 
    (match, checked, text) => {
      const isChecked = checked === 'x';
      const id = `task-${Math.random().toString(36).substring(2, 9)}`;
      return `<div class="flex items-start gap-2 my-2">
        <input type="checkbox" id="${id}" class="mt-1 rounded" ${isChecked ? 'checked' : ''} />
        <label for="${id}" class="${isChecked ? 'line-through text-muted-foreground' : ''}">${text}</label>
      </div>`;
    }
  );

  // Add custom styling for sections
  const styledHtml = processedHtml
    .replace(/<h1 id="(.*?)">(.*?)<\/h1>/g, (match, id, content) => {
      let icon = '';
      if (content.includes('Action Plan')) icon = '<span class="inline-block mr-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><circle cx="12" cy="12" r="10"/><path d="m16 12-4 4-4-4"/><path d="M12 8v8"/></svg></span>';
      if (content.includes('Strengths')) icon = '<span class="inline-block mr-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span>';
      if (content.includes('Progress')) icon = '<span class="inline-block mr-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="m22 12-4 4-4-4"/><path d="M8.5 14.5 6 18H2"/><path d="m2 6 4-4 4 4"/><path d="M18 10 6 10"/><path d="m18 6-8.5 8.5"/><path d="M18 14V6h-8"/></svg></span>';
      if (content.includes('Habits')) icon = '<span class="inline-block mr-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-500"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg></span>';
      
      return `<div class="mb-6"><h1 class="text-2xl font-bold flex items-center text-primary mb-2">${icon}${content}</h1><div class="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded mb-4"></div>`;
    })
    .replace(/<\/h1>/g, '</h1></div>')
    .replace(/<h2 id="(.*?)">(.*?)<\/h2>/g, '<h2 class="text-xl font-semibold mt-6 mb-3 text-secondary">$2</h2>')
    .replace(/<h3 id="(.*?)">(.*?)<\/h3>/g, '<h3 class="text-lg font-medium mt-4 mb-2 text-accent">$2</h3>');

  return (
    <div className={`development-plan-renderer ${className}`}>
      <Card className="bg-white/80 backdrop-blur-sm border-none shadow-sm">
        <CardContent className="p-6">
          <div 
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: styledHtml }}
          />
        </CardContent>
      </Card>
    </div>
  );
}