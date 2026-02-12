import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services-page.html',
  styleUrl: './services-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'relative overflow-x-clip',
  },
})
export class ServicesPage {
  public cartService = inject(CartService);

  services = signal<Product[]>([
    {
      id: 'web-pages',
      name: 'Creación de Páginas Web',
      examplesLabel: 'Ejemplos que puedes mostrar',
      description: 'Página web para abogados, médicos o contadores. Landing page para inmobiliarias o proyectos de apartamentos. Web para restaurantes con menú digital. Portafolio para freelancers / agencias. Página para empresas de construcción o transporte.',
      price: 490000,
      scope: ['Diseño UI/UX', 'SEO Básico', 'Botón de WhatsApp', 'Web responsive'],
      category: 'Web',
      image: 'assets/services/web.webp',
      addons: [
        { id: 'hosting-1-year', name: 'Hosting 1 Año', description: 'Hosting 1 Año', price: 100000 },
        { id: 'domain-com', name: 'Dominio .com', description: 'Dominio .com', price: 100000 },
        { id: 'multilanguage', name: 'Multilenguaje (2 idiomas)', description: 'Traducción y configuración', price: 200000 },
      ]
    },
    // {
    //   id: 'mobile-apps',
    //   name: 'Desarrollo de Apps Móviles',
    //   examplesLabel: 'Ejemplos reales',
    //   description: 'App de pedidos para restaurantes. App para gimnasios o entrenadores personales. App de turnos médicos. App interna para empleados o repartidores. App tipo catálogo con login.',
    //   price: 2000000,
    //   scope: ['Push Notifications', 'API Integration', 'App Store / Play Store', 'Soporte 3 Meses', 'Usuarios, Roles y permisos'],
    //   category: 'Mobile',
    //   image: 'assets/services/mobile.webp',
    //   addons: [
    //     { id: 'login-google', name: 'Login con Google', description: 'Inicio de sesión con cuenta de Google', price: 200000 },
    //     { id: 'admin-panel-mobile', name: 'Panel Admin dedicado', description: 'Gestiona la app desde web', price: 600000 },
    //   ]
    // },
    {
      id: 'ecommerce',
      name: 'E-commerce & Tiendas Online',
      examplesLabel: 'Ejemplos que conectan',
      description: 'Tienda de ropa o calzado. Venta de productos digitales (cursos, PDFs). Tienda para emprendedores locales. Catálogo para distribuidores. Marketplace pequeño de servicios.',
      price: 1490000,
      scope: ['Pasarela de Pagos', 'Gestión Stock', 'Panel Admin', 'Reportes Ventas', 'Productos Ilimitados', 'Usuarios, Roles y permisos'],
      category: 'Ecommerce',
      image: 'assets/services/ecommerce.webp',
      addons: [
        // { id: 'pos-integration', name: 'Integración con POS', description: 'Sincroniza con tu local físico', price: 600000 },
        { id: 'reviews-system', name: 'Sistema de Reseñas y comentarios', description: 'Fomenta la confianza del cliente', price: 200000 },
        { id: 'login-google', name: 'Login con Google', description: 'Inicio de sesión con cuenta de Google', price: 200000 },
        // { id: 'shipping-integration', name: 'Integración con envíos (Servientrega, Interrapidísimo)', description: 'Sincroniza con tu local físico', price: 400000 },
        { id: 'coupons-system', name: 'Cupones y descuentos avanzados', description: 'Fomenta la confianza del cliente', price: 200000 },
        { id: 'abandoned-cart-recovery', name: 'Recuperación de carritos abandonados (email/WhatsApp)', description: 'Fomenta la confianza del cliente', price: 350000 },
        { id: '2fa-authentication', name: 'Autenticación 2FA', description: 'Autenticación de dos factores', price: 200000 },
      ]
    },
    {
      id: 'admin-web-apps',
      name: 'Apps Web Administrativas',
      examplesLabel: 'Ejemplos claros',
      description: 'Sistema de inventario. CRM para ventas y clientes. Sistema de reservas. Plataforma de cursos internos. Sistema de facturación y reportes.',
      price: 1790000,
      scope: ['Roles y Permisos', 'Dashboards', 'Exportación Datos', 'Backup Automático', 'Usuarios, Roles y permisos'],
      category: 'Enterprise',
      image: 'assets/services/admin.webp',
      addons: [
        { id: 'real-time-chat', name: 'Chat en tiempo real', description: 'Comunicación interna fluida', price: 500000 },
        { id: '2fa-authentication', name: 'Autenticación 2FA', description: 'Autenticación de dos factores', price: 200000 },
      ]
    }
  ]);

  selectedAddonsState = signal<Record<string, string[]>>({});

  toggleAddonSelection(productId: string, addonId: string) {
    this.selectedAddonsState.update(state => {
      const productAddons = state[productId] || [];
      const newAddons = productAddons.includes(addonId)
        ? productAddons.filter(id => id !== addonId)
        : [...productAddons, addonId];
      return { ...state, [productId]: newAddons };
    });

    // If already in cart, update it
    if (this.isInCart(productId)) {
      this.cartService.toggleAddon(productId, addonId);
    }
  }

  isAddonSelected(productId: string, addonId: string): boolean {
    if (this.isInCart(productId)) {
      return this.cartService.items().find(i => i.id === productId)?.selectedAddons.includes(addonId) || false;
    }
    return this.selectedAddonsState()[productId]?.includes(addonId) || false;
  }

  toggleCart(product: Product) {
    if (this.isInCart(product.id)) {
      this.cartService.removeFromCart(product.id);
    } else {
      const addons = this.selectedAddonsState()[product.id] || [];
      this.cartService.addToCart(product, addons);
    }
  }

  addToCart(product: Product) {
    const addons = this.selectedAddonsState()[product.id] || [];
    this.cartService.addToCart(product, addons);
  }

  isInCart(productId: string) {
    return this.cartService.items().some(item => item.id === productId);
  }

  getCartQuantity(productId: string) {
    return this.cartService.items().find(item => item.id === productId)?.quantity || 0;
  }

  getServiceTotalPrice(product: Product): number {
    const addons = this.selectedAddonsState()[product.id] || [];
    const addonsPrice = (product.addons || [])
      .filter(a => addons.includes(a.id))
      .reduce((sum, a) => sum + a.price, 0);
    return product.price + addonsPrice;
  }
}
