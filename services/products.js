// --- DUMMY DATA for Products ---
const Products = [
    { 
        id: '1', 
        name: 'Black Pepper', 
        category: 'Spices', 
        subCategory: 'Whole Spices',
        price: 250, 
        unit: 'kg',
        stock: 500,
        stockStatus: 'In Stock',
        packagingQty: 500,
        origin: 'Kerala, India',
        variety: 'Hybrid',
        fssai: '10020064002537',
        description: 'Bold aromatic spice known as the "King of Spices".',
        image: require('../assets/images/products.png') // Make sure this path is correct
    },
    { 
        id: '2', 
        name: 'Turmeric Powder', 
        category: 'Spices - Ground Spices', 
        price: 180, 
        unit: 'kg',
        stock: 20,
        stockStatus: 'Low Stock',
        image: require('../assets/images/products.png')
    },
    { 
        id: '3', 
        name: 'Coriander Seeds', 
        category: 'Spices - Whole Spices', 
        price: 150, 
        unit: 'kg',
        stock: 0,
        stockStatus: 'Out of Stock',
        image: require('../assets/images/products.png')
    },
    { 
        id: '4', 
        name: 'Red Chilli Powder', 
        category: 'Spices - Ground Spices', 
        price: 220, 
        unit: 'kg',
        stock: 300,
        stockStatus: 'In Stock',
        image: require('../assets/images/products.png')
    },
    { 
        id: '5', 
        name: 'Cumin Seeds', 
        category: 'Spices - Whole Spices', 
        price: 300, 
        unit: 'kg',
        stock: 150,
        stockStatus: 'In Stock',
        image: require('../assets/images/products.png')
    },
];

// --- API FUNCTIONS ---

const getProducts = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...Products]; 
};

const getProductById = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return Products.find(p => p.id === id);
};

const deleteProductAPI = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = Products.findIndex(p => p.id === id);
    if (index > -1) {
        Products.splice(index, 1);
    }
    console.log(`Product ${id} deleted on the server.`);
    return { success: true };
};

const addProductAPI = async (productData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newProduct = {
        id: `PROD-${Math.floor(Math.random() * 10000)}`, // Generate a random ID
        stockStatus: productData.stock > 20 ? 'In Stock' : (productData.stock > 0 ? 'Low Stock' : 'Out of Stock'),
        unit: 'kg',
        ...productData,
    };
    Products.unshift(newProduct); // Add to the top of the list
    console.log(`Product ${newProduct.name} added to the server.`);
    return newProduct;
};

// --- NEW FUNCTION to update an existing product ---
const updateProductAPI = async (productId, updatedData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = Products.findIndex(p => p.id === productId);
    if (index > -1) {
        Products[index] = { 
            ...Products[index], 
            ...updatedData,
            stockStatus: updatedData.stock > 20 ? 'In Stock' : (updatedData.stock > 0 ? 'Low Stock' : 'Out of Stock'),
        };
        return Products[index];
    }
    throw new Error("Product not found");
};


// --- EXPORT ---
export const productService = {
    getProducts,
    deleteProductAPI,
    addProductAPI,
    updateProductAPI,
    getProductById,
};
