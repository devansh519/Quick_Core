/**
 * Centralized Redis Cache Keys
 *
 * Never hardcode Redis keys inside services.
 * Always use these helper methods.
 */

const CACHE_KEYS = {

    products: {
        all: () => "products:all",

        byId: (id) => `products:${id}`,

        byCategory: (categoryId) =>
            `products:category:${categoryId}`,

        byBrand: (brandId) =>
            `products:brand:${brandId}`,

        search: (query) =>
            `products:search:${query}`,
    },

    categories: {
        all: () => "categories:all",

        byId: (id) => `categories:${id}`,
    },

    brands: {
        all: () => "brands:all",

        byId: (id) => `brands:${id}`,
    },

    inventory: {
        byProduct: (productId) =>
            `inventory:product:${productId}`,

        byWarehouse: (warehouseId) =>
            `inventory:warehouse:${warehouseId}`,

        byWarehouseProduct: (
            warehouseId,
            productId
        ) =>
            `inventory:${warehouseId}:${productId}`,
    },

    cart: {
        byUser: (userId) =>
            `cart:${userId}`,
    },

    orders: {
        byId: (orderId) =>
            `orders:${orderId}`,

        byUser: (userId) =>
            `orders:user:${userId}`,
    },

    notifications: {
        byUser: (userId) =>
            `notifications:${userId}`,
    },

    drivers: {
        byId: (driverId) =>
            `drivers:${driverId}`,
    },

    deliveries: {
        byId: (deliveryId) =>
            `deliveries:${deliveryId}`,
    },

    auth: {
        refreshToken: (userId) =>
            `auth:refresh:${userId}`,

        session: (userId) =>
            `auth:session:${userId}`,
    },
};

module.exports = CACHE_KEYS;