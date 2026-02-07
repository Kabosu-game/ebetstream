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
                      <i class="fas fa-shield-alt me-2"></i>Privacy
                    </span>
                    <h1 class="hero_title mb-4">
                      Privacy <span class="text_gradient">Policy</span>
                    </h1>
                    <p class="hero_subtitle mb-5">
                      Last updated: {{ lastUpdated }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="row w-100">
                <div class="col-lg-10">
                  <div class="legal_content">
                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">1. Introduction</h3>
                      <p class="text-white" style="opacity: 0.9; line-height: 1.8;">
                        At eBetStream, we place great importance on protecting your personal data. 
                        This privacy policy explains how we collect, use, store, and protect 
                        your information when you use our platform.
                      </p>
                    </div>

                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">2. Data Collected</h3>
                      <p class="text-white mb-3" style="opacity: 0.9; line-height: 1.8;">
                        We collect the following types of data:
                      </p>
                      <ul class="text-white" style="opacity: 0.9; line-height: 1.8; padding-left: 1.5rem;">
                        <li>Identification information: name, email, username</li>
                        <li>Account information: password (hashed), preferences</li>
                        <li>Transaction data: challenge history, payments</li>
                        <li>Technical data: IP address, browser type, device</li>
                        <li>Usage data: pages visited, time spent on the platform</li>
                      </ul>
                    </div>

                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">3. Data Usage</h3>
                      <p class="text-white mb-3" style="opacity: 0.9; line-height: 1.8;">
                        We use your data to:
                      </p>
                      <ul class="text-white" style="opacity: 0.9; line-height: 1.8; padding-left: 1.5rem;">
                        <li>Provide and improve our services</li>
                        <li>Manage your account and transactions</li>
                        <li>Contact you regarding your account or our services</li>
                        <li>Ensure security and prevent fraud</li>
                        <li>Comply with our legal obligations</li>
                        <li>Analyze platform usage to improve user experience</li>
                      </ul>
                    </div>

                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">4. Data Sharing</h3>
                      <p class="text-white" style="opacity: 0.9; line-height: 1.8;">
                        We never sell your personal data. We may share your information only 
                        in the following cases: with your explicit consent, to comply with our legal obligations, 
                        with our trusted service providers (under confidentiality agreement), or in case of 
                        merger or acquisition of our company.
                      </p>
                    </div>

                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">5. Security</h3>
                      <p class="text-white" style="opacity: 0.9; line-height: 1.8;">
                        We implement appropriate technical and organizational security measures to 
                        protect your data against unauthorized access, loss, destruction, or alteration. 
                        This includes SSL/TLS encryption, secure storage, and strict access controls.
                      </p>
                    </div>

                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">6. Your Rights</h3>
                      <p class="text-white mb-3" style="opacity: 0.9; line-height: 1.8;">
                        You have the right to:
                      </p>
                      <ul class="text-white" style="opacity: 0.9; line-height: 1.8; padding-left: 1.5rem;">
                        <li>Access your personal data</li>
                        <li>Correct inaccurate data</li>
                        <li>Request deletion of your data</li>
                        <li>Object to processing of your data</li>
                        <li>Request portability of your data</li>
                        <li>Withdraw your consent at any time</li>
                      </ul>
                    </div>

                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">7. Cookies</h3>
                      <p class="text-white" style="opacity: 0.9; line-height: 1.8;">
                        We use cookies to improve your experience. See our 
                        <router-link to="/cookies" class="text_gradient text-decoration-none">Cookie Policy</router-link> 
                        for more information.
                      </p>
                    </div>

                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">8. Contact</h3>
                      <p class="text-white" style="opacity: 0.9; line-height: 1.8;">
                        For any questions regarding this policy or your personal data, contact us at 
                        <a href="mailto:privacy@acmpt.online" class="text_gradient text-decoration-none">privacy@acmpt.online</a>
                      </p>
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
import { computed } from 'vue';

const lastUpdated = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
});
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

.content_section_item {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
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

