<template>
  <!-- Section EbetStar -->
  <section class="defis_section py-6 position-relative overflow-hidden">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 gx-0 gx-lg-4">
          <div class="defis__main">
            <div class="row h-100 align-items-center">
              <!-- Colonne texte -->
              <div class="col-lg-6 col-md-7">
                <div class="defis_content" data-aos="fade-right">
                  <span class="hero_badge mb-3 d-inline-block">🌟 Joueurs EbetStar</span>
                  <h2 class="hero_title mb-4">
                    Découvrez nos <span class="text_gradient">Meilleurs Joueurs</span><br />
                    et leurs statistiques !
                  </h2>
                  <p class="hero_subtitle mb-5">
                    Suivez les performances de nos joueurs et voyez qui domine la plateforme.
                  </p>
                  <div class="hero_actions d-flex flex-wrap gap-3">
                    <button class="btn_primary">
                      <span>Voir tous les joueurs</span>
                      <i class="fas fa-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Colonne image / carte -->
              <div class="col-lg-6 col-md-5 d-none d-md-block">
                <div class="defis_image" data-aos="fade-left">
                  <div class="floating_card card_defis">
                    <div class="card_icon">🎮</div>
                    <div class="card_content">
                      <span class="card_label">Top Player</span>
                      <span class="card_value">EbetStar</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Liste des joueurs -->
            <div class="row mt-5 g-4">
              <div v-for="(joueur, index) in joueurs" :key="index" class="col-12 col-md-6 col-lg-4">
                <div class="defi_card n11-bg rounded-8 p-4 h-100 d-flex flex-column justify-content-between">
                  
                  <!-- Photo de profil et Nom -->
                  <div class="d-flex align-items-center mb-3">
                    <div class="player_icon me-3">👤</div>
                    <h5 class="fw-bold mb-0">{{ joueur.nom }}</h5>
                  </div>

                  <!-- Jeu préféré -->
                  <div class="mb-3">
                    <span class="fs-eight n10-color">
                      🎮 Jeu préféré : <strong>{{ joueur.jeu }}</strong>
                    </span>
                  </div>

                  <!-- Statistiques -->
                  <ul class="list-unstyled mb-3 fs-eight">
                    <li class="mb-1">
                      <i class="fas fa-trophy text-success me-2"></i>
                      Victoires : <strong>{{ joueur.victoires }}</strong>
                    </li>
                    <li class="mb-1">
                      <i class="fas fa-skull text-danger me-2"></i>
                      Défaites : <strong>{{ joueur.defaites }}</strong>
                    </li>
                    <li>
                      <i class="fas fa-percentage text-warning me-2"></i>
                      Ratio : <strong>{{ joueur.ratio }}</strong>
                    </li>
                  </ul>

                  <div class="text-end mt-auto">
                    <button class="btn_see_details rounded-4 fw-semibold px-4 py-2">
                      Voir profil <i class="fas fa-arrow-right ms-2"></i>
                    </button>
                  </div>

                </div>
              </div>
            </div>
            <!-- /Liste des joueurs -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Joueur {
  nom: string
  jeu: string
  victoires: number
  defaites: number
  ratio: string
}

const joueurs: Joueur[] = [
  { nom: "John Doe", jeu: "Efootball", victoires: 30, defaites: 0, ratio: "10,0%" },
  { nom: "Jane Smith", jeu: "Efootball", victoires: 25, defaites: 5, ratio: "8,3%" },
  { nom: "Alex King", jeu: "Efootball", victoires: 40, defaites: 10, ratio: "8,0%" },
  { nom: "Emily Rose", jeu: "Efootball", victoires: 35, defaites: 5, ratio: "7,5%" },
  { nom: "David Black", jeu: "Efootball", victoires: 28, defaites: 2, ratio: "9,3%" },
  { nom: "Sophia White", jeu: "Efootball", victoires: 50, defaites: 0, ratio: "10,0%" },
];
</script>

<style scoped>
/* Même style que DefisP2P.vue */
.defis_section {
  width: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
}

.text_gradient {
  background: linear-gradient(90deg, #FF9F00, #FF9F00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn_primary {
  background-color: #FF9F00;
  color: #000;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.3s;
}
.btn_primary:hover {
  background-color: #FF9F00;
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

/* --- Cartes joueurs --- */
.defi_card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.defi_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.player_icon {
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fs-eight {
  font-size: 0.85rem;
}

.n10-color {
  color: #FF9F00;
}

.btn_see_details {
  background-color: #FF9F00;
  color: #000;
  border: none;
  transition: 0.3s;
}
.btn_see_details:hover {
  background-color: #FF9F00;
}
</style>
