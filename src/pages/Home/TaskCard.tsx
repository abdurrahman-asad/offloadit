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
  return (
    <Card
      className="justify-between cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}>
      <div className="flex items-start justify-between px-4">
        <p className="break-words hyphens-auto line-clamp-2 pr-2 leading-tight">
          {task.description}
        </p>
        <Badge variant={task.is_complete ? 'default' : 'secondary'}>
          {task.is_complete ? 'Completed' : 'Running'}
        </Badge>
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
