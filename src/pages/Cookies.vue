<template>
  <div class="tw-page">
    <!-- Hero -->
    <section class="tw-page-hero">
      <div class="hero-inner">
        <p class="tw-page-hero__sub"><i class="fas fa-cookie-bite me-2"></i>{{ $t('ui.legal') }}</p>
        <h1 class="tw-page-hero__title">{{ $t('ui.cookie') }}<span class="accent">{{ $t('ui.policy') }}</span></h1>
        <p class="hero-date">Last updated: {{ lastUpdated }}</p>
      </div>
    </section>

    <div class="tw-page-body">
      <!-- Cookie type cards grid -->
      <section class="cookie-types-section">
        <h2 class="section-title">{{ $t('ui.types_of_cookies_we_use') }}</h2>
        <div class="tw-grid-3">
          <div class="tw-card cookie-type-card">
            <div class="cookie-icon required"><i class="fas fa-lock"></i></div>
            <h4 class="cookie-name">{{ $t('ui.essential') }}</h4>
            <span class="cookie-tag required">{{ $t('ui.always_active') }}</span>
            <p class="cookie-desc">{{ $t('ui.session_and_authentication_cookies_required_for_the_platform') }}</p>
          </div>
          <div class="tw-card cookie-type-card">
            <div class="cookie-icon perf"><i class="fas fa-chart-line"></i></div>
            <h4 class="cookie-name">{{ $t('ui.performance') }}</h4>
            <span class="cookie-tag perf">{{ $t('ui.optional') }}</span>
            <p class="cookie-desc">{{ $t('ui.collect_usage_data_to_help_us_understand_how_visitors_intera') }}</p>
          </div>
          <div class="tw-card cookie-type-card">
            <div class="cookie-icon func"><i class="fas fa-sliders-h"></i></div>
            <h4 class="cookie-name">{{ $t('ui.functionality') }}</h4>
            <span class="cookie-tag func">{{ $t('ui.optional') }}</span>
            <p class="cookie-desc">{{ $t('ui.remember_your_preferences_like_language_and_region_for_a_per') }}</p>
          </div>
          <div class="tw-card cookie-type-card">
            <div class="cookie-icon target"><i class="fas fa-bullseye"></i></div>
            <h4 class="cookie-name">{{ $t('ui.targeting') }}</h4>
            <span class="cookie-tag target">{{ $t('ui.optional') }}</span>
            <p class="cookie-desc">{{ $t('ui.set_by_advertising_partners_to_show_you_relevant_advertiseme') }}</p>
          </div>
        </div>
      </section>

      <div class="tw-divider"></div>

      <!-- Sections -->
      <div class="legal-content">
        <div class="tw-content-block">
          <h3 class="section-num">{{ $t('ui.1_what_is_a_cookie') }}</h3>
          <p class="body-text">
            Cookies are small text files stored on your device when you visit a website.
            They allow the site to remember your actions and preferences over a period of time, thus avoiding
            having to re-enter them on each visit.
          </p>
        </div>

        <div class="tw-content-block">
          <h3 class="section-num">{{ $t('ui.2_how_do_we_use_cookies') }}</h3>
          <p class="body-text">
            eBetStream uses cookies to improve your user experience, analyze usage of
            our platform, personalize content, and ensure the security of your account.
          </p>
        </div>

        <div class="tw-content-block">
          <h3 class="section-num">{{ $t('ui.3_cookie_management') }}</h3>
          <p class="body-text">{{ $t('ui.you_can_control_and_manage_cookies_in_several_ways') }}</p>
          <ul class="legal-list">
            <li>{{ $t('ui.browser_settings_most_browsers_allow_you_to_refuse_or_accept') }}</li>
            <li>{{ $t('ui.platform_settings_you_can_manage_your_cookie_preferences_in_') }}</li>
            <li>{{ $t('ui.note_disabling_certain_cookies_may_affect_the_functionality_') }}</li>
          </ul>
        </div>

        <div class="tw-content-block">
          <h3 class="section-num">{{ $t('ui.4_third_party_cookies') }}</h3>
          <p class="body-text">
            Some cookies are placed by third-party services that appear on our pages. We have no
            control over these third-party cookies. We recommend that you review the cookie policies of these
            third-party services for more information.
          </p>
        </div>

        <div class="tw-content-block">
          <h3 class="section-num">{{ $t('ui.5_retention_period') }}</h3>
          <p class="body-text">
            Session cookies are deleted when you close your browser. Persistent cookies
            remain on your device for a determined period or until you manually delete them.
          </p>
        </div>

        <div class="tw-content-block">
          <h3 class="section-num">{{ $t('ui.6_contact') }}</h3>
          <p class="body-text">
            For any questions regarding our use of cookies, contact us at
            <a href="mailto:privacy@acmpt.online" class="inline-link">{{ $t('ui.privacy_acmpt_online') }}</a>
          </p>
        </div>
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

/* Section title */
.cookie-types-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin-bottom: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* Cookie type cards */
.cookie-type-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cookie-icon {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.cookie-icon.required { background: rgba(59,196,100,0.15); color: #3bc464; }
.cookie-icon.perf     { background: rgba(37,150,190,0.15); color: rgb(var(--g1)); }
.cookie-icon.func     { background: rgba(66,153,225,0.15); color: #4299e1; }
.cookie-icon.target   { background: rgba(237,137,54,0.15); color: #ed8936; }

.cookie-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0;
}

.cookie-tag {
  display: inline-block;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: fit-content;
}

.cookie-tag.required { background: rgba(59,196,100,0.15); color: #3bc464; }
.cookie-tag.perf     { background: rgba(37,150,190,0.15); color: rgb(var(--g1)); }
.cookie-tag.func     { background: rgba(66,153,225,0.15); color: #4299e1; }
.cookie-tag.target   { background: rgba(237,137,54,0.15); color: #ed8936; }

.cookie-desc {
  font-size: 0.83rem;
  color: rgb(var(--n3));
  line-height: 1.6;
  margin: 0;
}

/* Legal sections */
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

@media (max-width: 768px) {
  .tw-page-hero {
    padding: 2.5rem 1rem 2rem;
  }
}
</style>
