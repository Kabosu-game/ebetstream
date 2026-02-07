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
                      <i class="fas fa-cookie-bite me-2"></i>Cookies
                    </span>
                    <h1 class="hero_title mb-4">
                      Cookie <span class="text_gradient">Policy</span>
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
                      <h3 class="text-white mb-3">1. What is a Cookie?</h3>
                      <p class="text-white" style="opacity: 0.9; line-height: 1.8;">
                        Cookies are small text files stored on your device when you visit a website. 
                        They allow the site to remember your actions and preferences over a period of time, thus avoiding 
                        having to re-enter them on each visit.
                      </p>
                    </div>

                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">2. How Do We Use Cookies?</h3>
                      <p class="text-white" style="opacity: 0.9; line-height: 1.8;">
                        eBetStream uses cookies to improve your user experience, analyze usage of 
                        our platform, personalize content, and ensure the security of your account.
                      </p>
                    </div>

                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">3. Types of Cookies Used</h3>
                      
                      <div class="cookie_type mb-4">
                        <h4 class="text-white mb-2">Essential Cookies</h4>
                        <p class="text-white" style="opacity: 0.9; line-height: 1.8;">
                          These cookies are necessary for the platform to function. They include session 
                          and authentication cookies that allow you to maintain a secure connection.
                        </p>
                      </div>

                      <div class="cookie_type mb-4">
                        <h4 class="text-white mb-2">Performance Cookies</h4>
                        <p class="text-white" style="opacity: 0.9; line-height: 1.8;">
                          These cookies collect information about how you use our site, such as the pages 
                          you visit most often. This data helps us improve the platform's functionality.
                        </p>
                      </div>

                      <div class="cookie_type mb-4">
                        <h4 class="text-white mb-2">Functionality Cookies</h4>
                        <p class="text-white" style="opacity: 0.9; line-height: 1.8;">
                          These cookies allow the platform to remember your choices (such as your language or region) 
                          and provide enhanced and personalized features.
                        </p>
                      </div>

                      <div class="cookie_type">
                        <h4 class="text-white mb-2">Targeting Cookies</h4>
                        <p class="text-white" style="opacity: 0.9; line-height: 1.8;">
                          These cookies may be set by our advertising partners to create a profile of your interests 
                          and show you relevant advertisements on other sites.
                        </p>
                      </div>
                    </div>

                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">4. Cookie Management</h3>
                      <p class="text-white mb-3" style="opacity: 0.9; line-height: 1.8;">
                        You can control and manage cookies in several ways:
                      </p>
                      <ul class="text-white" style="opacity: 0.9; line-height: 1.8; padding-left: 1.5rem;">
                        <li>Browser settings: most browsers allow you to refuse or accept cookies</li>
                        <li>Platform settings: you can manage your cookie preferences in your account settings</li>
                        <li>Note: disabling certain cookies may affect the functionality of some features</li>
                      </ul>
                    </div>

                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">5. Third-Party Cookies</h3>
                      <p class="text-white" style="opacity: 0.9; line-height: 1.8;">
                        Some cookies are placed by third-party services that appear on our pages. We have no 
                        control over these third-party cookies. We recommend that you review the cookie policies of these 
                        third-party services for more information.
                      </p>
                    </div>

                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">6. Retention Period</h3>
                      <p class="text-white" style="opacity: 0.9; line-height: 1.8;">
                        Session cookies are deleted when you close your browser. Persistent cookies 
                        remain on your device for a determined period or until you manually delete them.
                      </p>
                    </div>

                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">7. Contact</h3>
                      <p class="text-white" style="opacity: 0.9; line-height: 1.8;">
                        For any questions regarding our use of cookies, contact us at 
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

.cookie_type {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  margin-bottom: 1rem;
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
