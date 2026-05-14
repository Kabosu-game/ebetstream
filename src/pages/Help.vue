<template>
  <div class="tw-page">
    <!-- Hero -->
    <section class="tw-page-hero">
      <div class="hero-inner">
        <p class="tw-page-hero__sub"><i class="fas fa-question-circle me-2"></i>{{ $t('ui.help_center') }}</p>
        <h1 class="tw-page-hero__title">{{ $t('ui.how_can_we') }}<span class="accent">{{ $t('ui.help_you') }}</span></h1>
        <p class="hero-desc">{{ $t('ui.quickly_find_answers_to_your_questions_and_learn_how_to_use_') }}</p>
        <div class="search-wrap">
          <span class="search-icon"><i class="fas fa-search"></i></span>
          <input
            v-model="searchQuery"
            type="text"
            class="tw-input search-input"
            :placeholder="$t('ui.search_for_answers')"
            @input="filterArticles"
          />
        </div>
      </div>
    </section>

    <div class="tw-page-body">
      <!-- Categories -->
      <section class="page-section">
        <h2 class="section-title">{{ $t('ui.browse_categories') }}</h2>
        <div class="tw-grid-3">
          <div
            v-for="category in categories"
            :key="category.id"
            class="tw-card category-card"
            :class="{ active: selectedCategory === category.id }"
            @click="selectedCategory = selectedCategory === category.id ? null : category.id"
          >
            <div class="cat-icon">
              <i :class="category.icon"></i>
            </div>
            <h4 class="cat-name">{{ category.name }}</h4>
            <p class="cat-desc">{{ category.description }}</p>
          </div>
        </div>
      </section>

      <div class="tw-divider"></div>

      <!-- Articles -->
      <section class="page-section">
        <h2 class="section-title">{{ $t('ui.popular_articles') }}</h2>
        <div v-if="filteredArticles.length === 0" class="tw-alert">
          No articles found matching your search.
        </div>
        <div class="articles-grid">
          <div
            v-for="article in filteredArticles"
            :key="article.id"
            class="tw-card article-card"
          >
            <h5 class="article-title">{{ article.title }}</h5>
            <p class="article-excerpt">{{ article.excerpt }}</p>
            <span class="article-badge">{{ article.category }}</span>
          </div>
        </div>
      </section>

      <div class="tw-divider"></div>

      <!-- Quick Links -->
      <section class="page-section">
        <div class="tw-card quick-links-card">
          <h3 class="quick-links-title">{{ $t('ui.quick_links') }}</h3>
          <div class="quick-links-grid">
            <router-link to="/faq" class="quick-link">
              <i class="fas fa-list-alt quick-link__icon"></i>
              <span>{{ $t('labels.faq') }}</span>
              <i class="fas fa-chevron-right quick-link__arrow"></i>
            </router-link>
            <router-link to="/contact" class="quick-link">
              <i class="fas fa-envelope quick-link__icon"></i>
              <span>{{ $t('ui.contact_us') }}</span>
              <i class="fas fa-chevron-right quick-link__arrow"></i>
            </router-link>
            <router-link to="/support" class="quick-link">
              <i class="fas fa-headset quick-link__icon"></i>
              <span>{{ $t('ui.support') }}</span>
              <i class="fas fa-chevron-right quick-link__arrow"></i>
            </router-link>
            <router-link to="/privacy" class="quick-link">
              <i class="fas fa-shield-alt quick-link__icon"></i>
              <span>{{ $t('ui.privacy') }}</span>
              <i class="fas fa-chevron-right quick-link__arrow"></i>
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

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
/* Hero */
.tw-page-hero {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 1.5rem 3rem;
  background: linear-gradient(180deg, rgba(37,150,190,0.12) 0%, transparent 100%);
  border-bottom: 1px solid rgba(37,150,190,0.15);
}

.hero-inner {
  max-width: 680px;
  width: 100%;
}

.hero-desc {
  color: rgb(var(--n3));
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.accent {
  color: rgb(var(--g1));
}

/* Search */
.search-wrap {
  position: relative;
  max-width: 520px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgb(var(--n3));
  pointer-events: none;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding-left: 2.75rem !important;
  font-size: 0.95rem;
}

/* Page body */
.tw-page-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
}

.page-section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin-bottom: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* Category cards */
.category-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  border: 1px solid transparent;
  transition: border-color 0.2s, transform 0.2s;
}

.category-card:hover,
.category-card.active {
  border-color: rgb(var(--g1));
  transform: translateY(-3px);
}

.cat-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  background: rgba(37,150,190,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: rgb(var(--g1));
  margin-bottom: 0.25rem;
}

.cat-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0;
}

.cat-desc {
  font-size: 0.82rem;
  color: rgb(var(--n3));
  margin: 0;
  line-height: 1.5;
}

/* Articles */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.article-card {
  cursor: pointer;
  border: 1px solid transparent;
  transition: border-color 0.2s, transform 0.2s;
}

.article-card:hover {
  border-color: rgba(37,150,190,0.4);
  transform: translateY(-3px);
}

.article-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin-bottom: 0.5rem;
}

.article-excerpt {
  font-size: 0.85rem;
  color: rgb(var(--n3));
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.article-badge {
  display: inline-block;
  padding: 0.2rem 0.65rem;
  background: rgba(37,150,190,0.18);
  color: rgb(var(--g1));
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Quick links */
.quick-links-card {
  padding: 1.75rem 2rem;
}

.quick-links-title {
  font-size: 1rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin-bottom: 1.25rem;
}

.quick-links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px;
  color: rgb(var(--n8));
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 600;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}

.quick-link:hover {
  background: rgba(37,150,190,0.12);
  border-color: rgba(37,150,190,0.35);
  transform: translateX(3px);
}

.quick-link__icon {
  color: rgb(var(--g1));
  font-size: 1rem;
  flex-shrink: 0;
}

.quick-link__arrow {
  margin-left: auto;
  color: rgb(var(--n3));
  font-size: 0.7rem;
}

@media (max-width: 768px) {
  .tw-page-hero {
    padding: 2.5rem 1rem 2rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .quick-links-grid {
    grid-template-columns: 1fr;
  }
}
</style>
