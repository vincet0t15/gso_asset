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
import { index } from '@/routes/items';
import type { Auth, Item, ItemOption, PaginatedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { PencilIcon, PlusIcon, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CreateItemDialog } from './create';
import { DeleteItemDialog } from './delete';
import { EditItemDialog } from './edit';
import { Pagination } from '@/components/pagination';

type Props = {
    items: PaginatedData<Item>;
    brands: ItemOption[];
    models: ItemOption[];
    categories: ItemOption[];
    ppeClassifications: ItemOption[];
    filters: {
        search: string;
    };
};

export default function ItemsIndex({
    items,
    brands,
    models,
    categories,
    ppeClassifications,
    filters,
}: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [openCreate, setOpenCreate] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const canCreate = auth.permissions.includes('items.create');
    const canUpdate = auth.permissions.includes('items.update');
    const canDelete = auth.permissions.includes('items.delete');

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

    const handleEdit = (item: Item) => {
        setSelectedItem(item);
        setOpenEdit(true);
    };

    const handleDelete = (item: Item) => {
        setSelectedItem(item);
        setOpenDelete(true);
    };

    return (
        <>
            <Head title="Items" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    title="Master item list"
                    description="Overview and maintenance of all item entries."
                />

                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    {canCreate && (
                        <Button onClick={() => setOpenCreate(true)}>
                            <PlusIcon className="h-4 w-4" />
                            Create item
                        </Button>
                    )}

                    <div className="flex w-full items-center gap-2 sm:w-auto">
                        <div className="relative w-full sm:w-[250px]">
                            <Label htmlFor="item-search" className="sr-only">
                                Search
                            </Label>
                            <Input
                                id="item-search"
                                placeholder="Search the items..."
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
                                    Stock no.
                                </TableHead>
                                <TableHead className="text-primary font-bold">
                                    Brand
                                </TableHead>
                                <TableHead className="text-primary font-bold">
                                    Category
                                </TableHead>
                                <TableHead className="text-primary font-bold">
                                    Unit
                                </TableHead>
                                <TableHead className="text-primary font-bold">
                                    Unit cost
                                </TableHead>
                                <TableHead className="text-primary text-right font-bold">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.data.length > 0 ? (
                                items.data.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        className="hover:bg-muted/30 text-sm"
                                    >
                                        <TableCell className="text-sm">
                                            {item.name}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {item.stock_number || '—'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {item.brand?.name ?? '—'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {item.category?.name ?? '—'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {item.unit}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {item.unit_cost !== null
                                                ? Number(item.unit_cost).toLocaleString(undefined, {
                                                      minimumFractionDigits: 2,
                                                  })
                                                : '—'}
                                        </TableCell>
                                        <TableCell className="flex items-center justify-end gap-2 text-sm">
                                            {canUpdate && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                                                    onClick={() =>
                                                        handleEdit(item)
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
                                                        handleDelete(item)
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
                                        colSpan={7}
                                        className="py-3 text-center text-gray-500"
                                    >
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Pagination data={items} />
            </div>

            {openCreate && (
                <CreateItemDialog
                    isOpen={openCreate}
                    onClose={() => setOpenCreate(false)}
                    brands={brands}
                    models={models}
                    categories={categories}
                    ppeClassifications={ppeClassifications}
                />
            )}

            {openEdit && selectedItem && (
                <EditItemDialog
                    isOpen={openEdit}
                    onClose={() => setOpenEdit(false)}
                    item={selectedItem}
                    brands={brands}
                    models={models}
                    categories={categories}
                    ppeClassifications={ppeClassifications}
                />
            )}

            {openDelete && selectedItem && (
                <DeleteItemDialog
                    isOpen={openDelete}
                    onClose={() => setOpenDelete(false)}
                    item={selectedItem}
                />
            )}
        </>
    );
}

ItemsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Items',
            href: index.url(),
        },
    ],
};
