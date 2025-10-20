// --- DUMMY DATA for Offers ---
// Note: In a real app, the image would be a URL. Here, we use require for local assets.
let dummyOffers = [
    { 
        id: '1', 
        title: 'Special Offer on Pulses', 
        subtitle: 'Valid only today', 
        description: 'Get amazing discounts on all varieties of pulses . Fresh stock available !',
        status: 'Active',
        expiryDate: '20/09/2025',
        bannerImage: require('../assets/images/OfferBanner1.png') // Ensure this path is correct
    },
    { 
        id: '2', 
        title: 'Buy Seasonal Fruits', 
        subtitle: 'Fresh and Organic', 
        description: 'Premium quality seasonal fruits at the best prices. Limited time offer!',
        status: 'Active',
        expiryDate: '20/09/2025',
        bannerImage: require('../assets/images/OfferBanner2.png') // Ensure this path is correct
    },
     { 
        id: '3', 
        title: 'Discount on Oils', 
        subtitle: 'Weekend Sale', 
        status: 'Inactive',
        expiryDate: '15/09/2025',
        bannerImage: require('../assets/images/OfferBanner1.png') 
    },
];

// --- API FUNCTIONS ---

const getOffers = async () => {
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // Return a copy of the array to prevent direct mutation
    return [...dummyOffers]; 
};

const getOfferById = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return dummyOffers.find(o => o.id === id);
};

const deleteOfferAPI = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    dummyOffers = dummyOffers.filter(o => o.id !== id);
    console.log(`Offer ${id} deleted on the server.`);
    return { success: true };
};


const addOfferAPI = async (offerData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newOffer = {
        id: `OFFER-${Math.floor(Math.random() * 10000)}`,
        expiryDate: new Date().toLocaleDateString('en-GB'), // e.g., 20/09/2025
        ...offerData,
    };
    dummyOffers.unshift(newOffer);
    return newOffer;
};

const updateOfferAPI = async (offerId, updatedData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = dummyOffers.findIndex(o => o.id === offerId);
    if (index > -1) {
        dummyOffers[index] = { ...dummyOffers[index], ...updatedData };
        return dummyOffers[index];
    }
    throw new Error("Offer not found");
};

// --- EXPORT ---
export const offerService = {
    getOffers,
    deleteOfferAPI,
    getOfferById,
    addOfferAPI,
    updateOfferAPI,

};
