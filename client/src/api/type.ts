
export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    parent?: Category;
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
    parentId?: string;
    order?: number;
    isActive?: boolean;
}

export interface UpdateCategoryInput {
    name?: string;
    slug?: string;
    description?: string;
    parentId?: string | null;
    order?: number;
    isActive?: boolean;
}