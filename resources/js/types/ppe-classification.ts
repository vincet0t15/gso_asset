export type PpeClassification = {
    id: number;
    name: string;
    code: string;
    description: string | null;
    created_at: string;
    updated_at: string;
};

export type PpeClassificationForm = {
    name: string;
    code: string;
    description: string;
};
