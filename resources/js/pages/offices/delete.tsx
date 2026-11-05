import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { destroy } from '@/routes/offices';
import type { Office } from '@/types';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    office: Office;
};

export function DeleteOfficeDialog({ isOpen, onClose, office }: Props) {
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        router.delete(destroy.url(office.id), {
            onStart: () => setProcessing(true),
            onFinish: () => {
                setProcessing(false);
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm rounded-md">
                <DialogHeader className="mb-2">
                    <DialogTitle>Delete office</DialogTitle>
                    <DialogDescription className="text-xs">
                        This action cannot be undone. This will permanently
                        delete the office{' '}
                        <span className="font-bold text-foreground">
                            {office.name}
                        </span>
                        .
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={processing}
                    >
                        {processing ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
