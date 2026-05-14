<template>
  <div class="mon-page">

    <!-- ══ HERO ══════════════════════════════════════════════════════════ -->
    <div class="mon-hero">
      <div class="mon-hero__blobs">
        <div class="mon-hero__blob mon-hero__blob--1"></div>
        <div class="mon-hero__blob mon-hero__blob--2"></div>
      </div>
      <div class="mon-hero__content">
        <span class="mon-eyebrow">
          <i class="fas fa-file-certificate"></i>
          Document Fondateur · Version Investisseur
        </span>
        <h1 class="mon-hero__title">
          Programme Officiel<br />{{ $t('ui.de') }}<span class="mon-accent">{{ $t('ui.mon_tisation') }}</span>
        </h1>
        <p class="mon-hero__sub">
          Ebetstream transforme le gaming compétitif en opportunité économique durable.
          Découvrez comment les streamers génèrent des revenus grâce à leur skill et leur audience.
        </p>
        <div class="mon-hero__stats">
          <div class="mon-hstat">
            <span class="mon-hstat__val">20 000</span>
            <span class="mon-hstat__lbl">{{ $t('ui.utilisateurs_an_1') }}</span>
          </div>
          <div class="mon-hstat__sep"></div>
          <div class="mon-hstat">
            <span class="mon-hstat__val">{{ $t('ui.126_k') }}</span>
            <span class="mon-hstat__lbl">{{ $t('ui.revenus_estim_s_an_1') }}</span>
          </div>
          <div class="mon-hstat__sep"></div>
          <div class="mon-hstat">
            <span class="mon-hstat__val">{{ $t('ui.2_m') }}</span>
            <span class="mon-hstat__lbl">{{ $t('ui.objectif_an_3') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ VISION ═════════════════════════════════════════════════════════ -->
    <section class="mon-section">
      <div class="mon-section-header">
        <div class="mon-section-num">01</div>
        <h2 class="mon-section-title">{{ $t('ui.vision') }}</h2>
      </div>
      <div class="mon-vision-card">
        <div class="mon-vision-icon"><i class="fas fa-eye"></i></div>
        <div class="mon-vision-body">
          <p class="mon-vision-text">
            Ebetstream est une plateforme de streaming compétitif permettant aux gamers de générer
            des revenus grâce à leur <strong>{{ $t('ui.performance_2') }}</strong>{{ $t('ui.leur') }}<strong>{{ $t('ui.influence') }}</strong>
            et l'engagement de leur <strong>{{ $t('ui.audience') }}</strong>.
          </p>
          <p class="mon-vision-tagline">
            La plateforme crée une nouvelle économie où le skill devient un actif monétisable.
          </p>
        </div>
      </div>
    </section>

    <!-- ══ SOURCES DE REVENUS ═════════════════════════════════════════════ -->
    <section class="mon-section">
      <div class="mon-section-header">
        <div class="mon-section-num">02</div>
        <h2 class="mon-section-title">{{ $t('ui.sources_de_revenus_des_streamers') }}</h2>
      </div>

      <div class="mon-revenue-grid">

        <!-- A. Donations -->
        <div class="mon-revenue-card">
          <div class="mon-revenue-card__header">
            <div class="mon-revenue-icon mon-revenue-icon--a">
              <i class="fas fa-handshake-heart"></i>
            </div>
            <div>
              <span class="mon-revenue-label">A</span>
              <h3 class="mon-revenue-title">{{ $t('ui.donations_directes') }}</h3>
            </div>
          </div>
          <p class="mon-revenue-desc">
            {{ $t('ui.monetization_donations_desc') }}
          </p>
          <div class="mon-split">
            <div class="mon-split__item mon-split__item--streamer">
              <span class="mon-split__pct">85%</span>
              <span class="mon-split__lbl">{{ $t('ui.streamer') }}</span>
            </div>
            <div class="mon-split__divider"></div>
            <div class="mon-split__item mon-split__item--platform">
              <span class="mon-split__pct">15%</span>
              <span class="mon-split__lbl">{{ $t('ui.plateforme') }}</span>
            </div>
          </div>
          <div class="mon-split-bar">
            <div class="mon-split-bar__fill" style="width:85%"></div>
          </div>
        </div>

        <!-- B. Prédictions -->
        <div class="mon-revenue-card">
          <div class="mon-revenue-card__header">
            <div class="mon-revenue-icon mon-revenue-icon--b">
              <i class="fas fa-crosshairs"></i>
            </div>
            <div>
              <span class="mon-revenue-label">B</span>
              <h3 class="mon-revenue-title">{{ $t('ui.support_prediction_system') }}</h3>
            </div>
          </div>
          <p class="mon-revenue-desc">
            {{ $t('ui.monetization_predictions_desc') }}
          </p>
          <div class="mon-split">
            <div class="mon-split__item mon-split__item--streamer">
              <span class="mon-split__pct">40%</span>
              <span class="mon-split__lbl">{{ $t('ui.streamer') }}</span>
            </div>
            <div class="mon-split__divider"></div>
            <div class="mon-split__item mon-split__item--platform">
              <span class="mon-split__pct">60%</span>
              <span class="mon-split__lbl">{{ $t('ui.plateforme') }}</span>
            </div>
          </div>
          <div class="mon-split-bar">
            <div class="mon-split-bar__fill" style="width:40%"></div>
          </div>
          <p class="mon-split-note">{{ $t('ui.commission_calcul_e_sur_les_cr_dits_utilis_s') }}</p>
        </div>

        <!-- C. Matchs sponsorisés -->
        <div class="mon-revenue-card">
          <div class="mon-revenue-card__header">
            <div class="mon-revenue-icon mon-revenue-icon--c">
              <i class="fas fa-trophy"></i>
            </div>
            <div>
              <span class="mon-revenue-label">C</span>
              <h3 class="mon-revenue-title">{{ $t('ui.matchs_sponsoris_s') }}</h3>
            </div>
          </div>
          <p class="mon-revenue-desc">
            Ebetstream organise des défis sponsorisés et des tournois. Répartition du prize pool.
          </p>
          <div class="mon-triple-split">
            <div class="mon-triple-item mon-triple-item--players">
              <span class="mon-triple-pct">60%</span>
              <span class="mon-triple-lbl">{{ $t('ui.prize_pool_joueurs') }}</span>
            </div>
            <div class="mon-triple-item mon-triple-item--organizer">
              <span class="mon-triple-pct">20%</span>
              <span class="mon-triple-lbl">{{ $t('ui.streamer_organisateur') }}</span>
            </div>
            <div class="mon-triple-item mon-triple-item--platform">
              <span class="mon-triple-pct">20%</span>
              <span class="mon-triple-lbl">{{ $t('ui.plateforme') }}</span>
            </div>
          </div>
          <div class="mon-triple-bar">
            <div class="mon-triple-bar__s" style="width:60%"></div>
            <div class="mon-triple-bar__o" style="width:20%"></div>
            <div class="mon-triple-bar__p" style="width:20%"></div>
          </div>
        </div>

      </div>
    </section>

    <!-- ══ NIVEAUX STREAMERS ══════════════════════════════════════════════ -->
    <section class="mon-section">
      <div class="mon-section-header">
        <div class="mon-section-num">03</div>
        <h2 class="mon-section-title">{{ $t('ui.niveaux_des_streamers') }}</h2>
      </div>

      <div class="mon-tiers">

        <!-- Rookie -->
        <div class="mon-tier mon-tier--rookie">
          <div class="mon-tier__badge">
            <i class="fas fa-fire"></i>
          </div>
          <h3 class="mon-tier__name">{{ $t('ui.rookie') }}</h3>
          <p class="mon-tier__range">{{ $t('ui.0_1_000_followers') }}</p>
          <div class="mon-tier__commission">
            <span class="mon-tier__pct">30%</span>
            <span class="mon-tier__pct-lbl">{{ $t('ui.commission_3') }}</span>
          </div>
          <ul class="mon-tier__perks">
            <li><i class="fas fa-check"></i>{{ $t('ui.acc_s_donations_directes') }}</li>
            <li><i class="fas fa-check"></i>{{ $t('ui.support_prediction_system') }}</li>
            <li><i class="fas fa-check"></i>{{ $t('ui.streaming_illimit') }}</li>
          </ul>
        </div>

        <!-- Pro -->
        <div class="mon-tier mon-tier--pro mon-tier--featured">
          <div class="mon-tier__popular">{{ $t('ui.populaire') }}</div>
          <div class="mon-tier__badge">
            <i class="fas fa-award"></i>
          </div>
          <h3 class="mon-tier__name">{{ $t('ui.pro') }}</h3>
          <p class="mon-tier__range">{{ $t('ui.1_000_10_000_followers') }}</p>
          <div class="mon-tier__commission">
            <span class="mon-tier__pct">40%</span>
            <span class="mon-tier__pct-lbl">{{ $t('ui.commission_3') }}</span>
          </div>
          <ul class="mon-tier__perks">
            <li><i class="fas fa-check"></i>{{ $t('ui.tout_rookie_inclus') }}</li>
            <li><i class="fas fa-check"></i>{{ $t('ui.acc_s_tournois_sponsoris_s') }}</li>
            <li><i class="fas fa-check"></i>{{ $t('ui.priorit_dans_les_classements') }}</li>
            <li><i class="fas fa-check"></i>{{ $t('ui.analytics_avanc_s') }}</li>
          </ul>
        </div>

        <!-- Elite -->
        <div class="mon-tier mon-tier--elite">
          <div class="mon-tier__badge">
            <i class="fas fa-crown"></i>
          </div>
          <h3 class="mon-tier__name">{{ $t('ui.elite') }}</h3>
          <p class="mon-tier__range">{{ $t('ui.10_000_followers') }}</p>
          <div class="mon-tier__commission">
            <span class="mon-tier__pct">50%</span>
            <span class="mon-tier__pct-lbl">{{ $t('ui.commission_3') }}</span>
          </div>
          <ul class="mon-tier__perks">
            <li><i class="fas fa-check"></i>{{ $t('ui.tout_pro_inclus') }}</li>
            <li><i class="fas fa-check"></i>{{ $t('ui.badge_v_rifi') }}</li>
            <li><i class="fas fa-check"></i>{{ $t('ui.promotion_interne') }}</li>
            <li><i class="fas fa-check"></i>{{ $t('ui.acc_s_v_nements_exclusifs') }}</li>
            <li><i class="fas fa-check"></i>{{ $t('ui.support_d_di') }}</li>
          </ul>
        </div>

      </div>
    </section>

    <!-- ══ RÈGLES ET SÉCURITÉ ═════════════════════════════════════════════ -->
    <section class="mon-section">
      <div class="mon-section-header">
        <div class="mon-section-num">04</div>
        <h2 class="mon-section-title">{{ $t('ui.r_gles_s_curit') }}</h2>
      </div>
      <div class="mon-rules-grid">
        <div class="mon-rule">
          <div class="mon-rule__icon"><i class="fas fa-id-badge"></i></div>
          <h4>{{ $t('ui.v_rification_didentit') }}</h4>
          <p>{{ $t('ui.obligatoire_pour_tous_les_streamers_participants_aux_tournoi') }}</p>
        </div>
        <div class="mon-rule">
          <div class="mon-rule__icon"><i class="fas fa-shield-alt"></i></div>
          <h4>{{ $t('ui.interdiction_de_triche') }}</h4>
          <p>{{ $t('ui.syst_me_de_d_tection_anti_triche_actif_sur_tous_les_matchs_c') }}</p>
        </div>
        <div class="mon-rule">
          <div class="mon-rule__icon"><i class="fas fa-video"></i></div>
          <h4>{{ $t('ui.matchs_enregistr_s') }}</h4>
          <p>{{ $t('ui.tous_les_matchs_sont_archiv_s_pour_garantir_la_transparence_') }}</p>
        </div>
        <div class="mon-rule">
          <div class="mon-rule__icon"><i class="fas fa-balance-scale"></i></div>
          <h4>{{ $t('ui.syst_me_darbitrage') }}</h4>
          <p>{{ $t('ui.processus_darbitrage_quitable_pour_r_soudre_les_contestation') }}</p>
        </div>
        <div class="mon-rule">
          <div class="mon-rule__icon"><i class="fas fa-users"></i></div>
          <h4>{{ $t('ui.protection_utilisateurs') }}</h4>
          <p>{{ $t('ui.donn_es_s_curis_es_transactions_prot_g_es_et_rgpd_conforme') }}</p>
        </div>
        <div class="mon-rule">
          <div class="mon-rule__icon"><i class="fas fa-eye"></i></div>
          <h4>{{ $t('ui.transparence_totale') }}</h4>
          <p>{{ $t('ui.toutes_les_commissions_et_r_partitions_sont_affich_es_en_cla') }}</p>
        </div>
      </div>
    </section>

    <!-- ══ PROJECTION FINANCIÈRE ══════════════════════════════════════════ -->
    <section class="mon-section">
      <div class="mon-section-header">
        <div class="mon-section-num">05</div>
        <h2 class="mon-section-title">{{ $t('ui.projection_financi_re_ann_e_1') }}</h2>
      </div>

      <div class="mon-finance-banner">
        <p class="mon-finance-banner__caption">{{ $t('ui.hypoth_se_20_000_utilisateurs_1_000_streamers_actifs') }}</p>

        <div class="mon-finance-grid">

          <div class="mon-fstat">
            <div class="mon-fstat__icon mon-fstat__icon--credits"><i class="fas fa-coins"></i></div>
            <span class="mon-fstat__val">50 000 $</span>
            <span class="mon-fstat__lbl">{{ $t('ui.volume_cr_dits_mensuel_estim') }}</span>
            <span class="mon-fstat__sub">{{ $t('ui.commission_plateforme_15') }}<strong>7 500 $</strong></span>
          </div>

          <div class="mon-fstat">
            <div class="mon-fstat__icon mon-fstat__icon--donations"><i class="fas fa-handshake-heart"></i></div>
            <span class="mon-fstat__val">20 000 $</span>
            <span class="mon-fstat__lbl">{{ $t('ui.donations_estim_es_mois') }}</span>
            <span class="mon-fstat__sub">{{ $t('ui.commission_plateforme_15') }}<strong>3 000 $</strong></span>
          </div>

          <div class="mon-fstat mon-fstat--highlight">
            <div class="mon-fstat__icon mon-fstat__icon--monthly"><i class="fas fa-chart-line"></i></div>
            <span class="mon-fstat__val">10 500 $</span>
            <span class="mon-fstat__lbl">{{ $t('ui.revenus_mensuels_plateforme') }}</span>
            <span class="mon-fstat__sub">{{ $t('ui.estimation_conservatrice') }}</span>
          </div>

          <div class="mon-fstat mon-fstat--highlight mon-fstat--annual">
            <div class="mon-fstat__icon mon-fstat__icon--annual"><i class="fas fa-chart-bar"></i></div>
            <span class="mon-fstat__val">126 000 $</span>
            <span class="mon-fstat__lbl">{{ $t('ui.revenus_annuels_estim_s') }}</span>
            <span class="mon-fstat__sub">{{ $t('ui.ann_e_1_base_de_calcul') }}</span>
          </div>

        </div>
      </div>
    </section>

    <!-- ══ OBJECTIF 3 ANS ════════════════════════════════════════════════ -->
    <section class="mon-section">
      <div class="mon-section-header">
        <div class="mon-section-num">06</div>
        <h2 class="mon-section-title">{{ $t('ui.objectif_3_ans') }}</h2>
      </div>

      <div class="mon-roadmap">
        <div class="mon-milestone">
          <div class="mon-milestone__badge mon-milestone__badge--1">{{ $t('ui.an_1') }}</div>
          <div class="mon-milestone__body">
            <h4>{{ $t('ui.lancement_croissance') }}</h4>
            <ul>
              <li><i class="fas fa-users"></i>{{ $t('ui.20_000_utilisateurs_actifs') }}</li>
              <li><i class="fas fa-video"></i>{{ $t('ui.1_000_streamers_actifs') }}</li>
              <li><i class="fas fa-coins"></i>{{ $t('ui.126_000_revenus_annuels') }}</li>
            </ul>
          </div>
        </div>

        <div class="mon-milestone__line"></div>

        <div class="mon-milestone">
          <div class="mon-milestone__badge mon-milestone__badge--2">{{ $t('ui.an_2') }}</div>
          <div class="mon-milestone__body">
            <h4>{{ $t('ui.expansion_partenariats') }}</h4>
            <ul>
              <li><i class="fas fa-users"></i>{{ $t('ui.60_000_utilisateurs_actifs') }}</li>
              <li><i class="fas fa-video"></i>{{ $t('ui.5_000_streamers_actifs') }}</li>
              <li><i class="fas fa-globe"></i>{{ $t('ui.expansion_r_gionale') }}</li>
            </ul>
          </div>
        </div>

        <div class="mon-milestone__line"></div>

        <div class="mon-milestone">
          <div class="mon-milestone__badge mon-milestone__badge--3">{{ $t('ui.an_3') }}</div>
          <div class="mon-milestone__body">
            <h4>{{ $t('ui.leadership_mondial') }}</h4>
            <ul>
              <li><i class="fas fa-users"></i>{{ $t('ui.100_000_utilisateurs_actifs') }}</li>
              <li><i class="fas fa-video"></i>{{ $t('ui.10_000_streamers_actifs') }}</li>
              <li><i class="fas fa-coins"></i>{{ $t('ui.2_000_000_revenus_annuels') }}</li>
              <li><i class="fas fa-globe"></i>{{ $t('ui.expansion_internationale') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ CONCLUSION CTA ════════════════════════════════════════════════ -->
    <section class="mon-cta">
      <div class="mon-cta__blobs">
        <div class="mon-cta__blob"></div>
      </div>
      <div class="mon-cta__content">
        <h2 class="mon-cta__title">
          Ebetstream — Le Leader du Streaming<br class="d-none d-md-block" />
          Compétitif Monétisé
        </h2>
        <p class="mon-cta__sub">
          La plateforme transforme le gaming en opportunité économique durable.<br />
          Rejoignez l'aventure dès maintenant.
        </p>
        <div class="mon-cta__actions">
          <router-link to="/challenges" class="mon-btn mon-btn--primary">
            <i class="fas fa-gamepad"></i>{{ $t('ui.commencer_par_jouer') }}</router-link>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

// Static page — no data fetching needed
</script>

<style scoped>
/* ─── Root ─── */
.mon-page { padding: 0 0 60px; }

/* ─── Hero ─── */
.mon-hero {
  position: relative;
  padding: 56px 0 52px;
  overflow: hidden;
  border-bottom: 1px solid rgb(var(--n2));
  margin-bottom: 48px;
}

.mon-hero__blobs {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.mon-hero__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);

  &--1 {
    width: 480px; height: 480px;
    background: rgba(var(--g1), .1);
    top: -120px; left: -100px;
  }
  &--2 {
    width: 340px; height: 340px;
    background: rgba(var(--r1), .06);
    bottom: -80px; right: -60px;
  }
}

.mon-hero__content {
  position: relative;
  z-index: 2;
  max-width: 720px;
}

.mon-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: rgb(var(--g1));
  background: rgba(var(--g1), .1);
  border: 1px solid rgba(var(--g1), .25);
  padding: 4px 12px;
  border-radius: 12px;
  margin-bottom: 20px;
  i { font-size: 13px; }
}

.mon-hero__title {
  font-size: clamp(28px, 5vw, 52px);
  font-weight: 900;
  color: rgb(var(--n8));
  line-height: 1.1;
  margin: 0 0 18px;
  letter-spacing: -1px;
}

.mon-accent {
  background: linear-gradient(90deg, rgb(var(--g1)) 0%, rgba(200, 144, 255, 1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.mon-hero__sub {
  font-size: 16px;
  color: rgb(var(--n3));
  line-height: 1.65;
  margin: 0 0 36px;
  max-width: 560px;
}

.mon-hero__stats {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.mon-hstat { display: flex; flex-direction: column; gap: 2px; }
.mon-hstat__val { font-size: 26px; font-weight: 900; color: rgb(var(--n8)); line-height: 1; }
.mon-hstat__lbl { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; color: rgb(var(--n3)); }
.mon-hstat__sep { width: 1px; height: 36px; background: rgb(var(--n2)); }

/* ─── Section shell ─── */
.mon-section { margin-bottom: 52px; }

.mon-section-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
}

.mon-section-num {
  width: 36px; height: 36px;
  border-radius: 8px;
  background: rgba(var(--g1), .14);
  color: rgb(var(--g1));
  font-size: 13px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mon-section-title {
  font-size: 20px;
  font-weight: 800;
  color: rgb(var(--n8));
  margin: 0;
  letter-spacing: -.2px;
}

/* ─── Vision ─── */
.mon-vision-card {
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-left: 4px solid rgb(var(--g1));
  border-radius: 10px;
  padding: 28px 32px;
  display: flex;
  gap: 20px;
  align-items: flex-start;

  @media (max-width: 576px) { flex-direction: column; padding: 20px; }
}

.mon-vision-icon {
  width: 48px; height: 48px;
  border-radius: 10px;
  background: rgba(var(--g1), .14);
  color: rgb(var(--g1));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.mon-vision-text {
  font-size: 15px;
  color: rgb(var(--n5));
  line-height: 1.7;
  margin: 0 0 12px;
  strong { color: rgb(var(--n8)); font-weight: 700; }
}

.mon-vision-tagline {
  font-size: 14px;
  font-weight: 600;
  font-style: italic;
  color: rgb(var(--g1));
  margin: 0;
}

/* ─── Revenue grid ─── */
.mon-revenue-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 576px) { grid-template-columns: 1fr; }
}

.mon-revenue-card {
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 10px;
  padding: 24px;
  transition: border-color .2s, transform .2s;
  &:hover { border-color: rgba(var(--g1), .4); transform: translateY(-3px); }
}

.mon-revenue-card__header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}

.mon-revenue-icon {
  width: 44px; height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;

  &--a { background: rgba(236, 72, 153, .15); color: rgba(236, 72, 153, 1); }
  &--b { background: rgba(var(--g1), .14); color: rgb(var(--g1)); }
  &--c { background: rgba(255, 180, 0, .15); color: rgb(255, 180, 0); }
}

.mon-revenue-label {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: rgb(var(--n3));
  display: block;
  margin-bottom: 2px;
}

.mon-revenue-title {
  font-size: 15px;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0;
}

.mon-revenue-desc {
  font-size: 13px;
  color: rgb(var(--n3));
  line-height: 1.6;
  margin: 0 0 18px;
}

/* Split bar (2-way) */
.mon-split {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.mon-split__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.mon-split__pct {
  font-size: 22px;
  font-weight: 900;
  line-height: 1;
}

.mon-split__lbl {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: rgb(var(--n3));
}

.mon-split__item--streamer .mon-split__pct { color: rgb(var(--g1)); }
.mon-split__item--platform .mon-split__pct { color: rgb(var(--n3)); }
.mon-split__divider { width: 1px; height: 32px; background: rgb(var(--n2)); }

.mon-split-bar {
  height: 6px;
  background: rgb(var(--p3));
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.mon-split-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, rgb(var(--g1)), rgba(200, 144, 255, 1));
  border-radius: 3px;
}

.mon-split-note {
  font-size: 11px;
  color: rgb(var(--n3));
  margin: 0;
  font-style: italic;
}

/* Triple split (3-way) */
.mon-triple-split {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.mon-triple-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  flex: 1;
  min-width: 60px;
  padding: 10px 6px;
  border-radius: 6px;
}

.mon-triple-pct {
  font-size: 20px;
  font-weight: 900;
  line-height: 1;
}

.mon-triple-lbl {
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: .03em;
  color: rgb(var(--n3));
}

.mon-triple-item--players  { background: rgba(0, 200, 83, .1); .mon-triple-pct { color: rgb(0, 200, 83); } }
.mon-triple-item--organizer { background: rgba(var(--g1), .1); .mon-triple-pct { color: rgb(var(--g1)); } }
.mon-triple-item--platform { background: rgba(var(--n2), .5); .mon-triple-pct { color: rgb(var(--n3)); } }

.mon-triple-bar {
  height: 6px;
  display: flex;
  border-radius: 3px;
  overflow: hidden;
}

.mon-triple-bar__s { background: rgb(0, 200, 83); }
.mon-triple-bar__o { background: rgb(var(--g1)); }
.mon-triple-bar__p { background: rgb(var(--n2)); }

/* ─── Tiers ─── */
.mon-tiers {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  align-items: start;

  @media (max-width: 768px) { grid-template-columns: 1fr; max-width: 400px; }
}

.mon-tier {
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 12px;
  padding: 28px 24px;
  position: relative;
  transition: transform .2s;
  &:hover { transform: translateY(-4px); }
}

.mon-tier--featured {
  border-color: rgb(var(--g1));
  box-shadow: 0 0 0 1px rgba(var(--g1), .25), 0 8px 32px rgba(var(--g1), .12);
}

.mon-tier__popular {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgb(var(--g1));
  color: rgb(var(--n8));
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .08em;
  padding: 3px 12px;
  border-radius: 10px;
  white-space: nowrap;
}

.mon-tier__badge {
  width: 52px; height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 16px;

  .mon-tier--rookie & { background: rgba(255, 100, 50, .15); color: rgb(255, 100, 50); }
  .mon-tier--pro &    { background: rgba(var(--g1), .15); color: rgb(var(--g1)); }
  .mon-tier--elite &  { background: rgba(255, 180, 0, .15); color: rgb(255, 180, 0); }
}

.mon-tier__name {
  font-size: 20px;
  font-weight: 800;
  color: rgb(var(--n8));
  margin: 0 0 4px;
}

.mon-tier__range {
  font-size: 12px;
  color: rgb(var(--n3));
  margin: 0 0 18px;
}

.mon-tier__commission {
  display: flex;
  align-items: baseline;
  gap: 5px;
  margin-bottom: 18px;
  padding-bottom: 18px;
  border-bottom: 1px solid rgb(var(--n2));
}

.mon-tier__pct {
  font-size: 36px;
  font-weight: 900;
  color: rgb(var(--n8));
  line-height: 1;
}

.mon-tier__pct-lbl {
  font-size: 13px;
  color: rgb(var(--n3));
  font-weight: 600;
}

.mon-tier__perks {
  list-style: none;
  padding: 0;
  margin: 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: rgb(var(--n5));

    i {
      font-size: 14px;
      color: rgb(0, 200, 83);
      flex-shrink: 0;
    }
  }
}

.mon-tier__cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  height: 40px;
  background: rgba(var(--n8), .08);
  border: 1px solid rgba(var(--n8), .15);
  color: rgb(var(--n8));
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: all .2s;
  &:hover { background: rgba(var(--n8), .14); color: rgb(var(--n8)); }

  &--featured {
    background: rgb(var(--g1));
    border-color: rgb(var(--g1));
    color: rgb(var(--n8));
    box-shadow: 0 4px 16px rgba(var(--g1), .3);
    &:hover { background: rgba(var(--g1), .85); color: rgb(var(--n8)); }
  }
}

/* ─── Rules ─── */
.mon-rules-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
}

.mon-rule {
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 8px;
  padding: 20px;

  h4 {
    font-size: 14px;
    font-weight: 700;
    color: rgb(var(--n8));
    margin: 0 0 6px;
  }
  p {
    font-size: 13px;
    color: rgb(var(--n3));
    line-height: 1.55;
    margin: 0;
  }
}

.mon-rule__icon {
  width: 38px; height: 38px;
  border-radius: 8px;
  background: rgba(var(--g1), .12);
  color: rgb(var(--g1));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-bottom: 12px;
}

/* ─── Finance ─── */
.mon-finance-banner {
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 12px;
  padding: 32px;

  @media (max-width: 576px) { padding: 20px; }
}

.mon-finance-banner__caption {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: rgb(var(--n3));
  margin: 0 0 24px;
}

.mon-finance-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 1000px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px)  { grid-template-columns: 1fr; }
}

