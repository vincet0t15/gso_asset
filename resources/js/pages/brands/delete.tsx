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
import { destroy } from '@/routes/brands';
import type { Brand } from '@/types';

type Props = {
    brand: Brand | null;
    open: boolean;
    onClose: () => void;
};

export function DeleteBrandDialog({ brand, open, onClose }: Props) {
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        if (!brand) {
            return;
        }

        router.delete(destroy.url(brand.id), {
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
                    <DialogTitle>Delete brand</DialogTitle>
                    <DialogDescription>
                        This will permanently delete{' '}
                        <span className="font-semibold text-foreground">
                            {brand?.name}
                        </span>
                        . Brands that still have models cannot be deleted.
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
