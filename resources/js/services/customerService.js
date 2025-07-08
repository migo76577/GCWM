import apiService from './apiService';

class CustomerService {
  async getCustomers(params = {}) {
    return await apiService.get('/customers', { params });
  }

  async getCustomer(id) {
    return await apiService.get(`/customers/${id}`);
  }

  async createCustomer(customerData) {
    return await apiService.post('/customers', customerData);
  }

  async updateCustomer(id, customerData) {
    return await apiService.put(`/customers/${id}`, customerData);
  }

  async deleteCustomer(id) {
    return await apiService.delete(`/customers/${id}`);
  }

  // Customer-specific methods
  async getCustomersByStatus(status) {
    return await this.getCustomers({ status });
  }

  async getCustomersByRegistrationStatus(registrationStatus) {
    return await this.getCustomers({ registration_status: registrationStatus });
  }

  async searchCustomers(query) {
    return await this.getCustomers({ search: query });
  }

  async getCustomersByArea(area) {
    return await this.getCustomers({ area });
  }

  async getCustomersByCity(city) {
    return await this.getCustomers({ city });
  }

  // Registration management
  async approveRegistration(id) {
    return await apiService.post(`/customers/${id}/approve-registration`);
  }

  async assignToRoute(id, routeId) {
    return await apiService.post(`/customers/${id}/assign-route`, { route_id: routeId });
  }

  // Related data
  async getCustomerCollections(id, params = {}) {
    return await apiService.get(`/customers/${id}/collections`, { params });
  }

  async getCustomerInvoices(id, params = {}) {
    return await apiService.get(`/customers/${id}/invoices`, { params });
  }

  async getCustomerPayments(id, params = {}) {
    return await apiService.get(`/customers/${id}/payments`, { params });
  }

  async getCustomerComplaints(id, params = {}) {
    return await apiService.get(`/customers/${id}/complaints`, { params });
  }

  // Statistics
  async getCustomerStatistics() {
    return await apiService.get('/customers/statistics');
  }
}

export default new CustomerService();