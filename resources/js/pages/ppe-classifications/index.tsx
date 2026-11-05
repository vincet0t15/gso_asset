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
import { index } from '@/routes/ppe-classifications';
import type { Auth, PaginatedData, PpeClassification } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { PencilIcon, PlusIcon, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CreatePpeClassificationDialog } from './create';
import { DeletePpeClassificationDialog } from './delete';
import { EditPpeClassificationDialog } from './edit';
import { Pagination } from '@/components/pagination';

type Props = {
    classifications: PaginatedData<PpeClassification>;
    filters: {
        search: string;
    };
};

export default function PpeClassificationsIndex({
    classifications,
    filters,
}: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [openCreate, setOpenCreate] = useState(false);
    const [selected, setSelected] = useState<PpeClassification | null>(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const canCreate = auth.permissions.includes('ppe_classifications.create');
    const canUpdate = auth.permissions.includes('ppe_classifications.update');
    const canDelete = auth.permissions.includes('ppe_classifications.delete');

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

    const handleEdit = (classification: PpeClassification) => {
        setSelected(classification);
        setOpenEdit(true);
    };

    const handleDelete = (classification: PpeClassification) => {
        setSelected(classification);
        setOpenDelete(true);
    };

    return (
        <>
            <Head title="PPE classifications" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    title="PPE classification management"
                    description="Overview and maintenance of PPE classifications."
                />

                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    {canCreate && (
                        <Button onClick={() => setOpenCreate(true)}>
                            <PlusIcon className="h-4 w-4" />
                            Create classification
                        </Button>
                    )}

                    <div className="flex w-full items-center gap-2 sm:w-auto">
                        <div className="relative w-full sm:w-[250px]">
                            <Label
                                htmlFor="ppe-classification-search"
                                className="sr-only"
                            >
                                Search
                            </Label>
                            <Input
                                id="ppe-classification-search"
                                placeholder="Search the classifications..."
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
                                    Description
                                </TableHead>
                                <TableHead className="text-primary text-right font-bold">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {classifications.data.length > 0 ? (
                                classifications.data.map((classification) => (
                                    <TableRow
                                        key={classification.id}
                                        className="hover:bg-muted/30 text-sm"
                                    >
                                        <TableCell className="text-sm">
                                            {classification.name}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {classification.code}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {classification.description || '—'}
                                        </TableCell>
                                        <TableCell className="flex items-center justify-end gap-2 text-sm">
                                            {canUpdate && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                                                    onClick={() =>
                                                        handleEdit(
                                                            classification,
                                                        )
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
                                                        handleDelete(
                                                            classification,
                                                        )
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
                                        colSpan={4}
                                        className="py-3 text-center text-gray-500"
                                    >
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Pagination data={classifications} />
            </div>

            {openCreate && (
                <CreatePpeClassificationDialog
                    isOpen={openCreate}
                    onClose={() => setOpenCreate(false)}
                />
            )}

            {openEdit && selected && (
                <EditPpeClassificationDialog
                    isOpen={openEdit}
                    onClose={() => setOpenEdit(false)}
                    classification={selected}
                />
            )}

            {openDelete && selected && (
                <DeletePpeClassificationDialog
                    isOpen={openDelete}
                    onClose={() => setOpenDelete(false)}
                    classification={selected}
                />
            )}
        </>
    );
}

PpeClassificationsIndex.layout = {
    breadcrumbs: [
        {
            title: 'PPE classifications',
            href: index.url(),
        },
    ],
};
