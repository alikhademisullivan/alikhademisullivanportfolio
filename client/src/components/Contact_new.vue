<template>
  <div class="contact-container">
    <section class="contact-header">
      <div class="container">
        <h1>Get In Touch</h1>
        <p>I'd love to hear from you. Send me a message!</p>
      </div>
    </section>

    <section class="contact-section">
      <div class="container">
        <div class="contact-content">
          <div class="contact-form-wrapper">
            <form @submit.prevent="submitContact" class="contact-form">
              <div class="form-group">
                <label for="name">Your Name *</label>
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  required
                  placeholder="John Doe"
                />
              </div>

              <div class="form-group">
                <label for="email">Your Email *</label>
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div class="form-group">
                <label for="subject">Subject *</label>
                <input
                  id="subject"
                  v-model="formData.subject"
                  type="text"
                  required
                  placeholder="Project Inquiry"
                />
              </div>

              <div class="form-group full-width">
                <label for="message">Message *</label>
                <textarea
                  id="message"
                  v-model="formData.message"
                  rows="6"
                  required
                  placeholder="Tell me about your project or inquiry..."
                ></textarea>
              </div>

              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
              </button>

              <div v-if="successMessage" class="success-message">
                ✓ {{ successMessage }}
              </div>
              <div v-if="errorMessage" class="error-message">
                ✗ {{ errorMessage }}
              </div>
            </form>
          </div>

          <div class="contact-info">
            <h2>Contact Information</h2>
            <div class="info-item">
              <i class="fas fa-envelope"></i>
              <div>
                <h3>Email</h3>
                <a href="mailto:sullivanali03@gmail.com">sullivanali03@gmail.com</a>
              </div>
            </div>

            <div class="info-item">
              <i class="fab fa-linkedin"></i>
              <div>
                <h3>LinkedIn</h3>
                <a href="https://www.linkedin.com/in/ali-khademi-sullivan-49930b24a/" target="_blank">
                  Connect with me
                </a>
              </div>
            </div>

            <div class="info-item">
              <i class="fab fa-github"></i>
              <div>
                <h3>GitHub</h3>
                <a href="https://github.com/alikhademisullivan" target="_blank">
                  View my projects
                </a>
              </div>
            </div>

            <div class="info-item">
              <i class="fas fa-map-marker-alt"></i>
              <div>
                <h3>Location</h3>
                <p>London, Ontario, Canada</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Admin View -->
        <div v-if="isAdmin && isAuthenticated" class="admin-section">
          <h2>Messages</h2>
          <div class="messages-list">
            <div v-for="msg in messages" :key="msg._id" class="message-item" :class="{ unread: !msg.read }">
              <div class="message-header">
                <div>
                  <strong>{{ msg.name }}</strong> ({{ msg.email }})
                  <p class="message-date">{{ formatDate(msg.createdAt) }}</p>
                </div>
                <div class="message-actions">
                  <button @click="markAsRead(msg._id)" class="btn-small" v-if="!msg.read">Mark Read</button>
                  <button @click="deleteMessage(msg._id)" class="btn-small delete">Delete</button>
                </div>
              </div>
              <p class="message-subject"><strong>{{ msg.subject }}</strong></p>
              <p class="message-text">{{ msg.message }}</p>
            </div>
            <div v-if="messages.length === 0" class="no-messages">
              <p>No messages yet.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ContactService from '../services/ContactService';
import AuthService from '../services/AuthService';

