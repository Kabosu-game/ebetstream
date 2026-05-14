<template>
  <div class="tw-page">
    <!-- Hero -->
    <section class="tw-page-hero">
      <div class="hero-inner">
        <p class="tw-page-hero__sub"><i class="fas fa-shield-alt me-2"></i>{{ $t('ui.legal') }}</p>
        <h1 class="tw-page-hero__title">{{ $t('ui.privacy') }}<span class="accent">{{ $t('ui.policy') }}</span></h1>
        <p class="hero-date">Last updated: {{ lastUpdated }}</p>
      </div>
    </section>

    <div class="tw-page-body">
      <div class="legal-layout">
        <!-- Table of contents (sidebar) -->
        <aside class="toc">
          <div class="tw-card toc-card">
            <h4 class="toc-heading">{{ $t('ui.contents') }}</h4>
            <ol class="toc-list">
              <li><a href="#s1" class="toc-link">{{ $t('ui.introduction') }}</a></li>
              <li><a href="#s2" class="toc-link">{{ $t('ui.data_collected') }}</a></li>
              <li><a href="#s3" class="toc-link">{{ $t('ui.data_usage') }}</a></li>
              <li><a href="#s4" class="toc-link">{{ $t('ui.data_sharing') }}</a></li>
              <li><a href="#s5" class="toc-link">{{ $t('ui.security') }}</a></li>
              <li><a href="#s6" class="toc-link">{{ $t('ui.your_rights') }}</a></li>
              <li><a href="#s7" class="toc-link">{{ $t('ui.cookies') }}</a></li>
              <li><a href="#s8" class="toc-link">{{ $t('ui.contact') }}</a></li>
            </ol>
          </div>
        </aside>

        <!-- Sections -->
        <main class="legal-content">
          <div id="s1" class="tw-content-block">
            <h3 class="section-num">{{ $t('ui.1_introduction') }}</h3>
            <p class="body-text">
              At eBetStream, we place great importance on protecting your personal data.
              This privacy policy explains how we collect, use, store, and protect
              your information when you use our platform.
            </p>
          </div>

          <div id="s2" class="tw-content-block">
            <h3 class="section-num">{{ $t('ui.2_data_collected') }}</h3>
            <p class="body-text">{{ $t('ui.we_collect_the_following_types_of_data') }}</p>
            <ul class="legal-list">
              <li>{{ $t('ui.identification_information_name_email_username') }}</li>
              <li>{{ $t('ui.account_information_password_hashed_preferences') }}</li>
              <li>{{ $t('ui.transaction_data_challenge_history_payments') }}</li>
              <li>{{ $t('ui.technical_data_ip_address_browser_type_device') }}</li>
              <li>{{ $t('ui.usage_data_pages_visited_time_spent_on_the_platform') }}</li>
            </ul>
          </div>

          <div id="s3" class="tw-content-block">
            <h3 class="section-num">{{ $t('ui.3_data_usage') }}</h3>
            <p class="body-text">{{ $t('ui.we_use_your_data_to') }}</p>
            <ul class="legal-list">
              <li>{{ $t('ui.provide_and_improve_our_services') }}</li>
              <li>{{ $t('ui.manage_your_account_and_transactions') }}</li>
              <li>{{ $t('ui.contact_you_regarding_your_account_or_our_services') }}</li>
              <li>{{ $t('ui.ensure_security_and_prevent_fraud') }}</li>
              <li>{{ $t('ui.comply_with_our_legal_obligations') }}</li>
              <li>{{ $t('ui.analyze_platform_usage_to_improve_user_experience') }}</li>
            </ul>
          </div>

          <div id="s4" class="tw-content-block">
            <h3 class="section-num">{{ $t('ui.4_data_sharing') }}</h3>
            <p class="body-text">
              We never sell your personal data. We may share your information only
              in the following cases: with your explicit consent, to comply with our legal obligations,
              with our trusted service providers (under confidentiality agreement), or in case of
              merger or acquisition of our company.
            </p>
          </div>

          <div id="s5" class="tw-content-block">
            <h3 class="section-num">{{ $t('ui.5_security') }}</h3>
            <p class="body-text">
              We implement appropriate technical and organizational security measures to
              protect your data against unauthorized access, loss, destruction, or alteration.
              This includes SSL/TLS encryption, secure storage, and strict access controls.
            </p>
          </div>

          <div id="s6" class="tw-content-block">
            <h3 class="section-num">{{ $t('ui.6_your_rights') }}</h3>
            <p class="body-text">{{ $t('ui.you_have_the_right_to') }}</p>
            <ul class="legal-list">
              <li>{{ $t('ui.access_your_personal_data') }}</li>
              <li>{{ $t('ui.correct_inaccurate_data') }}</li>
              <li>{{ $t('ui.request_deletion_of_your_data') }}</li>
              <li>{{ $t('ui.object_to_processing_of_your_data') }}</li>
              <li>{{ $t('ui.request_portability_of_your_data') }}</li>
              <li>{{ $t('ui.withdraw_your_consent_at_any_time') }}</li>
            </ul>
          </div>

          <div id="s7" class="tw-content-block">
            <h3 class="section-num">{{ $t('ui.7_cookies') }}</h3>
            <p class="body-text">
              We use cookies to improve your experience. See our
              <router-link to="/cookies" class="inline-link">{{ $t('ui.cookie_policy') }}</router-link>
              for more information.
            </p>
          </div>

          <div id="s8" class="tw-content-block">
            <h3 class="section-num">{{ $t('ui.8_contact') }}</h3>
            <p class="body-text">
              For any questions regarding this policy or your personal data, contact us at
              <a href="mailto:privacy@acmpt.online" class="inline-link">{{ $t('ui.privacy_acmpt_online') }}</a>
            </p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

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
