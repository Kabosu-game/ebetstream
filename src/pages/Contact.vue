<template>
  <div class="page-content-with-space">
    <section class="content_section py-6 position-relative overflow-hidden pb-120">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 gx-0 gx-lg-4">
            <div class="top10__main">
              <!-- Header Section -->
              <div class="row w-100 h-100 align-items-center mb-8">
                <div class="col-lg-8">
                  <div class="content_header" data-aos="fade-right">
                    <span class="hero_badge mb-3 d-inline-block">
                      <i class="fas fa-envelope me-2"></i>Contact
                    </span>
                    <h1 class="hero_title mb-4">
                      Contact <span class="text_gradient">eBetStream</span>
                    </h1>
                    <p class="hero_subtitle mb-5">
                      We are here to help you. Feel free to contact us for any questions, 
                      suggestions, or issues. Our team will respond as soon as possible.
                    </p>
                  </div>
                </div>
              </div>

              <div class="row w-100 g-5">
                <!-- Contact Form -->
                <div class="col-lg-7">
                  <div class="contact_form_card n11-bg rounded-8 p-5">
                    <h3 class="text-white mb-4">Send us a Message</h3>
                    <form @submit.prevent="handleSubmit">
                      <div class="form-group mb-4">
                        <label class="text-white mb-2 d-block">Full Name</label>
                        <input 
                          v-model="form.name"
                          type="text" 
                          class="form-control n11-bg text-white border-secondary" 
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div class="form-group mb-4">
                        <label class="text-white mb-2 d-block">Email</label>
                        <input 
                          v-model="form.email"
                          type="email" 
                          class="form-control n11-bg text-white border-secondary" 
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div class="form-group mb-4">
                        <label class="text-white mb-2 d-block">Subject</label>
                        <select 
                          v-model="form.subject"
                          class="form-select n11-bg text-white border-secondary"
                          required
                        >
                          <option value="">Select a subject</option>
                          <option value="support">Technical Support</option>
                          <option value="account">Account Issue</option>
                          <option value="payment">Payment Question</option>
                          <option value="challenge">Challenge Question</option>
                          <option value="event">Event Question</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div class="form-group mb-4">
                        <label class="text-white mb-2 d-block">Message</label>
                        <textarea 
                          v-model="form.message"
                          class="form-control n11-bg text-white border-secondary" 
                          rows="6"
                          placeholder="Your message..."
                          required
                        ></textarea>
                      </div>
                      <button type="submit" class="btn_primary w-100" :disabled="submitting">
                        <span v-if="!submitting">Send Message</span>
                        <span v-else>
                          <i class="fas fa-spinner fa-spin me-2"></i>Sending...
                        </span>
                      </button>
                      <div v-if="submitSuccess" class="alert alert-success mt-3">
                        <i class="fas fa-check-circle me-2"></i>Message sent successfully! We will respond soon.
                      </div>
                      <div v-if="submitError" class="alert alert-danger mt-3">
                        <i class="fas fa-exclamation-circle me-2"></i>{{ submitError }}
                      </div>
                    </form>
                  </div>
                </div>

                <!-- Contact Info -->
                <div class="col-lg-5">
                  <div class="contact_info">
                    <div class="info_card n11-bg rounded-8 p-4 mb-4">
                      <div class="d-flex align-items-center gap-3 mb-3">
                        <div class="info_icon">
                          <i class="fas fa-envelope text_gradient fs-3"></i>
                        </div>
                        <div>
                          <h5 class="text-white mb-1">Email</h5>
                          <p class="text-white mb-0" style="opacity: 0.8;">support@acmpt.online</p>
                        </div>
                      </div>
                    </div>

                    <div class="info_card n11-bg rounded-8 p-4 mb-4">
                      <div class="d-flex align-items-center gap-3 mb-3">
                        <div class="info_icon">
                          <i class="fas fa-headset text_gradient fs-3"></i>
                        </div>
                        <div>
                          <h5 class="text-white mb-1">Support</h5>
                          <p class="text-white mb-0" style="opacity: 0.8;">Available 24/7</p>
                        </div>
                      </div>
                    </div>

                    <div class="info_card n11-bg rounded-8 p-4 mb-4">
                      <div class="d-flex align-items-center gap-3 mb-3">
                        <div class="info_icon">
                          <i class="fas fa-clock text_gradient fs-3"></i>
                        </div>
                        <div>
                          <h5 class="text-white mb-1">Response Time</h5>
                          <p class="text-white mb-0" style="opacity: 0.8;">Within 24 hours</p>
                        </div>
                      </div>
                    </div>

                    <div class="info_card n11-bg rounded-8 p-4">
                      <h5 class="text-white mb-3">Other Resources</h5>
                      <div class="d-flex flex-column gap-2">
                        <router-link to="/help" class="text-white text-decoration-none" style="opacity: 0.8;">
                          <i class="fas fa-question-circle me-2 text_gradient"></i>Help Center
                        </router-link>
                        <router-link to="/faq" class="text-white text-decoration-none" style="opacity: 0.8;">
                          <i class="fas fa-list-alt me-2 text_gradient"></i>FAQ
                        </router-link>
                        <router-link to="/privacy" class="text-white text-decoration-none" style="opacity: 0.8;">
                          <i class="fas fa-shield-alt me-2 text_gradient"></i>Privacy Policy
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const submitting = ref(false);
const submitSuccess = ref(false);
const submitError = ref('');

const handleSubmit = async () => {
  submitting.value = true;
  submitSuccess.value = false;
  submitError.value = '';

  // Simulate sending (to be replaced with a real API call)
  setTimeout(() => {
    submitting.value = false;
    submitSuccess.value = true;
    form.value = { name: '', email: '', subject: '', message: '' };
    
    setTimeout(() => {
      submitSuccess.value = false;
    }, 5000);
  }, 1500);
};
</script>

<style scoped>
.content_section {
  width: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
}

.contact_form_card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.info_card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.info_card:hover {
  transform: translateY(-5px);
}

.text_gradient {
  background: linear-gradient(90deg, #FF9F00, #FF9F00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero_badge {
  background: rgba(255, 159, 0, 0.2);
  color: #FF9F00;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.hero_title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  line-height: 1.2;
}

.hero_subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.btn_primary {
  background: linear-gradient(135deg, #FFD700, #FF9F00);
  color: #000;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.3s;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn_primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 159, 0, 0.4);
}

.btn_primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.page-content-with-space {
  padding-top: 90px;
}

@media (max-width: 768px) {
  .page-content-with-space {
    padding-top: 60px;
  }
  
  .hero_title {
    font-size: 1.8rem;
  }
}
</style>

