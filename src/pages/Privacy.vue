<template>
  <div class="tw-page">
    <!-- Hero -->
    <section class="tw-page-hero">
      <div class="hero-inner">
        <p class="tw-page-hero__sub"><i class="fas fa-shield-alt me-2"></i>Legal</p>
        <h1 class="tw-page-hero__title">Privacy <span class="accent">Policy</span></h1>
        <p class="hero-date">Last updated: {{ lastUpdated }}</p>
      </div>
    </section>

    <div class="tw-page-body">
      <div class="legal-layout">
        <!-- Table of contents (sidebar) -->
        <aside class="toc">
          <div class="tw-card toc-card">
            <h4 class="toc-heading">Contents</h4>
            <ol class="toc-list">
              <li><a href="#s1" class="toc-link">Introduction</a></li>
              <li><a href="#s2" class="toc-link">Data Collected</a></li>
              <li><a href="#s3" class="toc-link">Data Usage</a></li>
              <li><a href="#s4" class="toc-link">Data Sharing</a></li>
              <li><a href="#s5" class="toc-link">Security</a></li>
              <li><a href="#s6" class="toc-link">Your Rights</a></li>
              <li><a href="#s7" class="toc-link">Cookies</a></li>
              <li><a href="#s8" class="toc-link">Contact</a></li>
            </ol>
          </div>
        </aside>

        <!-- Sections -->
        <main class="legal-content">
          <div id="s1" class="tw-content-block">
            <h3 class="section-num">1. Introduction</h3>
            <p class="body-text">
              At eBetStream, we place great importance on protecting your personal data.
              This privacy policy explains how we collect, use, store, and protect
              your information when you use our platform.
            </p>
          </div>

          <div id="s2" class="tw-content-block">
            <h3 class="section-num">2. Data Collected</h3>
            <p class="body-text">We collect the following types of data:</p>
            <ul class="legal-list">
              <li>Identification information: name, email, username</li>
              <li>Account information: password (hashed), preferences</li>
              <li>Transaction data: challenge history, payments</li>
              <li>Technical data: IP address, browser type, device</li>
              <li>Usage data: pages visited, time spent on the platform</li>
            </ul>
          </div>

          <div id="s3" class="tw-content-block">
            <h3 class="section-num">3. Data Usage</h3>
            <p class="body-text">We use your data to:</p>
            <ul class="legal-list">
              <li>Provide and improve our services</li>
              <li>Manage your account and transactions</li>
              <li>Contact you regarding your account or our services</li>
              <li>Ensure security and prevent fraud</li>
              <li>Comply with our legal obligations</li>
              <li>Analyze platform usage to improve user experience</li>
            </ul>
          </div>

          <div id="s4" class="tw-content-block">
            <h3 class="section-num">4. Data Sharing</h3>
            <p class="body-text">
              We never sell your personal data. We may share your information only
              in the following cases: with your explicit consent, to comply with our legal obligations,
              with our trusted service providers (under confidentiality agreement), or in case of
              merger or acquisition of our company.
            </p>
          </div>

          <div id="s5" class="tw-content-block">
            <h3 class="section-num">5. Security</h3>
            <p class="body-text">
              We implement appropriate technical and organizational security measures to
              protect your data against unauthorized access, loss, destruction, or alteration.
              This includes SSL/TLS encryption, secure storage, and strict access controls.
            </p>
          </div>

          <div id="s6" class="tw-content-block">
            <h3 class="section-num">6. Your Rights</h3>
            <p class="body-text">You have the right to:</p>
            <ul class="legal-list">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request portability of your data</li>
              <li>Withdraw your consent at any time</li>
            </ul>
          </div>

          <div id="s7" class="tw-content-block">
            <h3 class="section-num">7. Cookies</h3>
            <p class="body-text">
              We use cookies to improve your experience. See our
              <router-link to="/cookies" class="inline-link">Cookie Policy</router-link>
              for more information.
            </p>
          </div>

          <div id="s8" class="tw-content-block">
            <h3 class="section-num">8. Contact</h3>
            <p class="body-text">
              For any questions regarding this policy or your personal data, contact us at
              <a href="mailto:privacy@acmpt.online" class="inline-link">privacy@acmpt.online</a>
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
