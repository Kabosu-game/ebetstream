<template>
  <footer class="footer_section p2-bg">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 gx-0 gx-lg-4">
          <div class="top10__main">
            <!-- Main Footer Content -->
            <div class="row w-100 py-10 py-md-12 py-lg-15">
              <!-- Brand Column -->
              <div class="col-lg-4 col-md-6 mb-8 mb-lg-0">
                <div class="footer_section__brand">
                  <h3 class="mb-4 n8-color fw-bold">eBetStream</h3>
                  <p class="fs-ten n4-color mb-0">
                    {{ $t('footer.description') }}
                  </p>
                </div>
              </div>

              <!-- Quick Links -->
              <div class="col-lg-2 col-md-3 col-sm-6 mb-8 mb-lg-0">
                <div class="footer_section__links">
                  <h5 class="mb-4 mb-md-5 n8-color fw-semibold">{{ $t('footer.company') }}</h5>
                  <ul class="list-unstyled d-flex flex-column gap-3">
                    <li>
                      <router-link to="/about" class="fs-ten n4-color text-decoration-none footer-link">
                        {{ $t('footer.aboutUs') }}
                      </router-link>
                    </li>
                    <li>
                      <router-link to="/contact" class="fs-ten n4-color text-decoration-none footer-link">
                        {{ $t('footer.contact') }}
                      </router-link>
                    </li>
                    <li>
                      <router-link to="/careers" class="fs-ten n4-color text-decoration-none footer-link">
                        {{ $t('footer.careers') }}
                      </router-link>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Legal Links -->
              <div class="col-lg-2 col-md-3 col-sm-6 mb-8 mb-lg-0">
                <div class="footer_section__links">
                  <h5 class="mb-4 mb-md-5 n8-color fw-semibold">{{ $t('footer.legal') }}</h5>
                  <ul class="list-unstyled d-flex flex-column gap-3">
                    <li>
                      <router-link to="/privacy" class="fs-ten n4-color text-decoration-none footer-link">
                        {{ $t('footer.privacy') }}
                      </router-link>
                    </li>
                    <li>
                      <router-link to="/terms" class="fs-ten n4-color text-decoration-none footer-link">
                        {{ $t('footer.terms') }}
                      </router-link>
                    </li>
                    <li>
                      <router-link to="/cookies" class="fs-ten n4-color text-decoration-none footer-link">
                        {{ $t('footer.cookies') }}
                      </router-link>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Support Links -->
              <div class="col-lg-2 col-md-3 col-sm-6 mb-8 mb-lg-0">
                <div class="footer_section__links">
                  <h5 class="mb-4 mb-md-5 n8-color fw-semibold">{{ $t('footer.support') }}</h5>
                  <ul class="list-unstyled d-flex flex-column gap-3">
                    <li>
                      <router-link to="/help" class="fs-ten n4-color text-decoration-none footer-link">
                        {{ $t('footer.help') }}
                      </router-link>
                    </li>
                    <li>
                      <router-link to="/faq" class="fs-ten n4-color text-decoration-none footer-link">
                        {{ $t('footer.faq') }}
                      </router-link>
                    </li>
                    <li>
                      <router-link to="/support" class="fs-ten n4-color text-decoration-none footer-link">
                        {{ $t('footer.supportCenter') }}
                      </router-link>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Certifications -->
              <div class="col-lg-2 col-md-3 col-sm-6 mb-8 mb-lg-0">
                <div class="footer_section__links">
                  <h5 class="mb-4 mb-md-5 n8-color fw-semibold">{{ $t('footer.certifications') }}</h5>
                  <ul class="list-unstyled d-flex flex-column gap-3">
                    <li>
                      <router-link to="/become-organizer" class="fs-ten n4-color text-decoration-none footer-link">
                        {{ $t('footer.becomeOrganizer') }}
                      </router-link>
                    </li>
                    <li>
                      <router-link to="/become-referee" class="fs-ten n4-color text-decoration-none footer-link">
                        {{ $t('footer.becomeReferee') }}
                      </router-link>
                    </li>
                    <li>
                      <router-link to="/become-ambassador" class="fs-ten n4-color text-decoration-none footer-link">
                        {{ $t('footer.becomeAmbassador') }}
                      </router-link>
                    </li>
                    <li>
                      <router-link to="/become-agent" class="fs-ten n4-color text-decoration-none footer-link">
                        {{ $t('footer.becomeAgent') }}
                      </router-link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Bottom Bar -->
            <div class="row w-100 border-top border-four pt-6 pb-6">
              <div class="col-12">
                <div class="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
                  <div class="footer_section__copyright">
                    <p class="fs-ten n4-color mb-0">
                      &copy; {{ currentYear }} eBetStream. {{ $t('footer.allRightsReserved') }}
                    </p>
                  </div>
                  <div class="footer_section__badges d-flex align-items-center gap-3">
                    <span class="fs-ten n4-color px-3 py-1 border border-four rounded-2">18+</span>
                    <span class="fs-ten n4-color px-3 py-1 border border-four rounded-2">{{ $t('footer.responsibleGaming') }}</span>
                  </div>
                  </div>
                  </div>
            </div>
          </div>
        </div>
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

<style>
.footer_section {
  overflow: hidden;
}

.footer-link {
  transition: all 0.3s ease;
}

.footer-link:hover {
  color: rgba(var(--g1), 1) !important;
  padding-left: 4px;
}

.footer_section__brand h3 {
  font-size: 1.5rem;
  letter-spacing: -0.5px;
}
</style>
