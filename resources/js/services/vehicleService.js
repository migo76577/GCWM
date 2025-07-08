import apiService from './apiService';

class VehicleService {
  async getVehicles(params = {}) {
    return await apiService.get('/vehicles', { params });
  }

  async getVehicle(id) {
    return await apiService.get(`/vehicles/${id}`);
  }

  async createVehicle(vehicleData) {
    return await apiService.post('/vehicles', vehicleData);
  }

  async updateVehicle(id, vehicleData) {
    return await apiService.put(`/vehicles/${id}`, vehicleData);
  }

  async deleteVehicle(id) {
    return await apiService.delete(`/vehicles/${id}`);
  }

  // Additional vehicle-specific methods
  async getVehiclesByStatus(status) {
    return await this.getVehicles({ status });
  }

  async getVehiclesByType(type) {
    return await this.getVehicles({ vehicle_type: type });
  }

  async searchVehicles(query) {
    return await this.getVehicles({ search: query });
  }

  async getVehicleStatistics() {
    return await apiService.get('/vehicles/statistics');
  }
}

export default new VehicleService();