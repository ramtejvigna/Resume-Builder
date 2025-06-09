
"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'; // Added Input
import { Edit3 } from 'lucide-react';

interface DirectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentText: string;
  onSave: (newText: string) => void;
  label: string;
  isTextarea?: boolean; // To differentiate between input and textarea
}

const DirectEditModal: FC<DirectEditModalProps> = ({
  isOpen,
  onClose,
  currentText,
  onSave,
  label,
  isTextarea = true, // Default to textarea
}) => {
  const [editText, setEditText] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setEditText(currentText);
    }
  }, [currentText, isOpen]);

  const handleSave = () => {
    onSave(editText);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center">
            <Edit3 className="mr-2 h-5 w-5 text-primary" />
            Edit {label}
          </DialogTitle>
          <DialogDescription>
            Make changes to your {label.toLowerCase()}. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-text-field">{label}</Label>
            {isTextarea ? (
              <Textarea
                id="edit-text-field"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={label.toLowerCase().includes('description') || label.toLowerCase().includes('summary') ? 5 : 3}
                className="bg-background"
              />
            ) : (
              <Input
                id="edit-text-field"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="bg-background"
              />
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DirectEditModal;
