<template>
  <footer class="tw-footer">
    <div class="tw-footer__inner">
      <!-- Brand + description -->
      <div class="tw-footer__brand">
        <span class="tw-footer__logo">{{ $t('ui.ebetstream_2') }}</span>
        <p class="tw-footer__tagline">{{ $t('footer.description2', 'Ebetstream is designed for a new generation of digital platforms where interactive entertainment, performance and community come together to create an immersive and dynamic experience.') }}</p>
      </div>

      <!-- Links grid -->
      <div class="tw-footer__links">
        <div class="tw-footer__col">
          <h6 class="tw-footer__col-title">{{ $t('footer.company', 'Company') }}</h6>
          <ul>
            <li><router-link to="/about">{{ $t('footer.aboutUs', 'About') }}</router-link></li>
            <li><router-link to="/monetisation">{{ $t('ui.mon_tisation') }}</router-link></li>
            <li><router-link to="/arena">{{ $t('ui.ebetstream_arena') }}</router-link></li>
            <li><router-link to="/contact">{{ $t('footer.contact', 'Contact') }}</router-link></li>
            <li><router-link to="/careers">{{ $t('footer.careers', 'Careers') }}</router-link></li>
          </ul>
        </div>

        <div class="tw-footer__col">
          <h6 class="tw-footer__col-title">{{ $t('footer.legal', 'Legal') }}</h6>
          <ul>
            <li><router-link to="/privacy">{{ $t('footer.privacy', 'Privacy') }}</router-link></li>
            <li><router-link to="/terms">{{ $t('footer.terms', 'Terms') }}</router-link></li>
            <li><router-link to="/cookies">{{ $t('footer.cookies', 'Cookies') }}</router-link></li>
          </ul>
        </div>

        <div class="tw-footer__col">
          <h6 class="tw-footer__col-title">{{ $t('footer.support', 'Support') }}</h6>
          <ul>
            <li><router-link to="/help">{{ $t('footer.help', 'Help') }}</router-link></li>
            <li><router-link to="/faq">{{ $t('footer.faq', 'FAQ') }}</router-link></li>
            <li><router-link to="/support">{{ $t('footer.supportCenter', 'Support Center') }}</router-link></li>
          </ul>
        </div>

        <div class="tw-footer__col">
          <h6 class="tw-footer__col-title">{{ $t('footer.certifications', 'Certifications') }}</h6>
          <ul>
            <li><router-link to="/agents-crypto">{{ $t('ui.agents_crypto') }}</router-link></li>
            <li><router-link to="/become-agent">{{ $t('footer.becomeAgent', 'Become Agent') }}</router-link></li>
            <li><router-link to="/become-referee">{{ $t('footer.becomeReferee', 'Become Referee') }}</router-link></li>
            <li><router-link to="/become-ambassador">{{ $t('footer.becomeAmbassador', 'Ambassador') }}</router-link></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="tw-footer__bottom">
      <p class="tw-footer__copyright">
        &copy; {{ currentYear }} eBetStream. {{ $t('footer.allRightsReserved', 'All rights reserved.') }}
      </p>
      <div class="tw-footer__badges">
        <span>18+</span>
        <span>{{ $t('footer.responsibleGaming', 'Responsible Gaming') }}</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.tw-footer {
  background: rgb(var(--p2));
  border-top: 1px solid rgb(var(--n2));
  margin-top: 40px;
}

.tw-footer__inner {
  display: flex;
  gap: 48px;
  padding: 40px 24px 32px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 32px;
  }
}

/* Brand */
.tw-footer__brand {
  flex: 0 0 220px;

  @media (max-width: 768px) { flex: none; }
}

.tw-footer__logo {
  display: block;
  font-size: 20px;
  font-weight: 800;
  color: rgb(var(--n8));
  margin-bottom: 10px;
  letter-spacing: -0.5px;
}

.tw-footer__tagline {
  font-size: 13px;
  color: rgb(var(--n3));
  line-height: 1.6;
  margin: 0;
}

/* Links grid */
.tw-footer__links {
  display: flex;
  gap: 40px;
  flex: 1;
  flex-wrap: wrap;
}

.tw-footer__col {
  min-width: 120px;

  h6 { margin: 0 0 12px; }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  a {
    font-size: 13px;
    color: rgb(var(--n3));
    text-decoration: none;
    transition: color 0.15s;

    &:hover { color: rgb(var(--n8)); }
  }
}

.tw-footer__col-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgb(var(--n8));
}

/* Bottom bar */
.tw-footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid rgb(var(--n2));
  flex-wrap: wrap;
  gap: 12px;
}

.tw-footer__copyright {
  font-size: 12px;
  color: rgb(var(--n3));
  margin: 0;
}

.tw-footer__badges {
  display: flex;
  gap: 8px;

  span {
    font-size: 11px;
    font-weight: 600;
    color: rgb(var(--n3));
    border: 1px solid rgb(var(--n2));
    padding: 2px 8px;
    border-radius: 3px;
  }
}
</style>
