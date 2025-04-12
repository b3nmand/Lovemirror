import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ProgressData {
  date: string;
  score: number;
}

interface ProgressChartProps {
  data: ProgressData[];
  color?: string;
}

export function ProgressChart({ data, color = '#8b5cf6' }: ProgressChartProps) {
  return (
    <Card>
      <CardContent className="p-6">
        {data.length > 0 ? (
          <div className="h-[300px] w-full">
            <div className="flex h-full flex-col">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Score</span>
                <span>Date</span>
              </div>
              <div className="relative flex-1">
                {data.map((item, index) => (
                  <div 
                    key={index}
                    className="absolute bottom-0 flex flex-col items-center"
                    style={{ 
                      left: `${(index / (data.length - 1)) * 100}%`,
                      height: `${item.score}%`,
                    }}
                  >
                    <div 
                      className="w-1 rounded-t-full" 
                      style={{ 
                        backgroundColor: color,
                        height: '100%'
                      }}
                    />
                    <div className="mt-2 text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                
                {/* Horizontal grid lines */}
                {[0, 25, 50, 75, 100].map((value) => (
                  <div 
                    key={value}
                    className="absolute w-full border-t border-gray-100 flex items-center"
                    style={{ bottom: `${value}%` }}
                  >
                    <span className="text-xs text-muted-foreground -mt-3">{value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No progress data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}