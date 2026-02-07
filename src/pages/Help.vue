<template>
  <div class="page-content-with-space">
    <section class="content_section py-6 position-relative overflow-hidden pb-120">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 gx-0 gx-lg-4">
            <div class="top10__main">
              <!-- Header Section -->
              <div class="row w-100 h-100 align-items-center mb-8">
                <div class="col-lg-8">
                  <div class="content_header" data-aos="fade-right">
                    <span class="hero_badge mb-3 d-inline-block">
                      <i class="fas fa-question-circle me-2"></i>Help Center
                    </span>
                    <h1 class="hero_title mb-4">
                      Help <span class="text_gradient">Center</span>
                    </h1>
                    <p class="hero_subtitle mb-5">
                      Quickly find answers to your questions and learn how to use all eBetStream features.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Search Section -->
              <div class="row w-100 mb-8">
                <div class="col-lg-8">
                  <div class="search_box n11-bg rounded-8 p-4">
                    <div class="input-group">
                      <span class="input-group-text n11-bg border-secondary text-white">
                        <i class="fas fa-search"></i>
                      </span>
                      <input 
                        v-model="searchQuery"
                        type="text" 
                        class="form-control n11-bg text-white border-secondary" 
                        placeholder="Search help..."
                        @input="filterArticles"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Categories -->
              <div class="row w-100 mb-8">
                <div class="col-12">
                  <h2 class="text-white mb-4">Categories</h2>
                  <div class="row g-4">
                    <div 
                      v-for="category in categories" 
                      :key="category.id"
                      class="col-md-6 col-lg-4"
                    >
                      <div 
                        class="category_card n11-bg rounded-8 p-4 h-100"
                        @click="selectedCategory = category.id"
                        style="cursor: pointer;"
                      >
                        <div class="category_icon mb-3">
                          <i :class="`${category.icon} text_gradient fs-1`"></i>
                        </div>
                        <h4 class="text-white mb-2">{{ category.name }}</h4>
                        <p class="text-white mb-0" style="opacity: 0.8;">
                          {{ category.description }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Articles -->
              <div class="row w-100 mb-8">
                <div class="col-12">
                  <h2 class="text-white mb-4">Popular Articles</h2>
                  <div class="row g-4">
                    <div 
                      v-for="article in filteredArticles" 
                      :key="article.id"
                      class="col-md-6"
                    >
                      <div 
                        class="article_card n11-bg rounded-8 p-4"
                        @click="selectedArticle = article"
                        style="cursor: pointer;"
                      >
                        <h5 class="text-white mb-2">{{ article.title }}</h5>
                        <p class="text-white mb-0" style="opacity: 0.8; line-height: 1.6;">
                          {{ article.excerpt }}
                        </p>
                        <div class="mt-3">
                          <span class="badge bg-warning text-dark">{{ article.category }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Links -->
              <div class="row w-100">
                <div class="col-12">
                  <div class="quick_links_card n11-bg rounded-8 p-5">
                    <h3 class="text-white mb-4">Quick Links</h3>
                    <div class="row g-3">
                      <div class="col-md-6">
                        <router-link to="/faq" class="quick_link text-white text-decoration-none d-flex align-items-center gap-3 p-3 rounded-8" style="background: rgba(255,255,255,0.05);">
                          <i class="fas fa-list-alt text_gradient fs-4"></i>
                          <span>FAQ</span>
                        </router-link>
                      </div>
                      <div class="col-md-6">
                        <router-link to="/contact" class="quick_link text-white text-decoration-none d-flex align-items-center gap-3 p-3 rounded-8" style="background: rgba(255,255,255,0.05);">
                          <i class="fas fa-envelope text_gradient fs-4"></i>
                          <span>Contact Us</span>
                        </router-link>
                      </div>
                      <div class="col-md-6">
                        <router-link to="/support" class="quick_link text-white text-decoration-none d-flex align-items-center gap-3 p-3 rounded-8" style="background: rgba(255,255,255,0.05);">
                          <i class="fas fa-headset text_gradient fs-4"></i>
                          <span>Support</span>
                        </router-link>
                      </div>
                      <div class="col-md-6">
                        <router-link to="/privacy" class="quick_link text-white text-decoration-none d-flex align-items-center gap-3 p-3 rounded-8" style="background: rgba(255,255,255,0.05);">
                          <i class="fas fa-shield-alt text_gradient fs-4"></i>
                          <span>Privacy</span>
                        </router-link>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const searchQuery = ref('');
const selectedCategory = ref<number | null>(null);
const selectedArticle = ref<any>(null);

const categories = [
  { id: 1, name: 'Account', icon: 'fas fa-user', description: 'Manage your account' },
  { id: 2, name: 'Challenges', icon: 'fas fa-trophy', description: 'Create and participate in challenges' },
  { id: 3, name: 'Payments', icon: 'fas fa-credit-card', description: 'Deposits and withdrawals' },
  { id: 4, name: 'Events', icon: 'fas fa-calendar', description: 'Tournaments and competitions' },
  { id: 5, name: 'Streaming', icon: 'fas fa-video', description: 'Stream your games' },
  { id: 6, name: 'Security', icon: 'fas fa-shield-alt', description: 'Protect your account' },
];

const articles = [
  { id: 1, title: 'How to create an account?', excerpt: 'Learn how to create your eBetStream account in a few simple steps.', category: 'Account' },
  { id: 2, title: 'How to create a challenge?', excerpt: 'Discover how to create and customize your challenges with other players.', category: 'Challenges' },
  { id: 3, title: 'How to deposit funds?', excerpt: 'Complete guide to make a deposit to your account.', category: 'Payments' },
  { id: 4, title: 'How to participate in an event?', excerpt: 'Everything you need to know to join our events.', category: 'Events' },
  { id: 5, title: 'How to stream?', excerpt: 'Set up your streaming and share your games live.', category: 'Streaming' },
  { id: 6, title: 'Secure my account', excerpt: 'Best practices to protect your eBetStream account.', category: 'Security' },
];

const filteredArticles = computed(() => {
  let filtered = articles;
  
  if (searchQuery.value) {
    filtered = filtered.filter(article => 
      article.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  if (selectedCategory.value) {
    const category = categories.find(c => c.id === selectedCategory.value);
    filtered = filtered.filter(article => article.category === category?.name);
  }
  
  return filtered;
});

const filterArticles = () => {
  // Filter is handled by computed property
};
</script>

<style scoped>
.content_section {
  width: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
}

.category_card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.category_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 159, 0, 0.3);
}

.article_card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 159, 0, 0.3);
}

.quick_link {
  transition: all 0.3s ease;
}

.quick_link:hover {
  background: rgba(255, 159, 0, 0.1) !important;
  transform: translateX(5px);
}

.text_gradient {
  background: linear-gradient(90deg, #FF9F00, #FF9F00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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

.page-content-with-space {
  padding-top: 90px;
}

@media (max-width: 768px) {
  .page-content-with-space {
    padding-top: 60px;
  }
  
  .hero_title {
    font-size: 1.8rem;
  }
}
</style>

