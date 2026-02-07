<template>
  <!-- Section Call To Action -->
  <section class="top10_section py-6 position-relative overflow-hidden">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 gx-0 gx-lg-4">
          <div class="top10__main">
            <div class="row w-100">
              <div class="col-12">
                <div class="row h-100 align-items-center">
                  
                  <!-- Colonne texte -->
                  <div class="col-lg-6 col-md-7">
                    <div class="top10_content" data-aos="fade-right">
                      <span class="hero_badge mb-3 d-inline-block">
                        <i class="fas fa-rocket me-2"></i>Ready for Adventure
                      </span>
                      <h2 class="hero_title mb-4">
                        Join millions of players in the <span class="text_gradient">eBetStream</span> universe
                      </h2>
                    
                      <div class="hero_actions d-flex flex-wrap gap-3">
                        <router-link to="/create-acount" class="btn_primary btn-lg text-decoration-none">
                          <span>Sign Up Now</span>
                          <i class="fas fa-arrow-right ms-2"></i>
                        </router-link>
                        <router-link to="/pubg-mobile" class="btn_secondary btn-lg text-decoration-none">
                          <i class="fas fa-info-circle me-2"></i>
                          <span>Discover More</span>
                        </router-link>
                      </div>
                    </div>
                  </div>

                  <!-- Colonne illustration / floating card 🚀 -->
                  <div class="col-lg-6 col-md-5 d-none d-md-block">
                    <div class="top10_image" data-aos="fade-left">
                      <div class="floating_card card_top10">
                        <div class="card_icon">🚀</div>
                        <div class="card_content">
                          <span class="card_label">Adventure</span>
                          <span class="card_value">Cyber Gaming</span>
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
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<style scoped>
.top10_section {
  width: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
}

.top10_content {
  color: white;
}

.hero_actions .btn_primary, .hero_actions .btn_secondary {
  font-size: 1rem;
  font-weight: 600;
  padding: 0.8rem 2rem;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hero_actions .btn_primary {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #0a0e27;
}

.hero_actions .btn_primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(255, 215, 0, 0.5);
}

.hero_actions .btn_secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #FFD700;
  border: 1px solid #FFD700;
}

.hero_actions .btn_secondary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(255, 215, 0, 0.3);
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
}

.card_icon {
  font-size: 3rem;
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
</style>
