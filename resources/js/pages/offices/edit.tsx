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
import { update } from '@/routes/offices';
import type { Office, OfficeForm as OfficeFormData } from '@/types';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    office: Office;
};

export function EditOfficeDialog({ isOpen, onClose, office }: Props) {
    const { data, setData, patch, reset, errors, processing } =
        useForm<OfficeFormData>({
            name: office.name,
            code: office.code,
        });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        patch(update.url(office.id), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm rounded-md">
                <form onSubmit={submit}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>Edit office</DialogTitle>
                        <DialogDescription className="text-xs">
                            Update the office details.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-office-name">Name</Label>
                            <Input
                                id="edit-office-name"
                                value={data.name}
                                onChange={(event) =>
                                    setData('name', event.target.value)
                                }
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-office-code">Code</Label>
                            <Input
                                id="edit-office-code"
                                value={data.code}
                                onChange={(event) =>
                                    setData('code', event.target.value)
                                }
                            />
                            <InputError message={errors.code} />
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Update office'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
