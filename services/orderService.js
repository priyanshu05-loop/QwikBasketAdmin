// --- Dummy Data for Orders ---
// This array simulates the data you would get from your backend API.
// It's designed to be easily replaceable.

const initialOrders = [
   {
        id: 'ORD-2024-1004',
        date: '15 Jan 2024',
        customerName: 'Rajesh Patel',
        customerEmail: 'rajesh.patel@example.com',
        customerPhone: '+91 98765 43210',
        items: 3,
        amount: 429.00,
        paymentMethod: 'Credit Payment',
        status: 'Delivered',
        invoiceUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        shippingMethod: 'Next Express',
        cardLast4: '8765',
        productName: 'Fresh Organic Apples',
        unitPrice: 143.00,
    },
    {
        id: 'ORD-2024-1005',
        date: '16 Jan 2024',
        customerName: 'Anita Sharma',
        customerEmail: 'anita.sharma@example.com',
        customerPhone: '+91 87654 32109',
        items: 5,
        amount: 899.50,
        paymentMethod: 'UPI',
        status: 'In Transit',
        invoiceUrl: null,
        shippingMethod: 'Standard Shipping',
        cardLast4: '1234',
        productName: 'Basmati Rice (5kg)',
        unitPrice: 179.90,
    },
    {
        id: 'ORD-2024-1006',
        date: '17 Jan 2024',
        customerName: 'Manoj Kumar',
        customerEmail: 'manoj.kumar@example.com',
        customerPhone: '+91 76543 21098',
        items: 2,
        amount: 250.00,
        paymentMethod: 'Cash on Delivery',
        status: 'Pending',
        invoiceUrl: null,
        shippingMethod: 'Standard Shipping',
        cardLast4: '5678',
        productName: 'Aashirvaad Atta (1kg)',
        unitPrice: 125.00,
    },
    {
        id: 'ORD-2024-1007',
        date: '18 Jan 2024',
        customerName: 'Priya Singh',
        customerEmail: 'priya.singh@example.com',
        customerPhone: '+91 65432 10987',
        items: 10,
        amount: 1520.00,
        paymentMethod: 'Credit Card',
        status: 'Delivered',
        invoiceUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        shippingMethod: 'Next Express',
        cardLast4: '9876',
        productName: 'Sunflower Oil (1L)',
        unitPrice: 152.00,
    },
    {
        id: 'ORD-2024-1008',
        date: '19 Jan 2024',
        customerName: 'Vikram Reddy',
        customerEmail: 'vikram.reddy@example.com',
        customerPhone: '+91 54321 09876',
        items: 1,
        amount: 99.00,
        paymentMethod: 'UPI',
        status: 'In Transit',
        invoiceUrl: null,
        shippingMethod: 'Standard Shipping',
        cardLast4: '5432',
        productName: 'Tata Salt (1kg)',
        unitPrice: 99.00,
    },
];

// --- API Service Simulation ---

// Simulates fetching all orders
const getOrders = async () => {
    // In a real app, this would be an API call:
    // const response = await fetch('https://api.qwikbasket.com/orders');
    // const data = await response.json();
    // return data;
    return new Promise(resolve => setTimeout(() => resolve(initialOrders), 500)); // Simulate network delay
};


// The functions below are not used in the initial build but show how you'd structure the service.
// Your backend team would implement the actual logic here.

const getOrderById = async (orderId) => {
    return new Promise(resolve => {
        const order = initialOrders.find(o => o.id === orderId);
        setTimeout(() => resolve(order), 300);
    });
};

const updateOrder = async (orderId, updatedData) => {
    console.log(`Updating order ${orderId} with`, updatedData);
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 300));
};

const deleteOrderAPI = async (orderId) => {
    console.log(`Deleting order ${orderId} from the backend.`);
    // In a real app, you would make an API call to delete the order from the database.
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 300));
};


export const orderService = {
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrderAPI,
};
