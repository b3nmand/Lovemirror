import React from 'react';
import { getScoreRange } from '../lib/scores';
import type { ScoreRange } from '../types/assessment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ScoreCardProps {
  title: string;
  score: number;
  description?: string;
  showRange?: boolean;
}

export function ScoreCard({ title, score, description, showRange = true }: ScoreCardProps) {
  const range: ScoreRange = getScoreRange(score);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="text-4xl font-bold"
            style={{ color: range.color }}
          >
            {score.toFixed(1)}%
          </div>
          {showRange && (
            <div 
              className="text-sm px-3 py-1 rounded-full"
              style={{ 
                backgroundColor: `${range.color}20`,
                color: range.color,
              }}
            >
              {range.label}
            </div>
          )}
        </div>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
        <div className="mt-4">
          <Progress 
            value={score} 
            className="h-2"
            style={{ 
              '--progress-background': range.color,
            } as React.CSSProperties}
          />
        </div>
      </CardContent>
    </Card>
  );
}