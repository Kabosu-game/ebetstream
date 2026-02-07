<template>
  <div class="page-content-with-space">
    <section class="defis_section py-6 position-relative overflow-hidden pb-120">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 gx-0 gx-lg-4">
            <div class="defis__main">
              <ProfileComponent />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import ProfileComponent from "@/components/Pages/Dashboard/Profile.vue";
</script>

<style scoped>
.page-content-with-space {
  padding-top: 90px;
}

.defis_section {
  width: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
}

@media (max-width: 768px) {
  .page-content-with-space {
    padding-top: 60px;
  }
}
</style>


