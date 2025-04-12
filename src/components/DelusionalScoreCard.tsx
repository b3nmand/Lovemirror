import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { ScoreRange } from '../types/assessment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DelusionalScoreProps {
  categoryName: string;
  selfScore: number;
  externalScore: number;
  gapScore: number;
}

function getDelusionalRange(gap: number): ScoreRange {
  if (gap <= 10) {
    return {
      min: 0,
      max: 10,
      label: 'Highly self-aware',
      color: '#22C55E',
      description: 'Your self-perception closely matches how others see you',
    };
  } else if (gap <= 20) {
    return {
      min: 11,
      max: 20,
      label: 'Some self-blind spots',
      color: '#EAB308',
      description: 'Minor differences between self-perception and external views',
    };
  } else if (gap <= 30) {
    return {
      min: 21,
      max: 30,
      label: 'Growing self-awareness gap',
      color: '#FB923C',
      description: 'Notable differences in how you see yourself versus others',
    };
  } else {
    return {
      min: 31,
      max: 100,
      label: 'Significant misalignment',
      color: '#EF4444',
      description: 'Large gap between self-perception and external views',
    };
  }
}

function getIcon(gap: number) {
  if (gap <= 10) {
    return <CheckCircle className="w-6 h-6 text-emerald-500" />;
  } else if (gap <= 20) {
    return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
  } else {
    return <XCircle className="w-6 h-6 text-red-500" />;
  }
}

export function DelusionalScoreCard({ 
  categoryName, 
  selfScore, 
  externalScore, 
  gapScore 
}: DelusionalScoreProps) {
  const range = getDelusionalRange(gapScore);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{categoryName}</CardTitle>
            <CardDescription>Gap Score: {gapScore.toFixed(1)}%</CardDescription>
          </div>
          {getIcon(gapScore)}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Your Score</span>
            <span className="font-semibold">{selfScore.toFixed(1)}%</span>
          </div>
          <Progress value={selfScore} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>External Score</span>
            <span className="font-semibold">{externalScore.toFixed(1)}%</span>
          </div>
          <Progress value={externalScore} className="h-2 bg-secondary/50" />
        </div>

        <div 
          className="mt-4 p-3 rounded-lg text-sm"
          style={{ 
            backgroundColor: `${range.color}10`,
            color: range.color,
          }}
        >
          <p className="font-medium">{range.label}</p>
          <p className="mt-1 opacity-90">{range.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}