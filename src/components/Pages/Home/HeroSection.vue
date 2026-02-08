<template>
  <section class="top_hero">
    <div class="top_hero__main">
      <swiper
        class="hero_swiper"
        :modules="[Autoplay, Pagination]"
        :autoplay="{ delay: 5000, disableOnInteraction: false }"
        :pagination="{ clickable: true, dynamicBullets: true }"
        :speed="1000"
        loop
      >
        <!-- Slide 1: Welcome to EBETSTREAM -->
        <swiper-slide>
          <div class="hero_slide hero_slide_1" :style="{ backgroundImage: `url(${bg11})` }">
            <div class="hero_overlay_dark"></div>
            <div class="row h-100 align-items-center gx-0">
              <div class="col-lg-8 col-md-10 px-0 mx-auto">
                <div class="hero_content text-center">
                  <h2 class="hero_subtitle_title mb-3">Gaming becomes a spectacle</h2>
                  <h1 class="hero_title mb-4">
                    Welcome to <span class="text_gradient">EBETSTREAM</span>
                  </h1>
                  <p class="hero_subtitle mb-4">
                    One platform to compete, stream your matches live, and bet between players.<br />
                    Here, every game matters and every victory can earn you rewards.
                  </p>
                  <div class="hero_actions d-flex flex-wrap gap-3 justify-content-center">
                    <router-link to="/" class="btn_primary text-decoration-none">
                      <span>Discover EBETSTREAM</span>
                      <i class="fas fa-arrow-right ms-2"></i>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>

        <!-- Slide 2: Play. Challenge. Rise. -->
        <swiper-slide>
          <div class="hero_slide hero_slide_2" :style="{ backgroundImage: `url(${bg12})` }">
            <div class="hero_overlay_dark"></div>
            <div class="row h-100 align-items-center gx-0">
              <div class="col-lg-8 col-md-10 px-0 mx-auto">
                <div class="hero_content text-center">
                  <h2 class="hero_subtitle_title mb-3">Structured championships by divisions</h2>
                  <h1 class="hero_title mb-4">
                    Play. Challenge. <span class="text_gradient">Rise.</span>
                  </h1>
                  <p class="hero_subtitle mb-4">
                    Register your team, choose your division, and face the best players.<br />
                    Climb the ranks, gain visibility, and unlock greater rewards.
                  </p>
                  <div class="hero_actions d-flex flex-wrap gap-3 justify-content-center">
                    <router-link to="/tournaments" class="btn_primary text-decoration-none">
                      <span>Join a Championship</span>
                      <i class="fas fa-trophy ms-2"></i>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
                    </div>
        </swiper-slide>

        <!-- Slide 3: Every match goes live -->
        <swiper-slide>
          <div class="hero_slide hero_slide_3" :style="{ backgroundImage: `url(${bg13})` }">
            <div class="hero_overlay_dark"></div>
            <div class="row h-100 align-items-center gx-0">
              <div class="col-lg-8 col-md-10 px-0 mx-auto">
                <div class="hero_content text-center">
                  <h2 class="hero_subtitle_title mb-3">Your talent deserves an audience</h2>
                  <h1 class="hero_title mb-4">
                    Every match goes <span class="text_gradient">live</span>
                  </h1>
                  <p class="hero_subtitle mb-4">
                    Stream your matches live, interact with viewers, and enjoy a unique interactive experience.
                  </p>
                  <div class="hero_actions d-flex flex-wrap gap-3 justify-content-center">
                    <a href="/streams" class="btn_primary">
                      <span>👉 Start Streaming</span>
                      <i class="fas fa-video ms-2"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>

        <!-- Slide 4: Turn play into profit -->
        <swiper-slide>
          <div class="hero_slide hero_slide_4" :style="{ backgroundImage: `url(${bg14})` }">
            <div class="hero_overlay_dark"></div>
            <div class="row h-100 align-items-center gx-0">
              <div class="col-lg-8 col-md-10 px-0 mx-auto">
                <div class="hero_content text-center">
                  <h2 class="hero_subtitle_title mb-3">Bet between players, securely</h2>
                  <h1 class="hero_title mb-4">
                    Turn play into <span class="text_gradient">profit</span>
                  </h1>
                  <p class="hero_subtitle mb-4">
                    Bet on matches, create challenges, and win based on your performance.<br />
                    A clear, secure, and transparent system for fair competition.
                  </p>
                  <div class="hero_actions d-flex flex-wrap gap-3 justify-content-center">
                    <router-link to="/create-acount" class="btn_primary text-decoration-none">
                      <span>👉 Create My Account</span>
                      <i class="fas fa-user-plus ms-2"></i>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Pagination } from "swiper/modules";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import "swiper/css";
import "swiper/css/pagination";

