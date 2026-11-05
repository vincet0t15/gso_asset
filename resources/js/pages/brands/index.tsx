import { Head, Link, router } from '@inertiajs/react';
import { PencilIcon, PlusIcon, Search, Trash2 } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { create, edit, index } from '@/routes/brands';
import type { Auth, Brand, PaginatedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { DeleteBrandDialog } from './delete';

type Props = {
    brands: PaginatedData<Brand>;
    filters: {
        search: string;
    };
};

export default function BrandsIndex({ brands, filters }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [search, setSearch] = useState(filters.search ?? '');
    const [deleting, setDeleting] = useState<Brand | null>(null);

    const canCreate = auth.permissions.includes('brands.create');
    const canUpdate = auth.permissions.includes('brands.update');
    const canDelete = auth.permissions.includes('brands.delete');

    const submitSearch = (event: FormEvent) => {
        event.preventDefault();

        router.get(
            index.url(),
            { search },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Brands" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Brands
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage the brands that asset models belong to.
                        </p>
                    </div>

                    {canCreate && (
                        <Button asChild>
                            <Link href={create.url()}>
                                <PlusIcon />
                                New brand
                            </Link>
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-base">
                            All brands
                            <Badge variant="secondary" className="ml-2">
                                {brands.total}
                            </Badge>
                        </CardTitle>

                        <form
                            onSubmit={submitSearch}
                            className="flex w-full gap-2 sm:w-auto"
                        >
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search brands..."
                                    className="pl-8"
                                />
                            </div>
                            <Button type="submit" variant="secondary">
                                Search
                            </Button>
                        </form>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Models</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {brands.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            No brands found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    brands.data.map((brand) => (
                                        <TableRow key={brand.id}>
                                            <TableCell className="font-medium">
                                                {brand.name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {brand.code}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {brand.models_count ?? 0}
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate whitespace-normal text-muted-foreground">
                                                {brand.description || '—'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {canUpdate && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={edit.url(
                                                                    brand.id,
                                                                )}
                                                            >
                                                                <PencilIcon />
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {canDelete && (
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() =>
                                                                setDeleting(
                                                                    brand,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 />
                                                            Delete
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        <Pagination data={brands} />
                    </CardContent>
                </Card>
            </div>

            <DeleteBrandDialog
                brand={deleting}
                open={deleting !== null}
                onClose={() => setDeleting(null)}
            />
        </>
    );
}

BrandsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Brands',
            href: index.url(),
        },
    ],
};
