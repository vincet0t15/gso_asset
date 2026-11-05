import { Head, Link, router, usePage } from '@inertiajs/react';
import { PencilIcon, PlusIcon, Search, Trash2 } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { create, edit, index } from '@/routes/models';
import type {
    AssetModel,
    Auth,
    BrandOption,
    PaginatedData,
} from '@/types';
import { DeleteAssetModelDialog } from './delete';

type Props = {
    models: PaginatedData<AssetModel>;
    brands: BrandOption[];
    filters: {
        search: string;
        brand: number | null;
    };
};

export default function ModelsIndex({ models, brands, filters }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [search, setSearch] = useState(filters.search ?? '');
    const [brandFilter, setBrandFilter] = useState(
        filters.brand ? String(filters.brand) : 'all',
    );
    const [deleting, setDeleting] = useState<AssetModel | null>(null);

    const canCreate = auth.permissions.includes('models.create');
    const canUpdate = auth.permissions.includes('models.update');
    const canDelete = auth.permissions.includes('models.delete');

    const applyFilters = (nextSearch: string, nextBrand: string) => {
        router.get(
            index.url(),
            {
                search: nextSearch,
                brand: nextBrand === 'all' ? '' : nextBrand,
            },
            { preserveState: true, replace: true },
        );
    };

    const submitSearch = (event: FormEvent) => {
        event.preventDefault();
        applyFilters(search, brandFilter);
    };

    return (
        <>
            <Head title="Models" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Models
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage asset models and the brand they belong to.
                        </p>
                    </div>

                    {canCreate && (
                        <Button asChild>
                            <Link href={create.url()}>
                                <PlusIcon />
                                New model
                            </Link>
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <CardTitle className="text-base">
                            All models
                            <Badge variant="secondary" className="ml-2">
                                {models.total}
                            </Badge>
                        </CardTitle>

                        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                            <Select
                                value={brandFilter}
                                onValueChange={(value) => {
                                    setBrandFilter(value);
                                    applyFilters(search, value);
                                }}
                            >
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="All brands" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All brands
                                    </SelectItem>
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

                            <form
                                onSubmit={submitSearch}
                                className="flex w-full gap-2"
                            >
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Search models..."
                                        className="pl-8"
                                    />
                                </div>
                                <Button type="submit" variant="secondary">
                                    Search
                                </Button>
                            </form>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Model</TableHead>
                                    <TableHead>Brand</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {models.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            No models found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    models.data.map((model) => (
                                        <TableRow key={model.id}>
                                            <TableCell className="font-medium">
                                                {model.name}
                                            </TableCell>
                                            <TableCell>
                                                {model.brand?.name ?? '—'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {model.code}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate whitespace-normal text-muted-foreground">
                                                {model.description || '—'}
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
                                                                    model.id,
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
                                                                    model,
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

                        <Pagination data={models} />
                    </CardContent>
                </Card>
            </div>

            <DeleteAssetModelDialog
                model={deleting}
                open={deleting !== null}
                onClose={() => setDeleting(null)}
            />
        </>
    );
}

ModelsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Models',
            href: index.url(),
        },
    ],
};
