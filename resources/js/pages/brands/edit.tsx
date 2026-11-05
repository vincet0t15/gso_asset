import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Card, CardContent } from '@/components/ui/card';
import { index } from '@/routes/brands';
import type { Brand } from '@/types';
import { BrandForm } from './form';

type Props = {
    brand: Brand;
};

export default function EditBrand({ brand }: Props) {
    return (
        <>
            <Head title={`Edit ${brand.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title={`Edit ${brand.name}`}
                    description="Update the brand details."
                />

                <Card className="max-w-2xl">
                    <CardContent>
                        <BrandForm brand={brand} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EditBrand.layout = {
    breadcrumbs: [
        {
            title: 'Brands',
            href: index.url(),
        },
        {
            title: 'Edit',
            href: '/brands',
        },
    ],
};
