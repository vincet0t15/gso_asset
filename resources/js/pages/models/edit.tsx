import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Card, CardContent } from '@/components/ui/card';
import { index } from '@/routes/models';
import type { AssetModel, BrandOption } from '@/types';
import { AssetModelForm } from './form';

type Props = {
    model: AssetModel;
    brands: BrandOption[];
};

export default function EditAssetModel({ model, brands }: Props) {
    return (
        <>
            <Head title={`Edit ${model.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title={`Edit ${model.name}`}
                    description="Update the model details and brand."
                />

                <Card className="max-w-2xl">
                    <CardContent>
                        <AssetModelForm brands={brands} model={model} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EditAssetModel.layout = {
    breadcrumbs: [
        {
            title: 'Models',
            href: index.url(),
        },
        {
            title: 'Edit',
            href: '/models',
        },
    ],
};
