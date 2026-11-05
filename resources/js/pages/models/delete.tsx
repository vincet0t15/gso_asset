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
import { destroy } from '@/routes/models';
import type { AssetModel } from '@/types';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    model: AssetModel;
};

export function DeleteAssetModelDialog({ isOpen, onClose, model }: Props) {
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        router.delete(destroy.url(model.id), {
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
                    <DialogTitle>Delete model</DialogTitle>
                    <DialogDescription className="text-xs">
                        This action cannot be undone. This will permanently
                        delete the model{' '}
                        <span className="font-bold text-foreground">
                            {model.name}
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
