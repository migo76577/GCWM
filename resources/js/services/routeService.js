import apiService from './apiService';

class RouteService {
  async getRoutes(params = {}) {
    return await apiService.get('/routes', { params });
  }

  async getRoute(id) {
    return await apiService.get(`/routes/${id}`);
  }

  async createRoute(routeData) {
    return await apiService.post('/routes', routeData);
  }

  async updateRoute(id, routeData) {
    return await apiService.put(`/routes/${id}`, routeData);
  }

  async deleteRoute(id) {
    return await apiService.delete(`/routes/${id}`);
  }

  // Route-specific methods
  async getRoutesByStatus(status) {
    return await this.getRoutes({ status });
  }

  async getActiveRoutes() {
    return await this.getRoutes({ status: 'active' });
  }

  async getRoutesWithCapacity() {
    return await this.getRoutes({ has_capacity: true });
  }

  async searchRoutes(query) {
    return await this.getRoutes({ search: query });
  }

  async getRoutesByArea(area) {
    return await this.getRoutes({ area });
  }

  // Route assignment methods
  async assignDriverAndVehicle(id, assignmentData) {
    return await apiService.post(`/routes/${id}/assign`, assignmentData);
  }

  async getRouteAssignments(id, params = {}) {
    return await apiService.get(`/routes/${id}/assignments`, { params });
  }

  async createRouteAssignment(assignmentData) {
    return await apiService.post('/route-assignments', assignmentData);
  }

  async updateRouteAssignment(assignmentId, assignmentData) {
    return await apiService.put(`/route-assignments/${assignmentId}`, assignmentData);
  }

  async deleteRouteAssignment(assignmentId) {
    return await apiService.delete(`/route-assignments/${assignmentId}`);
  }

  async getAssignmentsByDate(date, params = {}) {
    return await apiService.get('/route-assignments', { 
      params: { assignment_date: date, ...params } 
    });
  }

  // Route schedule methods
  async updateRouteSchedule(id, scheduleData) {
    return await apiService.put(`/routes/${id}/schedule`, scheduleData);
  }

  async getRouteSchedule(id) {
    return await apiService.get(`/routes/${id}/schedule`);
  }

  async getUpcomingCollections(id, days = 30) {
    return await apiService.get(`/routes/${id}/upcoming-collections`, { 
      params: { days } 
    });
  }

  async optimizeRoute(id) {
    return await apiService.post(`/routes/${id}/optimize`);
  }

  // Route customers
  async getRouteCustomers(id, params = {}) {
    return await apiService.get(`/routes/${id}/customers`, { params });
  }

  async addCustomerToRoute(routeId, customerId, assignmentData = {}) {
    return await apiService.post(`/routes/${routeId}/customers`, {
      customer_id: customerId,
      ...assignmentData
    });
  }

  async removeCustomerFromRoute(routeId, customerId) {
    return await apiService.delete(`/routes/${routeId}/customers/${customerId}`);
  }

  // Route collections
  async getRouteCollections(id, params = {}) {
    return await apiService.get(`/routes/${id}/collections`, { params });
  }

  // Route expenses
  async getRouteExpenses(id, params = {}) {
    return await apiService.get(`/routes/${id}/expenses`, { params });
  }

  // Statistics
  async getRouteStatistics(id) {
    return await apiService.get(`/routes/${id}/statistics`);
  }

  async getAllRoutesStatistics() {
    return await apiService.get('/routes/statistics');
  }

  // Route efficiency
  async getRouteEfficiency(id, params = {}) {
    return await apiService.get(`/routes/${id}/efficiency`, { params });
  }
}

export default new RouteService();