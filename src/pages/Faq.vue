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
                      <i class="fas fa-list-alt me-2"></i>FAQ
                    </span>
                    <h1 class="hero_title mb-4">
                      Frequently Asked <span class="text_gradient">Questions</span>
                    </h1>
                    <p class="hero_subtitle mb-5">
                      Quickly find answers to the most common questions about eBetStream.
                    </p>
                  </div>
                </div>
              </div>

              <!-- FAQ Items -->
              <div class="row w-100">
                <div class="col-lg-10">
                  <div class="faq_list">
                    <div 
                      v-for="(faq, index) in faqs" 
                      :key="index"
                      class="faq_item n11-bg rounded-8 p-4 mb-3"
                    >
                      <div 
                        class="faq_question d-flex justify-content-between align-items-center"
                        @click="toggleFaq(index)"
                        style="cursor: pointer;"
                      >
                        <h4 class="text-white mb-0">{{ faq.question }}</h4>
                        <i 
                          :class="`fas fa-chevron-${activeFaq === index ? 'up' : 'down'} text_gradient`"
                        ></i>
                      </div>
                      <div 
                        v-show="activeFaq === index"
                        class="faq_answer mt-3"
                      >
                        <p class="text-white" style="opacity: 0.9; line-height: 1.8;">
                          {{ faq.answer }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Still Need Help -->
              <div class="row w-100 mt-8">
                <div class="col-12">
                  <div class="cta_card n11-bg rounded-8 p-5 text-center">
                    <h3 class="text-white mb-3">Can't Find the Answer?</h3>
                    <p class="text-white mb-4" style="opacity: 0.9;">
                      Our support team is here to help you.
                    </p>
                    <router-link to="/contact" class="btn_primary text-decoration-none">
                      <span>Contact Us</span>
                      <i class="fas fa-arrow-right ms-2"></i>
                    </router-link>
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
import { ref } from 'vue';

const activeFaq = ref<number | null>(0);

const faqs = [
  {
    question: 'How to create an account on eBetStream?',
    answer: 'To create an account, click on "Create Account" in the main menu. Fill out the form with your information (name, email, username, and password). You will receive a confirmation email to activate your account.'
  },
  {
    question: 'How to create a challenge?',
    answer: 'Go to the "Challenges" section and click on "Create a challenge". Choose the game, the bet amount, and whether you want an open challenge or a direct challenge to a specific user. Once created, the amount will be locked until the challenge is resolved.'
  },
  {
    question: 'How do payments work?',
    answer: 'Payments are secure and managed automatically. When you create a challenge, the amount is locked in your account. The winner automatically receives the winnings once the challenge is resolved. Withdrawals are processed within 24-48 hours.'
  },
  {
    question: 'Can I cancel a challenge?',
    answer: 'A challenge can only be cancelled if the opponent has not yet accepted. Once accepted, the challenge is locked and can only be cancelled under exceptional circumstances. Contact support for more information.'
  },
  {
    question: 'How to participate in an event?',
    answer: 'Visit the "Events" page to see all available events. Click on an event to see details and participation conditions. Follow the instructions to register.'
  },
  {
    question: 'How to stream?',
    answer: 'Go to the "Streams" section and click on "Create a stream". Configure your stream with the provided RTMP information. Once configured, your stream will be visible to all platform users.'
  },
  {
    question: 'Is my account secure?',
    answer: 'Yes, we use the best security technologies, including SSL/TLS encryption, two-factor authentication (if enabled), and hashed passwords. Your data is protected in accordance with the strictest security standards.'
  },
  {
    question: 'What to do if I forget my password?',
    answer: 'On the login page, click on "Forgot Password". Enter your email and you will receive a link to reset your password. The link is valid for 24 hours.'
  },
  {
    question: 'Are there fees on transactions?',
    answer: 'eBetStream charges a 5% commission on challenge winnings. There are no fees for deposits, but fees may apply to withdrawals depending on the method chosen.'
  },
  {
    question: 'How to contact support?',
    answer: 'You can contact us via the contact form on the "Contact" page, by email at support@acmpt.online, or via live chat available 24/7 on the platform.'
  },
  {
    question: 'What games are supported?',
    answer: 'eBetStream supports a wide range of popular esports games including PUBG Mobile, Call of Duty Mobile, Free Fire, Mobile Legends, and many others. The complete list is available in the "Games" section.'
  },
  {
    question: 'Can I play from any country?',
    answer: 'eBetStream is available in many countries. However, some restrictions may apply according to local laws. Check the terms of use and legal restrictions of your country before creating an account.'
  }
];

const toggleFaq = (index: number) => {
  activeFaq.value = activeFaq.value === index ? null : index;
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

.faq_item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.faq_item:hover {
  border: 1px solid rgba(255, 159, 0, 0.3);
}

.faq_answer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
}

.cta_card {
  background: rgba(255, 159, 0, 0.1);
  border: 2px solid rgba(255, 159, 0, 0.3);
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

.btn_primary {
  background: linear-gradient(135deg, #FFD700, #FF9F00);
  color: #000;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.3s;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

.btn_primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 159, 0, 0.4);
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

