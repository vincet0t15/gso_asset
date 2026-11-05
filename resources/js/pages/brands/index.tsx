import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { index } from '@/routes/brands';
import type { Auth, Brand, PaginatedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { PencilIcon, PlusIcon, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CreateBrandDialog } from './create';
import { DeleteBrandDialog } from './delete';
import { EditBrandDialog } from './edit';
import { Pagination } from '@/components/pagination';

type Props = {
    brands: PaginatedData<Brand>;
    filters: {
        search: string;
    };
};

export default function BrandsIndex({ brands, filters }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [openCreate, setOpenCreate] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const canCreate = auth.permissions.includes('brands.create');
    const canUpdate = auth.permissions.includes('brands.update');
    const canDelete = auth.permissions.includes('brands.delete');

    const handleSearchKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            router.get(
                index.url(),
                search ? { search } : undefined,
                { preserveState: true, preserveScroll: true },
            );
        }
    };

    const handleEdit = (brand: Brand) => {
        setSelectedBrand(brand);
        setOpenEdit(true);
    };

    const handleDelete = (brand: Brand) => {
        setSelectedBrand(brand);
        setOpenDelete(true);
    };

    return (
        <>
            <Head title="Brands" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    title="Brand management"
                    description="Overview and maintenance of all brand entries."
                />

                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    {canCreate && (
                        <Button onClick={() => setOpenCreate(true)}>
                            <PlusIcon className="h-4 w-4" />
                            Create brand
                        </Button>
                    )}

                    <div className="flex w-full items-center gap-2 sm:w-auto">
                        <div className="relative w-full sm:w-[250px]">
                            <Label htmlFor="brand-search" className="sr-only">
                                Search
                            </Label>
                            <Input
                                id="brand-search"
                                placeholder="Search the brands..."
                                className="w-full pl-8"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                onKeyDown={handleSearchKeyDown}
                            />
                            <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
                        </div>
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="text-primary font-bold">
                                    Name
                                </TableHead>
                                <TableHead className="text-primary font-bold">
                                    Code
                                </TableHead>
                                <TableHead className="text-primary font-bold">
                                    Models
                                </TableHead>
                                <TableHead className="text-primary font-bold">
                                    Description
                                </TableHead>
                                <TableHead className="text-primary text-right font-bold">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {brands.data.length > 0 ? (
                                brands.data.map((brand) => (
                                    <TableRow
                                        key={brand.id}
                                        className="hover:bg-muted/30 text-sm"
                                    >
                                        <TableCell className="text-sm">
                                            {brand.name}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {brand.code}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {brand.models_count ?? 0}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {brand.description || '—'}
                                        </TableCell>
                                        <TableCell className="flex items-center justify-end gap-2 text-sm">
                                            {canUpdate && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                                                    onClick={() =>
                                                        handleEdit(brand)
                                                    }
                                                    title="Edit"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {canDelete && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    onClick={() =>
                                                        handleDelete(brand)
                                                    }
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="py-3 text-center text-gray-500"
                                    >
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Pagination data={brands} />
            </div>

            {openCreate && (
                <CreateBrandDialog
                    isOpen={openCreate}
                    onClose={() => setOpenCreate(false)}
                />
            )}

            {openEdit && selectedBrand && (
                <EditBrandDialog
                    isOpen={openEdit}
                    onClose={() => setOpenEdit(false)}
                    brand={selectedBrand}
                />
            )}

            {openDelete && selectedBrand && (
                <DeleteBrandDialog
                    isOpen={openDelete}
                    onClose={() => setOpenDelete(false)}
                    brand={selectedBrand}
                />
            )}
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
