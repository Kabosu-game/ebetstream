<template>
  <div class="tw-page">
    <!-- Hero -->
    <section class="tw-page-hero">
      <div class="hero-inner">
        <p class="tw-page-hero__sub"><i class="fas fa-cookie-bite me-2"></i>{{ $t('legal.hero_sub') }}</p>
        <h1 class="tw-page-hero__title">{{ $t('legal.cookies.hero_title') }} <span class="accent">{{ $t('legal.cookies.hero_accent') }}</span></h1>
        <p class="hero-date">{{ $t('legal.last_updated') }} : {{ lastUpdated }}</p>
      </div>
    </section>

    <div class="tw-page-body">
      <!-- Cookie type cards -->
      <section class="cookie-types-section">
        <h2 class="section-title">{{ $t('legal.cookies.types_title') }}</h2>
        <div class="tw-grid-3">
          <div class="tw-card cookie-type-card">
            <div class="cookie-icon required"><i class="fas fa-lock"></i></div>
            <h4 class="cookie-name">{{ $t('legal.cookies.essential_name') }}</h4>
            <span class="cookie-tag required">{{ $t('legal.cookies.always_active') }}</span>
            <p class="cookie-desc">{{ $t('legal.cookies.essential_desc') }}</p>
          </div>
          <div class="tw-card cookie-type-card">
            <div class="cookie-icon perf"><i class="fas fa-chart-line"></i></div>
            <h4 class="cookie-name">{{ $t('legal.cookies.perf_name') }}</h4>
            <span class="cookie-tag perf">{{ $t('legal.cookies.optional') }}</span>
            <p class="cookie-desc">{{ $t('legal.cookies.perf_desc') }}</p>
          </div>
          <div class="tw-card cookie-type-card">
            <div class="cookie-icon func"><i class="fas fa-sliders-h"></i></div>
            <h4 class="cookie-name">{{ $t('legal.cookies.func_name') }}</h4>
            <span class="cookie-tag func">{{ $t('legal.cookies.optional') }}</span>
            <p class="cookie-desc">{{ $t('legal.cookies.func_desc') }}</p>
          </div>
          <div class="tw-card cookie-type-card">
            <div class="cookie-icon target"><i class="fas fa-bullseye"></i></div>
            <h4 class="cookie-name">{{ $t('legal.cookies.target_name') }}</h4>
            <span class="cookie-tag target">{{ $t('legal.cookies.optional') }}</span>
            <p class="cookie-desc">{{ $t('legal.cookies.target_desc') }}</p>
          </div>
        </div>
      </section>

      <div class="tw-divider"></div>

      <div class="legal-content">
        <div class="tw-content-block">
          <h3 class="section-num">{{ $t('legal.cookies.s1_title') }}</h3>
          <p class="body-text">{{ $t('legal.cookies.s1_p1') }}</p>
          <p class="body-text">{{ $t('legal.cookies.s1_p2') }}</p>
        </div>

        <div class="tw-content-block">
          <h3 class="section-num">{{ $t('legal.cookies.s2_title') }}</h3>
          <p class="body-text">{{ $t('legal.cookies.s2_p1') }}</p>
          <ul class="legal-list">
            <li>{{ $t('legal.cookies.s2_li1') }}</li>
            <li>{{ $t('legal.cookies.s2_li2') }}</li>
            <li>{{ $t('legal.cookies.s2_li3') }}</li>
          </ul>
        </div>

        <div class="tw-content-block">
          <h3 class="section-num">{{ $t('legal.cookies.s3_title') }}</h3>
          <p class="body-text">{{ $t('legal.cookies.s3_p1') }}</p>
        </div>

        <div class="tw-content-block">
          <h3 class="section-num">{{ $t('legal.cookies.s4_title') }}</h3>
          <p class="body-text">{{ $t('legal.cookies.s4_p1') }}</p>
          <ul class="legal-list">
            <li>{{ $t('legal.cookies.s4_li1') }}</li>
            <li>{{ $t('legal.cookies.s4_li2') }}</li>
          </ul>
        </div>

        <div class="tw-content-block">
          <h3 class="section-num">{{ $t('legal.cookies.s5_title') }}</h3>
          <p class="body-text">{{ $t('legal.cookies.s5_p1') }}</p>
        </div>

        <div class="tw-content-block">
          <h3 class="section-num">{{ $t('legal.cookies.s6_title') }}</h3>
          <p class="body-text">{{ $t('legal.cookies.s6_p1') }}</p>
        </div>

        <div class="tw-content-block">
          <h3 class="section-num">{{ $t('legal.cookies.s7_title') }}</h3>
          <p class="body-text">{{ $t('legal.cookies.s7_p1') }}</p>
          <ul class="legal-list">
            <li>{{ $t('legal.cookies.s7_li1') }}</li>
            <li>{{ $t('legal.cookies.s7_li2') }}</li>
            <li>{{ $t('legal.cookies.s7_li3') }}</li>
            <li>{{ $t('legal.cookies.s7_li4') }}</li>
            <li>{{ $t('legal.cookies.s7_li5') }}</li>
          </ul>
        </div>

        <div class="tw-content-block">
          <h3 class="section-num">{{ $t('legal.cookies.s8_title') }}</h3>
          <p class="body-text">{{ $t('legal.cookies.s8_p1') }}</p>
          <ul class="legal-list">
            <li>{{ $t('legal.cookies.s8_li1') }}</li>
            <li>{{ $t('legal.cookies.s8_li2') }}</li>
            <li>{{ $t('legal.cookies.s8_li3') }}</li>
          </ul>
          <p class="body-text">{{ $t('legal.cookies.s8_note') }}</p>
        </div>

        <div class="tw-content-block">
          <h3 class="section-num">{{ $t('legal.cookies.s9_title') }}</h3>
          <p class="body-text">{{ $t('legal.cookies.s9_p1') }}</p>
        </div>

        <div class="tw-content-block">
          <h3 class="section-num">{{ $t('legal.cookies.s10_title') }}</h3>
          <p class="body-text">{{ $t('legal.cookies.s10_p1') }}</p>
          <ul class="legal-list">
            <li>{{ $t('legal.cookies.s10_li1') }}</li>
            <li>{{ $t('legal.cookies.s10_li2') }}</li>
          </ul>
        </div>

        <div class="tw-content-block">
          <h3 class="section-num">{{ $t('legal.cookies.s11_title') }}</h3>
          <p class="body-text">
            {{ $t('legal.cookies.s11_p1') }}
            <router-link to="/privacy" class="inline-link">{{ $t('legal.cookies.s11_link') }}</router-link>.
          </p>
        </div>

        <div class="tw-content-block">
          <h3 class="section-num">{{ $t('legal.cookies.s12_title') }}</h3>
          <p class="body-text">{{ $t('legal.cookies.s12_p1') }}</p>
        </div>

        <div class="tw-content-block">
          <h3 class="section-num">{{ $t('legal.cookies.s13_title') }}</h3>
          <p class="body-text">
            {{ $t('legal.cookies.s13_p1') }}
            <a :href="'mailto:' + $t('legal.email_privacy')" class="inline-link">{{ $t('legal.email_privacy') }}</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const lastUpdated = computed(() => {
  return new Date().toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : locale.value === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});
</script>

<style scoped>
.tw-page-hero {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 1.5rem 3rem;
  background: linear-gradient(180deg, rgba(37,150,190,0.12) 0%, transparent 100%);
  border-bottom: 1px solid rgba(37,150,190,0.15);
}

.hero-inner { max-width: 580px; }

.hero-date {
  color: rgb(var(--n3));
  font-size: 0.88rem;
  margin: 0;
}

.accent { color: rgb(var(--g1)); }

.tw-page-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
}

.cookie-types-section { margin-bottom: 2rem; }

.section-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin-bottom: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

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
  margin: 0 0 0.5rem;
}

.legal-list li { margin-bottom: 0.25rem; }

.inline-link {
  color: rgb(var(--g1));
  text-decoration: none;
  font-weight: 600;
}

.inline-link:hover { text-decoration: underline; }

@media (max-width: 768px) {
  .tw-page-hero { padding: 2.5rem 1rem 2rem; }
  .tw-page-body { padding: 1.5rem 1rem 3rem; }
}
</style>
