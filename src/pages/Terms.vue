<template>
  <div class="tw-page">
    <!-- Hero -->
    <section class="tw-page-hero">
      <div class="hero-inner">
        <p class="tw-page-hero__sub"><i class="fas fa-file-contract me-2"></i>{{ $t('ui.legal') }}</p>
        <h1 class="tw-page-hero__title">{{ $t('ui.terms_amp') }}<span class="accent">{{ $t('ui.conditions') }}</span></h1>
        <p class="hero-date">Last updated: {{ lastUpdated }}</p>
      </div>
    </section>

    <div class="tw-page-body">
      <div class="legal-layout">
        <!-- Table of contents -->
        <aside class="toc">
          <div class="tw-card toc-card">
            <h4 class="toc-heading">{{ $t('ui.contents') }}</h4>
            <ol class="toc-list">
              <li><a href="#s1" class="toc-link">{{ $t('ui.acceptance_of_terms') }}</a></li>
              <li><a href="#s2" class="toc-link">{{ $t('ui.eligibility') }}</a></li>
              <li><a href="#s3" class="toc-link">{{ $t('ui.user_account') }}</a></li>
              <li><a href="#s4" class="toc-link">{{ $t('ui.platform_usage') }}</a></li>
              <li><a href="#s5" class="toc-link">{{ $t('ui.challenges_amp_transactions') }}</a></li>
              <li><a href="#s6" class="toc-link">{{ $t('ui.intellectual_property') }}</a></li>
              <li><a href="#s7" class="toc-link">{{ $t('ui.limitation_of_liability') }}</a></li>
              <li><a href="#s8" class="toc-link">{{ $t('ui.responsible_gaming') }}</a></li>
              <li><a href="#s9" class="toc-link">{{ $t('ui.terms_modifications') }}</a></li>
              <li><a href="#s10" class="toc-link">{{ $t('ui.contact') }}</a></li>
            </ol>
          </div>
        </aside>

        <!-- Content -->
        <main class="legal-content">
          <div id="s1" class="tw-content-block">
            <h3 class="section-num">{{ $t('ui.1_acceptance_of_terms') }}</h3>
            <p class="body-text">
              By accessing and using eBetStream, you agree to be bound by these terms and conditions.
              If you do not agree to these terms, please do not use our platform.
            </p>
          </div>

          <div id="s2" class="tw-content-block">
            <h3 class="section-num">{{ $t('ui.2_eligibility') }}</h3>
            <p class="body-text">{{ $t('ui.to_use_ebetstream_you_must') }}</p>
            <ul class="legal-list">
              <li>{{ $t('ui.be_at_least_18_years_old') }}</li>
              <li>{{ $t('ui.have_the_legal_capacity_to_contract') }}</li>
              <li>{{ $t('ui.reside_in_a_jurisdiction_where_use_of_our_platform_is_legal') }}</li>
              <li>{{ $t('ui.provide_accurate_and_up_to_date_information') }}</li>
            </ul>
          </div>

          <div id="s3" class="tw-content-block">
            <h3 class="section-num">{{ $t('ui.3_user_account') }}</h3>
            <p class="body-text">{{ $t('ui.you_are_responsible_for') }}</p>
            <ul class="legal-list">
              <li>{{ $t('ui.maintaining_the_confidentiality_of_your_login_credentials') }}</li>
              <li>{{ $t('ui.all_activities_performed_under_your_account') }}</li>
              <li>{{ $t('ui.immediately_notifying_ebetstream_of_any_unauthorized_use') }}</li>
              <li>{{ $t('ui.ensuring_that_your_account_information_is_accurate_and_up_to') }}</li>
            </ul>
          </div>

          <div id="s4" class="tw-content-block">
            <h3 class="section-num">{{ $t('ui.4_platform_usage') }}</h3>
            <p class="body-text">{{ $t('ui.you_agree_not_to') }}</p>
            <ul class="legal-list">
              <li>{{ $t('ui.use_the_platform_for_illegal_purposes') }}</li>
              <li>{{ $t('ui.attempt_to_access_unauthorized_areas') }}</li>
              <li>{{ $t('ui.transmit_viruses_or_malicious_code') }}</li>
              <li>{{ $t('ui.harass_threaten_or_harm_other_users') }}</li>
              <li>{{ $t('ui.use_bots_or_automated_scripts') }}</li>
              <li>{{ $t('ui.attempt_to_bypass_security_measures') }}</li>
            </ul>
          </div>

          <div id="s5" class="tw-content-block">
            <h3 class="section-num">{{ $t('ui.5_challenges_and_transactions') }}</h3>
            <p class="body-text">
              Challenges created on eBetStream are agreements between users. eBetStream acts as an intermediary
              and is not responsible for challenge results. All bet amounts are locked until
              the challenge is resolved. Winnings are distributed automatically according to recorded results.
            </p>
          </div>

          <div id="s6" class="tw-content-block">
            <h3 class="section-num">{{ $t('ui.6_intellectual_property') }}</h3>
            <p class="body-text">
              All content on the eBetStream platform, including but not limited to texts, graphics,
              logos, icons, images, audio clips, and software, is the property of eBetStream or its content
              providers and is protected by copyright laws and other intellectual property laws.
            </p>
          </div>

          <div id="s7" class="tw-content-block">
            <h3 class="section-num">{{ $t('ui.7_limitation_of_liability') }}</h3>
            <p class="body-text">
              eBetStream will not be liable for indirect, incidental, special, or consequential damages resulting
              from the use or inability to use the platform. Our total liability will never exceed
              the amount you have paid to use our services in the past 12 months.
            </p>
          </div>

          <div id="s8" class="tw-content-block">
            <h3 class="section-num">{{ $t('ui.8_responsible_gaming') }}</h3>
            <p class="body-text">
              We encourage responsible gaming. If you think you have a gambling problem, please consult
              professional help resources. We offer tools to help you manage your activity,
              including deposit limits and self-exclusion options.
            </p>
          </div>

          <div id="s9" class="tw-content-block">
            <h3 class="section-num">{{ $t('ui.9_terms_modifications') }}</h3>
            <p class="body-text">
              We reserve the right to modify these terms at any time. Modifications will take effect
              immediately upon publication on the platform. Your continued use of the platform after the
              modifications constitutes your acceptance of the new terms.
            </p>
          </div>

          <div id="s10" class="tw-content-block">
            <h3 class="section-num">{{ $t('ui.10_contact') }}</h3>
            <p class="body-text">
              For any questions regarding these terms, contact us at
              <a href="mailto:legal@acmpt.online" class="inline-link">{{ $t('ui.legal_acmpt_online') }}</a>
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
