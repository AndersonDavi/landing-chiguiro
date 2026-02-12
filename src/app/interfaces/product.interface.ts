export interface Addon {
    id: string;
    name: string;
    description: string;
    price: number;
}

export interface Product {
    id: string;
    name: string;
    icon?: string;
    description: string;
    examplesLabel?: string;
    price: number;
    scope: string[];
    addons?: Addon[];
    image?: string;
    category: string;
}

export interface CartItem extends Product {
    quantity: number;
    selectedAddons: string[]; // IDs of selected addons
}
