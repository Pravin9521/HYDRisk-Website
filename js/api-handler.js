/* ===================================
   API Handler for HYDRisk Website
   Handles all API calls to backend
   =================================== */

const API_BASE_URL = window.location.origin; // Will work with same domain
// For development, you can use: const API_BASE_URL = 'http://localhost:3000';

class APIHandler {
  constructor() {
    this.apiBase = API_BASE_URL;
  }

  /**
   * Submit contact form
   */
  async submitContact(formData) {
    try {
      const response = await fetch(`${this.apiBase}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject || null,
          message: formData.message,
          serviceType: formData.serviceType || null
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.'
      };
    }
  }

  /**
   * Subscribe to newsletter
   */
  async subscribeNewsletter(email, name = null, source = 'website') {
    try {
      const response = await fetch(`${this.apiBase}/api/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          name: name,
          source: source
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: 'Network error. Please try again later.'
      };
    }
  }

  /**
   * Submit service inquiry
   */
  async submitServiceInquiry(formData) {
    try {
      const response = await fetch(`${this.apiBase}/api/service-inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company || null,
          serviceType: formData.serviceType,
          projectDetails: formData.projectDetails || null,
          location: formData.location || null,
          budgetRange: formData.budgetRange || null
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.'
      };
    }
  }
}

// Initialize API Handler
const apiHandler = new APIHandler();

