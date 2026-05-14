<template>
  <div class="tw-page">
    <!-- Hero -->
    <section class="tw-page-hero">
      <div class="hero-inner">
        <p class="tw-page-hero__sub"><i class="fas fa-list-alt me-2"></i>{{ $t('labels.faq') }}</p>
        <h1 class="tw-page-hero__title">{{ $t('ui.frequently_asked') }}<span class="accent">{{ $t('ui.questions') }}</span></h1>
        <p class="hero-desc">{{ $t('ui.quickly_find_answers_to_the_most_common_questions_about_ebet') }}</p>
      </div>
    </section>

    <div class="tw-page-body">
      <!-- Accordion FAQ -->
      <section class="faq-section">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="tw-accordion-item"
          :class="{ open: activeFaq === index }"
        >
          <button
            class="tw-accordion-btn"
            @click="toggleFaq(index)"
            :aria-expanded="activeFaq === index"
          >
            <span class="tw-accordion-btn__text">{{ faq.question }}</span>
            <span class="tw-accordion-btn__icon">
              <i :class="activeFaq === index ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
            </span>
          </button>
          <div class="tw-accordion-body" v-show="activeFaq === index">
            <p class="faq-answer">{{ faq.answer }}</p>
          </div>
        </div>
      </section>

      <div class="tw-divider"></div>

      <!-- CTA -->
      <section class="cta-section">
        <div class="tw-card cta-card">
          <div class="cta-icon"><i class="fas fa-headset"></i></div>
          <h3 class="cta-title">{{ $t('ui.cant_find_the_answer') }}</h3>
          <p class="cta-desc">{{ $t('ui.our_support_team_is_here_to_help_you_around_the_clock') }}</p>
          <router-link to="/contact" class="tw-btn tw-btn--primary">
            Contact Us <i class="fas fa-arrow-right ms-2"></i>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

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
  max-width: 620px;
}

.hero-desc {
  color: rgb(var(--n3));
  font-size: 1rem;
  line-height: 1.7;
  margin: 0;
}

.accent {
  color: rgb(var(--g1));
}

/* Body */
.tw-page-body {
  max-width: 860px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
}

/* FAQ section */
.faq-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
}

.faq-answer {
  color: rgb(var(--n3));
  font-size: 0.9rem;
  line-height: 1.8;
  margin: 0;
}

/* CTA */
.cta-section {
  margin-top: 2.5rem;
}

.cta-card {
  text-align: center;
  padding: 3rem 2rem;
  border: 1px solid rgba(37,150,190,0.25);
  background: rgba(37,150,190,0.06);
}

.cta-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: rgba(37,150,190,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: rgb(var(--g1));
  margin: 0 auto 1.25rem;
}

.cta-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin-bottom: 0.5rem;
}

.cta-desc {
  color: rgb(var(--n3));
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .tw-page-hero {
    padding: 2.5rem 1rem 2rem;
  }
}
</style>