.mon-fstat {
  background: rgb(var(--p3));
  border: 1px solid rgb(var(--n2));
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &--highlight {
    border-color: rgba(var(--g1), .4);
    background: rgba(var(--g1), .06);
  }

  &--annual {
    border-color: rgba(255, 180, 0, .4);
    background: rgba(255, 180, 0, .06);
  }
}

.mon-fstat__icon {
  width: 36px; height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  margin-bottom: 8px;

  &--credits   { background: rgba(var(--g1), .14); color: rgb(var(--g1)); }
  &--donations { background: rgba(236, 72, 153, .12); color: rgba(236, 72, 153, 1); }
  &--monthly   { background: rgba(0, 200, 83, .12); color: rgb(0, 200, 83); }
  &--annual    { background: rgba(255, 180, 0, .12); color: rgb(255, 180, 0); }
}

.mon-fstat__val {
  font-size: 22px;
  font-weight: 900;
  color: rgb(var(--n8));
  line-height: 1;
}

.mon-fstat__lbl {
  font-size: 12px;
  font-weight: 600;
  color: rgb(var(--n5));
}

.mon-fstat__sub {
  font-size: 11px;
  color: rgb(var(--n3));
  strong { color: rgb(var(--n8)); }
}

/* ─── Roadmap ─── */
.mon-roadmap {
  display: flex;
  align-items: flex-start;
  gap: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.mon-milestone {
  flex: 1;
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 10px;
  padding: 24px;

  h4 {
    font-size: 15px;
    font-weight: 700;
    color: rgb(var(--n8));
    margin: 0 0 14px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;

    li {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: rgb(var(--n5));
      i { font-size: 14px; color: rgb(var(--g1)); flex-shrink: 0; }
    }
  }
}

.mon-milestone__line {
  width: 32px;
  height: 2px;
  background: rgba(var(--g1), .35);
  flex-shrink: 0;
  align-self: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    right: -5px;
    top: -4px;
    width: 0; height: 0;
    border-left: 7px solid rgba(var(--g1), .5);
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
  }

  @media (max-width: 768px) {
    width: 2px; height: 24px;
    align-self: center;
    margin: 0 auto;

    &::after {
      right: -4px; top: auto;
      bottom: -5px;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 7px solid rgba(var(--g1), .5);
      border-bottom: none;
    }
  }
}

