import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import vehicleService from '../services/vehicleService';

/**
 * @typedef {Object} Vehicle
 * @property {number} id - Vehicle ID
 * @property {string} vehicle_number - Vehicle number
 * @property {string} license_plate - License plate
 * @property {string} make - Vehicle make
 * @property {string} model - Vehicle model
 * @property {number} year - Vehicle year
 * @property {string} vehicle_type - Type (truck, van, pickup)
 * @property {number} capacity_kg - Capacity in kg
 * @property {string} status - Status (active, maintenance, inactive)
 * @property {string} notes - Additional notes
 */

/**
 * Vehicle store for managing vehicle data and operations
 * @typedef {Object} VehicleStore
 * @property {Vehicle[]} vehicles - Array of vehicles
 * @property {boolean} isLoading - Loading state
 * @property {string|null} error - Error message
 * @property {Object} filters - Current filters (status, type, search)
 * @property {Function} fetchVehicles - Fetch vehicles from API
 * @property {Function} addVehicle - Add new vehicle
 * @property {Function} updateVehicle - Update existing vehicle
 * @property {Function} deleteVehicle - Delete vehicle
 * @property {Function} setFilters - Update filters
 * @property {Function} getVehicleStats - Get vehicle statistics
 */
export const useVehicleStore = create(
  devtools(
    (set, get) => ({
      // State
      vehicles: [],
      isLoading: false,
      error: null,
      filters: {
        status: 'all',
        type: 'all',
        search: '',
      },
      pagination: {
        currentPage: 1,
        perPage: 10,
        total: 0,
      },
      selectedVehicle: null,

      // Actions
      setVehicles: (vehicles) => set({ vehicles }, false, 'setVehicles'),

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

      setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }, false, 'setSelectedVehicle'),

      // Async Actions
      fetchVehicles: async (params = {}) => {
        set({ isLoading: true, error: null }, false, 'fetchVehicles:start');
        
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

          const response = await vehicleService.getVehicles(queryParams);
          const data = Array.isArray(response) ? response : response.data || [];
          
          set({ 
            vehicles: data, 
            isLoading: false, 
            error: null 
          }, false, 'fetchVehicles:success');
          
          return data;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to fetch vehicles' 
          }, false, 'fetchVehicles:error');
          throw error;
        }
      },

      addVehicle: async (vehicleData) => {
        set({ isLoading: true, error: null }, false, 'addVehicle:start');
        
        try {
          const response = await vehicleService.createVehicle(vehicleData);
          const newVehicle = response.data || response;
          
          set((state) => ({
            vehicles: [...state.vehicles, newVehicle],
            isLoading: false,
            error: null,
          }), false, 'addVehicle:success');
          
          return newVehicle;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to add vehicle' 
          }, false, 'addVehicle:error');
          throw error;
        }
      },

      updateVehicle: async (id, vehicleData) => {
        set({ isLoading: true, error: null }, false, 'updateVehicle:start');
        
        try {
          const response = await vehicleService.updateVehicle(id, vehicleData);
          const updatedVehicle = response.data || response;
          
          set((state) => ({
            vehicles: state.vehicles.map(vehicle =>
              vehicle.id === id ? { ...vehicle, ...updatedVehicle } : vehicle
            ),
            selectedVehicle: state.selectedVehicle?.id === id 
              ? { ...state.selectedVehicle, ...updatedVehicle } 
              : state.selectedVehicle,
            isLoading: false,
            error: null,
          }), false, 'updateVehicle:success');
          
          return updatedVehicle;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to update vehicle' 
          }, false, 'updateVehicle:error');
          throw error;
        }
      },

      deleteVehicle: async (id) => {
        set({ isLoading: true, error: null }, false, 'deleteVehicle:start');
        
        try {
          await vehicleService.deleteVehicle(id);
          
          set((state) => ({
            vehicles: state.vehicles.filter(vehicle => vehicle.id !== id),
            selectedVehicle: state.selectedVehicle?.id === id ? null : state.selectedVehicle,
            isLoading: false,
            error: null,
          }), false, 'deleteVehicle:success');
          
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to delete vehicle' 
          }, false, 'deleteVehicle:error');
          throw error;
        }
      },

      // Computed/Derived state
      getFilteredVehicles: () => {
        const { vehicles, filters } = get();
        
        return (vehicles || []).filter(vehicle => {
          const matchesStatus = filters.status === 'all' || vehicle.status === filters.status;
          const matchesType = filters.type === 'all' || vehicle.vehicle_type === filters.type;
          const matchesSearch = !filters.search || 
            vehicle.vehicle_number.toLowerCase().includes(filters.search.toLowerCase()) ||
            vehicle.license_plate.toLowerCase().includes(filters.search.toLowerCase()) ||
            vehicle.make.toLowerCase().includes(filters.search.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(filters.search.toLowerCase());
          
          return matchesStatus && matchesType && matchesSearch;
        });
      },

      getVehiclesByStatus: (status) => {
        const { vehicles } = get();
        return (vehicles || []).filter(vehicle => vehicle.status === status);
      },

      getVehiclesByType: (type) => {
        const { vehicles } = get();
        return (vehicles || []).filter(vehicle => vehicle.vehicle_type === type);
      },

      getVehicleStats: () => {
        const { vehicles } = get();
        const vehiclesArray = vehicles || [];
        
        const stats = {
          total: vehiclesArray.length,
          active: vehiclesArray.filter(v => v.status === 'active').length,
          maintenance: vehiclesArray.filter(v => v.status === 'maintenance').length,
          inactive: vehiclesArray.filter(v => v.status === 'inactive').length,
          byType: {
            truck: vehiclesArray.filter(v => v.vehicle_type === 'truck').length,
            van: vehiclesArray.filter(v => v.vehicle_type === 'van').length,
            pickup: vehiclesArray.filter(v => v.vehicle_type === 'pickup').length,
          }
        };
        
        return stats;
      },

      // Reset functions
      resetFilters: () => 
        set({
          filters: {
            status: 'all',
            type: 'all',
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
          vehicles: [],
          isLoading: false,
          error: null,
          filters: {
            status: 'all',
            type: 'all',
            search: '',
          },
          pagination: {
            currentPage: 1,
            perPage: 10,
            total: 0,
          },
          selectedVehicle: null,
        }, false, 'reset'),
    }),
    {
      name: 'vehicle-store', // Store name for devtools
    }
  )
);