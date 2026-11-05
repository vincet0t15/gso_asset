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
import { store } from '@/routes/models';
import type { AssetModelForm as AssetModelFormData, BrandOption } from '@/types';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    brands: BrandOption[];
};

export function CreateAssetModelDialog({ isOpen, onClose, brands }: Props) {
    const { data, setData, post, reset, errors, processing } =
        useForm<AssetModelFormData>({
            brand_id: '',
            name: '',
            code: '',
            description: '',
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
            <DialogContent className="sm:max-w-md rounded-md">
                <form onSubmit={submit}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>Create model</DialogTitle>
                        <DialogDescription className="text-xs">
                            Add a new asset model and assign it to a brand.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="model-brand">Brand</Label>
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
                            <Label htmlFor="model-name">Model name</Label>
                            <Input
                                id="model-name"
                                value={data.name}
                                onChange={(event) =>
                                    setData('name', event.target.value)
                                }
                                placeholder="e.g. Latitude 5440"
                                autoFocus
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="model-code">Code</Label>
                            <Input
                                id="model-code"
                                value={data.code}
                                onChange={(event) =>
                                    setData('code', event.target.value)
                                }
                                placeholder="e.g. LAT-5440"
                            />
                            <InputError message={errors.code} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="model-description">
                                Description
                            </Label>
                            <Textarea
                                id="model-description"
                                value={data.description}
                                onChange={(event) =>
                                    setData('description', event.target.value)
                                }
                                placeholder="Optional notes about this model..."
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
                            {processing ? 'Saving...' : 'Create model'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
