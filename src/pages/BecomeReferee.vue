<template>
  <div class="tw-page">
    <!-- Hero -->
    <section class="tw-page-hero">
      <div class="hero-inner">
        <p class="tw-page-hero__sub"><i class="fas fa-gavel me-2"></i>{{ $t('ui.certification') }}</p>
        <h1 class="tw-page-hero__title">{{ $t('ui.become_a') }}<span class="accent">{{ $t('ui.referee') }}</span></h1>
        <p class="hero-desc">{{ $t('ui.join_our_team_of_certified_referees_and_ensure_fairness_in_c') }}</p>
      </div>
    </section>

    <div class="tw-page-body">

      <!-- Conditions + Documents: two columns -->
      <section class="two-col-section">
        <!-- Conditions -->
        <div class="tw-card info-card">
          <div class="card-header-row">
            <div class="card-icon"><i class="fas fa-check-circle"></i></div>
            <h3 class="card-title">{{ $t('ui.requirements') }}</h3>
          </div>
          <ul class="check-list">
            <li>{{ $t('ui.pass_and_succeed_an_ebetstream_refereeing_test') }}</li>
            <li>{{ $t('ui.have_good_knowledge_of_games_rules_and_disputes') }}</li>
            <li>{{ $t('ui.be_able_to_record_verify_and_validate_evidence') }}</li>
            <li>{{ $t('ui.have_a_fast_response_time_minimum_availability') }}</li>
            <li>{{ $t('ui.commit_to_absolute_neutrality') }}</li>
          </ul>
        </div>

        <!-- Documents -->
        <div class="tw-card info-card">
          <div class="card-header-row">
            <div class="card-icon docs"><i class="fas fa-file-alt"></i></div>
            <h3 class="card-title">{{ $t('ui.required_documents') }}</h3>
          </div>
          <div class="doc-group">
            <h5 class="doc-group-title">{{ $t('ui.identity_documents') }}<span class="required-tag">{{ $t('ui.required') }}</span></h5>
            <ul class="doc-list">
              <li>{{ $t('ui.id_card_passport_front_and_back') }}</li>
              <li>{{ $t('ui.selfie_for_face_verification_anti_fraud') }}</li>
            </ul>
          </div>
          <div class="tw-divider mini"></div>
          <div class="doc-group">
            <h5 class="doc-group-title">{{ $t('ui.referee_specific_documents') }}</h5>
            <ul class="doc-list">
              <li>{{ $t('ui.mini_cv_experience_in_gaming_refereeing_moderation') }}</li>
              <li>{{ $t('ui.short_presentation_video_15_30_sec') }}</li>
              <li>{{ $t('ui.proof_of_activity_in_gaming_communities_discord_facebook_etc') }}</li>
            </ul>
          </div>
        </div>
      </section>

      <div class="tw-divider"></div>

      <!-- Validation process steps -->
      <section class="steps-section">
        <h2 class="section-title">{{ $t('ui.validation_process') }}</h2>
        <div class="tw-steps">
          <div class="tw-step">
            <div class="tw-step__num">1</div>
            <div>
              <p class="tw-step__title">{{ $t('ui.submission') }}</p>
              <p class="tw-step__desc">{{ $t('ui.the_candidate_fills_out_a_form_and_submits_required_document') }}</p>
            </div>
          </div>
          <div class="tw-step">
            <div class="tw-step__num">2</div>
            <div>
              <p class="tw-step__title">{{ $t('ui.verification') }}</p>
              <p class="tw-step__desc">{{ $t('ui.the_ebetstream_team_verifies_identity_account_history_behavi') }}</p>
            </div>
          </div>
          <div class="tw-step">
            <div class="tw-step__num">3</div>
            <div>
              <p class="tw-step__title">{{ $t('ui.test') }}</p>
              <p class="tw-step__desc">{{ $t('ui.refereeing_test_to_assess_your_knowledge_of_rules_and_disput') }}</p>
            </div>
          </div>
          <div class="tw-step">
            <div class="tw-step__num">4</div>
            <div>
              <p class="tw-step__title">{{ $t('ui.quick_interview') }}<span class="optional-tag">{{ $t('ui.optional') }}</span></p>
              <p class="tw-step__desc">{{ $t('ui.5_minute_video_call_or_video_recording_to_discuss_your_backg') }}</p>
            </div>
          </div>
          <div class="tw-step">
            <div class="tw-step__num">5</div>
            <div>
              <p class="tw-step__title">{{ $t('ui.validation') }}</p>
              <p class="tw-step__desc">{{ $t('ui.awarding_of_an_official_badge_and_access_to_advanced_referee') }}</p>
            </div>
          </div>
          <div class="tw-step">
            <div class="tw-step__num">6</div>
            <div>
              <p class="tw-step__title">{{ $t('ui.training') }}</p>
              <p class="tw-step__desc">{{ $t('ui.mini_guides_or_onboarding_videos_provided_by_ebetstream_to_g') }}</p>
            </div>
          </div>
        </div>
      </section>

      <div class="tw-divider"></div>

      <!-- Disqualification criteria -->
      <section class="disq-section">
        <div class="tw-alert tw-alert--danger">
          <h4 class="disq-title"><i class="fas fa-ban me-2"></i>{{ $t('ui.disqualification_rejection_criteria') }}</h4>
          <ul class="disq-list">
            <li>{{ $t('ui.falsified_documents') }}</li>
            <li>{{ $t('ui.suspicious_activities_or_multiple_accounts') }}</li>
            <li>{{ $t('ui.fraudulent_betting_or_match_fixing') }}</li>
            <li>{{ $t('ui.insults_toxicity_or_harassment') }}</li>
            <li>{{ $t('ui.refusal_to_cooperate_with_the_rules') }}</li>
            <li>{{ $t('ui.poor_past_experiences_in_e_sports') }}</li>
          </ul>
        </div>
      </section>

      <div class="tw-divider"></div>

      <!-- Form -->
      <section class="form-section">
        <div class="tw-card form-card">
          <div class="card-header-row">
            <div class="card-icon form-icon"><i class="fas fa-paper-plane"></i></div>
            <h3 class="card-title">{{ $t('ui.submit_your_request') }}</h3>
          </div>
          <CertificationForm type="referee" />
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import CertificationForm from '@/components/Pages/Certification/CertificationForm.vue';
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
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
}

