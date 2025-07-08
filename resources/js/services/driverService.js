import apiService from './apiService';

class DriverService {
  async getDrivers(params = {}) {
    return await apiService.get('/drivers', { params });
  }

  async getDriver(id) {
    return await apiService.get(`/drivers/${id}`);
  }

  async createDriver(driverData) {
    return await apiService.post('/drivers', driverData);
  }

  async updateDriver(id, driverData) {
    return await apiService.put(`/drivers/${id}`, driverData);
  }

  async deleteDriver(id) {
    return await apiService.delete(`/drivers/${id}`);
  }

  // Additional driver-specific methods
  async getDriversByStatus(status) {
    return await this.getDrivers({ status });
  }

  async getActiveDrivers() {
    return await this.getDriversByStatus('active');
  }

  async getDriversWithExpiringLicense(days = 30) {
    return await this.getDrivers({ license_expiring_in: days });
  }

  async searchDrivers(query) {
    return await this.getDrivers({ search: query });
  }

  async getDriverStatistics() {
    return await apiService.get('/drivers/statistics');
  }

  async getDriverAssignments(id, params = {}) {
    return await apiService.get(`/drivers/${id}/assignments`, { params });
  }
}

export default new DriverService();