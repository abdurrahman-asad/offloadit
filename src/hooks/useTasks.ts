import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { toast } from '@ui';
import type { User } from '@supabase/supabase-js';

export interface Task {
  id: string;
  description: string;
  is_complete: boolean;
  output: string | null;
  destination: string | null;
  destination_value: string | null;
  created_at: string;
  created_by: User;
  is_deleted: boolean;
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
        .eq('is_deleted', false)
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

  const createTask = async (
    description: string,
    destination: string | null = null,
    destinationValue: string | null = null,
  ) => {
    try {
      // Validation: if destination is provided, destination_value must also be provided
      if (destination && !destinationValue?.trim()) {
        throw new Error('Destination value is required when destination is selected');
      }

      const { data, error: supabaseError } = await supabase.functions.invoke('create-task', {
        body: {
          description,
          destination,
          destination_value: destinationValue,
        },
        method: 'POST',
      });

      if (supabaseError) {
        throw supabaseError;
      }

      setTasks(prev => [data.data, ...prev]);
      toast.success('Task created successfully!');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      toast.error(errorMessage);
    }
  };

  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'created_at'>>) => {
    try {
      // If this is a deletion operation, don't expect data back
      if (updates.is_deleted === true) {
        const { error: supabaseError } = await supabase
          .schema('api')
          .from('tasks')
          .update(updates)
          .eq('id', id);

        if (supabaseError) {
          throw supabaseError;
        }

        // Remove the task from local state since it's now deleted
        setTasks(prev => prev.filter(task => task.id !== id));
        toast.success('Task deleted successfully!');
        return;
      }

      // For non-deletion updates, get the data back
      const { data, error: supabaseError } = await supabase
        .schema('api')
        .from('tasks')
        .update({ ...updates })
        // .update({ ...updates, updated_at: new Date().toISOString() })
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

  // const deleteTask = async (id: string) => {
  //   try {
  //     const { error: supabaseError } = await supabase.from('tasks').delete().eq('id', id);

  //     if (supabaseError) {
  //       throw supabaseError;
  //     }

  //     setTasks(prev => prev.filter(task => task.id !== id));
  //     toast.success('Task deleted successfully!');
  //   } catch (err) {
  //     const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
  //     setError(errorMessage);
  //     toast.error(errorMessage);
  //     throw err;
  //   }
  // };

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
    // deleteTask,
  };
};
