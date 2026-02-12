import { Injectable, signal, computed, effect } from '@angular/core';
import { CartItem, Product } from '../interfaces/product.interface';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItems = signal<CartItem[]>(this.loadCart());

    public items = computed(() => this.cartItems());
    public totalItems = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
    public totalPrice = computed(() => this.cartItems().reduce((acc, item) => {
        const addonsPrice = (item.addons || [])
            .filter(a => item.selectedAddons.includes(a.id))
            .reduce((sum, a) => sum + a.price, 0);
        return acc + ((item.price + addonsPrice) * item.quantity);
    }, 0));

    constructor() {
        effect(() => {
            localStorage.setItem('chiguiro_cart', JSON.stringify(this.cartItems()));
        });
    }

    private loadCart(): CartItem[] {
        const saved = localStorage.getItem('chiguiro_cart');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Ensure selectedAddons exists for backward compatibility
                return parsed.map((item: any) => ({
                    ...item,
                    selectedAddons: item.selectedAddons || []
                }));
            } catch (e) {
                console.error('Error loading cart', e);
                return [];
            }
        }
        return [];
    }

    addToCart(product: Product, selectedAddons: string[] = []) {
        this.cartItems.update(items => {
            const existing = items.find(i => i.id === product.id);
            if (existing) {
                // Si existe, actualizamos los agregados pero mantenemos la cantidad en 1
                return items.map(i => (i.id === product.id ? { ...i, selectedAddons } : i));
            }
            return [...items, { ...product, quantity: 1, selectedAddons }];
        });
    }

    toggleAddon(productId: string, addonId: string) {
        this.cartItems.update(items => {
            return items.map(i => {
                if (i.id === productId) {
                    const selectedAddons = i.selectedAddons.includes(addonId)
                        ? i.selectedAddons.filter(id => id !== addonId)
                        : [...i.selectedAddons, addonId];
                    return { ...i, selectedAddons };
                }
                return i;
            });
        });
    }

    updateQuantity(productId: string, delta: number) {
        this.cartItems.update(items => {
            return items.map(i => {
                if (i.id === productId) {
                    const nextQty = Math.max(1, i.quantity + delta);
                    return { ...i, quantity: nextQty };
                }
                return i;
            });
        });
    }

    removeFromCart(productId: string) {
        this.cartItems.update(items => items.filter(i => i.id !== productId));
    }

    clearCart() {
        this.cartItems.set([]);
    }

    sendToWhatsApp() {
        const items = this.cartItems();
        if (items.length === 0) return;

        let message = "*Nueva Solicitud de Cotización*\n\n";
        message += "Hola, estoy interesado en los siguientes servicios:\n\n";

        items.forEach(item => {
            const selectedAddons = (item.addons || []).filter(a => item.selectedAddons.includes(a.id));
            const itemTotalPrice = (item.price + selectedAddons.reduce((sum, a) => sum + a.price, 0)) * item.quantity;

            message += `*${item.name}*\n`;
            // message += `   - Cantidad: ${item.quantity}\n`;
            message += `   - Precio base: $${item.price.toLocaleString()}\n`;
            if (selectedAddons.length > 0) {
                message += `   - Agregados:\n`;
                selectedAddons.forEach(a => {
                    message += `     + ${a.name} ($${a.price.toLocaleString()})\n`;
                });
            }
            message += `   - Subtotal: $${itemTotalPrice.toLocaleString()}\n\n`;
        });

        message += `*Total Estimado: $${this.totalPrice().toLocaleString()}*\n\n`;
        message += "Quedo atento a su respuesta para iniciar con el proyecto. ¡Gracias!";

        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/573001658936?text=${encoded}`, '_blank');
    }
}
