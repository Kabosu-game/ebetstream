<template>
  <!-- Hero Section -->
  <section class="hero_section py-0 position-relative overflow-hidden">
    <div class="hero_overlay py-6"></div>
    <swiper
      class="hero_swiper"
      :modules="[Autoplay, Pagination, EffectFade]"
      :effect="'fade'"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false,
      }"
      :pagination="{
        clickable: true,
        dynamicBullets: true,
      }"
      :speed="1000"
      loop
    >
      <!-- Slide 1: Cotes Boostées -->
      <swiper-slide>
        <div class="hero_slide hero_slide_1">
          <div class="container-fluid">
            <div class="row">
              <div class="col-12 gx-0 gx-lg-4">
                <div class="top_matches__main">
                  <div class="row w-100">
                    <div class="col-12">
                      <div class="row h-100 align-items-center">
                        <div class="col-lg-6 col-md-7">
                          <div class="hero_content" data-aos="fade-right">
                  <span class="hero_badge mb-3 d-inline-block">
                    <i class="fas fa-fire me-2"></i>EXCLUSIVE OFFER
                  </span>
                  <h1 class="hero_title mb-4">
                    Boosted <span class="text_gradient">Odds</span><br />
                    up to 200%
                  </h1>
                  <p class="hero_subtitle mb-5">
                    Enjoy exceptional odds on weekend matches.
                    Maximize your winnings with our exclusive promotions.
                  </p>
                  <div class="hero_actions d-flex flex-wrap gap-3">
                    <button class="btn_primary">
                      <span>Bet Now</span>
                      <i class="fas fa-arrow-right ms-2"></i>
                    </button>
                    <button class="btn_secondary">
                      <i class="fas fa-play me-2"></i>
                      <span>View Matches</span>
                    </button>
                  </div>
                </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-5 d-none d-md-block">
            <div class="hero_image" data-aos="fade-left">
                  <div class="floating_card card_1">
                    <div class="card_icon">⚽</div>
                    <div class="card_content">
                      <span class="card_label">Boosted Odds</span>
                      <span class="card_value">2.50 → 5.00</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </swiper-slide>

      <!-- Slide 2: Welcome Bonus -->
      <swiper-slide>
        <div class="hero_slide hero_slide_2">
          <div class="container-fluid">
            <div class="row">
              <div class="col-12 gx-0 gx-lg-4">
                <div class="top_matches__main">
                  <div class="row w-100">
                    <div class="col-12">
                      <div class="row h-100 align-items-center">
                        <div class="col-lg-6 col-md-7">
                          <div class="hero_content" data-aos="fade-right">
                  <span class="hero_badge mb-3 d-inline-block">
                    <i class="fas fa-gift me-2"></i>NEW PLAYER
                  </span>
                  <h1 class="hero_title mb-4">
                    Welcome <span class="text_gradient">Bonus</span><br />
                    100 EBT Offered
                  </h1>
                  <p class="hero_subtitle mb-5">
                    Sign up now and receive 100 EBT bonus on your
                    first deposit. Start winning today!
                  </p>
                  <div class="hero_actions d-flex flex-wrap gap-3">
                    <button class="btn_primary">
                      <span>Create Account</span>
                      <i class="fas fa-user-plus ms-2"></i>
                    </button>
                    <button class="btn_secondary">
                      <i class="fas fa-info-circle me-2"></i>
                      <span>Learn More</span>
                    </button>
                  </div>
                  <div class="hero_stats mt-5">
                    <div class="stat_item">
                      <h3 class="stat_value">50K+</h3>
                      <p class="stat_label">Active Bettors</p>
                    </div>
                    <div class="stat_item">
                      <h3 class="stat_value">98%</h3>
                      <p class="stat_label">Satisfaction Rate</p>
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
          <div class="col-lg-6 col-md-5 d-none d-md-block">
            <div class="hero_image" data-aos="fade-left">
                  <div class="floating_card card_2">
                    <div class="card_icon">🎁</div>
                    <div class="card_content">
                      <span class="card_label">Bonus</span>
                      <span class="card_value">100 EBT</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </swiper-slide>

      <!-- Slide 3: Live Betting -->
      <swiper-slide>
        <div class="hero_slide hero_slide_3">
          <div class="container-fluid">
            <div class="row">
              <div class="col-12 gx-0 gx-lg-4">
                <div class="top_matches__main">
                  <div class="row w-100">
                    <div class="col-12">
                      <div class="row h-100 align-items-center">
                        <div class="col-lg-6 col-md-7">
                          <div class="hero_content" data-aos="fade-right">
                  <span class="hero_badge mb-3 d-inline-block">
                    <i class="fas fa-bolt me-2"></i>LIVE
                  </span>
                  <h1 class="hero_title mb-4">
                    Live <span class="text_gradient">Betting</span><br />
                    in Real Time
                  </h1>
                  <p class="hero_subtitle mb-5">
                    Bet during the match with odds that evolve in real
                    time. Experience the adrenaline of live betting!
                  </p>
                  <div class="hero_actions d-flex flex-wrap gap-3">
                    <button class="btn_primary">
                      <span>Live Matches</span>
                      <i class="fas fa-broadcast-tower ms-2"></i>
                    </button>
                    <button class="btn_secondary">
                      <i class="fas fa-calendar me-2"></i>
                      <span>Schedule</span>
                    </button>
                  </div>
                  <div class="live_matches mt-5">
                    <a href="/streams" class="live_match_item text-center p-3 d-block text-decoration-none" style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; border: 1px solid rgba(255, 159, 0, 0.3); transition: 0.3s;">
                      <span class="text-white">
                        <i class="fas fa-video me-2"></i>
                        Regarder les streams en direct
                      </span>
                    </a>
                  </div>
                </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-5 d-none d-md-block">
            <div class="hero_image" data-aos="fade-left">
                  <div class="floating_card card_3">
                    <div class="card_icon">📡</div>
                    <div class="card_content">
                      <span class="card_label">Live</span>
                      <span class="card_value">120+ Matches</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </swiper-slide>

      <!-- Slide 4: Cash Out -->
      <swiper-slide>
        <div class="hero_slide hero_slide_4">
          <div class="container-fluid">
            <div class="row">
              <div class="col-12 gx-0 gx-lg-4">
                <div class="top_matches__main">
                  <div class="row w-100">
                    <div class="col-12">
                      <div class="row h-100 align-items-center">
                        <div class="col-lg-6 col-md-7">
                          <div class="hero_content" data-aos="fade-right">
                  <span class="hero_badge mb-3 d-inline-block">
                    <i class="fas fa-shield-alt me-2"></i>SÉCURISÉ
                  </span>
                  <h1 class="hero_title mb-4">
                    <span class="text_gradient">Cash Out</span><br />
                    Sécurisez vos Gains
                  </h1>
                  <p class="hero_subtitle mb-5">
                    Récupérez votre mise à tout moment ! Avec notre fonction Cash
                    Out, vous contrôlez vos paris et sécurisez vos gains.
                  </p>
                  <div class="hero_actions d-flex flex-wrap gap-3">
                    <button class="btn_primary">
                      <span>Découvrir Cash Out</span>
                      <i class="fas fa-money-bill-wave ms-2"></i>
                    </button>
                    <button class="btn_secondary">
                      <i class="fas fa-question-circle me-2"></i>
                      <span>Comment ça marche</span>
                    </button>
                  </div>
                  <div class="hero_features mt-5">
                    <div class="feature_item">
                      <i class="fas fa-check-circle"></i>
                      <span>Paiement Instantané</span>
                    </div>
                    <div class="feature_item">
                      <i class="fas fa-check-circle"></i>
                      <span>Disponible 24/7</span>
                    </div>
                    <div class="feature_item">
                      <i class="fas fa-check-circle"></i>
                      <span>100% Secure</span>
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
          <div class="col-lg-6 col-md-5 d-none d-md-block">
            <div class="hero_image" data-aos="fade-left">
                  <div class="floating_card card_4">
                    <div class="card_icon">💰</div>
                    <div class="card_content">
                      <span class="card_label">Cash Out</span>
                      <span class="card_value">Instantané</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </section>

  <!-- Top Matches Section -->
  <section class="top_matches py-6">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 gx-0 gx-sm-4">
          <div class="top_matches__main">
            <div class="row w-100">
              <div class="col-12">
                <div class="live-playing2">
                  <div class="hero_area__topslider swiper-wrapper">
                    <swiper
                      class="slider_hero"
                      loop
                      :speed="5000"
                      :autoplay="{
                        delay: 0,
                      }"
                      :modules="[Autoplay]"
                      :breakpoints="{
                        0: {
                          slidesPerView: 1,
                        },
                        480: {
                          slidesPerView: 1.5,
                          spaceBetween: 20,
                        },
                        575: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        991: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        1499: {
                          slidesPerView: 3,
                          spaceBetween: 24,
                        },
                        1799: {
                          slidesPerView: 3.5,
                          spaceBetween: 24,
                        },
                      }"
                    >
                      <swiper-slide>
                        <div class="hero_area__topslider-card swiper-slide p-4 p-md-6">
                          <div class="hero_area__topslider-cardtop text-center mb-4 mb-md-6">
                            <span class="fs-ten d-block mb-1">Stamford Bridge</span>
                            <span class="n3-color cpoint">Week 10</span>
                          </div>
                          <div class="hero_area__topslider-cardbody d-flex align-items-center justify-content-between mb-4 mb-md-6">
                            <div class="hero_area__topslider-flag d-center flex-column">
                              <img class="mb-2" :src="chelsea" width="64" height="64" alt="Icon" />
                              <span class="cpoint fs-seven mb-1">Chelsea</span>
                              <span class="n3-color fs-eight">Home</span>
                            </div>
                            <div class="hero_area__topslider-scr">
                              <h3 class="mb-2">1 : 1</h3>
                              <span class="fs-seven py-1 px-2 rounded-5 cpoint">90+4</span>
                            </div>
                            <div class="hero_area__topslider-flag text-end d-flex flex-column justify-content-center align-items-center">
                              <img class="mb-2" :src="manUtd" width="64" height="64" alt="Icon" />
                              <span class="cpoint fs-seven mb-1">Man Utd</span>
                              <span class="n3-color fs-eight">Away</span>
                            </div>
                          </div>
                        </div>
                      </swiper-slide>
                    </swiper>
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
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import chelsea from "@/assets/images/icon/chelsea.png";
import manUtd from "@/assets/images/icon/man-utd.png";
</script>

