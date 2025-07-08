import { create } from 'zustand';
import customerService from '@/services/customerService';

export const useCustomerStore = create((set, get) => ({
  // State
  customers: [],
  isLoading: false,
  error: null,
  selectedCustomer: null,

  // Actions
  fetchCustomers: async (params = {}) => {
    try {
      set({ isLoading: true, error: null });
      const response = await customerService.getCustomers(params);
      const customers = Array.isArray(response) ? response : response.data || [];
      set({ customers, isLoading: false });
      return customers;
    } catch (error) {
      console.error('Error fetching customers:', error);
      const errorMessage = error.message || 'Failed to fetch customers';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  addCustomer: async (customerData) => {
    try {
      set({ error: null });
      const response = await customerService.createCustomer(customerData);
      const newCustomer = response.data || response;
      
      set(state => ({
        customers: [...state.customers, newCustomer]
      }));
      
      return newCustomer;
    } catch (error) {
      console.error('Error adding customer:', error);
      const errorMessage = error.type === 'VALIDATION_ERROR' 
        ? Object.values(error.errors || {}).flat().join(', ') 
        : error.message || 'Failed to add customer';
      set({ error: errorMessage });
      throw error;
    }
  },

  updateCustomer: async (id, customerData) => {
    try {
      set({ error: null });
      const response = await customerService.updateCustomer(id, customerData);
      const updatedCustomer = response.data || response;
      
      set(state => ({
        customers: state.customers.map(customer => 
          customer.id === id ? updatedCustomer : customer
        )
      }));
      
      return updatedCustomer;
    } catch (error) {
      console.error('Error updating customer:', error);
      const errorMessage = error.type === 'VALIDATION_ERROR' 
        ? Object.values(error.errors || {}).flat().join(', ') 
        : error.message || 'Failed to update customer';
      set({ error: errorMessage });
      throw error;
    }
  },

  deleteCustomer: async (id) => {
    try {
      set({ error: null });
      await customerService.deleteCustomer(id);
      
      set(state => ({
        customers: state.customers.filter(customer => customer.id !== id)
      }));
      
    } catch (error) {
      console.error('Error deleting customer:', error);
      const errorMessage = error.message || 'Failed to delete customer';
      set({ error: errorMessage });
      throw error;
    }
  },

  approveCustomerRegistration: async (id) => {
    try {
      set({ error: null });
      const response = await customerService.approveRegistration(id);
      const updatedCustomer = response.data || response;
      
      set(state => ({
        customers: state.customers.map(customer => 
          customer.id === id ? { ...customer, registration_status: 'approved', status: 'active' } : customer
        )
      }));
      
      return updatedCustomer;
    } catch (error) {
      console.error('Error approving customer registration:', error);
      const errorMessage = error.message || 'Failed to approve registration';
      set({ error: errorMessage });
      throw error;
    }
  },

  assignCustomerToRoute: async (customerId, routeId) => {
    try {
      set({ error: null });
      const response = await customerService.assignToRoute(customerId, routeId);
      const updatedCustomer = response.data || response;
      
      set(state => ({
        customers: state.customers.map(customer => 
          customer.id === customerId ? updatedCustomer : customer
        )
      }));
      
      return updatedCustomer;
    } catch (error) {
      console.error('Error assigning customer to route:', error);
      const errorMessage = error.message || 'Failed to assign customer to route';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Utility methods
  setSelectedCustomer: (customer) => {
    set({ selectedCustomer: customer });
  },

  clearError: () => {
    set({ error: null });
  },

  clearCustomers: () => {
    set({ customers: [], selectedCustomer: null });
  },

  // Filtered getters
  getCustomersByStatus: (status) => {
    return get().customers.filter(customer => customer.status === status);
  },

  getCustomersByRegistrationStatus: (registrationStatus) => {
    return get().customers.filter(customer => customer.registration_status === registrationStatus);
  },

  getPendingCustomers: () => {
    return get().customers.filter(customer => customer.registration_status === 'pending');
  },

  getActiveCustomers: () => {
    return get().customers.filter(customer => customer.status === 'active');
  },
}));