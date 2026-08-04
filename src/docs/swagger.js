/**
 * @openapi
 * # This file documents every QuickCore API endpoint. The top-level OpenAPI
 * # properties (openapi version, info and servers) are supplied by the
 * # definition object in src/config/swagger.js. swagger-jsdoc merges the
 * # tags, components and paths declared below into that definition.
 * #
 * # NOTE: All protected endpoints read the JWT from an httpOnly accessToken
 * # cookie (set on signup/login) while Swagger UI's Authorize button sends
 * # it as a Bearer header; both are accepted by the authenticate middleware
 * # in src/middlewares/authenticate.middleware.js.
 *
 * tags:
 *   - name: Authentication
 *     description: Signup, login, logout and token refresh
 *   - name: Categories
 *     description: Category management (public read, admin write)
 *   - name: Brands
 *     description: Brand management (public read, admin write)
 *   - name: Products
 *     description: Product management (public read, admin write)
 *   - name: Warehouses
 *     description: Warehouse management (public read, admin write)
 *   - name: Inventory
 *     description: Warehouse-product stock management (public read, admin write)
 *   - name: Cart
 *     description: Customer shopping cart (authenticated)
 *   - name: Orders
 *     description: Order placement and fulfilment (authenticated, admin status updates)
 *   - name: Payments
 *     description: Payment creation and lifecycle (authenticated, admin status updates)
 *   - name: Drivers
 *     description: Delivery driver management (admin only)
 *   - name: Deliveries
 *     description: Delivery fulfilment tracking (admin only)
 *   - name: Notifications
 *     description: User notifications (authenticated, admin create)
 *   - name: System
 *     description: Health and infrastructure
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   responses:
 *     ValidationError:
 *       description: Request body failed Joi validation
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiError'
 *           example:
 *             success: false
 *             message: Validation failed
 *             errors:
 *               - name is required
 *     Unauthorized:
 *       description: Missing, invalid or expired access token
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiError'
 *           example:
 *             success: false
 *             message: Access token is required
 *             errors: []
 *     Forbidden:
 *       description: Authenticated but the user role is not permitted (admin required)
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiError'
 *           example:
 *             success: false
 *             message: You are not authorized to perform this action
 *             errors: []
 *     NotFound:
 *       description: The requested resource does not exist or belongs to another user
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiError'
 *           example:
 *             success: false
 *             message: Resource not found
 *             errors: []
 *     Conflict:
 *       description: A conflicting record already exists (unique constraint)
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiError'
 *           example:
 *             success: false
 *             message: Resource already exists
 *             errors: []
 *     BadRequest:
 *       description: Business rule violation or invalid state transition
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiError'
 *           example:
 *             success: false
 *             message: Invalid request state
 *             errors: []
 *     ServerError:
 *       description: Internal server error (also raised for malformed Mongo ObjectId values)
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiError'
 *           example:
 *             success: false
 *             message: Internal Server Error
 *             errors: []
 *
 *   schemas:
 *     ApiResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           example: 200
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Request successful
 *         data:
 *           type: object
 *           nullable: true
 *
 *     ApiError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Something went wrong
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *         stack:
 *           type: string
 *           description: Stack trace, present only when NODE_ENV is development
 *
 *     ObjectId:
 *       type: string
 *       description: MongoDB ObjectId
 *       pattern: '^[0-9a-fA-F]{24}$'
 *       example: 65f4c1a2b3c4d5e6f7a8b9c0
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         total:
 *           type: integer
 *           example: 42
 *         totalPages:
 *           type: integer
 *           example: 5
 *
 *     GeoPoint:
 *       type: object
 *       description: GeoJSON point. Coordinates are [longitude, latitude]
 *       required:
 *         - type
 *         - coordinates
 *       properties:
 *         type:
 *           type: string
 *           enum:
 *             - Point
 *           default: Point
 *         coordinates:
 *           type: array
 *           items:
 *             type: number
 *           minItems: 2
 *           maxItems: 2
 *           example:
 *             - 77.2090
 *             - 28.6139
 *
 *     User:
 *       type: object
 *       description: Public user profile (password is never returned)
 *       properties:
 *         id:
 *           type: string
 *           example: 65f4c1a2b3c4d5e6f7a8b9c0
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         phone:
 *           type: string
 *           example: '9876543210'
 *         role:
 *           type: string
 *           enum:
 *             - customer
 *             - admin
 *             - warehouse_manager
 *             - driver
 *           example: customer
 *
 *     SignupRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           maxLength: 30
 *           example: Password@123
 *         phone:
 *           type: string
 *           pattern: '^[6-9][0-9]{9}$'
 *           example: '9876543210'
 *         role:
 *           type: string
 *           enum:
 *             - customer
 *             - admin
 *           default: customer
 *           description: Optional, defaults to customer
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: Password@123
 *
 *     AuthData:
 *       type: object
 *       description: Tokens are returned as httpOnly cookies, only the user object is in the body
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: '#/components/schemas/ObjectId'
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: Dairy & Eggs
 *         description:
 *           type: string
 *           maxLength: 300
 *           example: Fresh milk, eggs and paneer
 *         image:
 *           type: string
 *           format: uri
 *           example: https://cdn.quickcore.in/categories/dairy.png
 *         isActive:
 *           type: boolean
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateCategoryRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: Dairy & Eggs
 *         description:
 *           type: string
 *           maxLength: 300
 *           example: Fresh milk, eggs and paneer
 *         image:
 *           type: string
 *           format: uri
 *           example: https://cdn.quickcore.in/categories/dairy.png
 *         displayOrder:
 *           type: integer
 *           minimum: 0
 *           example: 1
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *     UpdateCategoryRequest:
 *       type: object
 *       description: At least one field must be provided
 *       minProperties: 1
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *         description:
 *           type: string
 *           maxLength: 300
 *         image:
 *           type: string
 *           format: uri
 *         displayOrder:
 *           type: integer
 *           minimum: 0
 *         isActive:
 *           type: boolean
 *
 *     CategoryList:
 *       type: object
 *       properties:
 *         categories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Category'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     Brand:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: '#/components/schemas/ObjectId'
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: Amul
 *         description:
 *           type: string
 *           maxLength: 500
 *           example: India's largest dairy brand
 *         logo:
 *           type: string
 *           example: https://cdn.quickcore.in/brands/amul.png
 *         website:
 *           type: string
 *           format: uri
 *           example: https://www.amul.com
 *         isActive:
 *           type: boolean
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateBrandRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: Amul
 *         description:
 *           type: string
 *           maxLength: 300
 *           example: India's largest dairy brand
 *         image:
 *           type: string
 *           format: uri
 *           description: Accepted by the API; the Brand model persists it under the logo field
 *         displayOrder:
 *           type: integer
 *           minimum: 0
 *           example: 1
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *     UpdateBrandRequest:
 *       type: object
 *       description: At least one field must be provided
 *       minProperties: 1
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *         description:
 *           type: string
 *           maxLength: 300
 *         image:
 *           type: string
 *           format: uri
 *         displayOrder:
 *           type: integer
 *           minimum: 0
 *         isActive:
 *           type: boolean
 *
 *     BrandList:
 *       type: object
 *       properties:
 *         brands:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Brand'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: '#/components/schemas/ObjectId'
 *         name:
 *           type: string
 *           maxLength: 150
 *           example: Amul Taaza Toned Milk
 *         description:
 *           type: string
 *           maxLength: 1000
 *           example: 500 ml pack of fresh toned milk
 *         category:
 *           type: object
 *           properties:
 *             _id:
 *               $ref: '#/components/schemas/ObjectId'
 *             name:
 *               type: string
 *               example: Dairy & Eggs
 *         brand:
 *           type: object
 *           properties:
 *             _id:
 *               $ref: '#/components/schemas/ObjectId'
 *             name:
 *               type: string
 *               example: Amul
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           example:
 *             - https://cdn.quickcore.in/products/milk-500ml.png
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 29
 *         discountPrice:
 *           type: number
 *           minimum: 0
 *           example: 27
 *         unit:
 *           type: string
 *           enum:
 *             - g
 *             - kg
 *             - ml
 *             - l
 *             - piece
 *             - packet
 *             - dozen
 *           example: ml
 *         quantityPerUnit:
 *           type: number
 *           minimum: 0
 *           example: 500
 *         sku:
 *           type: string
 *           example: AMUL-TAAZA-500ML
 *         barcode:
 *           type: string
 *           example: '8901262010102'
 *         averageRating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           example: 4.5
 *         totalReviews:
 *           type: integer
 *           minimum: 0
 *           example: 128
 *         isActive:
 *           type: boolean
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - brand
 *         - price
 *         - unit
 *         - quantityPerUnit
 *         - sku
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 150
 *           example: Amul Taaza Toned Milk
 *         description:
 *           type: string
 *           maxLength: 1000
 *           example: 500 ml pack of fresh toned milk
 *         category:
 *           $ref: '#/components/schemas/ObjectId'
 *         brand:
 *           $ref: '#/components/schemas/ObjectId'
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           example:
 *             - https://cdn.quickcore.in/products/milk-500ml.png
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 29
 *         discountPrice:
 *           type: number
 *           minimum: 0
 *           description: Must be lower than or equal to price
 *           example: 27
 *         unit:
 *           type: string
 *           enum:
 *             - g
 *             - kg
 *             - ml
 *             - l
 *             - piece
 *             - packet
 *             - dozen
 *           example: ml
 *         quantityPerUnit:
 *           type: number
 *           minimum: 0
 *           example: 500
 *         sku:
 *           type: string
 *           description: Uppercased automatically
 *           example: amul-taaza-500ml
 *         barcode:
 *           type: string
 *           example: '8901262010102'
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *     UpdateProductRequest:
 *       type: object
 *       description: At least one field must be provided
 *       minProperties: 1
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 150
 *         description:
 *           type: string
 *           maxLength: 1000
 *         category:
 *           $ref: '#/components/schemas/ObjectId'
 *         brand:
 *           $ref: '#/components/schemas/ObjectId'
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *         price:
 *           type: number
 *           minimum: 0
 *         discountPrice:
 *           type: number
 *           minimum: 0
 *         unit:
 *           type: string
 *           enum:
 *             - g
 *             - kg
 *             - ml
 *             - l
 *             - piece
 *             - packet
 *             - dozen
 *         quantityPerUnit:
 *           type: number
 *           minimum: 0
 *         sku:
 *           type: string
 *         barcode:
 *           type: string
 *         isActive:
 *           type: boolean
 *
 *     ProductList:
 *       type: object
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     Warehouse:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: '#/components/schemas/ObjectId'
 *         name:
 *           type: string
 *           maxLength: 100
 *           example: Delhi - Okhla Fulfilment Hub
 *         code:
 *           type: string
 *           example: WH-DEL-01
 *         manager:
 *           type: object
 *           nullable: true
 *           properties:
 *             _id:
 *               $ref: '#/components/schemas/ObjectId'
 *             name:
 *               type: string
 *               example: Priya Sharma
 *             email:
 *               type: string
 *               format: email
 *               example: priya@quickcore.in
 *             phone:
 *               type: string
 *               example: '9812345670'
 *         address:
 *           type: string
 *           example: 12, Okhla Industrial Estate, New Delhi
 *         location:
 *           $ref: '#/components/schemas/GeoPoint'
 *         serviceRadius:
 *           type: number
 *           minimum: 1
 *           example: 5
 *         capacity:
 *           type: number
 *           minimum: 0
 *           example: 10000
 *         currentLoad:
 *           type: number
 *           minimum: 0
 *           example: 3400
 *         status:
 *           type: string
 *           enum:
 *             - active
 *             - inactive
 *             - maintenance
 *           example: active
 *         phone:
 *           type: string
 *           example: '9812345670'
 *         isActive:
 *           type: boolean
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateWarehouseRequest:
 *       type: object
 *       required:
 *         - name
 *         - code
 *         - address
 *         - location
 *         - serviceRadius
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: Delhi - Okhla Fulfilment Hub
 *         code:
 *           type: string
 *           description: Uppercased automatically, must be unique
 *           example: wh-del-01
 *         manager:
 *           type: string
 *           nullable: true
 *           description: ObjectId of a User
 *           example: 65f4c1a2b3c4d5e6f7a8b9c0
 *         address:
 *           type: string
 *           example: 12, Okhla Industrial Estate, New Delhi
 *         location:
 *           $ref: '#/components/schemas/GeoPoint'
 *         serviceRadius:
 *           type: number
 *           minimum: 1
 *           example: 5
 *         capacity:
 *           type: number
 *           minimum: 0
 *           example: 10000
 *         currentLoad:
 *           type: number
 *           minimum: 0
 *           example: 0
 *         status:
 *           type: string
 *           enum:
 *             - active
 *             - inactive
 *             - maintenance
 *           example: active
 *         phone:
 *           type: string
 *           pattern: '^[6-9][0-9]{9}$'
 *           example: '9812345670'
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *     UpdateWarehouseRequest:
 *       type: object
 *       description: At least one field must be provided
 *       minProperties: 1
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         code:
 *           type: string
 *         manager:
 *           type: string
 *           nullable: true
 *         address:
 *           type: string
 *         location:
 *           $ref: '#/components/schemas/GeoPoint'
 *         serviceRadius:
 *           type: number
 *           minimum: 1
 *         capacity:
 *           type: number
 *           minimum: 0
 *         currentLoad:
 *           type: number
 *           minimum: 0
 *         status:
 *           type: string
 *           enum:
 *             - active
 *             - inactive
 *             - maintenance
 *         phone:
 *           type: string
 *           pattern: '^[6-9][0-9]{9}$'
 *         isActive:
 *           type: boolean
 *
 *     WarehouseList:
 *       type: object
 *       properties:
 *         warehouses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Warehouse'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     Inventory:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: '#/components/schemas/ObjectId'
 *         warehouse:
 *           type: object
 *           properties:
 *             _id:
 *               $ref: '#/components/schemas/ObjectId'
 *             name:
 *               type: string
 *               example: Delhi - Okhla Fulfilment Hub
 *             code:
 *               type: string
 *               example: WH-DEL-01
 *         product:
 *           type: object
 *           properties:
 *             _id:
 *               $ref: '#/components/schemas/ObjectId'
 *             name:
 *               type: string
 *               example: Amul Taaza Toned Milk
 *             sku:
 *               type: string
 *               example: AMUL-TAAZA-500ML
 *         quantity:
 *           type: number
 *           minimum: 0
 *           example: 540
 *         reservedQuantity:
 *           type: number
 *           minimum: 0
 *           example: 12
 *         reorderLevel:
 *           type: number
 *           minimum: 0
 *           example: 10
 *         maxStockLevel:
 *           type: number
 *           minimum: 1
 *           example: 100
 *         lastRestockedAt:
 *           type: string
 *           format: date-time
 *         isActive:
 *           type: boolean
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateInventoryRequest:
 *       type: object
 *       required:
 *         - warehouse
 *         - product
 *         - quantity
 *       properties:
 *         warehouse:
 *           $ref: '#/components/schemas/ObjectId'
 *         product:
 *           $ref: '#/components/schemas/ObjectId'
 *         quantity:
 *           type: number
 *           minimum: 0
 *           example: 100
 *         reservedQuantity:
 *           type: number
 *           minimum: 0
 *           example: 0
 *         reorderLevel:
 *           type: number
 *           minimum: 0
 *           example: 10
 *         maxStockLevel:
 *           type: number
 *           minimum: 1
 *           example: 100
 *         lastRestockedAt:
 *           type: string
 *           format: date-time
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *     UpdateInventoryRequest:
 *       type: object
 *       description: At least one field must be provided
 *       minProperties: 1
 *       properties:
 *         warehouse:
 *           $ref: '#/components/schemas/ObjectId'
 *         product:
 *           $ref: '#/components/schemas/ObjectId'
 *         quantity:
 *           type: number
 *           minimum: 0
 *         reservedQuantity:
 *           type: number
 *           minimum: 0
 *         reorderLevel:
 *           type: number
 *           minimum: 0
 *         maxStockLevel:
 *           type: number
 *           minimum: 1
 *         lastRestockedAt:
 *           type: string
 *           format: date-time
 *         isActive:
 *           type: boolean
 *
 *     InventoryList:
 *       type: object
 *       properties:
 *         inventories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Inventory'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     CartItem:
 *       type: object
 *       properties:
 *         product:
 *           $ref: '#/components/schemas/Product'
 *         warehouse:
 *           $ref: '#/components/schemas/Warehouse'
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 29
 *
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: '#/components/schemas/ObjectId'
 *         user:
 *           $ref: '#/components/schemas/ObjectId'
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         subtotal:
 *           type: number
 *           minimum: 0
 *           example: 87
 *         discount:
 *           type: number
 *           minimum: 0
 *           example: 0
 *         total:
 *           type: number
 *           minimum: 0
 *           example: 87
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     AddCartItemRequest:
 *       type: object
 *       required:
 *         - product
 *         - warehouse
 *         - quantity
 *       properties:
 *         product:
 *           $ref: '#/components/schemas/ObjectId'
 *         warehouse:
 *           $ref: '#/components/schemas/ObjectId'
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *
 *     UpdateCartItemRequest:
 *       type: object
 *       required:
 *         - quantity
 *       properties:
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 5
 *
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: '#/components/schemas/ObjectId'
 *         orderNumber:
 *           type: string
 *           example: ORD-1719742000000-4821
 *         customer:
 *           $ref: '#/components/schemas/ObjectId'
 *         warehouse:
 *           type: object
 *           properties:
 *             _id:
 *               $ref: '#/components/schemas/ObjectId'
 *             name:
 *               type: string
 *               example: Delhi - Okhla Fulfilment Hub
 *         coupon:
 *           type: string
 *           nullable: true
 *         payment:
 *           type: string
 *           nullable: true
 *         delivery:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum:
 *             - placed
 *             - confirmed
 *             - packing
 *             - ready
 *             - picked_up
 *             - delivered
 *             - cancelled
 *           example: placed
 *         paymentStatus:
 *           type: string
 *           enum:
 *             - pending
 *             - paid
 *             - failed
 *             - refunded
 *           example: pending
 *         subtotal:
 *           type: number
 *           minimum: 0
 *           example: 200
 *         discount:
 *           type: number
 *           minimum: 0
 *           example: 0
 *         deliveryFee:
 *           type: number
 *           minimum: 0
 *           example: 40
 *         tax:
 *           type: number
 *           minimum: 0
 *           example: 0
 *         total:
 *           type: number
 *           minimum: 0
 *           example: 240
 *         deliveryAddress:
 *           type: object
 *           nullable: true
 *           description: Populated Address document
 *         notes:
 *           type: string
 *           maxLength: 300
 *           example: Call before delivery
 *         placedAt:
 *           type: string
 *           format: date-time
 *         deliveredAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     OrderItem:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: '#/components/schemas/ObjectId'
 *         order:
 *           $ref: '#/components/schemas/ObjectId'
 *         product:
 *           $ref: '#/components/schemas/ObjectId'
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *         unitPrice:
 *           type: number
 *           minimum: 0
 *           example: 100
 *         discount:
 *           type: number
 *           minimum: 0
 *           example: 0
 *         totalPrice:
 *           type: number
 *           minimum: 0
 *           example: 200
 *         productName:
 *           type: string
 *           example: Amul Taaza Toned Milk
 *         productImage:
 *           type: string
 *           example: https://cdn.quickcore.in/products/milk-500ml.png
 *         productWeight:
 *           type: string
 *           example: '500'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     OrderDetail:
 *       type: object
 *       properties:
 *         order:
 *           $ref: '#/components/schemas/Order'
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *
 *     CreateOrderRequest:
 *       type: object
 *       required:
 *         - warehouse
 *         - deliveryAddress
 *       properties:
 *         warehouse:
 *           $ref: '#/components/schemas/ObjectId'
 *         deliveryAddress:
 *           $ref: '#/components/schemas/ObjectId'
 *           description: ObjectId of an Address document
 *         coupon:
 *           type: string
 *           nullable: true
 *           description: ObjectId of a Coupon document
 *         notes:
 *           type: string
 *           maxLength: 300
 *           example: Call before delivery
 *
 *     UpdateOrderStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum:
 *             - placed
 *             - confirmed
 *             - packing
 *             - ready
 *             - picked_up
 *             - delivered
 *             - cancelled
 *           example: confirmed
 *
 *     Payment:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: '#/components/schemas/ObjectId'
 *         order:
 *           type: object
 *           properties:
 *             _id:
 *               $ref: '#/components/schemas/ObjectId'
 *             orderNumber:
 *               type: string
 *               example: ORD-1719742000000-4821
 *             total:
 *               type: number
 *               example: 240
 *             status:
 *               type: string
 *               example: placed
 *         customer:
 *           $ref: '#/components/schemas/ObjectId'
 *         amount:
 *           type: number
 *           minimum: 0
 *           example: 240
 *         paymentMethod:
 *           type: string
 *           enum:
 *             - upi
 *             - card
 *             - net_banking
 *             - wallet
 *             - cod
 *           example: upi
 *         paymentProvider:
 *           type: string
 *           enum:
 *             - razorpay
 *             - stripe
 *             - cashfree
 *             - phonepe
 *             - paytm
 *             - cod
 *           example: razorpay
 *         transactionId:
 *           type: string
 *           example: pay_Qz5Xj2mRw8aBc1
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - processing
 *             - successful
 *             - failed
 *             - cancelled
 *             - refunded
 *           example: pending
 *         paidAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         refundAmount:
 *           type: number
 *           minimum: 0
 *           example: 0
 *         refundReason:
 *           type: string
 *           example: ''
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreatePaymentRequest:
 *       type: object
 *       required:
 *         - order
 *         - paymentMethod
 *         - paymentProvider
 *       properties:
 *         order:
 *           $ref: '#/components/schemas/ObjectId'
 *         paymentMethod:
 *           type: string
 *           enum:
 *             - upi
 *             - card
 *             - net_banking
 *             - wallet
 *             - cod
 *           example: upi
 *         paymentProvider:
 *           type: string
 *           enum:
 *             - razorpay
 *             - stripe
 *             - cashfree
 *             - phonepe
 *             - paytm
 *             - cod
 *           example: razorpay
 *
 *     UpdatePaymentStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - processing
 *             - successful
 *             - failed
 *             - cancelled
 *             - refunded
 *           example: successful
 *         transactionId:
 *           type: string
 *           example: pay_Qz5Xj2mRw8aBc1
 *         refundAmount:
 *           type: number
 *           minimum: 0
 *           example: 240
 *         refundReason:
 *           type: string
 *           example: Customer request
 *
 *     Driver:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: '#/components/schemas/ObjectId'
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               $ref: '#/components/schemas/ObjectId'
 *             name:
 *               type: string
 *               example: Ravi Kumar
 *             email:
 *               type: string
 *               format: email
 *               example: ravi@quickcore.in
 *             phone:
 *               type: string
 *               example: '9950123456'
 *         warehouse:
 *           type: object
 *           properties:
 *             _id:
 *               $ref: '#/components/schemas/ObjectId'
 *             name:
 *               type: string
 *               example: Delhi - Okhla Fulfilment Hub
 *             code:
 *               type: string
 *               example: WH-DEL-01
 *         vehicleType:
 *           type: string
 *           enum:
 *             - bike
 *             - scooter
 *             - bicycle
 *             - car
 *           example: bike
 *         vehicleNumber:
 *           type: string
 *           example: DL-01-AB-1234
 *         licenseNumber:
 *           type: string
 *           example: DL-2019-123456
 *         status:
 *           type: string
 *           enum:
 *             - offline
 *             - online
 *             - busy
 *             - on_break
 *           example: offline
 *         currentLocation:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *               nullable: true
 *               example: 28.6139
 *             longitude:
 *               type: number
 *               nullable: true
 *               example: 77.2090
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           example: 5
 *         totalDeliveries:
 *           type: integer
 *           minimum: 0
 *           example: 0
 *         isAvailable:
 *           type: boolean
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateDriverRequest:
 *       type: object
 *       required:
 *         - user
 *         - warehouse
 *         - vehicleType
 *         - vehicleNumber
 *         - licenseNumber
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/ObjectId'
 *           description: ObjectId of a User with the driver role
 *         warehouse:
 *           $ref: '#/components/schemas/ObjectId'
 *         vehicleType:
 *           type: string
 *           enum:
 *             - bike
 *             - scooter
 *             - bicycle
 *             - car
 *           example: bike
 *         vehicleNumber:
 *           type: string
 *           example: DL01AB1234
 *         licenseNumber:
 *           type: string
 *           example: DL2019123456
 *
 *     UpdateDriverRequest:
 *       type: object
 *       description: At least one field must be provided
 *       minProperties: 1
 *       properties:
 *         warehouse:
 *           $ref: '#/components/schemas/ObjectId'
 *         vehicleType:
 *           type: string
 *           enum:
 *             - bike
 *             - scooter
 *             - bicycle
 *             - car
 *         vehicleNumber:
 *           type: string
 *         licenseNumber:
 *           type: string
 *         status:
 *           type: string
 *           enum:
 *             - offline
 *             - online
 *             - busy
 *             - on_break
 *         currentLocation:
 *           type: object
 *           required:
 *             - latitude
 *             - longitude
 *           properties:
 *             latitude:
 *               type: number
 *               example: 28.6139
 *             longitude:
 *               type: number
 *               example: 77.2090
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         totalDeliveries:
 *           type: integer
 *           minimum: 0
 *         isAvailable:
 *           type: boolean
 *
 *     DriverList:
 *       type: object
 *       properties:
 *         drivers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Driver'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     Delivery:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: '#/components/schemas/ObjectId'
 *         order:
 *           type: object
 *           description: Populated Order document
 *         driver:
 *           type: object
 *           nullable: true
 *           description: Populated Driver document
 *         warehouse:
 *           type: object
 *           properties:
 *             _id:
 *               $ref: '#/components/schemas/ObjectId'
 *             name:
 *               type: string
 *               example: Delhi - Okhla Fulfilment Hub
 *             code:
 *               type: string
 *               example: WH-DEL-01
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - assigned
 *             - picked_up
 *             - out_for_delivery
 *             - delivered
 *             - failed
 *             - cancelled
 *           example: pending
 *         pickupTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         dispatchTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         deliveredTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         estimatedDeliveryTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         actualDistance:
 *           type: number
 *           minimum: 0
 *           example: 4.2
 *         deliveryNotes:
 *           type: string
 *           example: Hand over at the security gate
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateDeliveryRequest:
 *       type: object
 *       required:
 *         - order
 *         - warehouse
 *       properties:
 *         order:
 *           $ref: '#/components/schemas/ObjectId'
 *         warehouse:
 *           $ref: '#/components/schemas/ObjectId'
 *         driver:
 *           type: string
 *           nullable: true
 *           example: 65f4c1a2b3c4d5e6f7a8b9c0
 *         estimatedDeliveryTime:
 *           type: string
 *           format: date-time
 *         deliveryNotes:
 *           type: string
 *           example: Hand over at the security gate
 *
 *     UpdateDeliveryRequest:
 *       type: object
 *       description: At least one field must be provided
 *       minProperties: 1
 *       properties:
 *         driver:
 *           $ref: '#/components/schemas/ObjectId'
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - assigned
 *             - picked_up
 *             - out_for_delivery
 *             - delivered
 *             - failed
 *             - cancelled
 *         pickupTime:
 *           type: string
 *           format: date-time
 *         dispatchTime:
 *           type: string
 *           format: date-time
 *         deliveredTime:
 *           type: string
 *           format: date-time
 *         estimatedDeliveryTime:
 *           type: string
 *           format: date-time
 *         actualDistance:
 *           type: number
 *           minimum: 0
 *         deliveryNotes:
 *           type: string
 *
 *     DeliveryList:
 *       type: object
 *       properties:
 *         deliveries:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Delivery'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     Notification:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: '#/components/schemas/ObjectId'
 *         recipient:
 *           $ref: '#/components/schemas/ObjectId'
 *         title:
 *           type: string
 *           maxLength: 100
 *           example: Order Shipped
 *         message:
 *           type: string
 *           maxLength: 500
 *           example: Your order ORD-1719742000000-4821 is out for delivery
 *         type:
 *           type: string
 *           enum:
 *             - order
 *             - payment
 *             - delivery
 *             - coupon
 *             - system
 *           example: system
 *         isRead:
 *           type: boolean
 *           default: false
 *         metadata:
 *           type: object
 *           additionalProperties: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateNotificationRequest:
 *       type: object
 *       required:
 *         - recipient
 *         - title
 *         - message
 *       properties:
 *         recipient:
 *           $ref: '#/components/schemas/ObjectId'
 *         title:
 *           type: string
 *           maxLength: 100
 *           example: Order Shipped
 *         message:
 *           type: string
 *           maxLength: 500
 *           example: Your order ORD-1719742000000-4821 is out for delivery
 *         type:
 *           type: string
 *           enum:
 *             - order
 *             - payment
 *             - delivery
 *             - coupon
 *             - system
 *           default: system
 *         metadata:
 *           type: object
 *           additionalProperties: true
 *
 *     NotificationList:
 *       type: object
 *       properties:
 *         notifications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Notification'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *
 * paths:
 *   /auth/signup:
 *     post:
 *       tags:
 *         - Authentication
 *       summary: Register a new user
 *       description: Creates a customer or admin account, then sets httpOnly accessToken and refreshToken cookies.
 *       operationId: signup
 *       security: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SignupRequest'
 *             example:
 *               name: John Doe
 *               email: john@example.com
 *               phone: '9876543210'
 *               password: Password@123
 *               role: customer
 *       responses:
 *         '201':
 *           description: User registered successfully (auth cookies are also set)
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/AuthData'
 *               example:
 *                 statusCode: 201
 *                 success: true
 *                 message: User registered successfully
 *                 data:
 *                   user:
 *                     id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                     name: John Doe
 *                     email: john@example.com
 *                     phone: '9876543210'
 *                     role: customer
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '409':
 *           description: User with this email or phone already exists
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: User with this email or phone already exists
 *                 errors: []
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /auth/login:
 *     post:
 *       tags:
 *         - Authentication
 *       summary: Login a user
 *       description: Authenticates with email and password, then sets httpOnly accessToken and refreshToken cookies.
 *       operationId: login
 *       security: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginRequest'
 *             example:
 *               email: john@example.com
 *               password: Password@123
 *       responses:
 *         '200':
 *           description: Login successful (auth cookies are also set)
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/AuthData'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Login successful
 *                 data:
 *                   user:
 *                     id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                     name: John Doe
 *                     email: john@example.com
 *                     phone: '9876543210'
 *                     role: customer
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           description: Invalid email or password
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: Invalid email or password
 *                 errors: []
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /auth/refresh-token:
 *     post:
 *       tags:
 *         - Authentication
 *       summary: Refresh access token
 *       description: Reads the refreshToken cookie, verifies it against the RefreshToken store and issues a new accessToken cookie.
 *       operationId: refreshToken
 *       security: []
 *       responses:
 *         '200':
 *           description: Access token refreshed successfully (new accessToken cookie is set)
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Access token refreshed successfully
 *                 data: null
 *         '401':
 *           description: Refresh token is missing, invalid or expired
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: Invalid refresh token
 *                 errors: []
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /auth/logout:
 *     post:
 *       tags:
 *         - Authentication
 *       summary: Logout a user
 *       description: Revokes all stored refresh tokens for the user and clears the accessToken and refreshToken cookies.
 *       operationId: logout
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Logout successful
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Logout successful
 *                 data: null
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /auth/me:
 *     get:
 *       tags:
 *         - Authentication
 *       summary: Get current user
 *       description: Returns the profile of the currently authenticated user.
 *       operationId: getCurrentUser
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Current user fetched successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/User'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Current user fetched successfully
 *                 data:
 *                   id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   name: John Doe
 *                   email: john@example.com
 *                   phone: '9876543210'
 *                   role: customer
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /categories:
 *     get:
 *       tags:
 *         - Categories
 *       summary: List categories
 *       description: Returns active categories with pagination. Supports name search.
 *       operationId: getCategories
 *       security: []
 *       parameters:
 *         - name: page
 *           in: query
 *           required: false
 *           schema:
 *             type: integer
 *             minimum: 1
 *             default: 1
 *         - name: limit
 *           in: query
 *           required: false
 *           schema:
 *             type: integer
 *             minimum: 1
 *             default: 10
 *         - name: search
 *           in: query
 *           required: false
 *           schema:
 *             type: string
 *             description: Case-insensitive substring match on category name
 *       responses:
 *         '200':
 *           description: Categories fetched successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/CategoryList'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Categories fetched successfully
 *                 data:
 *                   categories:
 *                     - _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                       name: Dairy & Eggs
 *                       description: Fresh milk, eggs and paneer
 *                       image: https://cdn.quickcore.in/categories/dairy.png
 *                       isActive: true
 *                   pagination:
 *                     page: 1
 *                     limit: 10
 *                     total: 1
 *                     totalPages: 1
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     post:
 *       tags:
 *         - Categories
 *       summary: Create a category
 *       description: Admin only. Returns 409 if the category name already exists.
 *       operationId: createCategory
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateCategoryRequest'
 *             example:
 *               name: Dairy & Eggs
 *               description: Fresh milk, eggs and paneer
 *               image: https://cdn.quickcore.in/categories/dairy.png
 *               displayOrder: 1
 *               isActive: true
 *       responses:
 *         '201':
 *           description: Category created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Category'
 *               example:
 *                 statusCode: 201
 *                 success: true
 *                 message: Category created successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   name: Dairy & Eggs
 *                   description: Fresh milk, eggs and paneer
 *                   image: https://cdn.quickcore.in/categories/dairy.png
 *                   isActive: true
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '409':
 *           description: Category already exists
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: Category already exists
 *                 errors: []
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /categories/{id}:
 *     get:
 *       tags:
 *         - Categories
 *       summary: Get a category by id
 *       description: Returns a single active category.
 *       operationId: getCategoryById
 *       security: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Category fetched successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Category'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Category fetched successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   name: Dairy & Eggs
 *                   isActive: true
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     patch:
 *       tags:
 *         - Categories
 *       summary: Update a category
 *       description: Admin only. At least one field is required.
 *       operationId: updateCategory
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateCategoryRequest'
 *             example:
 *               name: Dairy & Frozen
 *               isActive: true
 *       responses:
 *         '200':
 *           description: Category updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Category'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Category updated successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   name: Dairy & Frozen
 *                   isActive: true
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     delete:
 *       tags:
 *         - Categories
 *       summary: Delete a category
 *       description: Admin only. Soft delete (isActive set to false).
 *       operationId: deleteCategory
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Category deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Category deleted successfully
 *                 data: null
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /brands:
 *     get:
 *       tags:
 *         - Brands
 *       summary: List brands
 *       description: Returns active brands with pagination. Supports name search.
 *       operationId: getBrands
 *       security: []
 *       parameters:
 *         - name: page
 *           in: query
 *           required: false
 *           schema:
 *             type: integer
 *             minimum: 1
 *             default: 1
 *         - name: limit
 *           in: query
 *           required: false
 *           schema:
 *             type: integer
 *             minimum: 1
 *             default: 10
 *         - name: search
 *           in: query
 *           required: false
 *           schema:
 *             type: string
 *             description: Case-insensitive substring match on brand name
 *       responses:
 *         '200':
 *           description: Brands fetched successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/BrandList'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Brands fetched successfully
 *                 data:
 *                   brands:
 *                     - _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                       name: Amul
 *                       description: India's largest dairy brand
 *                       logo: https://cdn.quickcore.in/brands/amul.png
 *                       isActive: true
 *                   pagination:
 *                     page: 1
 *                     limit: 10
 *                     total: 1
 *                     totalPages: 1
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     post:
 *       tags:
 *         - Brands
 *       summary: Create a brand
 *       description: Admin only. Returns 409 if the brand name already exists.
 *       operationId: createBrand
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateBrandRequest'
 *             example:
 *               name: Amul
 *               description: India's largest dairy brand
 *               image: https://cdn.quickcore.in/brands/amul.png
 *               isActive: true
 *       responses:
 *         '201':
 *           description: Brand created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Brand'
 *               example:
 *                 statusCode: 201
 *                 success: true
 *                 message: Brand created successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   name: Amul
 *                   description: India's largest dairy brand
 *                   isActive: true
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '409':
 *           description: Brand already exists
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: Brand already exists
 *                 errors: []
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /brands/{id}:
 *     get:
 *       tags:
 *         - Brands
 *       summary: Get a brand by id
 *       operationId: getBrandById
 *       security: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Brand fetched successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Brand'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Brand fetched successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   name: Amul
 *                   isActive: true
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     patch:
 *       tags:
 *         - Brands
 *       summary: Update a brand
 *       description: Admin only. At least one field is required.
 *       operationId: updateBrand
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateBrandRequest'
 *             example:
 *               name: Amul India
 *               description: Updated description
 *       responses:
 *         '200':
 *           description: Brand updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Brand'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Brand updated successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   name: Amul India
 *                   description: Updated description
 *                   isActive: true
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     delete:
 *       tags:
 *         - Brands
 *       summary: Delete a brand
 *       description: Admin only. Soft delete (isActive set to false).
 *       operationId: deleteBrand
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Brand deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Brand deleted successfully
 *                 data: null
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /products:
 *     get:
 *       tags:
 *         - Products
 *       summary: List products
 *       description: Returns active products with pagination. Supports text search, category and brand filters and a price range.
 *       operationId: getProducts
 *       security: []
 *       parameters:
 *         - name: page
 *           in: query
 *           required: false
 *           schema:
 *             type: integer
 *             minimum: 1
 *             default: 1
 *         - name: limit
 *           in: query
 *           required: false
 *           schema:
 *             type: integer
 *             minimum: 1
 *             default: 10
 *         - name: search
 *           in: query
 *           required: false
 *           schema:
 *             type: string
 *             description: Full text search on name and description
 *         - name: category
 *           in: query
 *           required: false
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *         - name: brand
 *           in: query
 *           required: false
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *         - name: minPrice
 *           in: query
 *           required: false
 *           schema:
 *             type: number
 *             minimum: 0
 *         - name: maxPrice
 *           in: query
 *           required: false
 *           schema:
 *             type: number
 *             minimum: 0
 *       responses:
 *         '200':
 *           description: Products fetched successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/ProductList'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Products fetched successfully
 *                 data:
 *                   products:
 *                     - _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                       name: Amul Taaza Toned Milk
 *                       category:
 *                         _id: 65f4c1a2b3c4d5e6f7a8b9c1
 *                         name: Dairy & Eggs
 *                       brand:
 *                         _id: 65f4c1a2b3c4d5e6f7a8b9c2
 *                         name: Amul
 *                       price: 29
 *                       unit: ml
 *                       quantityPerUnit: 500
 *                       sku: AMUL-TAAZA-500ML
 *                       isActive: true
 *                   pagination:
 *                     page: 1
 *                     limit: 10
 *                     total: 1
 *                     totalPages: 1
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     post:
 *       tags:
 *         - Products
 *       summary: Create a product
 *       description: Admin only. Validates category and brand existence. Returns 409 if the SKU already exists.
 *       operationId: createProduct
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateProductRequest'
 *             example:
 *               name: Amul Taaza Toned Milk
 *               description: 500 ml pack of fresh toned milk
 *               category: 65f4c1a2b3c4d5e6f7a8b9c1
 *               brand: 65f4c1a2b3c4d5e6f7a8b9c2
 *               price: 29
 *               discountPrice: 27
 *               unit: ml
 *               quantityPerUnit: 500
 *               sku: amul-taaza-500ml
 *               barcode: '8901262010102'
 *               isActive: true
 *       responses:
 *         '201':
 *           description: Product created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Product'
 *               example:
 *                 statusCode: 201
 *                 success: true
 *                 message: Product created successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   name: Amul Taaza Toned Milk
 *                   sku: AMUL-TAAZA-500ML
 *                   price: 29
 *                   unit: ml
 *                   quantityPerUnit: 500
 *                   isActive: true
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           description: Category or brand not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: Category not found
 *                 errors: []
 *         '409':
 *           description: Product with same SKU already exists
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: Product with same SKU already exists
 *                 errors: []
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /products/{id}:
 *     get:
 *       tags:
 *         - Products
 *       summary: Get a product by id
 *       operationId: getProductById
 *       security: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Product fetched successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Product'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Product fetched successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   name: Amul Taaza Toned Milk
 *                   category:
 *                     _id: 65f4c1a2b3c4d5e6f7a8b9c1
 *                     name: Dairy & Eggs
 *                   brand:
 *                     _id: 65f4c1a2b3c4d5e6f7a8b9c2
 *                     name: Amul
 *                   price: 29
 *                   isActive: true
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     patch:
 *       tags:
 *         - Products
 *       summary: Update a product
 *       description: Admin only. At least one field is required. Validates category and brand existence when provided.
 *       operationId: updateProduct
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateProductRequest'
 *             example:
 *               price: 31
 *               discountPrice: 28
 *       responses:
 *         '200':
 *           description: Product updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Product'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Product updated successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   name: Amul Taaza Toned Milk
 *                   price: 31
 *                   isActive: true
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     delete:
 *       tags:
 *         - Products
 *       summary: Delete a product
 *       description: Admin only. Soft delete (isActive set to false).
 *       operationId: deleteProduct
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Product deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Product deleted successfully
 *                 data: null
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /warehouses:
 *     get:
 *       tags:
 *         - Warehouses
 *       summary: List warehouses
 *       description: Returns active warehouses with pagination. Supports name search and status filter.
 *       operationId: getWarehouses
 *       security: []
 *       parameters:
 *         - name: page
 *           in: query
 *           required: false
 *           schema:
 *             type: integer
 *             minimum: 1
 *             default: 1
 *         - name: limit
 *           in: query
 *           required: false
 *           schema:
 *             type: integer
 *             minimum: 1
 *             default: 10
 *         - name: search
 *           in: query
 *           required: false
 *           schema:
 *             type: string
 *             description: Case-insensitive substring match on warehouse name
 *         - name: status
 *           in: query
 *           required: false
 *           schema:
 *             type: string
 *             enum:
 *               - active
 *               - inactive
 *               - maintenance
 *       responses:
 *         '200':
 *           description: Warehouses fetched successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/WarehouseList'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Warehouses fetched successfully
 *                 data:
 *                   warehouses:
 *                     - _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                       name: Delhi - Okhla Fulfilment Hub
 *                       code: WH-DEL-01
 *                       address: 12, Okhla Industrial Estate, New Delhi
 *                       serviceRadius: 5
 *                       status: active
 *                       isActive: true
 *                   pagination:
 *                     page: 1
 *                     limit: 10
 *                     total: 1
 *                     totalPages: 1
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     post:
 *       tags:
 *         - Warehouses
 *       summary: Create a warehouse
 *       description: Admin only. Returns 409 if the warehouse code already exists.
 *       operationId: createWarehouse
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateWarehouseRequest'
 *             example:
 *               name: Delhi - Okhla Fulfilment Hub
 *               code: wh-del-01
 *               address: 12, Okhla Industrial Estate, New Delhi
 *               location:
 *                 type: Point
 *                 coordinates:
 *                   - 77.2090
 *                   - 28.6139
 *               serviceRadius: 5
 *               capacity: 10000
 *               phone: '9812345670'
 *               isActive: true
 *       responses:
 *         '201':
 *           description: Warehouse created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Warehouse'
 *               example:
 *                 statusCode: 201
 *                 success: true
 *                 message: Warehouse created successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   name: Delhi - Okhla Fulfilment Hub
 *                   code: WH-DEL-01
 *                   status: active
 *                   isActive: true
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           description: Manager not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: Manager not found
 *                 errors: []
 *         '409':
 *           description: Warehouse code already exists
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: Warehouse code already exists
 *                 errors: []
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /warehouses/{id}:
 *     get:
 *       tags:
 *         - Warehouses
 *       summary: Get a warehouse by id
 *       operationId: getWarehouseById
 *       security: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Warehouse fetched successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Warehouse'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Warehouse fetched successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   name: Delhi - Okhla Fulfilment Hub
 *                   code: WH-DEL-01
 *                   isActive: true
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     patch:
 *       tags:
 *         - Warehouses
 *       summary: Update a warehouse
 *       description: Admin only. At least one field is required.
 *       operationId: updateWarehouse
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateWarehouseRequest'
 *             example:
 *               status: maintenance
 *               currentLoad: 4200
 *       responses:
 *         '200':
 *           description: Warehouse updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Warehouse'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Warehouse updated successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   name: Delhi - Okhla Fulfilment Hub
 *                   status: maintenance
 *                   isActive: true
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     delete:
 *       tags:
 *         - Warehouses
 *       summary: Delete a warehouse
 *       description: Admin only. Soft delete (isActive set to false).
 *       operationId: deleteWarehouse
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Warehouse deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Warehouse deleted successfully
 *                 data: null
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /inventories:
 *     get:
 *       tags:
 *         - Inventory
 *       summary: List inventory records
 *       description: Returns active inventory records with pagination. Can be filtered by warehouse and product.
 *       operationId: getInventories
 *       security: []
 *       parameters:
 *         - name: page
 *           in: query
 *           required: false
 *           schema:
 *             type: integer
 *             minimum: 1
 *             default: 1
 *         - name: limit
 *           in: query
 *           required: false
 *           schema:
 *             type: integer
 *             minimum: 1
 *             default: 10
 *         - name: warehouse
 *           in: query
 *           required: false
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *         - name: product
 *           in: query
 *           required: false
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Inventories fetched successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/InventoryList'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Inventories fetched successfully
 *                 data:
 *                   inventories:
 *                     - _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                       warehouse:
 *                         _id: 65f4c1a2b3c4d5e6f7a8b9c1
 *                         name: Delhi - Okhla Fulfilment Hub
 *                         code: WH-DEL-01
 *                       product:
 *                         _id: 65f4c1a2b3c4d5e6f7a8b9c2
 *                         name: Amul Taaza Toned Milk
 *                         sku: AMUL-TAAZA-500ML
 *                       quantity: 540
 *                       isActive: true
 *                   pagination:
 *                     page: 1
 *                     limit: 10
 *                     total: 1
 *                     totalPages: 1
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     post:
 *       tags:
 *         - Inventory
 *       summary: Create an inventory record
 *       description: Admin only. Returns 409 if the warehouse-product combination already exists.
 *       operationId: createInventory
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateInventoryRequest'
 *             example:
 *               warehouse: 65f4c1a2b3c4d5e6f7a8b9c1
 *               product: 65f4c1a2b3c4d5e6f7a8b9c2
 *               quantity: 100
 *               reorderLevel: 10
 *               maxStockLevel: 100
 *               isActive: true
 *       responses:
 *         '201':
 *           description: Inventory created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Inventory'
 *               example:
 *                 statusCode: 201
 *                 success: true
 *                 message: Inventory created successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   quantity: 100
 *                   isActive: true
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           description: Warehouse or product not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: Warehouse not found
 *                 errors: []
 *         '409':
 *           description: Inventory already exists for this warehouse and product
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: Inventory already exists for this warehouse and product
 *                 errors: []
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /inventories/{id}:
 *     get:
 *       tags:
 *         - Inventory
 *       summary: Get an inventory record by id
 *       operationId: getInventoryById
 *       security: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Inventory fetched successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Inventory'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Inventory fetched successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   quantity: 540
 *                   isActive: true
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     patch:
 *       tags:
 *         - Inventory
 *       summary: Update an inventory record
 *       description: Admin only. At least one field is required.
 *       operationId: updateInventory
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateInventoryRequest'
 *             example:
 *               quantity: 250
 *               lastRestockedAt: '2024-07-01T08:00:00.000Z'
 *       responses:
 *         '200':
 *           description: Inventory updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Inventory'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Inventory updated successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   quantity: 250
 *                   isActive: true
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     delete:
 *       tags:
 *         - Inventory
 *       summary: Delete an inventory record
 *       description: Admin only. Soft delete (isActive set to false).
 *       operationId: deleteInventory
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Inventory deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Inventory deleted successfully
 *                 data: null
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /cart:
 *     get:
 *       tags:
 *         - Cart
 *       summary: Get the current user's cart
 *       description: Creates and returns an empty cart on first access.
 *       operationId: getCart
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Cart fetched successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Cart'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Cart fetched successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   user: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   items: []
 *                   subtotal: 0
 *                   discount: 0
 *                   total: 0
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /cart/add-item:
 *     post:
 *       tags:
 *         - Cart
 *       summary: Add an item to the cart
 *       description: Adds a product, accumulating quantity if the product is already in the cart.
 *       operationId: addCartItem
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddCartItemRequest'
 *             example:
 *               product: 65f4c1a2b3c4d5e6f7a8b9c2
 *               warehouse: 65f4c1a2b3c4d5e6f7a8b9c1
 *               quantity: 2
 *       responses:
 *         '200':
 *           description: Item added to cart successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Cart'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Item added to cart successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   items:
 *                     - product:
 *                         _id: 65f4c1a2b3c4d5e6f7a8b9c2
 *                         name: Amul Taaza Toned Milk
 *                         price: 29
 *                       warehouse:
 *                         _id: 65f4c1a2b3c4d5e6f7a8b9c1
 *                         name: Delhi - Okhla Fulfilment Hub
 *                       quantity: 2
 *                       price: 29
 *                   subtotal: 58
 *                   discount: 0
 *                   total: 58
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '404':
 *           description: Product or warehouse not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: Product not found
 *                 errors: []
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /cart/update-item/{productId}:
 *     patch:
 *       tags:
 *         - Cart
 *       summary: Update a cart item quantity
 *       operationId: updateCartItem
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: productId
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateCartItemRequest'
 *             example:
 *               quantity: 5
 *       responses:
 *         '200':
 *           description: Cart item updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Cart'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Cart item updated successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   items:
 *                     - quantity: 5
 *                       price: 29
 *                   subtotal: 145
 *                   total: 145
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /cart/remove-item/{productId}:
 *     delete:
 *       tags:
 *         - Cart
 *       summary: Remove an item from the cart
 *       operationId: removeCartItem
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: productId
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Item removed from cart successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Cart'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Item removed from cart successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   items: []
 *                   subtotal: 0
 *                   total: 0
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /cart/clear:
 *     delete:
 *       tags:
 *         - Cart
 *       summary: Clear the cart
 *       description: Removes all items and resets subtotal, discount and total to zero.
 *       operationId: clearCart
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Cart cleared successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Cart cleared successfully
 *                 data: null
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /orders:
 *     post:
 *       tags:
 *         - Orders
 *       summary: Create an order
 *       description: Places an order from the current user's cart, clears the cart and returns the order with its items. Delivery fee is fixed at 40.
 *       operationId: createOrder
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateOrderRequest'
 *             example:
 *               warehouse: 65f4c1a2b3c4d5e6f7a8b9c1
 *               deliveryAddress: 65f4c1a2b3c4d5e6f7a8b9c3
 *               notes: Call before delivery
 *       responses:
 *         '201':
 *           description: Order created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/OrderDetail'
 *               example:
 *                 statusCode: 201
 *                 success: true
 *                 message: Order created successfully
 *                 data:
 *                   order:
 *                     _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                     orderNumber: ORD-1719742000000-4821
 *                     status: placed
 *                     paymentStatus: pending
 *                     subtotal: 200
 *                     discount: 0
 *                     deliveryFee: 40
 *                     tax: 0
 *                     total: 240
 *                     notes: Call before delivery
 *                   items:
 *                     - productName: Amul Taaza Toned Milk
 *                       quantity: 2
 *                       unitPrice: 100
 *                       totalPrice: 200
 *         '400':
 *           description: Cart is empty
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: Cart is empty
 *                 errors: []
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '404':
 *           description: Warehouse or delivery address not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: Delivery address not found
 *                 errors: []
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     get:
 *       tags:
 *         - Orders
 *       summary: List the current user's orders
 *       description: Returns all orders for the authenticated user, newest first.
 *       operationId: getMyOrders
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Orders fetched successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Order'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Orders fetched successfully
 *                 data:
 *                   - _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                     orderNumber: ORD-1719742000000-4821
 *                     warehouse:
 *                       _id: 65f4c1a2b3c4d5e6f7a8b9c1
 *                       name: Delhi - Okhla Fulfilment Hub
 *                     status: placed
 *                     total: 240
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /orders/{id}:
 *     get:
 *       tags:
 *         - Orders
 *       summary: Get an order by id
 *       description: Returns the order and its items. A user can only access their own orders.
 *       operationId: getOrderById
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Order fetched successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/OrderDetail'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Order fetched successfully
 *                 data:
 *                   order:
 *                     _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                     orderNumber: ORD-1719742000000-4821
 *                     status: placed
 *                     total: 240
 *                   items:
 *                     - productName: Amul Taaza Toned Milk
 *                       quantity: 2
 *                       totalPrice: 200
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /orders/{id}/cancel:
 *     patch:
 *       tags:
 *         - Orders
 *       summary: Cancel an order
 *       description: A customer can cancel their own order only while its status is placed.
 *       operationId: cancelOrder
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Order cancelled successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Order'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Order cancelled successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   orderNumber: ORD-1719742000000-4821
 *                   status: cancelled
 *         '400':
 *           description: Order cannot be cancelled (not in placed status)
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: Order cannot be cancelled
 *                 errors: []
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /orders/{id}/status:
 *     patch:
 *       tags:
 *         - Orders
 *       summary: Update order status
 *       description: Admin only. Sets deliveredAt when the status becomes delivered.
 *       operationId: updateOrderStatus
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateOrderStatusRequest'
 *             example:
 *               status: confirmed
 *       responses:
 *         '200':
 *           description: Order status updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Order'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Order status updated successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   orderNumber: ORD-1719742000000-4821
 *                   status: confirmed
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /payments:
 *     post:
 *       tags:
 *         - Payments
 *       summary: Create a payment
 *       description: Creates a payment for the user's own order. The amount is taken from the order total.
 *       operationId: createPayment
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreatePaymentRequest'
 *             example:
 *               order: 65f4c1a2b3c4d5e6f7a8b9c0
 *               paymentMethod: upi
 *               paymentProvider: razorpay
 *       responses:
 *         '201':
 *           description: Payment created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Payment'
 *               example:
 *                 statusCode: 201
 *                 success: true
 *                 message: Payment created successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   order: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   amount: 240
 *                   paymentMethod: upi
 *                   paymentProvider: razorpay
 *                   status: pending
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           description: Not the owner of the order
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: You are not authorized to pay for this order
 *                 errors: []
 *         '404':
 *           description: Order not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: Order not found
 *                 errors: []
 *         '409':
 *           description: Payment already exists for this order
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: Payment already exists for this order
 *                 errors: []
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     get:
 *       tags:
 *         - Payments
 *       summary: List the current user's payments
 *       description: Returns all payments for the authenticated user, newest first.
 *       operationId: getMyPayments
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Payments fetched successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Payment'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Payments fetched successfully
 *                 data:
 *                   - _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                     order:
 *                       _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                       orderNumber: ORD-1719742000000-4821
 *                       total: 240
 *                       status: placed
 *                     amount: 240
 *                     paymentMethod: upi
 *                     status: pending
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /payments/{id}:
 *     get:
 *       tags:
 *         - Payments
 *       summary: Get a payment by id
 *       description: A user can only access their own payments.
 *       operationId: getPaymentById
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Payment fetched successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Payment'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Payment fetched successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   amount: 240
 *                   paymentMethod: upi
 *                   status: pending
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /payments/{id}/status:
 *     patch:
 *       tags:
 *         - Payments
 *       summary: Update payment status
 *       description: Admin only. Synchronizes the linked order paymentStatus (paid, failed or refunded).
 *       operationId: updatePaymentStatus
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdatePaymentStatusRequest'
 *             example:
 *               status: successful
 *               transactionId: pay_Qz5Xj2mRw8aBc1
 *       responses:
 *         '200':
 *           description: Payment updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Payment'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Payment updated successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   status: successful
 *                   transactionId: pay_Qz5Xj2mRw8aBc1
 *                   paidAt: '2024-07-01T10:15:00.000Z'
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /drivers:
 *     get:
 *       tags:
 *         - Drivers
 *       summary: List drivers
 *       description: Admin only. Returns drivers with pagination. Can be filtered by warehouse and status.
 *       operationId: getDrivers
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: page
 *           in: query
 *           required: false
 *           schema:
 *             type: integer
 *             minimum: 1
 *             default: 1
 *         - name: limit
 *           in: query
 *           required: false
 *           schema:
 *             type: integer
 *             minimum: 1
 *             default: 10
 *         - name: warehouse
 *           in: query
 *           required: false
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *         - name: status
 *           in: query
 *           required: false
 *           schema:
 *             type: string
 *             enum:
 *               - offline
 *               - online
 *               - busy
 *               - on_break
 *       responses:
 *         '200':
 *           description: Drivers fetched successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/DriverList'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Drivers fetched successfully
 *                 data:
 *                   drivers:
 *                     - _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                       user:
 *                         _id: 65f4c1a2b3c4d5e6f7a8b9c1
 *                         name: Ravi Kumar
 *                         email: ravi@quickcore.in
 *                         phone: '9950123456'
 *                       warehouse:
 *                         _id: 65f4c1a2b3c4d5e6f7a8b9c2
 *                         name: Delhi - Okhla Fulfilment Hub
 *                         code: WH-DEL-01
 *                       vehicleType: bike
 *                       vehicleNumber: DL-01-AB-1234
 *                       status: offline
 *                       isAvailable: true
 *                   pagination:
 *                     page: 1
 *                     limit: 10
 *                     total: 1
 *                     totalPages: 1
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     post:
 *       tags:
 *         - Drivers
 *       summary: Create a driver
 *       description: Admin only. Links a User to a Warehouse. Returns 409 if the user is already a driver.
 *       operationId: createDriver
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateDriverRequest'
 *             example:
 *               user: 65f4c1a2b3c4d5e6f7a8b9c1
 *               warehouse: 65f4c1a2b3c4d5e6f7a8b9c2
 *               vehicleType: bike
 *               vehicleNumber: DL01AB1234
 *               licenseNumber: DL2019123456
 *       responses:
 *         '201':
 *           description: Driver created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Driver'
 *               example:
 *                 statusCode: 201
 *                 success: true
 *                 message: Driver created successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   vehicleType: bike
 *                   vehicleNumber: DL01AB1234
 *                   status: offline
 *                   isAvailable: true
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           description: User or warehouse not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: User not found
 *                 errors: []
 *         '409':
 *           description: Driver already exists for this user
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: Driver already exists
 *                 errors: []
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /drivers/{id}:
 *     get:
 *       tags:
 *         - Drivers
 *       summary: Get a driver by id
 *       description: Admin only.
 *       operationId: getDriverById
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Driver fetched successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Driver'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Driver fetched successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   vehicleType: bike
 *                   status: offline
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     patch:
 *       tags:
 *         - Drivers
 *       summary: Update a driver
 *       description: Admin only. At least one field is required.
 *       operationId: updateDriver
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateDriverRequest'
 *             example:
 *               status: online
 *               isAvailable: true
 *               currentLocation:
 *                 latitude: 28.6139
 *                 longitude: 77.2090
 *       responses:
 *         '200':
 *           description: Driver updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Driver'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Driver updated successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   status: online
 *                   isAvailable: true
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     delete:
 *       tags:
 *         - Drivers
 *       summary: Delete a driver
 *       description: Admin only. Hard delete.
 *       operationId: deleteDriver
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Driver deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Driver deleted successfully
 *                 data: null
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /deliveries:
 *     get:
 *       tags:
 *         - Deliveries
 *       summary: List deliveries
 *       description: Admin only. Returns deliveries with pagination. Can be filtered by status, driver and warehouse.
 *       operationId: getDeliveries
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: page
 *           in: query
 *           required: false
 *           schema:
 *             type: integer
 *             minimum: 1
 *             default: 1
 *         - name: limit
 *           in: query
 *           required: false
 *           schema:
 *             type: integer
 *             minimum: 1
 *             default: 10
 *         - name: status
 *           in: query
 *           required: false
 *           schema:
 *             type: string
 *             enum:
 *               - pending
 *               - assigned
 *               - picked_up
 *               - out_for_delivery
 *               - delivered
 *               - failed
 *               - cancelled
 *         - name: driver
 *           in: query
 *           required: false
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *         - name: warehouse
 *           in: query
 *           required: false
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Deliveries fetched successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/DeliveryList'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Deliveries fetched successfully
 *                 data:
 *                   deliveries:
 *                     - _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                       order:
 *                         _id: 65f4c1a2b3c4d5e6f7a8b9c1
 *                         orderNumber: ORD-1719742000000-4821
 *                         status: placed
 *                       driver:
 *                         _id: 65f4c1a2b3c4d5e6f7a8b9c2
 *                       warehouse:
 *                         _id: 65f4c1a2b3c4d5e6f7a8b9c3
 *                         name: Delhi - Okhla Fulfilment Hub
 *                         code: WH-DEL-01
 *                       status: pending
 *                   pagination:
 *                     page: 1
 *                     limit: 10
 *                     total: 1
 *                     totalPages: 1
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     post:
 *       tags:
 *         - Deliveries
 *       summary: Create a delivery
 *       description: Admin only. Returns 409 if a delivery already exists for the order.
 *       operationId: createDelivery
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateDeliveryRequest'
 *             example:
 *               order: 65f4c1a2b3c4d5e6f7a8b9c1
 *               warehouse: 65f4c1a2b3c4d5e6f7a8b9c3
 *               driver: 65f4c1a2b3c4d5e6f7a8b9c2
 *               estimatedDeliveryTime: '2024-07-01T12:30:00.000Z'
 *               deliveryNotes: Hand over at the security gate
 *       responses:
 *         '201':
 *           description: Delivery created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Delivery'
 *               example:
 *                 statusCode: 201
 *                 success: true
 *                 message: Delivery created successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   status: pending
 *                   estimatedDeliveryTime: '2024-07-01T12:30:00.000Z'
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           description: Order, warehouse or driver not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: Order not found
 *                 errors: []
 *         '409':
 *           description: Delivery already exists for this order
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: Delivery already exists for this order
 *                 errors: []
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /deliveries/{id}:
 *     get:
 *       tags:
 *         - Deliveries
 *       summary: Get a delivery by id
 *       description: Admin only.
 *       operationId: getDeliveryById
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Delivery fetched successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Delivery'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Delivery fetched successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   status: pending
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     patch:
 *       tags:
 *         - Deliveries
 *       summary: Update a delivery
 *       description: Admin only. At least one field is required.
 *       operationId: updateDelivery
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateDeliveryRequest'
 *             example:
 *               status: out_for_delivery
 *               dispatchTime: '2024-07-01T11:00:00.000Z'
 *       responses:
 *         '200':
 *           description: Delivery updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Delivery'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Delivery updated successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   status: out_for_delivery
 *                   dispatchTime: '2024-07-01T11:00:00.000Z'
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     delete:
 *       tags:
 *         - Deliveries
 *       summary: Delete a delivery
 *       description: Admin only. Hard delete.
 *       operationId: deleteDelivery
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Delivery deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Delivery deleted successfully
 *                 data: null
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /notifications:
 *     get:
 *       tags:
 *         - Notifications
 *       summary: List the current user's notifications
 *       description: Returns the authenticated user's notifications with pagination. Supports isRead and type filters.
 *       operationId: getMyNotifications
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: page
 *           in: query
 *           required: false
 *           schema:
 *             type: integer
 *             minimum: 1
 *             default: 1
 *         - name: limit
 *           in: query
 *           required: false
 *           schema:
 *             type: integer
 *             minimum: 1
 *             default: 10
 *         - name: isRead
 *           in: query
 *           required: false
 *           schema:
 *             type: boolean
 *             description: Filter by read state (true or false)
 *         - name: type
 *           in: query
 *           required: false
 *           schema:
 *             type: string
 *             enum:
 *               - order
 *               - payment
 *               - delivery
 *               - coupon
 *               - system
 *       responses:
 *         '200':
 *           description: Notifications fetched successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/NotificationList'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Notifications fetched successfully
 *                 data:
 *                   notifications:
 *                     - _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                       recipient: 65f4c1a2b3c4d5e6f7a8b9c1
 *                       title: Order Shipped
 *                       message: Your order ORD-1719742000000-4821 is out for delivery
 *                       type: order
 *                       isRead: false
 *                   pagination:
 *                     page: 1
 *                     limit: 10
 *                     total: 1
 *                     totalPages: 1
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     post:
 *       tags:
 *         - Notifications
 *       summary: Create a notification
 *       description: Admin only. Sends a notification to a user.
 *       operationId: createNotification
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateNotificationRequest'
 *             example:
 *               recipient: 65f4c1a2b3c4d5e6f7a8b9c1
 *               title: Order Shipped
 *               message: Your order ORD-1719742000000-4821 is out for delivery
 *               type: order
 *       responses:
 *         '201':
 *           description: Notification created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Notification'
 *               example:
 *                 statusCode: 201
 *                 success: true
 *                 message: Notification created successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   recipient: 65f4c1a2b3c4d5e6f7a8b9c1
 *                   title: Order Shipped
 *                   message: Your order ORD-1719742000000-4821 is out for delivery
 *                   type: order
 *                   isRead: false
 *         '400':
 *           $ref: '#/components/responses/ValidationError'
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '403':
 *           $ref: '#/components/responses/Forbidden'
 *         '404':
 *           description: Recipient not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: Recipient not found
 *                 errors: []
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /notifications/{id}:
 *     get:
 *       tags:
 *         - Notifications
 *       summary: Get a notification by id
 *       description: A user can only access their own notifications.
 *       operationId: getNotificationById
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Notification fetched successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Notification'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Notification fetched successfully
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   title: Order Shipped
 *                   isRead: false
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *     delete:
 *       tags:
 *         - Notifications
 *       summary: Delete a notification
 *       description: A user can only delete their own notifications. Hard delete.
 *       operationId: deleteNotification
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Notification deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Notification deleted successfully
 *                 data: null
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /notifications/{id}/read:
 *     patch:
 *       tags:
 *         - Notifications
 *       summary: Mark a notification as read
 *       description: A user can only mark their own notifications as read.
 *       operationId: markNotificationAsRead
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/ObjectId'
 *       responses:
 *         '200':
 *           description: Notification marked as read
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/ApiResponse'
 *                   - type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Notification'
 *               example:
 *                 statusCode: 200
 *                 success: true
 *                 message: Notification marked as read
 *                 data:
 *                   _id: 65f4c1a2b3c4d5e6f7a8b9c0
 *                   isRead: true
 *         '401':
 *           $ref: '#/components/responses/Unauthorized'
 *         '404':
 *           $ref: '#/components/responses/NotFound'
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 *
 *   /health:
 *     get:
 *       tags:
 *         - System
 *       summary: Health check
 *       description: Liveness probe. Registered on the server root, not under /api/v1.
 *       operationId: healthCheck
 *       security: []
 *       responses:
 *         '200':
 *           description: Backend healthy
 *           content:
 *             application/json:
 *               example:
 *                 success: true
 *                 message: QuickCore Backend is running
 *         '500':
 *           $ref: '#/components/responses/ServerError'
 */
module.exports = {};