/* Two column */
.two-col-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

/* Info card */
.info-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-header-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.card-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  background: rgba(37,150,190,0.15);
  color: rgb(var(--g1));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.card-icon.docs     { background: rgba(66,153,225,0.15); color: #4299e1; }
.card-icon.form-icon { background: rgba(59,196,100,0.15); color: #3bc464; }

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0;
}

/* Check list */
.check-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.check-list li {
  padding-left: 1.6rem;
  position: relative;
  color: rgb(var(--n3));
  font-size: 0.88rem;
  line-height: 1.55;
}

.check-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.3rem;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background: rgba(37,150,190,0.3);
  border: 2px solid rgb(var(--g1));
}

/* Doc groups */
.doc-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.doc-group-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.required-tag {
  display: inline-block;
  padding: 0.1rem 0.5rem;
  background: rgba(237,137,54,0.15);
  color: #ed8936;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.doc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.doc-list li {
  color: rgb(var(--n3));
  font-size: 0.85rem;
  line-height: 1.5;
  padding-left: 1rem;
  position: relative;
}

.doc-list li::before {
  content: "—";
  position: absolute;
  left: 0;
  color: rgb(var(--n2));
}

.mini {
  margin: 0.5rem 0;
}

/* Section title */
.section-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* Steps section */
.steps-section {
  margin-bottom: 2.5rem;
}

.optional-tag {
  display: inline-block;
  padding: 0.1rem 0.5rem;
  background: rgba(37,150,190,0.15);
  color: rgb(var(--g1));
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  vertical-align: middle;
  margin-left: 0.4rem;
}

/* Disqualification */
.disq-section {
  margin-bottom: 2.5rem;
}

.disq-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin-bottom: 0.75rem;
}

.disq-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.disq-list li {
  color: rgb(var(--n3));
  font-size: 0.88rem;
  padding-left: 1.2rem;
  position: relative;
}

.disq-list li::before {
  content: "×";
  position: absolute;
  left: 0;
  color: #fc4747;
  font-weight: 700;
}

/* Form */
.form-section {
  margin-top: 0;
}

.form-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .tw-page-hero {
    padding: 2.5rem 1rem 2rem;
  }

  .two-col-section {
    grid-template-columns: 1fr;
  }
}
</style>
