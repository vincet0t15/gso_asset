export type ItemOption = {
    id: number;
    name: string;
};

export type Item = {
    id: number;
    name: string;
    stock_number: string | null;
    brand_id: number | null;
    asset_model_id: number | null;
    category_id: number | null;
    ppe_classification_id: number | null;
    unit: string;
    unit_cost: number | null;
    description: string | null;
    brand?: ItemOption;
    asset_model?: ItemOption;
    category?: ItemOption;
    ppe_classification?: ItemOption;
    created_at: string;
    updated_at: string;
};

export type ItemForm = {
    name: string;
    stock_number: string;
    brand_id: string;
    asset_model_id: string;
    category_id: string;
    ppe_classification_id: string;
    unit: string;
    unit_cost: string;
    description: string;
};
