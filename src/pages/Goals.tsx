import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
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
=======
import { Target, TrendingUp, Trophy, Calendar, CheckCircle, Clock, Trash2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { DeleteConfirmationDialog } from '../components/ui/delete-confirmation-dialog';
import { Checkbox } from '../components/ui/checkbox';
import { Alert, AlertDescription } from '../components/ui/alert';

// Define interfaces for goals and habits
interface Goal {
  id: string;
  area: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  is_ai_generated: boolean;
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
}

interface Habit {
  id: string;
  name: string;
  streak: number;
  lastCompleted: string;
}

<<<<<<< HEAD
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

=======
interface Task {
  id: string;
  goal_id: string;
  title: string;
  completed: boolean;
  completed_at: string | null;
}

export function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [tasks, setTasks] = useState<Record<string, Task[]>>({});
  const [loading, setLoading] = useState(true);
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null);
  const [deleteHabitId, setDeleteHabitId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    checkSubscriptionStatus();
    fetchGoalsAndHabits();
    checkForDevelopmentPlan();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .single();
        
      setHasSubscription(subscription?.status === 'active');
    } catch (err) {
      console.error('Error checking subscription status:', err);
    }
  };

>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
  const fetchGoalsAndHabits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

<<<<<<< HEAD
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
=======
      // Fetch goals from database
      const { data: goalsData, error: goalsError } = await supabase
        .from('improvement_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_ai_generated', true)
        .order('created_at', { ascending: false });
        
      if (goalsError) {
        console.error('Error fetching goals:', goalsError);
        setError('Failed to load goals. Please try again.');
      } else {
        // Format goals data
        const formattedGoals = goalsData?.map(goal => ({
          id: goal.id,
          area: goal.area,
          title: goal.title,
          target: goal.target_score,
          current: goal.current_score,
          deadline: goal.deadline,
          status: goal.status,
          is_ai_generated: goal.is_ai_generated
        })) || [];
        
        setGoals(formattedGoals);
        
        // Fetch tasks for each goal
        if (formattedGoals.length > 0) {
          const tasksByGoal: Record<string, Task[]> = {};
          
          for (const goal of formattedGoals) {
            const { data: tasksData, error: tasksError } = await supabase
              .from('improvement_tasks')
              .select('*')
              .eq('goal_id', goal.id)
              .order('created_at', { ascending: true });
              
            if (!tasksError && tasksData) {
              tasksByGoal[goal.id] = tasksData;
            }
          }
          
          setTasks(tasksByGoal);
        }
      }
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      
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
<<<<<<< HEAD
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
=======
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching goals and habits:', err);
      setError('Failed to load goals and habits. Please try again.');
    }
  };

  const checkForDevelopmentPlan = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if there's a development plan without goals
      const { data: plan } = await supabase
        .from('development_plans')
        .select('id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (plan) {
        // Check if goals exist for this plan
        const { data: goals } = await supabase
          .from('improvement_goals')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_ai_generated', true)
          .limit(1);

        if (!goals || goals.length === 0) {
          // No goals exist, generate them
          const { error } = await supabase.rpc(
            'generate_goals_from_plan',
            { 
              p_user_id: user.id,
              p_plan_data: plan
            }
          );

          if (error) {
            console.error('Error generating goals:', error);
            setError('Failed to generate goals from development plan');
          } else {
            // Refresh goals after generation
            fetchGoalsAndHabits();
          }
        }
      }
    } catch (err) {
      console.error('Error checking development plan:', err);
      setError('Failed to check development plan');
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      // Delete goal from database
      const { error: deleteError } = await supabase
        .from('improvement_goals')
        .delete()
        .eq('id', id);
        
      if (deleteError) {
        console.error('Error deleting goal:', deleteError);
        return;
      }
      
      // Remove goal from state
      setGoals(prev => prev.filter(goal => goal.id !== id));
      
      // Remove tasks for this goal from state
      const newTasks = { ...tasks };
      delete newTasks[id];
      setTasks(newTasks);
      
      // Close confirmation dialog
      setDeleteGoalId(null);
    } catch (err) {
      console.error('Error deleting goal:', err);
      setError('Failed to delete goal. Please try again.');
    }
    
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    setDeleteGoalId(null);
  };

  const handleDeleteHabit = async (id: string) => {
    // This would be implemented when we add the tables
    console.log('Deleting habit:', id);
    setDeleteHabitId(null);
  };

