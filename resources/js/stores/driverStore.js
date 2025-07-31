import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import driverService from '../services/driverService';

/**
 * @typedef {Object} Driver
 * @property {number} id - Driver ID
 * @property {number} user_id - Associated user ID
 * @property {string} employee_number - Employee number
 * @property {string} first_name - First name
 * @property {string} last_name - Last name
 * @property {string} phone - Phone number
 * @property {string} license_number - License number
 * @property {string} license_expiry - License expiry date
 * @property {string} status - Status (active, inactive, suspended)
 * @property {string} hire_date - Hire date
 * @property {string} address - Address
 */

/**
 * Driver store for managing driver data and operations
 * @typedef {Object} DriverStore
 * @property {Driver[]} drivers - Array of drivers
 * @property {boolean} isLoading - Loading state
 * @property {string|null} error - Error message
 * @property {Object} filters - Current filters (status, search)
 * @property {Function} fetchDrivers - Fetch drivers from API
 * @property {Function} addDriver - Add new driver
 * @property {Function} updateDriver - Update existing driver
 * @property {Function} deleteDriver - Delete driver
 * @property {Function} setFilters - Update filters
 * @property {Function} getDriverStats - Get driver statistics
 */
export const useDriverStore = create(
  devtools(
    (set, get) => ({
      // State
      drivers: [],
      isLoading: false,
      error: null,
      filters: {
        status: 'all',
        search: '',
      },
      pagination: {
        currentPage: 1,
        perPage: 10,
        total: 0,
      },
      selectedDriver: null,

      // Actions
      setDrivers: (drivers) => set({ drivers }, false, 'setDrivers'),

      setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),

      setError: (error) => set({ error }, false, 'setError'),

      clearError: () => set({ error: null }, false, 'clearError'),

      setFilters: (newFilters) => 
        set(
          (state) => ({ 
            filters: { ...state.filters, ...newFilters },
            pagination: { ...state.pagination, currentPage: 1 } // Reset to first page when filtering
          }), 
          false, 
          'setFilters'
        ),

      setPagination: (pagination) => 
        set(
          (state) => ({ pagination: { ...state.pagination, ...pagination } }), 
          false, 
          'setPagination'
        ),

      setSelectedDriver: (driver) => set({ selectedDriver: driver }, false, 'setSelectedDriver'),

      // Async Actions
      fetchDrivers: async (params = {}) => {
        set({ isLoading: true, error: null }, false, 'fetchDrivers:start');
        
        try {
          const { filters } = get();
          const queryParams = {
            ...filters,
            ...params,
          };

          // Remove 'all' values from filters
          Object.keys(queryParams).forEach(key => {
            if (queryParams[key] === 'all' || queryParams[key] === '') {
              delete queryParams[key];
            }
          });

          const response = await driverService.getDrivers(queryParams);
          const data = Array.isArray(response) ? response : response.data || [];
          
          set({ 
            drivers: data, 
            isLoading: false, 
            error: null 
          }, false, 'fetchDrivers:success');
          
          return data;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to fetch drivers' 
          }, false, 'fetchDrivers:error');
          throw error;
        }
      },

      addDriver: async (driverData) => {
        set({ isLoading: true, error: null }, false, 'addDriver:start');
        
        try {
          const response = await driverService.createDriver(driverData);
          const newDriver = response.data || response;
          
          set((state) => ({
            drivers: [...state.drivers, newDriver],
            isLoading: false,
            error: null,
          }), false, 'addDriver:success');
          
          return newDriver;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to add driver' 
          }, false, 'addDriver:error');
          throw error;
        }
      },

      updateDriver: async (id, driverData) => {
        set({ isLoading: true, error: null }, false, 'updateDriver:start');
        
        try {
          const response = await driverService.updateDriver(id, driverData);
          const updatedDriver = response.data || response;
          
          set((state) => ({
            drivers: state.drivers.map(driver =>
              driver.id === id ? { ...driver, ...updatedDriver } : driver
            ),
            selectedDriver: state.selectedDriver?.id === id 
              ? { ...state.selectedDriver, ...updatedDriver } 
              : state.selectedDriver,
            isLoading: false,
            error: null,
          }), false, 'updateDriver:success');
          
          return updatedDriver;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to update driver' 
          }, false, 'updateDriver:error');
          throw error;
        }
      },

      deleteDriver: async (id) => {
        set({ isLoading: true, error: null }, false, 'deleteDriver:start');
        
        try {
          await driverService.deleteDriver(id);
          
          set((state) => ({
            drivers: state.drivers.filter(driver => driver.id !== id),
            selectedDriver: state.selectedDriver?.id === id ? null : state.selectedDriver,
            isLoading: false,
            error: null,
          }), false, 'deleteDriver:success');
          
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to delete driver' 
          }, false, 'deleteDriver:error');
          throw error;
        }
      },

      toggleDriverStatus: async (id, status) => {
        set({ error: null }, false, 'toggleDriverStatus:start');
        
        try {
          const response = await driverService.toggleDriverStatus(id, status);
          const updatedDriver = response.driver;
          
          set((state) => ({
            drivers: state.drivers.map(driver =>
              driver.id === id ? { ...driver, status } : driver
            ),
            selectedDriver: state.selectedDriver?.id === id 
              ? { ...state.selectedDriver, status } 
              : state.selectedDriver,
            error: null,
          }), false, 'toggleDriverStatus:success');
          
          return updatedDriver;
        } catch (error) {
          set({ 
            error: error.message || 'Failed to update driver status' 
          }, false, 'toggleDriverStatus:error');
          throw error;
        }
      },

      // Computed/Derived state
      getFilteredDrivers: () => {
        const { drivers, filters } = get();
        
        return (drivers || []).filter(driver => {
          const matchesStatus = filters.status === 'all' || driver.status === filters.status;
          const matchesSearch = !filters.search || 
            driver.first_name.toLowerCase().includes(filters.search.toLowerCase()) ||
            driver.last_name.toLowerCase().includes(filters.search.toLowerCase()) ||
            driver.employee_number.toLowerCase().includes(filters.search.toLowerCase()) ||
            driver.license_number.toLowerCase().includes(filters.search.toLowerCase()) ||
            driver.phone.includes(filters.search);
          
          return matchesStatus && matchesSearch;
        });
      },

      getDriversByStatus: (status) => {
        const { drivers } = get();
        return (drivers || []).filter(driver => driver.status === status);
      },

      getActiveDrivers: () => {
        const { drivers } = get();
        return (drivers || []).filter(driver => driver.status === 'active');
      },

      getDriversWithExpiringLicense: (days = 30) => {
        const { drivers } = get();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() + days);
        
        return (drivers || []).filter(driver => {
          if (!driver.license_expiry) return false;
          const expiryDate = new Date(driver.license_expiry);
          return expiryDate <= cutoffDate;
        });
      },

      getDriverStats: () => {
        const { drivers } = get();
        const driversArray = drivers || [];
        
        const stats = {
          total: driversArray.length,
          active: driversArray.filter(d => d.status === 'active').length,
          inactive: driversArray.filter(d => d.status === 'inactive').length,
          suspended: driversArray.filter(d => d.status === 'suspended').length,
          expiringLicense: get().getDriversWithExpiringLicense().length,
        };
        
        return stats;
      },

      getDriverById: (id) => {
        const { drivers } = get();
        return (drivers || []).find(driver => driver.id === parseInt(id));
      },

      getDriverFullName: (driver) => {
        if (!driver) return '';
        return `${driver.first_name} ${driver.last_name}`.trim();
      },

      // Reset functions
      resetFilters: () => 
        set({
          filters: {
            status: 'all',
            search: '',
          },
          pagination: {
            currentPage: 1,
            perPage: 10,
            total: 0,
          }
        }, false, 'resetFilters'),

      reset: () => 
        set({
          drivers: [],
          isLoading: false,
          error: null,
          filters: {
            status: 'all',
            search: '',
          },
          pagination: {
            currentPage: 1,
            perPage: 10,
            total: 0,
          },
          selectedDriver: null,
        }, false, 'reset'),
    }),
    {
      name: 'driver-store', // Store name for devtools
    }
  )
);