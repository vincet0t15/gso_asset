import { useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';
import InputError from '@/components/input-error';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { update } from '@/routes/brands';
import type { Brand, BrandForm as BrandFormData } from '@/types';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    brand: Brand;
};

export function EditBrandDialog({ isOpen, onClose, brand }: Props) {
    const { data, setData, patch, reset, errors, processing } =
        useForm<BrandFormData>({
            name: brand.name,
            code: brand.code,
            description: brand.description ?? '',
        });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        patch(update.url(brand.id), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-md">
                <form onSubmit={submit}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>Edit brand</DialogTitle>
                        <DialogDescription className="text-xs">
                            Update the brand details.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-brand-name">Name</Label>
                            <Input
                                id="edit-brand-name"
                                value={data.name}
                                onChange={(event) =>
                                    setData('name', event.target.value)
                                }
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-brand-code">Code</Label>
                            <Input
                                id="edit-brand-code"
                                value={data.code}
                                onChange={(event) =>
                                    setData('code', event.target.value)
                                }
                            />
                            <InputError message={errors.code} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-brand-description">
                                Description
                            </Label>
                            <Textarea
                                id="edit-brand-description"
                                value={data.description}
                                onChange={(event) =>
                                    setData('description', event.target.value)
                                }
                            />
                            <InputError message={errors.description} />
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Update brand'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