<<<<<<< HEAD
=======
  const handleCompleteTask = async (goalId: string, taskId: string, completed: boolean) => {
    try {
      // Update task in database
      const { error: updateError } = await supabase
        .from('improvement_tasks')
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null
        })
        .eq('id', taskId);
        
      if (updateError) {
        console.error('Error updating task:', updateError);
        return;
      }
      
      // Update task in state
      setTasks(prev => ({
        ...prev,
        [goalId]: prev[goalId].map(task => 
          task.id === taskId ? { ...task, completed, completed_at: completed ? new Date().toISOString() : null } : task
        )
      }));
    } catch (err) {
      console.error('Error completing task:', err);
      setError('Failed to update task. Please try again.');
    }
  };
  
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
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

<<<<<<< HEAD
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="text-center mb-12 bg-white/80 backdrop-blur-sm border-none">
          <CardHeader>
            <Target className="w-16 h-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl">Goals & Habits</CardTitle>
            <CardDescription className="text-lg">
              Track your progress and build better relationship habits
=======
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasSubscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center mb-12 bg-white/80 backdrop-blur-sm border-none">
            <CardHeader>
              <Target className="w-16 h-16 text-primary mx-auto mb-4" />
              <CardTitle className="text-3xl">Premium Feature</CardTitle>
              <CardDescription className="text-lg">
                AI-Generated Goals are available exclusively to premium members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-muted-foreground">
                Subscribe to unlock AI-powered goals that are automatically generated 
                based on your assessment results and development plan.
              </p>
              <Button
                onClick={() => window.location.href = '/dashboard?showSubscription=true'}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                size="lg"
              >
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-2 sm:px-4">
      <div className="max-w-2xl mx-auto w-full">
        <Card className="text-center mb-12 bg-white/80 backdrop-blur-sm border-none">
          <CardHeader>
            <Target className="w-16 h-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl">AI-Generated Goals</CardTitle>
            <CardDescription className="text-lg">
              Your personalized goals based on your assessment results
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
            </CardDescription>
          </CardHeader>
        </Card>

<<<<<<< HEAD
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Goals Section */}
          <Card>
=======
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Goals Section */}
          <Card className="w-full">
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Target className="w-6 h-6 text-primary mr-2" />
<<<<<<< HEAD
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
=======
                  AI-Generated Goals
                </CardTitle>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
              </div>
            </CardHeader>

            <CardContent>
              {goals.length > 0 ? (
                <div className="space-y-4">
                  {goals.map(goal => (
<<<<<<< HEAD
                    <Card key={goal.id} className="relative">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{goal.category}</h3>
=======
                    <Card key={goal.id} className="relative w-full">
                      <div className="absolute top-2 right-2 bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">AI Generated</div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{goal.title}</h3>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
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
<<<<<<< HEAD
=======
                        
                        {/* Tasks for this goal */}
                        {tasks[goal.id] && tasks[goal.id].length > 0 && (
                          <div className="mt-4 space-y-2">
                            <h4 className="text-sm font-medium">Tasks</h4>
                            <ul className="space-y-2">
                              {tasks[goal.id].map(task => (
                                <li key={task.id} className="flex items-start gap-2">
                                  <Checkbox
                                    id={`task-${task.id}`}
                                    checked={task.completed}
                                    onCheckedChange={(checked) => 
                                      handleCompleteTask(goal.id, task.id, checked === true)
                                    }
                                    className="mt-1"
                                  />
                                  <label 
                                    htmlFor={`task-${task.id}`}
                                    className={`${
                                      task.completed 
                                        ? 'line-through text-muted-foreground' 
                                        : 'text-gray-800'
                                    }`}
                                  >{task.title}</label>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
<<<<<<< HEAD
                  <p>No goals set yet</p>
                  <Button
                    onClick={() => setShowGoalForm(true)}
                    variant="link"
                    className="mt-2"
                  >
                    Set your first goal
                  </Button>
=======
                  <p>No AI-generated goals yet</p>
                    <p className="text-sm mt-2">Complete an assessment to get AI-generated goals based on your results</p>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                </div>
              )}
            </CardContent>
          </Card>

          {/* Habits Section */}
<<<<<<< HEAD
          <Card>
=======
          <Card className="w-full">
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Trophy className="w-6 h-6 text-secondary mr-2" />
                  Daily Habits
                </CardTitle>
<<<<<<< HEAD
                <Button
                  onClick={() => setShowHabitForm(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Habit
                </Button>
=======
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
              </div>
            </CardHeader>

            <CardContent>
              {habits.length > 0 ? (
                <div className="space-y-4">
                  {habits.map(habit => (
<<<<<<< HEAD
                    <Card key={habit.id} className="relative">
=======
                    <Card key={habit.id} className="relative w-full">
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
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
<<<<<<< HEAD
                              className="flex items-center"
=======
                              className="flex items-center w-full"
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
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
<<<<<<< HEAD
                  <Button
                    onClick={() => setShowHabitForm(true)}
                    variant="link"
                    className="mt-2"
                  >
                    Create your first habit
                  </Button>
=======
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

<<<<<<< HEAD
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

=======
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
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