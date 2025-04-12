import React, { useState, useEffect } from 'react';
import { Target, Plus, TrendingUp, Trophy, Calendar, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';

interface Goal {
  id: string;
  category: string;
  target: number;
  current: number;
  deadline: string;
}

interface Habit {
  id: string;
  name: string;
  streak: number;
  lastCompleted: string;
}

export function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState({
    category: '',
    target: 80,
    deadline: ''
  });
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: ''
  });
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null);
  const [deleteHabitId, setDeleteHabitId] = useState<string | null>(null);

  useEffect(() => {
    fetchGoalsAndHabits();
  }, []);

  const fetchGoalsAndHabits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Fetch goals and habits
      // This would be implemented when we add the tables
      setLoading(false);
      
      // Placeholder data
      setGoals([
        {
          id: '1',
          category: 'Emotional Intelligence',
          target: 80,
          current: 45,
          deadline: '2025-06-30'
        },
        {
          id: '2',
          category: 'Financial Stability',
          target: 90,
          current: 60,
          deadline: '2025-07-15'
        }
      ]);
      
      setHabits([
        {
          id: '1',
          name: 'Daily Communication',
          streak: 7,
          lastCompleted: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Budget Review',
          streak: 3,
          lastCompleted: new Date().toISOString()
        }
      ]);
    } catch (err) {
      console.error('Error fetching goals and habits:', err);
    }
  };

  const handleAddGoal = async () => {
    // This would be implemented when we add the tables
    console.log('Adding goal:', newGoal);
    setShowGoalForm(false);
  };

  const handleAddHabit = async () => {
    // This would be implemented when we add the tables
    console.log('Adding habit:', newHabit);
    setShowHabitForm(false);
  };

  const handleDeleteGoal = async (id: string) => {
    // This would be implemented when we add the tables
    console.log('Deleting goal:', id);
    setDeleteGoalId(null);
  };

  const handleDeleteHabit = async (id: string) => {
    // This would be implemented when we add the tables
    console.log('Deleting habit:', id);
    setDeleteHabitId(null);
  };

  const handleCompleteHabit = async (id: string) => {
    // This would be implemented when we add the tables
    console.log('Completing habit:', id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="text-center mb-12 bg-white/80 backdrop-blur-sm border-none">
          <CardHeader>
            <Target className="w-16 h-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl">Goals & Habits</CardTitle>
            <CardDescription className="text-lg">
              Track your progress and build better relationship habits
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Goals Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Target className="w-6 h-6 text-primary mr-2" />
                  Improvement Goals
                </CardTitle>
                <Button
                  onClick={() => setShowGoalForm(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Goal
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {goals.length > 0 ? (
                <div className="space-y-4">
                  {goals.map(goal => (
                    <Card key={goal.id} className="relative">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{goal.category}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5 mr-1" />
                              <span>Due {formatDate(goal.deadline)}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setDeleteGoalId(goal.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{goal.current}%</span>
                          </div>
                          <Progress value={(goal.current / goal.target) * 100} />
                          <div className="text-sm text-muted-foreground">
                            Target: {goal.target}%
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No goals set yet</p>
                  <Button
                    onClick={() => setShowGoalForm(true)}
                    variant="link"
                    className="mt-2"
                  >
                    Set your first goal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Habits Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Trophy className="w-6 h-6 text-secondary mr-2" />
                  Daily Habits
                </CardTitle>
                <Button
                  onClick={() => setShowHabitForm(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Habit
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {habits.length > 0 ? (
                <div className="space-y-4">
                  {habits.map(habit => (
                    <Card key={habit.id} className="relative">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{habit.name}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="w-3.5 h-3.5 mr-1" />
                              <span>{habit.streak} day streak</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center"
                              onClick={() => handleCompleteHabit(habit.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Complete
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setDeleteHabitId(habit.id)}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No habits tracked yet</p>
                  <Button
                    onClick={() => setShowHabitForm(true)}
                    variant="link"
                    className="mt-2"
                  >
                    Create your first habit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Goal Dialog */}
      <Dialog open={showGoalForm} onOpenChange={setShowGoalForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
            <DialogDescription>
              Set a specific improvement goal with a target and deadline
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newGoal.category}
                onValueChange={(value) => setNewGoal({...newGoal, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Emotional Intelligence">Emotional Intelligence</SelectItem>
                  <SelectItem value="Financial Stability">Financial Stability</SelectItem>
                  <SelectItem value="Communication Skills">Communication Skills</SelectItem>
                  <SelectItem value="Physical Health">Physical Health</SelectItem>
                  <SelectItem value="Mental Strength">Mental Strength</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target">Target Score (%)</Label>
              <Input
                id="target"
                type="number"
                min="1"
                max="100"
                value={newGoal.target}
                onChange={(e) => setNewGoal({...newGoal, target: parseInt(e.target.value)})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGoalForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGoal}>
              Add Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Habit Dialog */}
      <Dialog open={showHabitForm} onOpenChange={setShowHabitForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Habit</DialogTitle>
            <DialogDescription>
              Create a daily habit to improve your relationship skills
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Habit Name</Label>
              <Input
                id="name"
                value={newHabit.name}
                onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                placeholder="e.g., Daily Communication"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={newHabit.description}
                onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                placeholder="e.g., Have a meaningful conversation with partner"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowHabitForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddHabit}>
              Add Habit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Goal Confirmation */}
      <DeleteConfirmationDialog
        open={!!deleteGoalId}
        onOpenChange={() => setDeleteGoalId(null)}
        title="Delete Goal"
        description="Are you sure you want to delete this goal? This action cannot be undone."
        onConfirm={() => deleteGoalId && handleDeleteGoal(deleteGoalId)}
      />

      {/* Delete Habit Confirmation */}
      <DeleteConfirmationDialog
        open={!!deleteHabitId}
        onOpenChange={() => setDeleteHabitId(null)}
        title="Delete Habit"
        description="Are you sure you want to delete this habit? This action cannot be undone."
        onConfirm={() => deleteHabitId && handleDeleteHabit(deleteHabitId)}
      />
    </div>
  );
}