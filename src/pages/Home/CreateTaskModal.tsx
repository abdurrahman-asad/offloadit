import { useState } from 'react';
import { TbPlus, TbX, TbLoader2 } from 'react-icons/tb';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Textarea,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
} from '../../ui';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    description: string,
    destination: string | null,
    destinationValue: string | null,
  ) => Promise<void>;
}

const DESCRIPTION_PLACEHOLDER =
  'Enter detailed instructions on how to complete the task. The more the details, the more accurately the agent can assist you.';

export const CreateTaskModal = ({ isOpen, onClose, onSubmit }: CreateTaskModalProps) => {
  const [description, setDescription] = useState('');
  const [destination, setDestination] = useState<string | null>(null);
  const [destinationValue, setDestinationValue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    if (destination && !destinationValue.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(description.trim(), destination, destination ? destinationValue.trim() : null);
      setDescription('');
      setDestination(null);
      setDestinationValue('');
      onClose();
    } catch {
      // Error is handled by the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onInteractOutside={e => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
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
          </div>

          <div>
            <Label htmlFor="destination-select">Destination</Label>
            <div className="flex gap-2 mt-1 items-center">
              <Select
                value={destination || ''}
                onValueChange={value => setDestination(value || null)}>
                <SelectTrigger id="destination-select" className="w-48">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="whatsapp" disabled>
                    WhatsApp (Coming Soon)
                  </SelectItem>
                </SelectContent>
              </Select>
              {destination && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="px-2"
                  onClick={() => {
                    setDestination(null);
                    setDestinationValue('');
                  }}>
                  <TbX />
                </Button>
              )}
            </div>
          </div>

          {destination && (
            <div>
              <Label htmlFor="destination-value-input">
                {destination === 'email' ? 'Email Address' : 'Destination Value'}
              </Label>
              <Input
                className="mt-1"
                id="destination-value-input"
                type={destination === 'email' ? 'email' : 'text'}
                value={destinationValue}
                onChange={e => setDestinationValue(e.target.value)}
                placeholder={
                  destination === 'email' ? 'Enter email address' : 'Enter destination value'
                }
                required
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !description.trim() || (destination && !destinationValue.trim()) || isSubmitting
              }>
              {isSubmitting ? (
                <>
                  <TbLoader2 className="animate-spin" />
                  Creating
                </>
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
