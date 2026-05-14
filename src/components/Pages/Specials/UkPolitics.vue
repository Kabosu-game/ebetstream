<template>
  <section class="top_matches">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 gx-0 gx-sm-4">
          <div class="top_matches__main pt-20">
            <div class="row w-100 pt-md-5 mb-7 mb-md-0">
              <div class="col-12 pe-0">
                <div
                  class="top_matches__title d-flex align-items-center gap-sm-2 mb-4 mb-md-5"
                >
                  <IconCalendarEvent class="fs-three" height="31" width="31" />
                  <h3>{{ $t('ui.outrights_politics') }}</h3>
                  <IconArrowBadgeUp
                    class="fs-four mt-1 cpoint"
                    height="24"
                    width="24"
                  />
                </div>
                <div class="top_matches__content">
                  <div
                    class="top_matches__winnercard p-4 p-sm-5 p-md-6 rounded-3 p2-bg"
                  >
                    <div
                      class="top_matches__winnercard-title d-flex align-items-center gap-2 mb-5 mb-md-6"
                    >
                      <img
                        :src="specials2"
                        width="{30}"
                        height="{30}"
                        alt="Icon"
                      />
                      <div class="top_matches__winnercard-obi">
                        <span class="mb-3 n4-color">Jan 1, 2024, 10:00</span>
                        <h5>
                          UK Politics - Next Permanent Labour Party Leader
                        </h5>
                      </div>
                    </div>
                    <div class="row gy-2">
                      <div class="col-sm-6 col-xl-4">
                        <div class="top_matches__winnercard-sctn w-100">
                          <div
                            class="top_matches__winnercard-singe d-flex align-items-center justify-content-between n11-bg rounded-2 py-2 px-3 mb-2"
                          >
                            <span>{{ $t('ui.burnham_andy') }}</span>
                            <span>4.5</span>
                          </div>
                          <div
                            class="top_matches__winnercard-singe d-flex align-items-center justify-content-between n11-bg rounded-2 py-2 px-3 mb-2"
                          >
                            <span>{{ $t('ui.nandy_lisa') }}</span>
                            <span>7.5</span>
                          </div>
                          <div
                            class="top_matches__winnercard-singe d-flex align-items-center justify-content-between n11-bg rounded-2 py-2 px-3"
                          >
                            <span>{{ $t('ui.phillipson_bridget') }}</span>
                            <span>1000.0</span>
                          </div>
                        </div>
                      </div>
                      <div class="col-sm-6 col-xl-4">
                        <div class="top_matches__winnercard-sctn w-100">
                          <div
                            class="top_matches__winnercard-singe d-flex align-items-center justify-content-between n11-bg rounded-2 py-2 px-3 mb-2"
                          >
                            <span>{{ $t('ui.streeting_wes') }}</span>
                            <span>6.5</span>
                          </div>
                          <div
                            class="top_matches__winnercard-singe d-flex align-items-center justify-content-between n11-bg rounded-2 py-2 px-3 mb-2"
                          >
                            <span>{{ $t('ui.rayner_angela') }}</span>
                            <span>8.0</span>
                          </div>
                          <div
                            class="top_matches__winnercard-singe d-flex align-items-center justify-content-between n11-bg rounded-2 py-2 px-3"
                          >
                            <span>{{ $t('ui.jarvis_dan') }}</span>
                            <span>-</span>
                          </div>
                        </div>
                      </div>
                      <div class="col-sm-6 col-xl-4">
                        <div class="top_matches__winnercard-sctn w-100">
                          <div
                            class="top_matches__winnercard-singe d-flex align-items-center justify-content-between n11-bg rounded-2 py-2 px-3 mb-2"
                          >
                            <span>{{ $t('ui.reeves_rachel') }}</span>
                            <span>6.5</span>
                          </div>
                          <div
                            class="top_matches__winnercard-singe d-flex align-items-center justify-content-between n11-bg rounded-2 py-2 px-3 mb-2"
                          >
                            <span>{{ $t('ui.cooper_yvette') }}</span>
                            <span>8.0</span>
                          </div>
                          <div
                            class="top_matches__winnercard-singe d-flex align-items-center justify-content-between n11-bg rounded-2 py-2 px-3"
                          >
                            <span>{{ $t('ui.miliband_david') }}</span>
                            <span>23.0</span>
                          </div>
                        </div>
                      </div>
                      <div class="col-12">
                        <div
                          class="top_matches__winnercard-singe d-flex align-items-center justify-content-center n11-bg rounded-2 py-1 px-3 mb-2 gap-2 mt-2"
                        >
                          <span class="cpoint">{{ $t('common.show_more') }}</span>
                          <i class="ti ti-arrow-badge-down cpoint mt-1"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import specials2 from "@/assets/images/icon/specials2.png";
</script>

<style scoped></style>
