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
import { store } from '@/routes/offices';
import type { OfficeForm as OfficeFormData } from '@/types';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export function CreateOfficeDialog({ isOpen, onClose }: Props) {
    const { data, setData, post, reset, errors, processing } =
        useForm<OfficeFormData>({
            name: '',
            code: '',
        });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        post(store.url(), {
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
                        <DialogTitle>Create office</DialogTitle>
                        <DialogDescription className="text-xs">
                            Add a new office by providing the required details.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="office-name">Name</Label>
                            <Input
                                id="office-name"
                                value={data.name}
                                onChange={(event) =>
                                    setData('name', event.target.value)
                                }
                                placeholder="e.g. Office of the Municipal Mayor"
                                autoFocus
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="office-code">Code</Label>
                            <Input
                                id="office-code"
                                value={data.code}
                                onChange={(event) =>
                                    setData('code', event.target.value)
                                }
                                placeholder="e.g. MO"
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
                            {processing ? 'Saving...' : 'Create office'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
