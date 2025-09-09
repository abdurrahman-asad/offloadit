import { useState } from 'react';
import { TbPlus, TbLoader2, TbExclamationCircle } from 'react-icons/tb';
import { useTasks } from '../../hooks';
import { Button } from '../../ui';
import { TaskCard } from './TaskCard';
import { CreateTaskModal } from './CreateTaskModal';

export const Home = () => {
  const { tasks, loading, error, createTask } = useTasks();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateTask = async (
    taskDescription: string,
    destination: string | null,
    destinationValue: string | null,
  ) => {
    await createTask(taskDescription, destination, destinationValue);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center gap-2 text-muted-foreground">
          <TbLoader2 className="animate-spin" size={20} />
          <span>Loading tasks...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center gap-2 text-destructive">
          <TbExclamationCircle size={20} />
          <span>An error has occured while loading the tasks. Please try refreshing the page.</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground mt-1">Recently created tasks</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <TbPlus />
          Create Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-96 text-center">
          <div className="bg-muted/20 rounded-full p-6 mb-4">
            <TbPlus className="text-muted-foreground" size={32} />
          </div>
          <h2 className="text-xl font-semibold mb-2">No tasks yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            You haven't created any tasks yet. Get started by offloading your first task to us and
            focus on what matters most.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => {
                // TODO: Handle task click (e.g., open task details modal)
                console.log('Task clicked:', task);
              }}
            />
          ))}
        </div>
      )}

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
};
