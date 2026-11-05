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
import { destroy } from '@/routes/brands';
import type { Brand } from '@/types';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    brand: Brand;
};

export function DeleteBrandDialog({ isOpen, onClose, brand }: Props) {
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        router.delete(destroy.url(brand.id), {
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
                    <DialogTitle>Delete brand</DialogTitle>
                    <DialogDescription className="text-xs">
                        This action cannot be undone. This will permanently
                        delete the brand{' '}
                        <span className="font-bold text-foreground">
                            {brand.name}
                        </span>
                        . Brands that still have models cannot be deleted.
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
