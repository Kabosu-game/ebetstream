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
                      <i class="fas fa-file-contract me-2"></i>Terms
                    </span>
                    <h1 class="hero_title mb-4">
                      Terms & <span class="text_gradient">Conditions</span>
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
                      <h3 class="text-white mb-3">1. Acceptance of Terms</h3>
                      <p class="text-white" style="opacity: 0.9; line-height: 1.8;">
                        By accessing and using eBetStream, you agree to be bound by these terms and conditions. 
                        If you do not agree to these terms, please do not use our platform.
                      </p>
                    </div>

                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">2. Eligibility</h3>
                      <p class="text-white mb-3" style="opacity: 0.9; line-height: 1.8;">
                        To use eBetStream, you must:
                      </p>
                      <ul class="text-white" style="opacity: 0.9; line-height: 1.8; padding-left: 1.5rem;">
                        <li>Be at least 18 years old</li>
                        <li>Have the legal capacity to contract</li>
                        <li>Reside in a jurisdiction where use of our platform is legal</li>
                        <li>Provide accurate and up-to-date information</li>
                      </ul>
                    </div>

                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">3. User Account</h3>
                      <p class="text-white mb-3" style="opacity: 0.9; line-height: 1.8;">
                        You are responsible for:
                      </p>
                      <ul class="text-white" style="opacity: 0.9; line-height: 1.8; padding-left: 1.5rem;">
                        <li>Maintaining the confidentiality of your login credentials</li>
                        <li>All activities performed under your account</li>
                        <li>Immediately notifying eBetStream of any unauthorized use</li>
                        <li>Ensuring that your account information is accurate and up-to-date</li>
                      </ul>
                    </div>

                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">4. Platform Usage</h3>
                      <p class="text-white mb-3" style="opacity: 0.9; line-height: 1.8;">
                        You agree not to:
                      </p>
                      <ul class="text-white" style="opacity: 0.9; line-height: 1.8; padding-left: 1.5rem;">
                        <li>Use the platform for illegal purposes</li>
                        <li>Attempt to access unauthorized areas</li>
                        <li>Transmit viruses or malicious code</li>
                        <li>Harass, threaten, or harm other users</li>
                        <li>Use bots or automated scripts</li>
                        <li>Attempt to bypass security measures</li>
                      </ul>
                    </div>

                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">5. Challenges and Transactions</h3>
                      <p class="text-white" style="opacity: 0.9; line-height: 1.8;">
                        Challenges created on eBetStream are agreements between users. eBetStream acts as an intermediary 
                        and is not responsible for challenge results. All bet amounts are locked until 
                        the challenge is resolved. Winnings are distributed automatically according to recorded results.
                      </p>
                    </div>

                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">6. Intellectual Property</h3>
                      <p class="text-white" style="opacity: 0.9; line-height: 1.8;">
                        All content on the eBetStream platform, including but not limited to texts, graphics, 
                        logos, icons, images, audio clips, and software, is the property of eBetStream or its content 
                        providers and is protected by copyright laws and other intellectual property laws.
                      </p>
                    </div>

                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">7. Limitation of Liability</h3>
                      <p class="text-white" style="opacity: 0.9; line-height: 1.8;">
                        eBetStream will not be liable for indirect, incidental, special, or consequential damages resulting 
                        from the use or inability to use the platform. Our total liability will never exceed 
                        the amount you have paid to use our services in the past 12 months.
                      </p>
                    </div>

                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">8. Responsible Gaming</h3>
                      <p class="text-white" style="opacity: 0.9; line-height: 1.8;">
                        We encourage responsible gaming. If you think you have a gambling problem, please consult 
                        professional help resources. We offer tools to help you manage your activity, 
                        including deposit limits and self-exclusion options.
                      </p>
                    </div>

                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">9. Terms Modifications</h3>
                      <p class="text-white" style="opacity: 0.9; line-height: 1.8;">
                        We reserve the right to modify these terms at any time. Modifications will take effect 
                        immediately upon publication on the platform. Your continued use of the platform after the 
                        modifications constitutes your acceptance of the new terms.
                      </p>
                    </div>

                    <div class="content_section_item mb-5">
                      <h3 class="text-white mb-3">10. Contact</h3>
                      <p class="text-white" style="opacity: 0.9; line-height: 1.8;">
                        For any questions regarding these terms, contact us at 
                        <a href="mailto:legal@acmpt.online" class="text_gradient text-decoration-none">legal@acmpt.online</a>
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