import bg11 from "@/assets/images/bg11.jpeg";
import bg12 from "@/assets/images/bg12.jpeg";
import bg13 from "@/assets/images/bg13.jpeg";
import bg14 from "@/assets/images/bg14.jpeg";

const router = useRouter();
const { t } = useI18n();

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<style scoped>
/* Hero Section Styles */
.top_hero {
  position: relative;
  width: 100%;
}

.top_hero__main {
  position: relative;
  width: 100%;
  padding: 0 15px;
}

.hero_swiper {
  width: 100%;
  min-height: 520px;
  height: auto;
  border-radius: 24px;
  overflow: hidden;
}

.hero_slide {
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 3rem 2rem;
  min-height: 520px;
}

.hero_slide_1,
.hero_slide_2,
.hero_slide_3,
.hero_slide_4 {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.hero_overlay_dark {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(10, 14, 39, 0.85) 0%, rgba(26, 31, 58, 0.75) 100%);
  z-index: 1;
}

.hero_content {
  position: relative;
  z-index: 3;
  color: white;
  padding: 1rem 0;
}

.hero_subtitle_title {
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  font-weight: 600;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 1rem;
}

.hero_badge {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 8px 20px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.hero_title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
}

.text_gradient {
  background: linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
}

.hero_subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.6;
  opacity: 0.95;
  max-width: 600px;
  margin-bottom: 1.5rem;
}

.btn_primary,
.btn_secondary {
  padding: 14px 28px;
  border-radius: 50px;
  font-weight: 600;
  font-size: clamp(14px, 2vw, 16px);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.btn_primary {
  background: #FFD700;
  color: #1a1f3a;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.btn_primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
}

.btn_secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
}

.btn_secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
}

.hero_actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.hero_features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.feature_item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: clamp(0.9rem, 2vw, 1rem);
  font-weight: 500;
}

.feature_item i {
  color: #43e97b;
  font-size: 1.2rem;
}

.hero_image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 520px;
  padding: 1rem;
}

.floating_card {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.card_icon {
  font-size: 3rem;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
}

.card_content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card_label {
  font-size: 0.9rem;
  opacity: 0.9;
  font-weight: 500;
  color: white;
}

.card_value {
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
}

:deep(.swiper-pagination) {
  bottom: 30px !important;
  z-index: 10;
}

:deep(.swiper-pagination-bullet) {
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 1;
  transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
  width: 40px;
  border-radius: 6px;
  background: white;
}

/* Responsive Styles */
@media (max-width: 991px) {
  .top_hero__main {
    margin: 0;
    padding: 0 10px;
    padding-top: 100px;
  }

  .hero_swiper {
    min-height: 450px;
  }

  .hero_slide {
    padding: 2rem 1.5rem;
    min-height: 450px;
  }

  .hero_image {
    min-height: 250px;
    padding: 1rem;
  }

  .floating_card {
    padding: 1.5rem;
    gap: 1rem;
  }

  .card_icon {
    font-size: 2.5rem;
  }

  .card_value {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .top_hero__main {
    padding: 0 15px;
    padding-top: 90px;
  }

  .hero_swiper {
    min-height: 400px;
    border-radius: 16px;
  }

  .hero_slide {
    padding: 2rem 1rem;
    min-height: 400px;
    flex-direction: column;
  }

  .hero_content {
    padding: 0;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .hero_subtitle {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }

  .hero_actions {
    justify-content: center;
  }

  .hero_features {
    align-items: center;
  }

  .hero_image {
    min-height: 200px;
    padding: 0.5rem;
  }

  .floating_card {
    padding: 1rem 1.25rem;
    gap: 0.75rem;
    margin: 0.5rem 0;
  }

  .card_icon {
    font-size: 2rem;
  }

  .card_value {
    font-size: 1.25rem;
  }

  .card_label {
    font-size: 0.8rem;
  }

  :deep(.swiper-pagination) {
    bottom: 15px !important;
  }
}

@media (max-width: 480px) {
  .top_hero__main {
    padding: 0 10px;
    padding-top: 80px;
  }

  .hero_swiper {
    min-height: 380px;
    border-radius: 12px;
  }

  .hero_slide {
    padding: 1.5rem 0.75rem;
    min-height: 380px;
  }

  .hero_title {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }

  .hero_subtitle {
    font-size: 0.95rem;
    margin-bottom: 1rem;
  }

  .btn_primary,
  .btn_secondary {
    padding: 12px 24px;
    font-size: 14px;
  }

  .hero_image {
    min-height: 180px;
  }

  .floating_card {
    padding: 0.75rem 1rem;
    gap: 0.5rem;
  }

  .card_icon {
    font-size: 1.75rem;
  }

  .card_value {
    font-size: 1.1rem;
  }

  .card_label {
    font-size: 0.75rem;
  }
}
</style>
