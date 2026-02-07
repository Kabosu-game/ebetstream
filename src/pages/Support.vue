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
                      <i class="fas fa-headset me-2"></i>Support
                    </span>
                    <h1 class="hero_title mb-4">
                      Support <span class="text_gradient">eBetStream</span>
                    </h1>
                    <p class="hero_subtitle mb-5">
                      Our support team is available 24/7 to help you. Choose the method that works best for you.
                    </p>
                  </div>
                </div>
              </div>

              <div class="row w-100 g-5">
                <!-- Support Options -->
                <div class="col-lg-8">
                  <div class="support_options">
                    <div class="support_card n11-bg rounded-8 p-5 mb-4">
                      <div class="d-flex align-items-center gap-4 mb-4">
                        <div class="support_icon">
                          <i class="fas fa-envelope text_gradient fs-1"></i>
                        </div>
                        <div class="flex-grow-1">
                          <h3 class="text-white mb-2">Email Support</h3>
                          <p class="text-white mb-3" style="opacity: 0.8;">
                            Send us an email and we will respond within 24 hours.
                          </p>
                          <a href="mailto:support@acmpt.online" class="text_gradient text-decoration-none">
                            support@acmpt.online
                          </a>
                        </div>
                      </div>
                    </div>

                    <div class="support_card n11-bg rounded-8 p-5 mb-4">
                      <div class="d-flex align-items-center gap-4 mb-4">
                        <div class="support_icon">
                          <i class="fas fa-comments text_gradient fs-1"></i>
                        </div>
                        <div class="flex-grow-1">
                          <h3 class="text-white mb-2">Live Chat</h3>
                          <p class="text-white mb-3" style="opacity: 0.8;">
                            Chat with our team in real-time (available 24/7).
                          </p>
                          <button class="btn_primary" @click="openChat">
                            <i class="fas fa-comment-dots me-2"></i>
                            Open Chat
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="support_card n11-bg rounded-8 p-5">
                      <div class="d-flex align-items-center gap-4">
                        <div class="support_icon">
                          <i class="fas fa-phone text_gradient fs-1"></i>
                        </div>
                        <div class="flex-grow-1">
                          <h3 class="text-white mb-2">Phone Support</h3>
                          <p class="text-white mb-3" style="opacity: 0.8;">
                            Call us for immediate assistance.
                          </p>
                          <a href="tel:+1234567890" class="text_gradient text-decoration-none">
                            +1 (234) 567-890
                          </a>
                          <p class="text-white mt-2 small" style="opacity: 0.7;">
                            Mon-Fri: 9am-6pm (UTC)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Quick Links -->
                <div class="col-lg-4">
                  <div class="quick_links_card n11-bg rounded-8 p-4">
                    <h4 class="text-white mb-4">Useful Resources</h4>
                    <div class="d-flex flex-column gap-3">
                      <router-link to="/help" class="quick_link text-white text-decoration-none d-flex align-items-center gap-3 p-3 rounded-8" style="background: rgba(255,255,255,0.05);">
                        <i class="fas fa-question-circle text_gradient"></i>
                        <span>Help Center</span>
                      </router-link>
                      <router-link to="/faq" class="quick_link text-white text-decoration-none d-flex align-items-center gap-3 p-3 rounded-8" style="background: rgba(255,255,255,0.05);">
                        <i class="fas fa-list-alt text_gradient"></i>
                        <span>FAQ</span>
                      </router-link>
                      <router-link to="/contact" class="quick_link text-white text-decoration-none d-flex align-items-center gap-3 p-3 rounded-8" style="background: rgba(255,255,255,0.05);">
                        <i class="fas fa-envelope text_gradient"></i>
                        <span>Contact Form</span>
                      </router-link>
                      <router-link to="/privacy" class="quick_link text-white text-decoration-none d-flex align-items-center gap-3 p-3 rounded-8" style="background: rgba(255,255,255,0.05);">
                        <i class="fas fa-shield-alt text_gradient"></i>
                        <span>Privacy</span>
                      </router-link>
                    </div>
                  </div>

                  <!-- Status -->
                  <div class="status_card n11-bg rounded-8 p-4 mt-4">
                    <h4 class="text-white mb-3">Service Status</h4>
                    <div class="status_item d-flex justify-content-between align-items-center mb-2">
                      <span class="text-white" style="opacity: 0.8;">Platform</span>
                      <span class="badge bg-success">Operational</span>
                    </div>
                    <div class="status_item d-flex justify-content-between align-items-center mb-2">
                      <span class="text-white" style="opacity: 0.8;">Payments</span>
                      <span class="badge bg-success">Operational</span>
                    </div>
                    <div class="status_item d-flex justify-content-between align-items-center">
                      <span class="text-white" style="opacity: 0.8;">Streaming</span>
                      <span class="badge bg-success">Operational</span>
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
const openChat = () => {
  // Simulate opening chat
  alert('Chat feature coming soon. In the meantime, please use the contact form or email.');
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

.support_card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.support_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 159, 0, 0.3);
}

.quick_links_card, .status_card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.quick_link {
  transition: all 0.3s ease;
}

.quick_link:hover {
  background: rgba(255, 159, 0, 0.1) !important;
  transform: translateX(5px);
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
}

.btn_primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 159, 0, 0.4);
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

