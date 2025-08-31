import { useState } from 'react';
import { TbPlus } from 'react-icons/tb';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Textarea,
  Label,
} from '../../ui';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (description: string) => Promise<void>;
}

const DESCRIPTION_PLACEHOLDER =
  'Enter detailed instructions on how to complete the task. The more the details, the more accurately the agent can assist you.';

export const CreateTaskModal = ({ isOpen, onClose, onSubmit }: CreateTaskModalProps) => {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(description.trim());
      setDescription('');
      onClose();
    } catch {
      // Error is handled by the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Label htmlFor="task-description-input">Description</Label>
          <Textarea
            className="mt-1"
            id="task-description-input"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={DESCRIPTION_PLACEHOLDER}
            rows={5}
            required
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!description.trim() || isSubmitting}>
              {isSubmitting ? (
                'Creating...'
              ) : (
                <>
                  <TbPlus />
                  Create Task
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
