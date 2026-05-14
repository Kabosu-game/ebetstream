<template>
  <div class="tw-page">
    <!-- Hero -->
    <section class="tw-page-hero">
      <div class="hero-inner">
        <p class="tw-page-hero__sub"><i class="fas fa-file-contract me-2"></i>Legal</p>
        <h1 class="tw-page-hero__title">Terms &amp; <span class="accent">Conditions</span></h1>
        <p class="hero-date">Last updated: {{ lastUpdated }}</p>
      </div>
    </section>

    <div class="tw-page-body">
      <div class="legal-layout">
        <!-- Table of contents -->
        <aside class="toc">
          <div class="tw-card toc-card">
            <h4 class="toc-heading">Contents</h4>
            <ol class="toc-list">
              <li><a href="#s1" class="toc-link">Acceptance of Terms</a></li>
              <li><a href="#s2" class="toc-link">Eligibility</a></li>
              <li><a href="#s3" class="toc-link">User Account</a></li>
              <li><a href="#s4" class="toc-link">Platform Usage</a></li>
              <li><a href="#s5" class="toc-link">Challenges &amp; Transactions</a></li>
              <li><a href="#s6" class="toc-link">Intellectual Property</a></li>
              <li><a href="#s7" class="toc-link">Limitation of Liability</a></li>
              <li><a href="#s8" class="toc-link">Responsible Gaming</a></li>
              <li><a href="#s9" class="toc-link">Terms Modifications</a></li>
              <li><a href="#s10" class="toc-link">Contact</a></li>
            </ol>
          </div>
        </aside>

        <!-- Content -->
        <main class="legal-content">
          <div id="s1" class="tw-content-block">
            <h3 class="section-num">1. Acceptance of Terms</h3>
            <p class="body-text">
              By accessing and using eBetStream, you agree to be bound by these terms and conditions.
              If you do not agree to these terms, please do not use our platform.
            </p>
          </div>

          <div id="s2" class="tw-content-block">
            <h3 class="section-num">2. Eligibility</h3>
            <p class="body-text">To use eBetStream, you must:</p>
            <ul class="legal-list">
              <li>Be at least 18 years old</li>
              <li>Have the legal capacity to contract</li>
              <li>Reside in a jurisdiction where use of our platform is legal</li>
              <li>Provide accurate and up-to-date information</li>
            </ul>
          </div>

          <div id="s3" class="tw-content-block">
            <h3 class="section-num">3. User Account</h3>
            <p class="body-text">You are responsible for:</p>
            <ul class="legal-list">
              <li>Maintaining the confidentiality of your login credentials</li>
              <li>All activities performed under your account</li>
              <li>Immediately notifying eBetStream of any unauthorized use</li>
              <li>Ensuring that your account information is accurate and up-to-date</li>
            </ul>
          </div>

          <div id="s4" class="tw-content-block">
            <h3 class="section-num">4. Platform Usage</h3>
            <p class="body-text">You agree not to:</p>
            <ul class="legal-list">
              <li>Use the platform for illegal purposes</li>
              <li>Attempt to access unauthorized areas</li>
              <li>Transmit viruses or malicious code</li>
              <li>Harass, threaten, or harm other users</li>
              <li>Use bots or automated scripts</li>
              <li>Attempt to bypass security measures</li>
            </ul>
          </div>

          <div id="s5" class="tw-content-block">
            <h3 class="section-num">5. Challenges and Transactions</h3>
            <p class="body-text">
              Challenges created on eBetStream are agreements between users. eBetStream acts as an intermediary
              and is not responsible for challenge results. All bet amounts are locked until
              the challenge is resolved. Winnings are distributed automatically according to recorded results.
            </p>
          </div>

          <div id="s6" class="tw-content-block">
            <h3 class="section-num">6. Intellectual Property</h3>
            <p class="body-text">
              All content on the eBetStream platform, including but not limited to texts, graphics,
              logos, icons, images, audio clips, and software, is the property of eBetStream or its content
              providers and is protected by copyright laws and other intellectual property laws.
            </p>
          </div>

          <div id="s7" class="tw-content-block">
            <h3 class="section-num">7. Limitation of Liability</h3>
            <p class="body-text">
              eBetStream will not be liable for indirect, incidental, special, or consequential damages resulting
              from the use or inability to use the platform. Our total liability will never exceed
              the amount you have paid to use our services in the past 12 months.
            </p>
          </div>

          <div id="s8" class="tw-content-block">
            <h3 class="section-num">8. Responsible Gaming</h3>
            <p class="body-text">
              We encourage responsible gaming. If you think you have a gambling problem, please consult
              professional help resources. We offer tools to help you manage your activity,
              including deposit limits and self-exclusion options.
            </p>
          </div>

          <div id="s9" class="tw-content-block">
            <h3 class="section-num">9. Terms Modifications</h3>
            <p class="body-text">
              We reserve the right to modify these terms at any time. Modifications will take effect
              immediately upon publication on the platform. Your continued use of the platform after the
              modifications constitutes your acceptance of the new terms.
            </p>
          </div>

          <div id="s10" class="tw-content-block">
            <h3 class="section-num">10. Contact</h3>
            <p class="body-text">
              For any questions regarding these terms, contact us at
              <a href="mailto:legal@acmpt.online" class="inline-link">legal@acmpt.online</a>
            </p>
          </div>
        </main>
      </div>
    </div>
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
  max-width: 580px;
}

.hero-date {
  color: rgb(var(--n3));
  font-size: 0.88rem;
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

/* Two-col layout */
.legal-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 2rem;
  align-items: start;
}

/* TOC sidebar */
.toc {
  position: sticky;
  top: 80px;
}

.toc-card {
  padding: 1.25rem;
}

.toc-heading {
  font-size: 0.78rem;
  font-weight: 700;
  color: rgb(var(--n3));
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
}

.toc-list {
  padding-left: 1.1rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.toc-link {
  color: rgb(var(--n3));
  text-decoration: none;
  font-size: 0.83rem;
  transition: color 0.2s;
}

.toc-link:hover {
  color: rgb(var(--g1));
}

/* Content */
.legal-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-num {
  font-size: 1rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin-bottom: 0.75rem;
}

.body-text {
  color: rgb(var(--n3));
  font-size: 0.9rem;
  line-height: 1.8;
  margin-bottom: 0.5rem;
}

.legal-list {
  color: rgb(var(--n3));
  font-size: 0.9rem;
  line-height: 1.8;
  padding-left: 1.5rem;
  margin: 0;
}

.legal-list li {
  margin-bottom: 0.25rem;
}

.inline-link {
  color: rgb(var(--g1));
  text-decoration: none;
  font-weight: 600;
}

.inline-link:hover {
  text-decoration: underline;
}

@media (max-width: 860px) {
  .legal-layout {
    grid-template-columns: 1fr;
  }

  .toc {
    position: static;
  }

  .tw-page-hero {
    padding: 2.5rem 1rem 2rem;
  }
}
</style>
