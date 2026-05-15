<template>
  <div class="tw-page">
    <!-- Hero -->
    <section class="tw-page-hero">
      <div class="hero-inner">
        <p class="tw-page-hero__sub"><i class="fas fa-shield-alt me-2"></i>{{ $t('legal.hero_sub') }}</p>
        <h1 class="tw-page-hero__title">{{ $t('legal.privacy.hero_title') }} <span class="accent">{{ $t('legal.privacy.hero_accent') }}</span></h1>
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
              <li><a href="#p1"  class="toc-link">{{ $t('legal.privacy.s1_title') }}</a></li>
              <li><a href="#p2"  class="toc-link">{{ $t('legal.privacy.s2_title') }}</a></li>
              <li><a href="#p3"  class="toc-link">{{ $t('legal.privacy.s3_title') }}</a></li>
              <li><a href="#p4"  class="toc-link">{{ $t('legal.privacy.s4_title') }}</a></li>
              <li><a href="#p5"  class="toc-link">{{ $t('legal.privacy.s5_title') }}</a></li>
              <li><a href="#p6"  class="toc-link">{{ $t('legal.privacy.s6_title') }}</a></li>
              <li><a href="#p7"  class="toc-link">{{ $t('legal.privacy.s7_title') }}</a></li>
              <li><a href="#p8"  class="toc-link">{{ $t('legal.privacy.s8_title') }}</a></li>
              <li><a href="#p9"  class="toc-link">{{ $t('legal.privacy.s9_title') }}</a></li>
              <li><a href="#p10" class="toc-link">{{ $t('legal.privacy.s10_title') }}</a></li>
              <li><a href="#p11" class="toc-link">{{ $t('legal.privacy.s11_title') }}</a></li>
              <li><a href="#p12" class="toc-link">{{ $t('legal.privacy.s12_title') }}</a></li>
              <li><a href="#p13" class="toc-link">{{ $t('legal.privacy.s13_title') }}</a></li>
            </ol>
          </div>
        </aside>

        <!-- Content -->
        <main class="legal-content">
          <div id="p1" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.privacy.s1_title') }}</h3>
            <p class="body-text">{{ $t('legal.privacy.s1_p1') }}</p>
            <p class="body-text">{{ $t('legal.privacy.s1_p2') }}</p>
          </div>

          <div id="p2" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.privacy.s2_title') }}</h3>
            <p class="body-text">{{ $t('legal.privacy.s2_sub1') }}</p>
            <ul class="legal-list">
              <li>{{ $t('legal.privacy.s2_li1') }}</li>
              <li>{{ $t('legal.privacy.s2_li2') }}</li>
              <li>{{ $t('legal.privacy.s2_li3') }}</li>
            </ul>
            <p class="body-text">{{ $t('legal.privacy.s2_sub2') }}</p>
            <ul class="legal-list">
              <li>{{ $t('legal.privacy.s2_li4') }}</li>
              <li>{{ $t('legal.privacy.s2_li5') }}</li>
              <li>{{ $t('legal.privacy.s2_li6') }}</li>
            </ul>
            <p class="body-text">{{ $t('legal.privacy.s2_sub3') }}</p>
            <ul class="legal-list">
              <li>{{ $t('legal.privacy.s2_li7') }}</li>
              <li>{{ $t('legal.privacy.s2_li8') }}</li>
            </ul>
          </div>

          <div id="p3" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.privacy.s3_title') }}</h3>
            <p class="body-text">{{ $t('legal.privacy.s3_p1') }}</p>
            <ul class="legal-list">
              <li>{{ $t('legal.privacy.s3_li1') }}</li>
              <li>{{ $t('legal.privacy.s3_li2') }}</li>
              <li>{{ $t('legal.privacy.s3_li3') }}</li>
              <li>{{ $t('legal.privacy.s3_li4') }}</li>
              <li>{{ $t('legal.privacy.s3_li5') }}</li>
            </ul>
          </div>

          <div id="p4" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.privacy.s4_title') }}</h3>
            <p class="body-text">{{ $t('legal.privacy.s4_p1') }}</p>
            <ul class="legal-list">
              <li>{{ $t('legal.privacy.s4_li1') }}</li>
              <li>{{ $t('legal.privacy.s4_li2') }}</li>
              <li>{{ $t('legal.privacy.s4_li3') }}</li>
              <li>{{ $t('legal.privacy.s4_li4') }}</li>
            </ul>
          </div>

          <div id="p5" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.privacy.s5_title') }}</h3>
            <p class="body-text">{{ $t('legal.privacy.s5_p1') }}</p>
            <ul class="legal-list">
              <li>{{ $t('legal.privacy.s5_li1') }}</li>
              <li>{{ $t('legal.privacy.s5_li2') }}</li>
              <li>{{ $t('legal.privacy.s5_li3') }}</li>
            </ul>
          </div>

          <div id="p6" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.privacy.s6_title') }}</h3>
            <p class="body-text">{{ $t('legal.privacy.s6_p1') }}</p>
            <ul class="legal-list">
              <li>{{ $t('legal.privacy.s6_li1') }}</li>
              <li>{{ $t('legal.privacy.s6_li2') }}</li>
              <li>{{ $t('legal.privacy.s6_li3') }}</li>
            </ul>
          </div>

          <div id="p7" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.privacy.s7_title') }}</h3>
            <p class="body-text">{{ $t('legal.privacy.s7_p1') }}</p>
          </div>

          <div id="p8" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.privacy.s8_title') }}</h3>
            <p class="body-text">{{ $t('legal.privacy.s8_p1') }}</p>
            <ul class="legal-list">
              <li>{{ $t('legal.privacy.s8_li1') }}</li>
              <li>{{ $t('legal.privacy.s8_li2') }}</li>
              <li>{{ $t('legal.privacy.s8_li3') }}</li>
            </ul>
          </div>

          <div id="p9" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.privacy.s9_title') }}</h3>
            <p class="body-text">{{ $t('legal.privacy.s9_p1') }}</p>
            <ul class="legal-list">
              <li>{{ $t('legal.privacy.s9_li1') }}</li>
              <li>{{ $t('legal.privacy.s9_li2') }}</li>
              <li>{{ $t('legal.privacy.s9_li3') }}</li>
              <li>{{ $t('legal.privacy.s9_li4') }}</li>
              <li>{{ $t('legal.privacy.s9_li5') }}</li>
              <li>{{ $t('legal.privacy.s9_li6') }}</li>
            </ul>
            <p class="body-text">{{ $t('legal.privacy.s9_note') }}</p>
          </div>

          <div id="p10" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.privacy.s10_title') }}</h3>
            <p class="body-text">{{ $t('legal.privacy.s10_p1') }}</p>
          </div>

          <div id="p11" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.privacy.s11_title') }}</h3>
            <p class="body-text">{{ $t('legal.privacy.s11_p1') }}</p>
          </div>

          <div id="p12" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.privacy.s12_title') }}</h3>
            <p class="body-text">{{ $t('legal.privacy.s12_p1') }}</p>
          </div>

          <div id="p13" class="tw-content-block">
            <h3 class="section-num">{{ $t('legal.privacy.s13_title') }}</h3>
            <p class="body-text">
              {{ $t('legal.privacy.s13_p1') }}
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
