import { useState } from 'react';
import {
  TbInfoCircle,
  TbCalendar,
  TbUser,
  TbMail,
  TbCheck,
  TbX,
  TbLoader2,
  TbTrash,
} from 'react-icons/tb';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Badge, Button } from '../../ui';
import type { Task } from '../../hooks/useTasks';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdateTask: (
    id: string,
    updates: Partial<Omit<Task, 'id' | 'created_at'>>,
  ) => Promise<Task | undefined>;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const TaskDetailsModal = ({
  isOpen,
  onClose,
  task,
  onUpdateTask,
}: TaskDetailsModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!task) return null;

  const handleDelete = async () => {
    if (!task) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this task?');

    if (confirmDelete) {
      try {
        setIsDeleting(true);
        await onUpdateTask(task.id, { is_deleted: true });
        onClose();
      } catch (error) {
        // Error is already handled by the useTasks hook
        console.error('Failed to delete task:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getTaskStatus = () => {
    if (!task.is_complete) {
      return { label: 'Running', variant: 'secondary' as const, icon: TbLoader2 };
    }
    if (task.is_complete && !task.output) {
      return { label: 'Failed', variant: 'destructive' as const, icon: TbX };
    }
    return { label: 'Completed', variant: 'default' as const, icon: TbCheck };
  };

  const status = getTaskStatus();
  const StatusIcon = status.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] min-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TbInfoCircle className="h-5 w-5" />
            Task Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Status</span>
            <Badge variant={status.variant} className="flex items-center gap-1">
              <StatusIcon
                className={`h-3 w-3 ${status.label === 'Running' ? 'animate-spin' : ''}`}
              />
              {status.label}
            </Badge>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
            <div className="bg-muted/30 rounded-md p-3">
              <p className="text-sm whitespace-pre-wrap break-words">{task.description}</p>
            </div>
          </div>

          {/* Output */}
          {task.output && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Output</h3>
              <div className="bg-muted/30 rounded-md p-3 max-h-[45vh] overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap break-words font-mono">
                  {task.output}
                </pre>
              </div>
            </div>
          )}

          {/* Destination */}
          {task.destination && task.destination_value && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Destination</h3>
              <div className="bg-muted/30 rounded-md p-3">
                <div className="flex items-center gap-2">
                  <TbMail />
                  <span className="text-sm font-medium capitalize">{task.destination}:</span>
                  <span className="text-sm">{task.destination_value}</span>
                </div>
              </div>
            </div>
          )}

          {/* Created Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Created At</h3>
              <div className="flex items-center gap-2 text-sm">
                <TbCalendar />
                {formatDate(task.created_at)}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Created By</h3>
              <div className="flex items-center gap-2 text-sm">
                <TbUser />
                {task.created_by?.user_metadata?.fullname ||
                  task.created_by?.email?.split('@')[0] ||
                  'Unknown User'}
              </div>
            </div>
          </div>

          {/* Delete Button */}
          <div className="pt-4 border-t flex justify-end">
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={!task.is_complete || isDeleting}>
              {isDeleting ? <TbLoader2 className="animate-spin" /> : <TbTrash />}
              {isDeleting ? 'Deleting' : 'Delete Task'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
