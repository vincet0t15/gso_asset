import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Card, CardContent } from '@/components/ui/card';
import { index } from '@/routes/brands';
import { BrandForm } from './form';

export default function CreateBrand() {
    return (
        <>
            <Head title="Create brand" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Create brand"
                    description="Add a brand that asset models can belong to."
                />

                <Card className="max-w-2xl">
                    <CardContent>
                        <BrandForm />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CreateBrand.layout = {
    breadcrumbs: [
        {
            title: 'Brands',
            href: index.url(),
        },
        {
            title: 'Create',
            href: '/brands/create',
        },
    ],
};
