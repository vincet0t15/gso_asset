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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { store } from '@/routes/items';
import type {
    ItemForm as ItemFormData,
    ItemOption,
} from '@/types';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    brands: ItemOption[];
    models: ItemOption[];
    categories: ItemOption[];
    ppeClassifications: ItemOption[];
};

export function CreateItemDialog({
    isOpen,
    onClose,
    brands,
    models,
    categories,
    ppeClassifications,
}: Props) {
    const { data, setData, post, reset, errors, processing, transform } =
        useForm<ItemFormData>({
            name: '',
            stock_number: '',
            brand_id: 'none',
            asset_model_id: 'none',
            category_id: 'none',
            ppe_classification_id: 'none',
            unit: 'pcs',
            unit_cost: '',
            description: '',
        });

    transform((data) => ({
        ...data,
        stock_number: data.stock_number || null,
        brand_id: data.brand_id === 'none' ? null : data.brand_id,
        asset_model_id:
            data.asset_model_id === 'none' ? null : data.asset_model_id,
        category_id: data.category_id === 'none' ? null : data.category_id,
        ppe_classification_id:
            data.ppe_classification_id === 'none'
                ? null
                : data.ppe_classification_id,
        unit_cost: data.unit_cost || null,
    }));

    const submit = (event: FormEvent) => {
        event.preventDefault();

        post(store.url(), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const toValue = (value: string) => (value === 'none' ? '' : value);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl rounded-md">
                <form onSubmit={submit}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>Create item</DialogTitle>
                        <DialogDescription className="text-xs">
                            Add a new master item to the catalog.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2 sm:col-span-2">
                            <Label htmlFor="item-name">Name</Label>
                            <Input
                                id="item-name"
                                value={data.name}
                                onChange={(event) =>
                                    setData('name', event.target.value)
                                }
                                placeholder="e.g. Laptop Dell Latitude 5440"
                                autoFocus
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="item-stock">Stock number</Label>
                            <Input
                                id="item-stock"
                                value={data.stock_number}
                                onChange={(event) =>
                                    setData('stock_number', event.target.value)
                                }
                                placeholder="e.g. STK-1234"
                            />
                            <InputError message={errors.stock_number} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="item-unit">Unit</Label>
                            <Input
                                id="item-unit"
                                value={data.unit}
                                onChange={(event) =>
                                    setData('unit', event.target.value)
                                }
                                placeholder="pcs"
                            />
                            <InputError message={errors.unit} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="item-brand">Brand</Label>
                            <Select
                                value={data.brand_id}
                                onValueChange={(value) =>
                                    setData('brand_id', value)
                                }
                            >
                                <SelectTrigger id="item-brand">
                                    <SelectValue placeholder="None" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {brands.map((brand) => (
                                        <SelectItem
                                            key={brand.id}
                                            value={String(brand.id)}
                                        >
                                            {brand.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.brand_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="item-model">Model</Label>
                            <Select
                                value={data.asset_model_id}
                                onValueChange={(value) =>
                                    setData('asset_model_id', value)
                                }
                            >
                                <SelectTrigger id="item-model">
                                    <SelectValue placeholder="None" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {models.map((model) => (
                                        <SelectItem
                                            key={model.id}
                                            value={String(model.id)}
                                        >
                                            {model.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.asset_model_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="item-category">Category</Label>
                            <Select
                                value={data.category_id}
                                onValueChange={(value) =>
                                    setData('category_id', value)
                                }
                            >
                                <SelectTrigger id="item-category">
                                    <SelectValue placeholder="None" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={String(category.id)}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.category_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="item-ppe">
                                PPE classification
                            </Label>
                            <Select
                                value={data.ppe_classification_id}
                                onValueChange={(value) =>
                                    setData('ppe_classification_id', value)
                                }
                            >
                                <SelectTrigger id="item-ppe">
                                    <SelectValue placeholder="None" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {ppeClassifications.map((ppe) => (
                                        <SelectItem
                                            key={ppe.id}
                                            value={String(ppe.id)}
                                        >
                                            {ppe.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError
                                message={errors.ppe_classification_id}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="item-cost">Unit cost</Label>
                            <Input
                                id="item-cost"
                                type="number"
                                step="0.01"
                                value={data.unit_cost}
                                onChange={(event) =>
                                    setData('unit_cost', event.target.value)
                                }
                                placeholder="0.00"
                            />
                            <InputError message={errors.unit_cost} />
                        </div>

                        <div className="grid gap-2 sm:col-span-2">
                            <Label htmlFor="item-description">
                                Description
                            </Label>
                            <Textarea
                                id="item-description"
                                value={data.description}
                                onChange={(event) =>
                                    setData('description', event.target.value)
                                }
                                placeholder="Optional notes about this item..."
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
                            {processing ? 'Saving...' : 'Create item'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
