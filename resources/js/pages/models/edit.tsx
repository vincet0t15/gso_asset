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
import { CustomComboBox } from '@/components/CustomComboBox';
import { Textarea } from '@/components/ui/textarea';
import { update } from '@/routes/models';
import type {
    AssetModel,
    AssetModelForm as AssetModelFormData,
    BrandOption,
} from '@/types';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    model: AssetModel;
    brands: BrandOption[];
};

export function EditAssetModelDialog({
    isOpen,
    onClose,
    model,
    brands,
}: Props) {
    const { data, setData, patch, reset, errors, processing } =
        useForm<AssetModelFormData>({
            brand_id: String(model.brand_id),
            name: model.name,
            code: model.code,
            description: model.description ?? '',
        });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        patch(update.url(model.id), {
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
                        <DialogTitle>Edit model</DialogTitle>
                        <DialogDescription className="text-xs">
                            Update the model details and brand.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-model-brand">Brand</Label>
                            <CustomComboBox
                                items={brands.map((brand) => ({
                                    value: String(brand.id),
                                    label: brand.name,
                                }))}
                                placeholder="Select a brand"
                                value={
                                    data.brand_id === ''
                                        ? null
                                        : data.brand_id
                                }
                                onSelect={(value) =>
                                    setData('brand_id', value ?? '')
                                }
                            />
                            <InputError message={errors.brand_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-model-name">Model name</Label>
                            <Input
                                id="edit-model-name"
                                value={data.name}
                                onChange={(event) =>
                                    setData('name', event.target.value)
                                }
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-model-code">Code</Label>
                            <Input
                                id="edit-model-code"
                                value={data.code}
                                onChange={(event) =>
                                    setData('code', event.target.value)
                                }
                            />
                            <InputError message={errors.code} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-model-description">
                                Description
                            </Label>
                            <Textarea
                                id="edit-model-description"
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
                            {processing ? 'Saving...' : 'Update model'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