export default {
  name: 'ContactForm',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      isSubmitting: false,
      successMessage: '',
      errorMessage: '',
      isAdmin: AuthService.isAdmin(),
      isAuthenticated: AuthService.isAuthenticated(),
      messages: []
    };
  },
  methods: {
    async submitContact() {
      if (this.isSubmitting) return;
      
      this.isSubmitting = true;
      this.successMessage = '';
      this.errorMessage = '';

      try {
        await ContactService.submitContact(this.formData);
        this.successMessage = 'Thank you! Your message has been sent successfully. I\'ll get back to you soon!';
        this.resetForm();
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      } catch (error) {
        console.error('Error submitting contact form:', error);
        this.errorMessage = 'Failed to send message. Please try again.';
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
    },
    async fetchMessages() {
      try {
        const response = await ContactService.getContacts();
        this.messages = response.data;
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    },
    async markAsRead(messageId) {
      try {
        await ContactService.markAsRead(messageId);
        const msg = this.messages.find(m => m._id === messageId);
        if (msg) msg.read = true;
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    },
    async deleteMessage(messageId) {
      if (!confirm('Are you sure you want to delete this message?')) return;
      
      try {
        await ContactService.deleteContact(messageId);
        this.messages = this.messages.filter(m => m._id !== messageId);
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  mounted() {
    if (this.isAdmin) {
      this.fetchMessages();
    }
  }
};
</script>

<style scoped>
.contact-container {
  width: 100%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Contact Header */
.contact-header {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
}

.contact-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.contact-header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* Contact Section */
.contact-section {
  padding: 60px 20px;
  background-color: #f9fafb;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 80px;
}

.contact-form-wrapper {
  background-color: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
  border: 1px solid #e5e7eb;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #1f2937;
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea {
  padding: 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.btn {
  padding: 12px 30px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  align-self: flex-start;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.success-message {
  color: #047857;
  background-color: #d1fae5;
  border: 1px solid #a7f3d0;
  padding: 12px;
  border-radius: 6px;
  margin-top: 10px;
}

.error-message {
  color: #dc2626;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  padding: 12px;
  border-radius: 6px;
  margin-top: 10px;
}

/* Contact Info */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.contact-info h2 {
  font-size: 1.8rem;
  color: #1f2937;
  margin-bottom: 10px;
  font-weight: 700;
}

.info-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.info-item:hover {
  background-color: #eef2ff;
  transform: translateX(5px);
  border-color: #6366f1;
}

.info-item i {
  font-size: 1.5rem;
  color: #6366f1;
  min-width: 30px;
}

.info-item h3 {
  font-size: 1.1rem;
  color: #1f2937;
  margin: 0 0 5px 0;
  font-weight: 600;
}

.info-item p {
  margin: 0;
  color: #6b7280;
}

.info-item a {
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
}

.info-item a:hover {
  text-decoration: underline;
}

/* Admin Section */
.admin-section {
  margin-top: 80px;
  padding-top: 60px;
  border-top: 2px solid #e5e7eb;
}

.admin-section h2 {
  font-size: 2rem;
  margin-bottom: 30px;
  color: #1f2937;
  font-weight: 700;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message-item {
  background-color: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.message-item.unread {
  border-left: 4px solid #6366f1;
  background-color: #eef2ff;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  gap: 20px;
}

.message-header strong {
  display: block;
  color: #1f2937;
  margin-bottom: 5px;
  font-weight: 600;
}

.message-date {
  color: #9ca3af;
  font-size: 0.9rem;
  margin: 0;
}

.message-actions {
  display: flex;
  gap: 10px;
}

.btn-small {
  padding: 8px 14px;
  font-size: 0.85rem;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn-small:hover {
  background-color: #4f46e5;
  transform: translateY(-2px);
}

.btn-small.delete {
  background-color: #ef4444;
}

.btn-small.delete:hover {
  background-color: #dc2626;
}

.message-subject {
  color: #1f2937;
  font-size: 1.1rem;
  margin: 10px 0;
  font-weight: 600;
}

.message-text {
  color: #374151;
  line-height: 1.6;
  margin: 10px 0;
  padding: 15px;
  background-color: #f3f4f6;
  border-radius: 8px;
  border-left: 3px solid #6366f1;
}

.no-messages {
  text-align: center;
  padding: 40px;
  color: #9ca3af;
}

/* Responsive Design */
@media (max-width: 768px) {
  .contact-header h1 {
    font-size: 2rem;
  }

  .contact-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .contact-form-wrapper {
    padding: 20px;
  }

  .message-header {
    flex-direction: column;
  }

  .message-actions {
    width: 100%;
  }

  .btn-small {
    flex: 1;
  }
}
</style>
