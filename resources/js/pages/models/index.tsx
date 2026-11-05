import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomComboBox } from '@/components/CustomComboBox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { index } from '@/routes/models';
import type { AssetModel, Auth, BrandOption, PaginatedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { PencilIcon, PlusIcon, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CreateAssetModelDialog } from './create';
import { DeleteAssetModelDialog } from './delete';
import { EditAssetModelDialog } from './edit';
import { Pagination } from '@/components/pagination';

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
    const [openCreate, setOpenCreate] = useState(false);
    const [selectedModel, setSelectedModel] = useState<AssetModel | null>(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const canCreate = auth.permissions.includes('models.create');
    const canUpdate = auth.permissions.includes('models.update');
    const canDelete = auth.permissions.includes('models.delete');

    const applyFilters = (nextSearch: string, nextBrand: string) => {
        router.get(
            index.url(),
            {
                search: nextSearch || undefined,
                brand: nextBrand === 'all' ? undefined : nextBrand,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleSearchKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            applyFilters(search, brandFilter);
        }
    };

    const handleEdit = (model: AssetModel) => {
        setSelectedModel(model);
        setOpenEdit(true);
    };

    const handleDelete = (model: AssetModel) => {
        setSelectedModel(model);
        setOpenDelete(true);
    };

    return (
        <>
            <Head title="Models" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    title="Model management"
                    description="Overview and maintenance of all model entries."
                />

                <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    {canCreate && (
                        <Button onClick={() => setOpenCreate(true)}>
                            <PlusIcon className="h-4 w-4" />
                            Create model
                        </Button>
                    )}

                    <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                        <CustomComboBox
                            items={[
                                { value: 'all', label: 'All brands' },
                                ...brands.map((brand) => ({
                                    value: String(brand.id),
                                    label: brand.name,
                                })),
                            ]}
                            placeholder="All brands"
                            value={brandFilter}
                            onSelect={(value) => {
                                const val = value ?? 'all';
                                setBrandFilter(val);
                                applyFilters(search, val);
                            }}
                        />

                        <div className="relative w-full sm:w-[250px]">
                            <Label htmlFor="model-search" className="sr-only">
                                Search
                            </Label>
                            <Input
                                id="model-search"
                                placeholder="Search the models..."
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
                                    Model
                                </TableHead>
                                <TableHead className="text-primary font-bold">
                                    Brand
                                </TableHead>
                                <TableHead className="text-primary font-bold">
                                    Code
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
                            {models.data.length > 0 ? (
                                models.data.map((model) => (
                                    <TableRow
                                        key={model.id}
                                        className="hover:bg-muted/30 text-sm"
                                    >
                                        <TableCell className="text-sm">
                                            {model.name}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {model.brand?.name ?? '—'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {model.code}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {model.description || '—'}
                                        </TableCell>
                                        <TableCell className="flex items-center justify-end gap-2 text-sm">
                                            {canUpdate && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                                                    onClick={() =>
                                                        handleEdit(model)
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
                                                        handleDelete(model)
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

                <Pagination data={models} />
            </div>

            {openCreate && (
                <CreateAssetModelDialog
                    isOpen={openCreate}
                    onClose={() => setOpenCreate(false)}
                    brands={brands}
                />
            )}

            {openEdit && selectedModel && (
                <EditAssetModelDialog
                    isOpen={openEdit}
                    onClose={() => setOpenEdit(false)}
                    model={selectedModel}
                    brands={brands}
                />
            )}

            {openDelete && selectedModel && (
                <DeleteAssetModelDialog
                    isOpen={openDelete}
                    onClose={() => setOpenDelete(false)}
                    model={selectedModel}
                />
            )}
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
