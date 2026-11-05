import { Link } from '@inertiajs/react';
import type { PaginatedData } from '@/types';

export function Pagination({ data }: { data: PaginatedData<unknown> }) {
    if (data.total === 0) {
        return null;
    }

    return (
        <div className="mt-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <p className="text-sm text-muted-foreground">
                Showing <strong>{data.from ?? 0}</strong> to{' '}
                <strong>{data.to ?? 0}</strong> of <strong>{data.total}</strong>{' '}
                results
            </p>

            <nav className="flex flex-wrap gap-1" aria-label="Pagination">
                {data.links.map((link, index) => {
                    const className = `rounded-md border px-3 py-1 text-sm transition-colors ${
                        link.active
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                    } ${!link.url ? 'pointer-events-none opacity-50' : ''}`;

                    if (!link.url) {
                        return (
                            <span
                                key={index}
                                className={className}
                                aria-disabled="true"
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={link.url}
                            preserveState
                            preserveScroll
                            className={className}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </nav>
        </div>
    );
}
