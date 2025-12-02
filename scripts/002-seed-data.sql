-- Seed Data for E-commerce App
-- Run this after creating tables

-- Insert Admin User (password is hashed 'admin123' using bcrypt)
INSERT INTO "User" ("id", "email", "password", "name", "phone", "isAdmin", "createdAt", "updatedAt")
VALUES (
    'admin_001',
    'ayanwumi101@gmail.com',
    '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNGFBy',
    'Store Admin',
    '+234800000001',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert Demo User (password is hashed 'demo123')
INSERT INTO "User" ("id", "email", "password", "name", "phone", "isAdmin", "createdAt", "updatedAt")
VALUES (
    'user_001',
    'demo@example.com',
    '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNGFBy',
    'Demo User',
    '+234800000002',
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert Address for Demo User (Lagos location for testing)
INSERT INTO "Address" ("id", "userId", "label", "street", "city", "region", "country", "lat", "lon", "isDefault", "createdAt")
VALUES (
    'addr_001',
    'user_001',
    'Home',
    '123 Victoria Island',
    'Lagos',
    'Lagos State',
    'Nigeria',
    6.4281,
    3.4219,
    true,
    CURRENT_TIMESTAMP
);

-- Insert Products - Sneakers
INSERT INTO "Product" ("id", "title", "slug", "description", "price", "discount", "images", "category", "sizes", "stock", "featured", "createdAt", "updatedAt")
VALUES
(
    'prod_001',
    'Nike Air Max 270',
    'nike-air-max-270',
    'The Nike Air Max 270 delivers visible Air cushioning and a sleek design. Features a breathable mesh upper with synthetic overlays for support and style.',
    85000,
    15,
    ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800'],
    'sneakers',
    ARRAY['38', '39', '40', '41', '42', '43', '44', '45'],
    25,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'prod_002',
    'Adidas Ultraboost 22',
    'adidas-ultraboost-22',
    'Experience incredible energy return with every step. The Adidas Ultraboost 22 features a Primeknit upper and responsive Boost midsole.',
    120000,
    10,
    ARRAY['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800', 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800'],
    'sneakers',
    ARRAY['39', '40', '41', '42', '43', '44'],
    18,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'prod_003',
    'Jordan Retro 4',
    'jordan-retro-4',
    'The Air Jordan 4 Retro brings back the iconic silhouette with premium materials and classic colorways. A must-have for sneaker collectors.',
    150000,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800', 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800'],
    'sneakers',
    ARRAY['40', '41', '42', '43', '44', '45'],
    12,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'prod_004',
    'New Balance 550',
    'new-balance-550',
    'A retro basketball sneaker with timeless style. The New Balance 550 features a leather upper with perforations for breathability.',
    75000,
    20,
    ARRAY['https://images.unsplash.com/photo-1539185441755-769473a23570?w=800'],
    'sneakers',
    ARRAY['38', '39', '40', '41', '42', '43'],
    30,
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'prod_005',
    'Puma RS-X',
    'puma-rs-x',
    'Bold chunky design meets retro running heritage. The Puma RS-X features a mesh and leather upper with cushioned midsole.',
    55000,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800'],
    'sneakers',
    ARRAY['39', '40', '41', '42', '43', '44'],
    22,
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert Products - Men's Wear
INSERT INTO "Product" ("id", "title", "slug", "description", "price", "discount", "images", "category", "sizes", "stock", "featured", "createdAt", "updatedAt")
VALUES
(
    'prod_006',
    'Premium Cotton Polo Shirt',
    'premium-cotton-polo-shirt',
    'Classic fit polo shirt made from 100% premium cotton. Perfect for casual and semi-formal occasions with breathable fabric.',
    18000,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1625910513413-5fc65a28ce75?w=800', 'https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?w=800'],
    'men',
    ARRAY['S', 'M', 'L', 'XL', 'XXL'],
    45,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'prod_007',
    'Slim Fit Chino Pants',
    'slim-fit-chino-pants',
    'Tailored slim fit chino pants with stretch fabric for comfort. Features side pockets and back welt pockets.',
    25000,
    15,
    ARRAY['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800'],
    'men',
    ARRAY['28', '30', '32', '34', '36', '38'],
    38,
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'prod_008',
    'Classic Denim Jacket',
    'classic-denim-jacket',
    'Timeless denim jacket with button closure. Made from durable cotton denim with a comfortable regular fit.',
    35000,
    10,
    ARRAY['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800'],
    'men',
    ARRAY['S', 'M', 'L', 'XL'],
    20,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'prod_009',
    'Athletic Fit Hoodie',
    'athletic-fit-hoodie',
    'Comfortable fleece hoodie with kangaroo pocket. Perfect for workouts or casual wear with ribbed cuffs and hem.',
    22000,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'],
    'men',
    ARRAY['S', 'M', 'L', 'XL', 'XXL'],
    55,
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert Products - Women's Wear
INSERT INTO "Product" ("id", "title", "slug", "description", "price", "discount", "images", "category", "sizes", "stock", "featured", "createdAt", "updatedAt")
VALUES
(
    'prod_010',
    'Floral Summer Dress',
    'floral-summer-dress',
    'Beautiful floral print midi dress perfect for summer. Features a flattering A-line silhouette and adjustable straps.',
    28000,
    20,
    ARRAY['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'],
    'women',
    ARRAY['XS', 'S', 'M', 'L', 'XL'],
    32,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'prod_011',
    'High-Waist Palazzo Pants',
    'high-waist-palazzo-pants',
    'Elegant wide-leg palazzo pants with high waist design. Made from flowing fabric for effortless style.',
    20000,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'],
    'women',
    ARRAY['XS', 'S', 'M', 'L', 'XL'],
    40,
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'prod_012',
    'Cropped Blazer Jacket',
    'cropped-blazer-jacket',
    'Modern cropped blazer with structured shoulders. Perfect for office or evening wear with single button closure.',
    45000,
    15,
    ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800'],
    'women',
    ARRAY['XS', 'S', 'M', 'L'],
    18,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'prod_013',
    'Ribbed Knit Top',
    'ribbed-knit-top',
    'Fitted ribbed knit top with subtle stretch. Versatile piece that pairs well with jeans or skirts.',
    12000,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800'],
    'women',
    ARRAY['XS', 'S', 'M', 'L', 'XL'],
    60,
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'prod_014',
    'Pleated Midi Skirt',
    'pleated-midi-skirt',
    'Elegant pleated midi skirt with elastic waistband. Flows beautifully and perfect for any occasion.',
    18000,
    10,
    ARRAY['https://images.unsplash.com/photo-1583496661160-fb5886a0afe0?w=800'],
    'women',
    ARRAY['XS', 'S', 'M', 'L', 'XL'],
    28,
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
