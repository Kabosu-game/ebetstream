<template>
  <div class="tw-page">
    <!-- Hero -->
    <div class="tw-page-hero">
      <div class="careers-eyebrow">
        <i class="fas fa-briefcase"></i> Careers
      </div>
      <h1 class="tw-page-hero__title">Join Our <span class="careers-accent">Team</span></h1>
      <p class="tw-page-hero__sub">
        We are looking for passionate talents to grow our competitive gaming platform.
        If you share our vision, we would love to meet you!
      </p>
    </div>

    <!-- Why Join section -->
    <div class="tw-section-header">
      <div class="tw-section-title">
        <span class="tw-section-icon"><i class="fas fa-star"></i></span>
        Why Join eBetStream?
      </div>
    </div>

    <div class="tw-grid-3">
      <div class="tw-card careers-benefit">
        <span class="careers-benefit__icon"><i class="fas fa-microchip"></i></span>
        <h4 class="tw-card__title">Innovative Environment</h4>
        <p class="tw-card__sub">Work on cutting-edge technologies in the gaming industry.</p>
      </div>
      <div class="tw-card careers-benefit">
        <span class="careers-benefit__icon"><i class="fas fa-chart-line"></i></span>
        <h4 class="tw-card__title">Professional Growth</h4>
        <p class="tw-card__sub">Opportunities for advancement and skill development.</p>
      </div>
      <div class="tw-card careers-benefit">
        <span class="careers-benefit__icon"><i class="fas fa-fire"></i></span>
        <h4 class="tw-card__title">Passionate Team</h4>
        <p class="tw-card__sub">Join a team of passionate and motivated gamers.</p>
      </div>
      <div class="tw-card careers-benefit">
        <span class="careers-benefit__icon"><i class="fas fa-globe"></i></span>
        <h4 class="tw-card__title">Real Impact</h4>
        <p class="tw-card__sub">Contribute to shaping the future of competitive gaming.</p>
      </div>
      <div class="tw-card careers-benefit">
        <span class="careers-benefit__icon"><i class="fas fa-home"></i></span>
        <h4 class="tw-card__title">Remote Friendly</h4>
        <p class="tw-card__sub">Flexible work-from-anywhere policy for most positions.</p>
      </div>
      <div class="tw-card careers-benefit">
        <span class="careers-benefit__icon"><i class="fas fa-medal"></i></span>
        <h4 class="tw-card__title">Competitive Pay</h4>
        <p class="tw-card__sub">We reward exceptional talent with market-leading compensation.</p>
      </div>
    </div>

    <!-- Open positions -->
    <div class="tw-section-header" style="margin-top: 2rem;">
      <div class="tw-section-title">
        <span class="tw-section-icon"><i class="fas fa-folder-open"></i></span>
        Open Positions
      </div>
    </div>

    <div class="careers-positions">
      <!-- Full Stack Developer -->
      <div class="tw-card position-card">
        <div class="position-card__header">
          <div>
            <h4 class="position-card__title">Full Stack Developer</h4>
            <div class="position-card__meta">
              <span class="tw-badge position-badge">
                <i class="fas fa-code"></i> Engineering
              </span>
              <span class="position-meta-item">
                <i class="fas fa-map-marker-alt"></i> Remote / Hybrid
              </span>
              <span class="position-meta-item">
                <i class="fas fa-clock"></i> Full-time
              </span>
            </div>
          </div>
          <button class="tw-btn tw-btn--primary position-card__apply">
            <i class="fas fa-paper-plane"></i>
            Apply
          </button>
        </div>
        <p class="position-card__desc">
          We are looking for an experienced developer to join our technical team.
          Proficiency in Vue.js, Laravel, and databases required.
        </p>
      </div>

      <!-- UX/UI Designer -->
      <div class="tw-card position-card">
        <div class="position-card__header">
          <div>
            <h4 class="position-card__title">UX / UI Designer</h4>
            <div class="position-card__meta">
              <span class="tw-badge position-badge">
                <i class="fas fa-paint-brush"></i> Design
              </span>
              <span class="position-meta-item">
                <i class="fas fa-map-marker-alt"></i> Remote / Hybrid
              </span>
              <span class="position-meta-item">
                <i class="fas fa-clock"></i> Full-time
              </span>
            </div>
          </div>
          <button class="tw-btn tw-btn--primary position-card__apply">
            <i class="fas fa-paper-plane"></i>
            Apply
          </button>
        </div>
        <p class="position-card__desc">
          Create exceptional user experiences for our platform.
          Strong portfolio and understanding of competitive gaming essential.
        </p>
      </div>

      <!-- Community Manager -->
      <div class="tw-card position-card">
        <div class="position-card__header">
          <div>
            <h4 class="position-card__title">Community Manager</h4>
            <div class="position-card__meta">
              <span class="tw-badge position-badge">
                <i class="fas fa-users"></i> Community
              </span>
              <span class="position-meta-item">
                <i class="fas fa-map-marker-alt"></i> Remote
              </span>
              <span class="position-meta-item">
                <i class="fas fa-clock"></i> Full-time
              </span>
            </div>
          </div>
          <button class="tw-btn tw-btn--primary position-card__apply">
            <i class="fas fa-paper-plane"></i>
            Apply
          </button>
        </div>
        <p class="position-card__desc">
          Manage our social media presence and engage our community of players.
          Excellent communication and passion for gaming required.
        </p>
      </div>
    </div>

    <!-- CTA -->
    <div class="careers-cta">
      <div class="careers-cta__icon">
        <i class="fas fa-paper-plane"></i>
      </div>
      <h2 class="careers-cta__heading">Don't Find the Perfect Position?</h2>
      <p class="careers-cta__sub">
        Send us your spontaneous application. We always keep an eye on promising talents!
      </p>
      <div class="tw-page-hero__actions">
        <router-link to="/contact" class="tw-btn tw-btn--primary">
          <i class="fas fa-envelope"></i>
          Contact Us
        </router-link>
        <router-link to="/about" class="tw-btn tw-btn--secondary">
          <i class="fas fa-info-circle"></i>
          Learn More
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
/* Eyebrow */
.careers-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgb(var(--g1));
  background: rgba(var(--g1), 0.12);
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  margin-bottom: 1rem;
}

