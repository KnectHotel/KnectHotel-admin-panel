'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface ModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onCloseAction: () => void;
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  description,
  isOpen,
  onCloseAction,
  children
}) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onCloseAction();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="max-w-lg bg-offWhite border border-coffee">
        <DialogHeader>
          <DialogTitle className="text-[rgb(160,125,61)] mb-2">{title}</DialogTitle>
          <DialogDescription className="text-black">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
