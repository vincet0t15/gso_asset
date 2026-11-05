import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { index } from '@/routes/models';
import type { BrandOption } from '@/types';
import { AssetModelForm } from './form';

type Props = {
    brands: BrandOption[];
};

export default function CreateAssetModel({ brands }: Props) {
    return (
        <>
            <Head title="Create model" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Create model"
                    description="Add an asset model and assign it to a brand."
                />

                <Card className="max-w-2xl">
                    <CardContent>
                        {brands.length === 0 ? (
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Create a brand first before adding a model.
                                </p>
                                <Button asChild>
                                    <Link href="/brands/create">
                                        Create a brand
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <AssetModelForm brands={brands} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CreateAssetModel.layout = {
    breadcrumbs: [
        {
            title: 'Models',
            href: index.url(),
        },
        {
            title: 'Create',
            href: '/models/create',
        },
    ],
};
