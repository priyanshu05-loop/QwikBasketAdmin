// --- DUMMY DATA ---
let mainCategories = [
    { id: '1', name: 'Grains', subCategoryCount: 3, image: require('../assets/images/categories/grains.png'), bgColor: '#FFF0E1' }, // Light Brown/Orange
    { id: '2', name: 'Vegetables', subCategoryCount: 3, image: require('../assets/images/categories/vegetables.png'), bgColor: '#E8F9E8' }, // Light Green
    { id: '3', name: 'Fresh Fruits', subCategoryCount: 3, image: require('../assets/images/categories/fruits.png'), bgColor: '#FFEBEB' }, // Light Pink
    { id: '4', name: 'Dairy', subCategoryCount: 3, image: require('../assets/images/categories/dairyy.png'), bgColor: '#E8F3FF' }, // Light Blue
    { id: '5', name: 'Meat & Eggs', subCategoryCount: 3, image: require('../assets/images/categories/meat.png'), bgColor: '#FFEFEF' }, // Another Light Pink/Red
    { id: '6', name: 'Spices', subCategoryCount: 3, image: require('../assets/images/categories/spices.png'), bgColor: '#FFF8E1' }, // Light Yellow/Cream
];

// Placeholder data for other sections
let subCategories = [
    // Grains
    { id: 's1', mainCategoryId: '1', mainCategoryName: 'Grains', name: 'All (Default)', image: require('../assets/images/categories/all_grains.png') }, // Ensure paths are correct
    { id: 's2', mainCategoryId: '1', mainCategoryName: 'Grains', name: 'Whole Grains', image: require('../assets/images/categories/whole_grains.png') },
    { id: 's3', mainCategoryId: '1', mainCategoryName: 'Grains', name: 'Powdered Grains', image: require('../assets/images/categories/powdered_grains.png') },
    { id: 's4', mainCategoryId: '1', mainCategoryName: 'Grains', name: 'Pulses', image: require('../assets/images/categories/pulses_grains.png') }, // Assuming pulses_grains.png
    // Spices
    { id: 's5', mainCategoryId: '6', mainCategoryName: 'Spices', name: 'All (Default)', image: require('../assets/images/categories/all_spices.png') },
    { id: 's6', mainCategoryId: '6', mainCategoryName: 'Spices', name: 'Powdered Spices', image: require('../assets/images/categories/powdered_spices.png') },
    { id: 's7', mainCategoryId: '6', mainCategoryName: 'Spices', name: 'Whole Spices', image: require('../assets/images/categories/whole_spices.png') },
    // Fruits
    { id: 's8', mainCategoryId: '3', mainCategoryName: 'Fresh Fruits', name: 'All (Default)', image: require('../assets/images/categories/all_spices.png') }, // Assuming all_fruits.png
    { id: 's9', mainCategoryId: '3', mainCategoryName: 'Fresh Fruits', name: 'Seasonal Fruits', image: require('../assets/images/categories/powdered_spices.png') }, // Assuming seasonal_fruits.png
     // Add more subcategories for Vegetables, Dairy, Meat & Eggs if needed
];
let homepageItems = [ { id: 'h1'}, { id: 'h2'}, { id: 'h3'}, { id: 'h4'} ];


// --- API FUNCTIONS ---

const getMainCategories = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mainCategories]; 
};



const deleteMainCategoryAPI = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mainCategories = mainCategories.filter(c => c.id !== id);
    console.log(`Main Category ${id} deleted.`);
    return { success: true };
};

// --- Add/Edit Functions (Placeholders for now) ---
const addMainCategoryAPI = async (categoryData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCategory = {
        id: `CAT-${Math.floor(Math.random() * 10000)}`,
        subCategoryCount: 0, // Default for new categories
        // Ensure image and bgColor are included
        image: categoryData.image || require('../assets/images/categories/grains.png'), // Default image if none provided
        bgColor: categoryData.bgColor || '#F0F0F0', // Default color if none provided
        ...categoryData,
    };
    mainCategories.unshift(newCategory);
    return newCategory;
}

const updateMainCategoryAPI = async (categoryId, updatedData) => {
     await new Promise(resolve => setTimeout(resolve, 500));
    const index = mainCategories.findIndex(c => c.id === categoryId);
    if (index > -1) {
        // Ensure image and bgColor are updated
        mainCategories[index] = {
            ...mainCategories[index],
            ...updatedData,
             // Keep existing image/color if not provided in update
            image: updatedData.image || mainCategories[index].image,
            bgColor: updatedData.bgColor || mainCategories[index].bgColor,
        };
        return mainCategories[index];
    }
    throw new Error("Category not found");
}


const getSubCategories = async () => {
     await new Promise(resolve => setTimeout(resolve, 500));
     // Group by main category name for easier display
     const grouped = subCategories.reduce((acc, sub) => {
        const key = sub.mainCategoryName;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(sub);
        return acc;
     }, {});
     return grouped; // Return the grouped object
};
const deleteSubCategoryAPI = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    subCategories = subCategories.filter(s => s.id !== id);
    console.log(`Sub Category ${id} deleted.`);
    return { success: true };
};

const getHomepageItems = async () => {
     await new Promise(resolve => setTimeout(resolve, 500));
     return [...homepageItems]; 
};

const getSubCategoryById = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return subCategories.find(s => s.id === id);
};

const addSubCategoryAPI = async (subCategoryData) => {
     await new Promise(resolve => setTimeout(resolve, 500));
     // Find the main category name based on the selected ID
     const parentCategory = mainCategories.find(mc => mc.id === subCategoryData.mainCategoryId);
     if (!parentCategory) throw new Error("Parent category not found");

     const newSub = {
         id: `SUB-${Math.floor(Math.random() * 10000)}`,
         mainCategoryName: parentCategory.name, // Add the name
         image: subCategoryData.image || require('../assets/images/categories/all_grains.png'), // Default image
         ...subCategoryData
     };
     subCategories.push(newSub);
     // Optionally update subCategoryCount in mainCategories
     const mainIndex = mainCategories.findIndex(mc => mc.id === newSub.mainCategoryId);
     if (mainIndex > -1) mainCategories[mainIndex].subCategoryCount++;
     return newSub;
}

const updateSubCategoryAPI = async (subCategoryId, updatedData) => {
     await new Promise(resolve => setTimeout(resolve, 500));
     const index = subCategories.findIndex(s => s.id === subCategoryId);
     if (index > -1) {
        // If mainCategoryId changed, update mainCategoryName
        let mainCategoryName = subCategories[index].mainCategoryName;
        if (updatedData.mainCategoryId && updatedData.mainCategoryId !== subCategories[index].mainCategoryId) {
            const parentCategory = mainCategories.find(mc => mc.id === updatedData.mainCategoryId);
            if (parentCategory) mainCategoryName = parentCategory.name;
        }
        subCategories[index] = {
            ...subCategories[index],
            ...updatedData,
            mainCategoryName, // Update the name
            image: updatedData.image || subCategories[index].image, // Keep existing if not updated
        };
        return subCategories[index];
     }
     throw new Error("SubCategory not found");
}


// --- EXPORT ---
export const categoryService = {
    getMainCategories,
    getSubCategories,
    getHomepageItems,
    deleteMainCategoryAPI,
    addMainCategoryAPI,
    updateMainCategoryAPI, 
    deleteSubCategoryAPI, // Export new function
    addSubCategoryAPI,    // Export new function
    updateSubCategoryAPI, // Export new function
    getSubCategoryById
};
