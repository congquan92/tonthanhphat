
export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    children?: Category[];
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryInput {
    name: string;
    slug: string;
    description?: string;
    order?: number;
    isActive?: boolean;
}

export interface UpdateCategoryInput {
    name?: string;
    slug?: string;
    description?: string;
    order?: number;
    isActive?: boolean;
}