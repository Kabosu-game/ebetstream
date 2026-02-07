<template>
  <div class="page-content-with-space">
    <!-- Section EbetStars -->
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
                      <i class="fas fa-star me-2"></i>eBetStars
                    </span>
                    <h2 class="hero_title mb-4">
                      Top <span class="text_gradient">eBetStars</span><br />
                      Platform Ranking
                    </h2>
                    <p class="hero_subtitle mb-5">
                      Discover the top players on the platform ranked as eBetStars by the admin.
                    </p>
                  </div>
                </div>

                <!-- Colonne image / carte -->
                <div class="col-lg-6 col-md-5 d-none d-md-block">
                  <div class="defis_image" data-aos="fade-left">
                    <div class="floating_card card_defis">
                      <div class="card_icon">⭐</div>
                      <div class="card_content">
                        <span class="card_label">Top 10</span>
                        <span class="card_value">{{ ebetstars.length }} eBetStars</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Liste des ebetstars -->
              <div v-if="loading" class="row mt-5">
                <div class="col-12 text-center py-5">
                  <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
              <div v-else-if="ebetstars.length > 0" class="row mt-5 g-4">
                <div v-for="(ebetstar, index) in ebetstars" :key="ebetstar.id" class="col-12 col-md-6 col-lg-4">
                  <div class="defi_card n11-bg rounded-8 p-4 h-100 d-flex flex-column" 
                       style="cursor: pointer;" 
                       @click="viewEbetStar(ebetstar.id)">
                    <div class="d-flex justify-content-start align-items-center mb-3">
                      <span class="ebetstar_rank fw-bold" style="font-size: 1.5rem; color: #FFD700;">
                        #{{ index + 1 }}
                      </span>
                    </div>
                    
                    <div class="d-flex align-items-center gap-3 mb-3">
                      <div class="ebetstar_avatar rounded-circle overflow-hidden" 
                           style="width: 60px; height: 60px; flex-shrink: 0; border: 2px solid rgba(255, 255, 255, 0.3);">
                        <img 
                          v-if="ebetstar.avatar_url || ebetstar.profile_photo_url" 
                          :src="ebetstar.avatar_url || ebetstar.profile_photo_url" 
                          :alt="ebetstar.name || ebetstar.username"
                          class="w-100 h-100"
                          style="object-fit: cover;"
                          @error="handleImageError"
                        />
                        <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center" 
                             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                          <i class="fas fa-user text-white fs-4"></i>
                        </div>
                      </div>
                      <div class="flex-grow-1">
                        <h5 class="fw-bold mb-1 text-white">
                          {{ (ebetstar.name && ebetstar.name.trim()) || (ebetstar.full_name && ebetstar.full_name.trim()) || ebetstar.username }}
                        </h5>
                        <p class="text-white small mb-0 d-flex align-items-center gap-2" style="opacity: 0.8;">
                          <span>@{{ ebetstar.username }}</span>
                          <span class="badge bg-warning text-dark px-2 py-1" style="font-size: 0.7rem;">
                            ⭐ eBetStar
                          </span>
                        </p>
                      </div>
                    </div>

                    <div v-if="ebetstar.country && ebetstar.country.trim()" class="mb-3">
                      <span class="text-white small" style="opacity: 0.8;">
                        <i class="fas fa-map-marker-alt me-1"></i>{{ ebetstar.country }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="row mt-5">
                <div class="col-12 text-center py-5">
                  <p class="text-white" style="opacity: 0.7;">No eBetStars available at the moment.</p>
                </div>
              </div>
              <!-- /Liste des ebetstars -->
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

interface EbetStar {
  id: number;
  name?: string;
  full_name?: string;
  username: string;
  score?: number;
  avatar?: string | null;
  avatar_url?: string;
  profile_photo_url?: string;
  country?: string | null;
  wallet?: {
    balance: number;
  };
}

const router = useRouter();
const ebetstars = ref<EbetStar[]>([]);
const loading = ref(false);
const error = ref('');

// Fonction pour corriger les URLs d'avatar
const correctAvatarUrl = (url: string): string => {
  return fixImageUrl(url);
};

const loadEbetStars = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    // Try to get ambassadors (same data as admin)
    const response = await apiClient.get('/ambassadors', {
      params: { limit: 100 }
    });

    if (response.data.success) {
      const data = response.data.data;
      ebetstars.value = Array.isArray(data) ? data : (data?.data || []);
      
      // Format avatar URLs avec correction
      ebetstars.value = ebetstars.value.map((ebetstar: EbetStar) => {
        const avatarUrl = ebetstar.avatar_url || ebetstar.profile_photo_url || (ebetstar.avatar ? getStorageUrl(ebetstar.avatar) : undefined);
        return {
          ...ebetstar,
          avatar_url: avatarUrl ? correctAvatarUrl(avatarUrl) : undefined
        };
      });
    }
  } catch (err: any) {
    console.error('Error loading ebetstars:', err);
    // If endpoint doesn't exist, try to get from users with filter
    try {
      const userResponse = await apiClient.get('/ambassadors', {
        params: { limit: 100 }
      });
      if (userResponse.data.success) {
        const data = userResponse.data.data;
        ebetstars.value = Array.isArray(data) ? data : (data?.data || []);
        
        // Format avatar URLs avec correction
        ebetstars.value = ebetstars.value.map((ebetstar: EbetStar) => {
          const avatarUrl = ebetstar.avatar_url || ebetstar.profile_photo_url || (ebetstar.avatar ? getStorageUrl(ebetstar.avatar) : undefined);
          return {
            ...ebetstar,
            avatar_url: avatarUrl ? correctAvatarUrl(avatarUrl) : undefined
          };
        });
      }
    } catch (userErr: any) {
      console.error('Error loading ebetstars from users:', userErr);
      error.value = 'Error loading ebetstars';
    }
  } finally {
    loading.value = false;
  }
};

const viewEbetStar = (id: number) => {
  router.push(`/players/${id}`);
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  const userName = img.alt || 'User';
  img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=667eea&color=fff&size=200`;
  img.onerror = null; // Prevent infinite loop
};

onMounted(() => {
  loadEbetStars();
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

