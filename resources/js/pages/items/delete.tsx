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
import { destroy } from '@/routes/items';
import type { Item } from '@/types';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    item: Item;
};

export function DeleteItemDialog({ isOpen, onClose, item }: Props) {
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        router.delete(destroy.url(item.id), {
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
                    <DialogTitle>Delete item</DialogTitle>
                    <DialogDescription className="text-xs">
                        This action cannot be undone. This will permanently
                        delete the item{' '}
                        <span className="font-bold text-foreground">
                            {item.name}
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
