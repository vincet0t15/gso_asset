export type Category = {
    id: number;
    name: string;
    code: string;
    description: string | null;
    created_at: string;
    updated_at: string;
};

export type CategoryForm = {
    name: string;
    code: string;
    description: string;
};
