// This file acts as a temporary "in-memory" database.
// Data will be lost when the app is closed.
let addresses = [];

// Function to get all addresses
export const getAddresses = () => {
  // By using the spread operator [...addresses], we are returning a NEW
  // copy of the array every time. This is the key to fixing the bug.
  // React will see a new array and re-render the list.
  return [...addresses];
};

// Function to add a new address or update an existing one
export const addOrUpdateAddress = (address) => {
  const existingIndex = addresses.findIndex(addr => addr.id === address.id);

  if (existingIndex > -1) {
    // Update existing address
    addresses[existingIndex] = address;
  } else {
    // Add new address
    addresses.push(address);
  }
};