.careers-accent {
  color: rgb(var(--g1));
}

/* Benefit cards */
.careers-benefit {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.25rem;
}

.careers-benefit__icon {
  display: inline-flex;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(var(--g1), 0.12);
  color: rgb(var(--g1));
  font-size: 1.1rem;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
}

/* Positions list */
.careers-positions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.position-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.position-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.position-card__title {
  font-size: 1.05rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0 0 0.5rem;
}

.position-card__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.position-badge {
  font-size: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.position-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: rgb(var(--n3));
}

.position-meta-item i {
  color: rgb(var(--g1));
  font-size: 0.72rem;
}

.position-card__apply {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
}

.position-card__desc {
  font-size: 0.85rem;
  color: rgb(var(--n3));
  line-height: 1.6;
  margin: 0;
  padding-top: 0.25rem;
  border-top: 1px solid rgba(var(--n2), 1);
}

/* CTA */
.careers-cta {
  margin-top: 2.5rem;
  padding: 2.5rem;
  border-radius: 12px;
  background: rgba(var(--g1), 0.08);
  border: 1px solid rgba(var(--g1), 0.2);
  text-align: center;
}

.careers-cta__icon {
  display: inline-flex;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(var(--g1), 0.15);
  color: rgb(var(--g1));
  font-size: 1.4rem;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.careers-cta__heading {
  font-size: 1.4rem;
  font-weight: 800;
  color: rgb(var(--n8));
  margin: 0 0 0.5rem;
}

.careers-cta__sub {
  font-size: 0.9rem;
  color: rgb(var(--n3));
  margin: 0 0 1.5rem;
}
</style>
