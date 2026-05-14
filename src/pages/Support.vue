<template>
  <div class="tw-page">
    <!-- Hero -->
    <section class="tw-page-hero">
      <div class="hero-inner">
        <p class="tw-page-hero__sub"><i class="fas fa-headset me-2"></i>Support</p>
        <h1 class="tw-page-hero__title">Support <span class="accent">Center</span></h1>
        <p class="hero-desc">Our support team is available 24/7 to help you. Choose the contact method that works best for you.</p>
      </div>
    </section>

    <div class="tw-page-body">
      <!-- Support method cards -->
      <section class="page-section">
        <h2 class="section-title">Get in Touch</h2>
        <div class="tw-grid-3">
          <!-- Email -->
          <div class="tw-card support-card">
            <div class="support-icon">
              <i class="fas fa-envelope"></i>
            </div>
            <h3 class="support-title">Email Support</h3>
            <p class="support-desc">Send us an email and we will respond within 24 hours.</p>
            <a href="mailto:support@acmpt.online" class="support-link">
              support@acmpt.online <i class="fas fa-external-link-alt ms-1"></i>
            </a>
            <div class="support-meta">Response within 24h</div>
          </div>

          <!-- Chat -->
          <div class="tw-card support-card">
            <div class="support-icon">
              <i class="fas fa-comments"></i>
            </div>
            <h3 class="support-title">Live Chat</h3>
            <p class="support-desc">Chat with our team in real-time. Available 24/7.</p>
            <button class="tw-btn tw-btn--primary" @click="openChat">
              <i class="fas fa-comment-dots me-2"></i>Open Chat
            </button>
            <div class="support-meta online"><span class="dot"></span> Available now</div>
          </div>

          <!-- Phone -->
          <div class="tw-card support-card">
            <div class="support-icon">
              <i class="fas fa-phone"></i>
            </div>
            <h3 class="support-title">Phone Support</h3>
            <p class="support-desc">Call us for immediate assistance.</p>
            <a href="tel:+1234567890" class="support-link">
              +1 (234) 567-890 <i class="fas fa-external-link-alt ms-1"></i>
            </a>
            <div class="support-meta">Mon–Fri: 9am–6pm (UTC)</div>
          </div>
        </div>
      </section>

      <div class="tw-divider"></div>

      <!-- Bottom row: quick links + status -->
      <section class="bottom-row">
        <!-- Quick links -->
        <div class="tw-card links-card">
          <h4 class="card-heading">Useful Resources</h4>
          <div class="quick-links">
            <router-link to="/help" class="quick-link">
              <i class="fas fa-question-circle quick-link__icon"></i>
              <span>Help Center</span>
              <i class="fas fa-chevron-right quick-link__arrow"></i>
            </router-link>
            <router-link to="/faq" class="quick-link">
              <i class="fas fa-list-alt quick-link__icon"></i>
              <span>FAQ</span>
              <i class="fas fa-chevron-right quick-link__arrow"></i>
            </router-link>
            <router-link to="/contact" class="quick-link">
              <i class="fas fa-envelope quick-link__icon"></i>
              <span>Contact Form</span>
              <i class="fas fa-chevron-right quick-link__arrow"></i>
            </router-link>
            <router-link to="/privacy" class="quick-link">
              <i class="fas fa-shield-alt quick-link__icon"></i>
              <span>Privacy</span>
              <i class="fas fa-chevron-right quick-link__arrow"></i>
            </router-link>
          </div>
        </div>

        <!-- Service status -->
        <div class="tw-card status-card">
          <h4 class="card-heading">Service Status</h4>
          <div class="status-list">
            <div class="status-row">
              <span class="status-name">Platform</span>
              <span class="status-badge operational"><i class="fas fa-circle me-1"></i>Operational</span>
            </div>
            <div class="tw-divider mini-divider"></div>
            <div class="status-row">
              <span class="status-name">Payments</span>
              <span class="status-badge operational"><i class="fas fa-circle me-1"></i>Operational</span>
            </div>
            <div class="tw-divider mini-divider"></div>
            <div class="status-row">
              <span class="status-name">Streaming</span>
              <span class="status-badge operational"><i class="fas fa-circle me-1"></i>Operational</span>
            </div>
          </div>
          <p class="status-footer">All systems normal</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const openChat = () => {
  // Simulate opening chat
  alert('Chat feature coming soon. In the meantime, please use the contact form or email.');
};
</script>

<style scoped>
/* Hero */
.tw-page-hero {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 1.5rem 3rem;
  background: linear-gradient(180deg, rgba(37,150,190,0.12) 0%, transparent 100%);
  border-bottom: 1px solid rgba(37,150,190,0.15);
}

.hero-inner {
  max-width: 620px;
}

.hero-desc {
  color: rgb(var(--n3));
  font-size: 1rem;
  line-height: 1.7;
  margin: 0;
}

.accent {
  color: rgb(var(--g1));
}

/* Body */
.tw-page-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
}

.page-section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin-bottom: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* Support cards */
.support-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
}

.support-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 10px;
  background: rgba(37,150,190,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: rgb(var(--g1));
  margin-bottom: 0.25rem;
}

.support-title {
  font-size: 1rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0;
}

.support-desc {
  font-size: 0.85rem;
  color: rgb(var(--n3));
  line-height: 1.6;
  margin: 0;
  flex-grow: 1;
}

.support-link {
  color: rgb(var(--g1));
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 600;
  transition: opacity 0.2s;
}

.support-link:hover {
  opacity: 0.8;
}

.support-meta {
  font-size: 0.78rem;
  color: rgb(var(--n3));
  margin-top: auto;
}

.support-meta.online {
  color: #3bc464;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #3bc464;
  display: inline-block;
}

/* Bottom row */
.bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.card-heading {
  font-size: 0.95rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin-bottom: 1rem;
}

/* Quick links */
.quick-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.9rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px;
  color: rgb(var(--n8));
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 600;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}

.quick-link:hover {
  background: rgba(37,150,190,0.12);
  border-color: rgba(37,150,190,0.35);
  transform: translateX(3px);
}

.quick-link__icon {
  color: rgb(var(--g1));
  font-size: 0.95rem;
  flex-shrink: 0;
}

.quick-link__arrow {
  margin-left: auto;
  color: rgb(var(--n3));
  font-size: 0.7rem;
}

/* Status */
.status-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.mini-divider {
  margin: 0.5rem 0;
  opacity: 0.5;
}

.status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0;
}

.status-name {
  font-size: 0.88rem;
  color: rgb(var(--n3));
}

.status-badge {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

.status-badge.operational {
  background: rgba(59,196,100,0.15);
  color: #3bc464;
}

.status-footer {
  font-size: 0.78rem;
  color: rgb(var(--n3));
  margin-top: 1rem;
  margin-bottom: 0;
  text-align: center;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .tw-page-hero {
    padding: 2.5rem 1rem 2rem;
  }

  .bottom-row {
    grid-template-columns: 1fr;
  }
}
</style>