.mon-milestone__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  padding: 0 12px;
  border-radius: 13px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .05em;
  margin-bottom: 12px;

  &--1 { background: rgba(var(--n2), .8); color: rgb(var(--n5)); }
  &--2 { background: rgba(var(--g1), .15); color: rgb(var(--g1)); }
  &--3 { background: rgba(255, 180, 0, .15); color: rgb(255, 180, 0); }
}

/* ─── CTA ─── */
.mon-cta {
  position: relative;
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 14px;
  padding: 56px 48px;
  text-align: center;
  overflow: hidden;

  @media (max-width: 576px) { padding: 40px 24px; }
}

.mon-cta__blobs {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.mon-cta__blob {
  position: absolute;
  width: 500px; height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--g1), .1) 0%, transparent 70%);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}

.mon-cta__content { position: relative; z-index: 2; }

.mon-cta__title {
  font-size: clamp(22px, 4vw, 36px);
  font-weight: 900;
  color: rgb(var(--n8));
  margin: 0 0 14px;
  letter-spacing: -.5px;
}

.mon-cta__sub {
  font-size: 15px;
  color: rgb(var(--n3));
  line-height: 1.6;
  margin: 0 0 32px;
}

.mon-cta__actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

/* ─── Buttons ─── */
.mon-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition: all .2s;
  white-space: nowrap;

  &--primary {
    background: rgb(var(--g1));
    color: rgb(var(--n8));
    box-shadow: 0 4px 20px rgba(var(--g1), .3);
    &:hover { background: rgba(var(--g1), .85); color: rgb(var(--n8)); transform: translateY(-2px); }
  }

  &--ghost {
    background: rgba(var(--n8), .08);
    color: rgb(var(--n8));
    border: 1px solid rgba(var(--n8), .16);
    &:hover { background: rgba(var(--n8), .14); color: rgb(var(--n8)); }
  }
}
</style>
