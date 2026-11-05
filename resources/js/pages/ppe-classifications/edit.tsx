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
import { update } from '@/routes/ppe-classifications';
import type { PpeClassification, PpeClassificationForm as PpeClassificationFormData } from '@/types';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    classification: PpeClassification;
};

export function EditPpeClassificationDialog({
    isOpen,
    onClose,
    classification,
}: Props) {
    const { data, setData, patch, reset, errors, processing } =
        useForm<PpeClassificationFormData>({
            name: classification.name,
            code: classification.code,
            description: classification.description ?? '',
        });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        patch(update.url(classification.id), {
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
                        <DialogTitle>Edit PPE classification</DialogTitle>
                        <DialogDescription className="text-xs">
                            Update the classification details.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-ppe-name">Name</Label>
                            <Input
                                id="edit-ppe-name"
                                value={data.name}
                                onChange={(event) =>
                                    setData('name', event.target.value)
                                }
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-ppe-code">Code</Label>
                            <Input
                                id="edit-ppe-code"
                                value={data.code}
                                onChange={(event) =>
                                    setData('code', event.target.value)
                                }
                            />
                            <InputError message={errors.code} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-ppe-description">
                                Description
                            </Label>
                            <Textarea
                                id="edit-ppe-description"
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
                            {processing ? 'Saving...' : 'Update classification'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
