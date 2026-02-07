<template>
  <div class="page-content-with-space">
    <!-- Section Partenaires -->
    <section class="defis_section py-6 position-relative overflow-hidden pb-120">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 gx-0 gx-lg-4">
            <div class="defis__main">
              <!-- Header Section -->
              <div class="row h-100 align-items-center mb-5">
                <div class="col-lg-6 col-md-7">
                  <div class="defis_content" data-aos="fade-right">
                    <span class="hero_badge mb-3 d-inline-block">
                      <i class="fas fa-gamepad me-2"></i>Partners
                    </span>
                    <h2 class="hero_title mb-4">
                      Our Developer <span class="text_gradient">Partners</span>
                    </h2>
                    <p class="hero_subtitle mb-5">
                      Discover the game developers who collaborate with us to create unique experiences.
                    </p>
                  </div>
                </div>

                <!-- Colonne image / carte -->
                <div class="col-lg-6 col-md-5 d-none d-md-block">
                  <div class="defis_image" data-aos="fade-left">
                    <div class="floating_card card_defis">
                      <div class="card_icon">🎮</div>
                      <div class="card_content">
                        <span class="card_label">Top 10</span>
                        <span class="card_value">{{ partners.length }} Partners</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Liste des partenaires -->
              <div v-if="loading" class="row mt-5">
                <div class="col-12 text-center py-5">
                  <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
              <div v-else-if="partners.length > 0" class="row mt-5 g-4">
                <div v-for="(partner, index) in partners" :key="partner.id" class="col-12 col-md-6 col-lg-4">
                  <div class="defi_card n11-bg rounded-8 p-4 h-100 d-flex flex-column" 
                       style="cursor: pointer;" 
                       @click="viewPartner(partner.id)">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <span class="partner_rank fw-bold" style="font-size: 1.5rem; color: #FFD700;">
                        #{{ index + 1 }}
                      </span>
                      <a v-if="partner.website" 
                         :href="partner.website" 
                         target="_blank" 
                         class="btn btn-sm btn-warning text-dark fw-bold"
                         @click.stop>
                        <i class="fas fa-external-link-alt me-1"></i>Visit
                      </a>
                    </div>
                    
                    <div class="d-flex align-items-center gap-3 mb-3">
                      <div class="partner_avatar rounded-circle overflow-hidden" 
                           style="width: 60px; height: 60px; flex-shrink: 0; border: 2px solid rgba(255, 255, 255, 0.3);">
                        <img 
                          v-if="partner.avatar_url" 
                          :src="partner.avatar_url" 
                          :alt="partner.name"
                          class="w-100 h-100"
                          style="object-fit: cover;"
                          @error="handleImageError"
                        />
                        <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center" 
                             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                          <i class="fas fa-building text-white fs-4"></i>
                        </div>
                      </div>
                      <div class="flex-grow-1">
                        <h5 class="fw-bold mb-1 text-white">{{ partner.name }}</h5>
                        <p v-if="partner.specialty" class="text-white small mb-0" style="opacity: 0.8;">
                          {{ partner.specialty }}
                        </p>
                      </div>
                    </div>

                    <div v-if="partner.country" class="mb-3">
                      <span class="text-white small" style="opacity: 0.8;">
                        <i class="fas fa-map-marker-alt me-1"></i>{{ partner.country }}
                      </span>
                    </div>

                    <p v-if="partner.bio" class="text-white small mb-0" style="opacity: 0.8; line-height: 1.5;">
                      {{ partner.bio }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-else-if="error" class="row mt-5">
                <div class="col-12 text-center py-5">
                  <div class="alert alert-warning" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
                  </div>
                </div>
              </div>
              <div v-else class="row mt-5">
                <div class="col-12 text-center py-5">
                  <p class="text-white" style="opacity: 0.7;">No partners available at the moment.</p>
                </div>
              </div>
              <!-- /Liste des partenaires -->
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/utils/axios';
import { getStorageUrl } from '@/config/constants';
import { fixImageUrl } from '@/utils/imageFixer';

interface Partner {
  id: number;
  name: string;
  specialty?: string | null;
  website?: string | null;
  avatar?: string | null;
  avatar_url?: string;
  country?: string | null;
  bio?: string | null;
  position?: number;
}

const router = useRouter();
const partners = ref<Partner[]>([]);
const loading = ref(false);
const error = ref('');

// Fonction pour corriger les URLs d'avatar
const correctAvatarUrl = (url: string): string => {
  return fixImageUrl(url);
};

const loadPartners = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const response = await apiClient.get('/partners', {
      params: { limit: 100 } // Récupérer tous les partenaires
    });

    if (response.data.success) {
      // Ensure data is an array
      const data = response.data.data;
      partners.value = Array.isArray(data) ? data : (data?.data || []);
      
      // Format avatar URLs avec correction
      partners.value = partners.value.map((partner: Partner) => {
        const avatarUrl = partner.avatar_url || (partner.avatar ? getStorageUrl(partner.avatar) : undefined);
        return {
          ...partner,
          avatar_url: avatarUrl ? correctAvatarUrl(avatarUrl) : undefined
        };
      });
    } else {
      error.value = response.data.message || 'Error loading partners';
    }
  } catch (err: any) {
    console.error('Error loading partners:', err);
    if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else if (err.isNetworkError) {
      error.value = 'Connection error. Check your internet connection.';
    } else {
      error.value = 'Error loading partners';
    }
  } finally {
    loading.value = false;
  }
};

const viewPartner = (id: number) => {
  router.push(`/partners/${id}`);
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  const partnerName = img.alt || 'Partner';
  img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerName)}&background=667eea&color=fff&size=200`;
  img.onerror = null; // Prevent infinite loop
};

onMounted(() => {
  loadPartners();
});
</script>

<style scoped>
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
  cursor: pointer;
}
.btn_primary:hover {
  background-color: #FF9F00;
  transform: translateY(-2px);
}
.btn_primary.active {
  background-color: #FF9F00;
  box-shadow: 0 4px 15px rgba(255, 159, 0, 0.4);
}

.btn_secondary {
  background: transparent;
  border: 2px solid #FF9F00;
  color: #FF9F00;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.3s;
  cursor: pointer;
}
.btn_secondary:hover {
  background-color: #FF9F00;
  color: #000;
}
.btn_secondary.active {
  background-color: #FF9F00;
  color: #000;
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

.defi_card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.defi_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 159, 0, 0.3);
}

.hero_badge {
  background: rgba(255, 159, 0, 0.2);
  color: #FF9F00;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.hero_title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  line-height: 1.2;
}

.hero_subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

/* Espace visible en haut de la page */
.page-content-with-space {
  padding-top: 90px; /* ajuste selon la hauteur réelle du header */
}
/* responsive */
@media (max-width: 768px) {
  .page-content-with-space {
    padding-top: 60px;
  }
  
  .hero_title {
    font-size: 1.8rem;
  }
}
</style>



