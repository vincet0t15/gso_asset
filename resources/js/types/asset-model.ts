export type BrandOption = {
    id: number;
    name: string;
};

export type AssetModel = {
    id: number;
    brand_id: number;
    name: string;
    code: string;
    description: string | null;
    brand?: BrandOption;
    created_at: string;
    updated_at: string;
};

export type AssetModelForm = {
    brand_id: string;
    name: string;
    code: string;
    description: string;
};
