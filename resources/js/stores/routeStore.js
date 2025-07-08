import { create } from 'zustand';
import routeService from '@/services/routeService';

export const useRouteStore = create((set, get) => ({
  // State
  routes: [],
  selectedRoute: null,
  routeCustomers: {},
  isLoading: false,
  error: null,

  // Actions
  fetchRoutes: async (params = {}) => {
    try {
      set({ isLoading: true, error: null });
      const response = await routeService.getRoutes(params);
      const routes = Array.isArray(response) ? response : response.data || [];
      set({ routes, isLoading: false });
      return routes;
    } catch (error) {
      console.error('Error fetching routes:', error);
      const errorMessage = error.message || 'Failed to fetch routes';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  fetchRoute: async (id) => {
    try {
      set({ error: null });
      const response = await routeService.getRoute(id);
      const route = response.data || response;
      set({ selectedRoute: route });
      return route;
    } catch (error) {
      console.error('Error fetching route:', error);
      const errorMessage = error.message || 'Failed to fetch route';
      set({ error: errorMessage });
      throw error;
    }
  },

  addRoute: async (routeData) => {
    try {
      set({ error: null });
      const response = await routeService.createRoute(routeData);
      const newRoute = response.data || response;
      
      set(state => ({
        routes: [...state.routes, newRoute]
      }));
      
      return newRoute;
    } catch (error) {
      console.error('Error adding route:', error);
      const errorMessage = error.type === 'VALIDATION_ERROR' 
        ? Object.values(error.errors || {}).flat().join(', ') 
        : error.message || 'Failed to add route';
      set({ error: errorMessage });
      throw error;
    }
  },

  updateRoute: async (id, routeData) => {
    try {
      set({ error: null });
      const response = await routeService.updateRoute(id, routeData);
      const updatedRoute = response.data || response;
      
      set(state => ({
        routes: state.routes.map(route => 
          route.id === id ? updatedRoute : route
        ),
        selectedRoute: state.selectedRoute?.id === id ? updatedRoute : state.selectedRoute
      }));
      
      return updatedRoute;
    } catch (error) {
      console.error('Error updating route:', error);
      const errorMessage = error.type === 'VALIDATION_ERROR' 
        ? Object.values(error.errors || {}).flat().join(', ') 
        : error.message || 'Failed to update route';
      set({ error: errorMessage });
      throw error;
    }
  },

  deleteRoute: async (id) => {
    try {
      set({ error: null });
      await routeService.deleteRoute(id);
      
      set(state => ({
        routes: state.routes.filter(route => route.id !== id),
        selectedRoute: state.selectedRoute?.id === id ? null : state.selectedRoute
      }));
      
    } catch (error) {
      console.error('Error deleting route:', error);
      const errorMessage = error.message || 'Failed to delete route';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Route customers management
  fetchRouteCustomers: async (routeId, params = {}) => {
    try {
      set({ error: null });
      const response = await routeService.getRouteCustomers(routeId, params);
      const customers = Array.isArray(response) ? response : response.data || [];
      
      set(state => ({
        routeCustomers: {
          ...state.routeCustomers,
          [routeId]: customers
        }
      }));
      
      return customers;
    } catch (error) {
      console.error('Error fetching route customers:', error);
      const errorMessage = error.message || 'Failed to fetch route customers';
      set({ error: errorMessage });
      throw error;
    }
  },

  addCustomerToRoute: async (routeId, customerId, assignmentData = {}) => {
    try {
      set({ error: null });
      const response = await routeService.addCustomerToRoute(routeId, customerId, assignmentData);
      
      // Refresh route customers
      await get().fetchRouteCustomers(routeId);
      
      return response;
    } catch (error) {
      console.error('Error adding customer to route:', error);
      const errorMessage = error.message || 'Failed to add customer to route';
      set({ error: errorMessage });
      throw error;
    }
  },

  removeCustomerFromRoute: async (routeId, customerId) => {
    try {
      set({ error: null });
      await routeService.removeCustomerFromRoute(routeId, customerId);
      
      // Update local state
      set(state => ({
        routeCustomers: {
          ...state.routeCustomers,
          [routeId]: (state.routeCustomers[routeId] || []).filter(customer => customer.id !== customerId)
        }
      }));
      
    } catch (error) {
      console.error('Error removing customer from route:', error);
      const errorMessage = error.message || 'Failed to remove customer from route';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Route assignment methods
  assignDriverAndVehicle: async (routeId, assignmentData) => {
    try {
      set({ error: null });
      const response = await routeService.assignDriverAndVehicle(routeId, assignmentData);
      
      // Refresh route data
      await get().fetchRoute(routeId);
      
      return response;
    } catch (error) {
      console.error('Error assigning driver and vehicle:', error);
      const errorMessage = error.message || 'Failed to assign driver and vehicle';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Route assignments management
  fetchRouteAssignments: async (routeId, params = {}) => {
    try {
      set({ error: null });
      const response = await routeService.getRouteAssignments(routeId, params);
      const assignments = Array.isArray(response) ? response : response.data || [];
      return assignments;
    } catch (error) {
      console.error('Error fetching route assignments:', error);
      const errorMessage = error.message || 'Failed to fetch route assignments';
      set({ error: errorMessage });
      throw error;
    }
  },

  createRouteAssignment: async (assignmentData) => {
    try {
      set({ error: null });
      const response = await routeService.createRouteAssignment(assignmentData);
      const assignment = response.data || response;
      return assignment;
    } catch (error) {
      console.error('Error creating route assignment:', error);
      const errorMessage = error.message || 'Failed to create route assignment';
      set({ error: errorMessage });
      throw error;
    }
  },

  updateRouteAssignment: async (assignmentId, assignmentData) => {
    try {
      set({ error: null });
      const response = await routeService.updateRouteAssignment(assignmentId, assignmentData);
      const assignment = response.data || response;
      return assignment;
    } catch (error) {
      console.error('Error updating route assignment:', error);
      const errorMessage = error.message || 'Failed to update route assignment';
      set({ error: errorMessage });
      throw error;
    }
  },

  deleteRouteAssignment: async (assignmentId) => {
    try {
      set({ error: null });
      await routeService.deleteRouteAssignment(assignmentId);
    } catch (error) {
      console.error('Error deleting route assignment:', error);
      const errorMessage = error.message || 'Failed to delete route assignment';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Route schedule methods
  updateRouteSchedule: async (routeId, scheduleData) => {
    try {
      set({ error: null });
      const response = await routeService.updateRouteSchedule(routeId, scheduleData);
      const updatedRoute = response.data || response;
      
      set(state => ({
        routes: state.routes.map(route => 
          route.id === routeId ? { ...route, ...updatedRoute } : route
        ),
        selectedRoute: state.selectedRoute?.id === routeId 
          ? { ...state.selectedRoute, ...updatedRoute } 
          : state.selectedRoute
      }));
      
      return updatedRoute;
    } catch (error) {
      console.error('Error updating route schedule:', error);
      const errorMessage = error.message || 'Failed to update route schedule';
      set({ error: errorMessage });
      throw error;
    }
  },

  fetchUpcomingCollections: async (routeId, days = 30) => {
    try {
      set({ error: null });
      const response = await routeService.getUpcomingCollections(routeId, days);
      const collections = Array.isArray(response) ? response : response.data || [];
      return collections;
    } catch (error) {
      console.error('Error fetching upcoming collections:', error);
      const errorMessage = error.message || 'Failed to fetch upcoming collections';
      set({ error: errorMessage });
      throw error;
    }
  },

  optimizeRoute: async (routeId) => {
    try {
      set({ error: null });
      const response = await routeService.optimizeRoute(routeId);
      
      // Refresh route data
      await get().fetchRoute(routeId);
      
      return response;
    } catch (error) {
      console.error('Error optimizing route:', error);
      const errorMessage = error.message || 'Failed to optimize route';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Utility methods
  setSelectedRoute: (route) => {
    set({ selectedRoute: route });
  },

  clearError: () => {
    set({ error: null });
  },

  clearRoutes: () => {
    set({ routes: [], selectedRoute: null, routeCustomers: {} });
  },

  clearRouteCustomers: (routeId) => {
    set(state => ({
      routeCustomers: {
        ...state.routeCustomers,
        [routeId]: []
      }
    }));
  },

  // Filtered getters
  getRoutesByStatus: (status) => {
    return get().routes.filter(route => route.status === status);
  },

  getActiveRoutes: () => {
    return get().routes.filter(route => route.status === 'active');
  },

  getRoutesWithCapacity: () => {
    return get().routes.filter(route => {
      const customersCount = route.customers_count || 0;
      const maxCustomers = route.max_customers || 0;
      return customersCount < maxCustomers;
    });
  },

  getRouteCustomers: (routeId) => {
    return get().routeCustomers[routeId] || [];
  },

  getRouteById: (id) => {
    return get().routes.find(route => route.id === parseInt(id));
  },
}));