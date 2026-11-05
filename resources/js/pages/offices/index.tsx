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
import { index } from '@/routes/offices';
import type { Auth, Office, PaginatedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { PencilIcon, PlusIcon, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CreateOfficeDialog } from './create';
import { DeleteOfficeDialog } from './delete';
import { EditOfficeDialog } from './edit';
import { Pagination } from '@/components/pagination';

type Props = {
    offices: PaginatedData<Office>;
    filters: {
        search: string;
    };
};

export default function OfficesIndex({ offices, filters }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [openCreate, setOpenCreate] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const canCreate = auth.permissions.includes('offices.create');
    const canEdit = auth.permissions.includes('offices.edit');
    const canDelete = auth.permissions.includes('offices.delete');

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

    const handleEdit = (office: Office) => {
        setSelectedOffice(office);
        setOpenEdit(true);
    };

    const handleDelete = (office: Office) => {
        setSelectedOffice(office);
        setOpenDelete(true);
    };

    return (
        <>
            <Head title="Offices" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    title="Office management"
                    description="Overview and maintenance of all office entries."
                />

                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    {canCreate && (
                        <Button onClick={() => setOpenCreate(true)}>
                            <PlusIcon className="h-4 w-4" />
                            Create office
                        </Button>
                    )}

                    <div className="flex w-full items-center gap-2 sm:w-auto">
                        <div className="relative w-full sm:w-[250px]">
                            <Label htmlFor="office-search" className="sr-only">
                                Search
                            </Label>
                            <Input
                                id="office-search"
                                placeholder="Search the offices..."
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
                                <TableHead className="text-primary text-right font-bold">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {offices.data.length > 0 ? (
                                offices.data.map((office) => (
                                    <TableRow
                                        key={office.id}
                                        className="hover:bg-muted/30 text-sm"
                                    >
                                        <TableCell className="text-sm">
                                            {office.name}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {office.code}
                                        </TableCell>
                                        <TableCell className="flex items-center justify-end gap-2 text-sm">
                                            {canEdit && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                                                    onClick={() =>
                                                        handleEdit(office)
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
                                                        handleDelete(office)
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
                                        colSpan={3}
                                        className="py-3 text-center text-gray-500"
                                    >
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Pagination data={offices} />
            </div>

            {openCreate && (
                <CreateOfficeDialog
                    isOpen={openCreate}
                    onClose={() => setOpenCreate(false)}
                />
            )}

            {openEdit && selectedOffice && (
                <EditOfficeDialog
                    isOpen={openEdit}
                    onClose={() => setOpenEdit(false)}
                    office={selectedOffice}
                />
            )}

            {openDelete && selectedOffice && (
                <DeleteOfficeDialog
                    isOpen={openDelete}
                    onClose={() => setOpenDelete(false)}
                    office={selectedOffice}
                />
            )}
        </>
    );
}

OfficesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Offices',
            href: index.url(),
        },
    ],
};
