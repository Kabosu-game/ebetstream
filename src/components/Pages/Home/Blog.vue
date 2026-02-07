<template>
  <!-- Recent Blog Section -->
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
                        <i class="fas fa-blog me-2"></i>Blog
                      </span>
                      <h2 class="hero_title mb-4">
                        Our Recent <span class="text_gradient">Articles</span>
                      </h2>
                      <p class="hero_subtitle mb-5">
                        Discover our latest articles to stay informed and inspired
                        in the eBetStream universe.
                      </p>
                      <div class="hero_actions d-flex flex-wrap gap-3">
                        <button class="btn_primary">
                          <span>View All Articles</span>
                          <i class="fas fa-arrow-right ms-2"></i>
                        </button>
                        <button class="btn_secondary">
                          <i class="fas fa-info-circle me-2"></i>
                          <span>Learn More</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Carte 📰 BlogRécents -->
                  <div class="col-lg-6 col-md-5 d-none d-md-block">
                    <div class="top10_image" data-aos="fade-left">
                      <div class="floating_card card_top10">
                        <div class="card_icon">📰</div>
                        <div class="card_content">
                          <span class="card_label">Blog</span>
                          <span class="card_value">Recent</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Liste des articles en défilement -->
                  <div class="col-12 mt-5">
                    <Swiper
                      :modules="[Autoplay, Pagination]"
                      :slides-per-view="3"
                      :space-between="24"
                      :loop="true"
                      :autoplay="{ delay: 3000, disableOnInteraction: false }"
                      :breakpoints="{
                        0: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1200: { slidesPerView: 3 }
                      }"
                      pagination
                      class="blog_swiper"
                    >
                      <SwiperSlide v-for="(post, index) in blogPosts" :key="post.id">
                        <div class="player_card p-4">
                          <div 
                            v-if="!post.image" 
                            :class="`blog_image_placeholder blog_image_placeholder_${index + 1} mb-3 rounded d-flex align-items-center justify-content-center`"
                          >
                            <i class="fas fa-newspaper fs-1 text-white opacity-50"></i>
                          </div>
                          <img v-else :src="post.image" :alt="post.title" class="blog_image mb-3 rounded" />
                          <h3 class="player_name">{{ post.title }}</h3>
                          <p class="player_score">{{ post.excerpt }}</p>
                          <a :href="post.link" target="_blank" class="btn_primary btn-sm mt-2">Read More</a>
                        </div>
                      </SwiperSlide>
                    </Swiper>
                  </div>
                  <!-- /Liste articles -->

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
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  link: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "How to master eBetStream quickly",
    excerpt: "Discover our tips to progress quickly and fully enjoy the platform.",
    image: "", // Will use CSS placeholder
    link: "#"
  },
  {
    id: 2,
    title: "Best games to follow this week",
    excerpt: "Check out our selection of the most popular and innovative games right now.",
    image: "", // Will use CSS placeholder
    link: "#"
  },
  {
    id: 3,
    title: "Advanced strategies for online betting",
    excerpt: "Learn advanced techniques to improve your performance and winnings.",
    image: "", // Will use CSS placeholder
    link: "#"
  },
  {
    id: 4,
    title: "eBetStream updates not to miss",
    excerpt: "The latest features and games added to enrich your experience.",
    image: "", // Will use CSS placeholder
    link: "#"
  },
];
</script>

<style scoped>
.top10_section {
  width: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: white;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
}

.top10_content {
  color: white;
}

/* Carte flottante 📰 */
.floating_card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  width: fit-content;
  margin-left: auto;
  transition: 0.3s;
}

.floating_card:hover {
  transform: translateY(-5px);
}

.card_icon {
  font-size: 2.5rem;
}

.card_label {
  font-size: 1rem;
  color: #aaa;
  display: block;
  text-transform: uppercase;
}

.card_value {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(90deg, #ffd700, #ffb400);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Swiper */
.blog_swiper {
  padding-bottom: 40px;
}

.player_card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.player_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
}

.blog_image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
}

.blog_image_placeholder {
  width: 100%;
  height: 180px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.blog_image_placeholder_1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.blog_image_placeholder_2 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.blog_image_placeholder_3 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.blog_image_placeholder_4 {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.player_name {
  font-weight: 700;
  font-size: 1.1rem;
}

.player_score {
  font-size: 0.9rem;
  opacity: 0.85;
}

/* Responsive */
@media (max-width: 768px) {
  .floating_card {
    margin: 20px auto 0;
  }
  .blog_image {
    height: 160px;
  }
}
</style>
