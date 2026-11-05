import { Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { index, store, update } from '@/routes/brands';
import type { Brand, BrandForm as BrandFormData } from '@/types';

type Props = {
    brand?: Brand;
};

export function BrandForm({ brand }: Props) {
    const isEdit = brand !== undefined;

    const { data, setData, post, patch, processing, errors } =
        useForm<BrandFormData>({
            name: brand?.name ?? '',
            code: brand?.code ?? '',
            description: brand?.description ?? '',
        });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (isEdit) {
            patch(update.url(brand.id));
        } else {
            post(store.url());
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(event) => setData('name', event.target.value)}
                    placeholder="e.g. Dell"
                    autoFocus
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
                    placeholder="e.g. DELL"
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
                    placeholder="Optional notes about this brand..."
                />
                <InputError message={errors.description} />
            </div>

            <div className="flex items-center gap-3">
                <Button type="submit" disabled={processing}>
                    {processing
                        ? 'Saving...'
                        : isEdit
                          ? 'Update brand'
                          : 'Create brand'}
                </Button>
                <Button variant="outline" asChild>
                    <Link href={index.url()}>Cancel</Link>
                </Button>
            </div>
        </form>
    );
}
