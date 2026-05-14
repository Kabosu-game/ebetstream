<template>
  <div class="pay_method__paymethod p-4 p-lg-6 p2-bg rounded-8">
    <div
      class="pay_method__paymethod-title d-flex align-items-center gap-3 mb-6 mb-md-8"
    >
      <IconBellRinging width="28" height="28" class="fs-four" />
      <h5 class="n10-color">{{ $t('ui.notifications_settings') }}</h5>
    </div>
    <div
      class="pay_method__Notiitem d-flex align-items-center gap-3 justify-content-between align-items-center pb-5 pb-md-6 mb-5 mb-md-6"
    >
      <div class="pay_method__Notiitem-text">
        <h6 class="mb-3">{{ $t('ui.email_notifications') }}</h6>
        <span class="fs-seven n4-color"
          >{{ $t('ui.receive_weekly_email_notifications') }}</span
        >
      </div>
      <div class="pay_method__Notiitem-switcher">
        <label class="switch">
          <input type="checkbox" />
          <div class="slider">
            <div class="circle"></div>
          </div>
        </label>
      </div>
    </div>
    <div
      class="pay_method__Notiitem d-flex align-items-center gap-3 justify-content-between align-items-center pb-5 pb-md-6 mb-5 mb-md-6"
    >
      <div class="pay_method__Notiitem-text">
        <h6 class="mb-3">{{ $t('ui.phone_notifications') }}</h6>
        <span class="fs-seven n4-color"
          >{{ $t('ui.receive_weekly_phone_notifications') }}</span
        >
      </div>
      <div class="pay_method__Notiitem-switcher">
        <label class="switch">
          <input type="checkbox" />
          <div class="slider">
            <div class="circle"></div>
          </div>
        </label>
      </div>
    </div>
    <div
      class="pay_method__Notiitem d-flex align-items-center gap-3 justify-content-between align-items-center pb-5 pb-md-6 mb-5 mb-md-6"
    >
      <div class="pay_method__Notiitem-text">
        <h6 class="mb-3">{{ $t('ui.new_tasks') }}</h6>
        <span class="fs-seven n4-color"
          >{{ $t('ui.receive_weekly_new_tasks_notifications') }}</span
        >
      </div>
      <div class="pay_method__Notiitem-switcher">
        <label class="switch">
          <input type="checkbox" />
          <div class="slider">
            <div class="circle"></div>
          </div>
        </label>
      </div>
    </div>
    <div
      class="pay_method__Notiitem d-flex align-items-center gap-3 justify-content-between align-items-center pb-5 pb-md-6 mb-5 mb-md-6"
    >
      <div class="pay_method__Notiitem-text">
        <h6 class="mb-3">{{ $t('ui.billing_and_payments') }}</h6>
        <span class="fs-seven n4-color"
          >{{ $t('ui.lorem_ipsum_dolor_sit_amet_consectetur_id') }}</span
        >
      </div>
      <div class="pay_method__Notiitem-switcher">
        <label class="switch">
          <input type="checkbox" />
          <div class="slider">
            <div class="circle"></div>
          </div>
        </label>
      </div>
    </div>
    <div
      class="pay_method__Notiitem d-flex align-items-center gap-3 justify-content-between align-items-center border-0"
    >
      <div class="pay_method__Notiitem-text">
        <h6 class="mb-3">{{ $t('ui.updates_and_announcements') }}</h6>
        <span class="fs-seven n4-color"
          >{{ $t('ui.lorem_ipsum_dolor_sit_amet_consectetur') }}</span
        >
      </div>
      <div class="pay_method__Notiitem-switcher">
        <label class="switch">
          <input type="checkbox" />
          <div class="slider">
            <div class="circle"></div>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

</script>

<style scoped></style>
