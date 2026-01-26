// API exports for listings and bids
// This module re-exports from backendApi for backwards compatibility

import { backendApi } from './backendApi';

// Export listings API
export const listingsAPI = {
    ...backendApi.properties,
    // Alias for compatibility
    search: backendApi.properties.search,
    getById: backendApi.properties.getById,
    create: backendApi.properties.create,
    update: backendApi.properties.update,
    delete: backendApi.properties.delete,
};

// Export bids API
export const bidsAPI = {
    ...backendApi.bids,
    create: backendApi.bids.create,
    accept: backendApi.bids.accept,
    reject: backendApi.bids.reject,
    counter: backendApi.bids.counter,
    acceptCounter: backendApi.bids.acceptCounter,
    withdraw: backendApi.bids.withdraw,
    getPropertyBids: backendApi.bids.getPropertyBids,
    getMyBids: backendApi.bids.getMyBids,
};

// Re-export backendApi for direct usage if needed
export { backendApi };
