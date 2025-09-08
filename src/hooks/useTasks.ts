import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { toast } from '@ui';
import type { User } from '@supabase/supabase-js';

export interface Task {
  id: string;
  description: string;
  is_complete: boolean;
  created_at: string;
  created_by: User;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: supabaseError } = await supabase
        .schema('api')
        .from('tasks')
        .select('*, created_by:users (*)')
        .limit(10)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setTasks(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (description: string) => {
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('create-task', {
        body: { description },
        method: 'POST',
      });

      if (supabaseError) {
        throw supabaseError;
      }

      setTasks(prev => [{ ...data }, ...prev]);
      toast.success('Task created successfully!');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      toast.error(errorMessage);
    }
  };

  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'created_at'>>) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      setTasks(prev => prev.map(task => (task.id === id ? data : task)));
      toast.success('Task updated successfully!');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error: supabaseError } = await supabase.from('tasks').delete().eq('id', id);

      if (supabaseError) {
        throw supabaseError;
      }

      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};