<style scoped>
/* Hero Section */
.hero_section {
  min-height: 600px;
  height: 80vh;
  position: relative;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
}

.hero_overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 1;
}

.hero_swiper {
  height: 100%;
  width: 100%;
  z-index: 2;
}

.hero_slide {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 60px 0;
}

/* Slide Backgrounds */
.hero_slide_1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero_slide_2 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.hero_slide_3 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.hero_slide_4 {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

/* Hero Content */
.hero_content {
  position: relative;
  z-index: 3;
  color: white;
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
  font-size: clamp(2.5rem, 5vw, 4rem);
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
  font-size: 1.25rem;
  line-height: 1.6;
  opacity: 0.95;
  max-width: 600px;
}

/* Buttons */
.btn_primary,
.btn_secondary {
  padding: 16px 32px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn_primary {
  background: white;
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

/* Stats */
.hero_stats {
  display: flex;
  gap: 3rem;
}

.stat_item {
  text-align: left;
}

.stat_value {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat_label {
  font-size: 0.95rem;
  opacity: 0.9;
  margin: 0;
}

/* Live Matches */
.live_matches {
  display: flex;
  gap: 1rem;
}

.live_match_item {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 12px 20px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.live_indicator {
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.match_info {
  font-size: 0.95rem;
  font-weight: 600;
}

/* Features */
.hero_features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature_item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  font-weight: 500;
}

.feature_item i {
  color: #43e97b;
  font-size: 1.2rem;
}

/* Floating Cards */
.hero_image {
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating_card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem;
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
}

.card_value {
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
}

/* Pagination */
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

/* Responsive */
@media (max-width: 768px) {
  .hero_section {
    min-height: 500px;
    height: auto;
  }

  .hero_swiper {
    height: auto;
    min-height: 500px;
  }

  .hero_slide {
    padding: 40px 0;
  }

  .hero_title {
    font-size: 2rem;
  }

  .hero_subtitle {
    font-size: 1rem;
  }

  .hero_stats {
    flex-direction: column;
    gap: 1.5rem;
  }

  .btn_primary,
  .btn_secondary {
    padding: 14px 24px;
    font-size: 14px;
  }

  .hero_features {
    gap: 0.75rem;
  }

  .feature_item {
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .hero_actions {
    flex-direction: column;
    width: 100%;
  }

  .btn_primary,
  .btn_secondary {
    width: 100%;
  }
}
</style>