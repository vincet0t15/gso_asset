export type Brand = {
    id: number;
    name: string;
    code: string;
    description: string | null;
    models_count?: number;
    created_at: string;
    updated_at: string;
};

export type BrandForm = {
    name: string;
    code: string;
    description: string;
};
