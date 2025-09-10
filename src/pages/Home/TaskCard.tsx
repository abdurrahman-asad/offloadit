import { Calendar, User } from 'lucide-react';
import { Card, CardContent, Badge } from '@ui';
import type { Task } from '../../hooks/useTasks';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const getTaskStatus = () => {
    if (!task.is_complete) {
      return { label: 'Running', variant: 'secondary' as const };
    }
    if (task.is_complete && !task.output) {
      return { label: 'Failed', variant: 'destructive' as const };
    }
    return { label: 'Completed', variant: 'default' as const };
  };

  const status = getTaskStatus();

  return (
    <Card
      className="justify-between cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}>
      <div className="flex items-start justify-between px-4">
        <p className="break-words hyphens-auto line-clamp-1 pr-2">{task.description}</p>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <CardContent>
        <div className="flex items-end justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Created {formatDate(task.created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>
                {task.created_by?.user_metadata?.fullname ||
                  task.created_by?.email?.split('@')[0] ||
                  'Unknown User'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
