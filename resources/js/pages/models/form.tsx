import { Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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
import { index, store, update } from '@/routes/models';
import type { AssetModel, AssetModelForm as AssetModelFormData, BrandOption } from '@/types';

type Props = {
    brands: BrandOption[];
    model?: AssetModel;
};

export function AssetModelForm({ brands, model }: Props) {
    const isEdit = model !== undefined;

    const { data, setData, post, patch, processing, errors } =
        useForm<AssetModelFormData>({
            brand_id: model?.brand_id ? String(model.brand_id) : '',
            name: model?.name ?? '',
            code: model?.code ?? '',
            description: model?.description ?? '',
        });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (isEdit) {
            patch(update.url(model.id));
        } else {
            post(store.url());
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-2">
                <Label htmlFor="brand_id">Brand</Label>
                <Select
                    value={data.brand_id}
                    onValueChange={(value) => setData('brand_id', value)}
                >
                    <SelectTrigger id="brand_id" className="w-full">
                        <SelectValue placeholder="Select a brand" />
                    </SelectTrigger>
                    <SelectContent>
                        {brands.map((brand) => (
                            <SelectItem key={brand.id} value={String(brand.id)}>
                                {brand.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.brand_id} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="name">Model name</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(event) => setData('name', event.target.value)}
                    placeholder="e.g. Latitude 5440"
                    required
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="code">Code</Label>
                <Input
                    id="code"
                    value={data.code}
                    onChange={(event) => setData('code', event.target.value)}
                    placeholder="e.g. LAT-5440"
                    required
                />
                <InputError message={errors.code} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={data.description}
                    onChange={(event) =>
                        setData('description', event.target.value)
                    }
                    placeholder="Optional notes about this model..."
                />
                <InputError message={errors.description} />
            </div>

            <div className="flex items-center gap-3">
                <Button type="submit" disabled={processing}>
                    {processing
                        ? 'Saving...'
                        : isEdit
                          ? 'Update model'
                          : 'Create model'}
                </Button>
                <Button variant="outline" asChild>
                    <Link href={index.url()}>Cancel</Link>
                </Button>
            </div>
        </form>
    );
}
