<template>
  <div class="tw-page">
    <!-- Hero -->
    <section class="tw-page-hero">
      <div class="hero-inner">
        <p class="tw-page-hero__sub"><i class="fas fa-file-contract me-2"></i>{{ $t('legal.hero_sub') }}</p>
        <h1 class="tw-page-hero__title">{{ $t('legal.terms.hero_title') }} <span class="accent">{{ $t('legal.terms.hero_accent') }}</span></h1>
        <p class="hero-date">{{ $t('legal.last_updated') }} : {{ lastUpdated }}</p>
      </div>
    </section>

    <div class="tw-page-body">
      <div class="legal-layout">
        <!-- TOC -->
        <aside class="toc">
          <div class="tw-card toc-card">
            <h4 class="toc-heading">{{ $t('legal.contents') }}</h4>
            <ol class="toc-list">
              <li><a href="#t1"  class="toc-link">{{ $t('legal.terms.s1_title') }}</a></li>
              <li><a href="#t2"  class="toc-link">{{ $t('legal.terms.s2_title') }}</a></li>
              <li><a href="#t3"  class="toc-link">{{ $t('legal.terms.s3_title') }}</a></li>
              <li><a href="#t4"  class="toc-link">{{ $t('legal.terms.s4_title') }}</a></li>
              <li><a href="#t5"  class="toc-link">{{ $t('legal.terms.s5_title') }}</a></li>
              <li><a href="#t6"  class="toc-link">{{ $t('legal.terms.s6_title') }}</a></li>
              <li><a href="#t7"  class="toc-link">{{ $t('legal.terms.s7_title') }}</a></li>
              <li><a href="#t8"  class="toc-link">{{ $t('legal.terms.s8_title') }}</a></li>
              <li><a href="#t9"  class="toc-link">{{ $t('legal.terms.s9_title') }}</a></li>
              <li><a href="#t10" class="toc-link">{{ $t('legal.terms.s10_title') }}</a></li>
              <li><a href="#t11" class="toc-link">{{ $t('legal.terms.s11_title') }}</a></li>
              <li><a href="#t12" class="toc-link">{{ $t('legal.terms.s12_title') }}</a></li>
              <li><a href="#t13" class="toc-link">{{ $t('legal.terms.s13_title') }}</a></li>
              <li><a href="#t14" class="toc-link">{{ $t('legal.terms.s14_title') }}</a></li>
              <li><a href="#t15" class="toc-link">{{ $t('legal.terms.s15_title') }}</a></li>
              <li><a href="#t16" class="toc-link">{{ $t('legal.terms.s16_title') }}</a></li>
              <li><a href="#t17" class="toc-link">{{ $t('legal.terms.s17_title') }}</a></li>
              <li><a href="#t18" class="toc-link">{{ $t('legal.terms.s18_title') }}</a></li>
              <li><a href="#t19" class="toc-link">{{ $t('legal.terms.s19_title') }}</a></li>
            </ol>
          </div>
        </aside>

        <!-- Content -->
        <main class="legal-content">
          <div id="t1" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.terms.s1_title') }}</h3>
            <p class="body-text">{{ $t('legal.terms.s1_p1') }}</p>
          </div>

          <div id="t2" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.terms.s2_title') }}</h3>
            <p class="body-text">{{ $t('legal.terms.s2_p1') }}</p>
            <ul class="legal-list">
              <li>{{ $t('legal.terms.s2_li1') }}</li>
              <li>{{ $t('legal.terms.s2_li2') }}</li>
              <li>{{ $t('legal.terms.s2_li3') }}</li>
            </ul>
          </div>

          <div id="t3" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.terms.s3_title') }}</h3>
            <p class="body-text">{{ $t('legal.terms.s3_p1') }}</p>
          </div>

          <div id="t4" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.terms.s4_title') }}</h3>
            <p class="body-text">{{ $t('legal.terms.s4_p1') }}</p>
            <ul class="legal-list">
              <li>{{ $t('legal.terms.s4_li1') }}</li>
              <li>{{ $t('legal.terms.s4_li2') }}</li>
              <li>{{ $t('legal.terms.s4_li3') }}</li>
              <li>{{ $t('legal.terms.s4_li4') }}</li>
            </ul>
          </div>

          <div id="t5" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.terms.s5_title') }}</h3>
            <p class="body-text">{{ $t('legal.terms.s5_p1') }}</p>
            <ul class="legal-list">
              <li>{{ $t('legal.terms.s5_li1') }}</li>
              <li>{{ $t('legal.terms.s5_li2') }}</li>
              <li>{{ $t('legal.terms.s5_li3') }}</li>
            </ul>
          </div>

          <div id="t6" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.terms.s6_title') }}</h3>
            <p class="body-text">{{ $t('legal.terms.s6_p1') }}</p>
            <ul class="legal-list">
              <li>{{ $t('legal.terms.s6_li1') }}</li>
              <li>{{ $t('legal.terms.s6_li2') }}</li>
              <li>{{ $t('legal.terms.s6_li3') }}</li>
              <li>{{ $t('legal.terms.s6_li4') }}</li>
              <li>{{ $t('legal.terms.s6_li5') }}</li>
            </ul>
          </div>

          <div id="t7" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.terms.s7_title') }}</h3>
            <p class="body-text">{{ $t('legal.terms.s7_p1') }}</p>
            <ul class="legal-list">
              <li>{{ $t('legal.terms.s7_li1') }}</li>
              <li>{{ $t('legal.terms.s7_li2') }}</li>
              <li>{{ $t('legal.terms.s7_li3') }}</li>
            </ul>
          </div>

          <div id="t8" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.terms.s8_title') }}</h3>
            <p class="body-text">{{ $t('legal.terms.s8_p1') }}</p>
            <ul class="legal-list">
              <li>{{ $t('legal.terms.s8_li1') }}</li>
              <li>{{ $t('legal.terms.s8_li2') }}</li>
              <li>{{ $t('legal.terms.s8_li3') }}</li>
            </ul>
          </div>

          <div id="t9" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.terms.s9_title') }}</h3>
            <p class="body-text">{{ $t('legal.terms.s9_p1') }}</p>
          </div>

          <div id="t10" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.terms.s10_title') }}</h3>
            <p class="body-text">{{ $t('legal.terms.s10_p1') }}</p>
            <ul class="legal-list">
              <li>{{ $t('legal.terms.s10_li1') }}</li>
              <li>{{ $t('legal.terms.s10_li2') }}</li>
              <li>{{ $t('legal.terms.s10_li3') }}</li>
            </ul>
          </div>

          <div id="t11" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.terms.s11_title') }}</h3>
            <p class="body-text">{{ $t('legal.terms.s11_p1') }}</p>
          </div>

          <div id="t12" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.terms.s12_title') }}</h3>
            <p class="body-text">{{ $t('legal.terms.s12_p1') }}</p>
            <ul class="legal-list">
              <li>{{ $t('legal.terms.s12_li1') }}</li>
              <li>{{ $t('legal.terms.s12_li2') }}</li>
              <li>{{ $t('legal.terms.s12_li3') }}</li>
            </ul>
          </div>

          <div id="t13" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.terms.s13_title') }}</h3>
            <p class="body-text">{{ $t('legal.terms.s13_p1') }}</p>
          </div>

          <div id="t14" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.terms.s14_title') }}</h3>
            <p class="body-text">{{ $t('legal.terms.s14_p1') }}</p>
          </div>

          <div id="t15" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.terms.s15_title') }}</h3>
            <p class="body-text">{{ $t('legal.terms.s15_p1') }}</p>
          </div>

          <div id="t16" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.terms.s16_title') }}</h3>
            <p class="body-text">{{ $t('legal.terms.s16_p1') }}</p>
            <ul class="legal-list">
              <li>{{ $t('legal.terms.s16_li1') }}</li>
              <li>{{ $t('legal.terms.s16_li2') }}</li>
              <li>{{ $t('legal.terms.s16_li3') }}</li>
            </ul>
          </div>

          <div id="t17" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.terms.s17_title') }}</h3>
            <p class="body-text">{{ $t('legal.terms.s17_p1') }}</p>
          </div>

          <div id="t18" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.terms.s18_title') }}</h3>
            <p class="body-text">{{ $t('legal.terms.s18_p1') }}</p>
          </div>

          <div id="t19" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.terms.s19_title') }}</h3>
            <p class="body-text">
              {{ $t('legal.terms.s19_p1') }}
              <a :href="'mailto:' + $t('legal.email_legal')" class="inline-link">{{ $t('legal.email_legal') }}</a>
            </p>
          </div>
        </main>
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

.legal-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 2rem;
  align-items: start;
}

.toc {
  position: sticky;
  top: 80px;
}

.toc-card { padding: 1.25rem; }

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
  gap: 0.35rem;
}

.toc-link {
  color: rgb(var(--n3));
  text-decoration: none;
  font-size: 0.82rem;
  transition: color 0.2s;
  line-height: 1.3;
}

.toc-link:hover { color: rgb(var(--g1)); }

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

@media (max-width: 860px) {
  .legal-layout { grid-template-columns: 1fr; }
  .toc { position: static; }
  .tw-page-hero { padding: 2.5rem 1rem 2rem; }
  .tw-page-body { padding: 1.5rem 1rem 3rem; }
}
</style>
