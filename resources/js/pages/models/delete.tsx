import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { destroy } from '@/routes/models';
import type { AssetModel } from '@/types';

type Props = {
    model: AssetModel | null;
    open: boolean;
    onClose: () => void;
};

export function DeleteAssetModelDialog({ model, open, onClose }: Props) {
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        if (!model) {
            return;
        }

        router.delete(destroy.url(model.id), {
            onStart: () => setProcessing(true),
            onFinish: () => {
                setProcessing(false);
                onClose();
            },
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) {
                    onClose();
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete model</DialogTitle>
                    <DialogDescription>
                        This will permanently delete{' '}
                        <span className="font-semibold text-foreground">
                            {model?.name}
                        </span>
                        . This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
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
