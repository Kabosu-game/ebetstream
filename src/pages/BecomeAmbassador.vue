<template>
  <div class="page-content-with-space">
    <section class="defis_section py-6 position-relative overflow-hidden pb-120">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 gx-0 gx-lg-4">
            <div class="defis__main">
              <!-- Header -->
              <div class="text-center mb-5">
                <h1 class="text-white fw-bold mb-3">Become a Certified Ambassador</h1>
                <p class="text-white-50">Join our team of ambassadors and represent Ebetstream on social media</p>
              </div>

              <!-- Conditions -->
              <div class="defi_card n11-bg rounded-8 p-4 p-lg-5 mb-4">
                <h2 class="text-white fw-bold mb-4">
                  <i class="fas fa-check-circle me-2 text-warning"></i>
                  Conditions to Become a Certified Ambassador
                </h2>
                <ul class="conditions-list text-white">
                  <li>Have an active presence on social media</li>
                  <li>Have a minimum number of followers (e.g., 500–5000, according to your choice)</li>
                  <li>Regularly produce Ebetstream content (posts, videos, invitations)</li>
                  <li>Represent the platform in a professional manner</li>
                </ul>
              </div>

              <!-- Documents requis -->
              <div class="defi_card n11-bg rounded-8 p-4 p-lg-5 mb-4">
                <h2 class="text-white fw-bold mb-4">
                  <i class="fas fa-file-alt me-2 text-warning"></i>
                  Required Documents
                </h2>
                <div class="mb-3">
                  <h5 class="text-white mb-3">Identity Documents (required)</h5>
                  <ul class="text-white-50">
                    <li>ID Card / Passport (front and back)</li>
                    <li>Selfie for face verification (anti-fraud)</li>
                  </ul>
                </div>
                <div>
                  <h5 class="text-white mb-3">Specific Documents for Ambassadors</h5>
                  <ul class="text-white-50">
                    <li>Link to social media accounts</li>
                    <li>Audience statistics (optional)</li>
                    <li>Previous media (posts, videos)</li>
                  </ul>
                </div>
              </div>

              <!-- Processus -->
              <div class="defi_card n11-bg rounded-8 p-4 p-lg-5 mb-4">
                <h2 class="text-white fw-bold mb-4">
                  <i class="fas fa-list-ol me-2 text-warning"></i>
                  Validation Process
                </h2>
                <div class="process-steps">
                  <div class="step-item mb-3">
                    <div class="step-number">1</div>
                    <div class="step-content">
                      <h5 class="text-white mb-2">Submission</h5>
                      <p class="text-white-50 mb-0">The candidate fills out a form + submits documents</p>
                    </div>
                  </div>
                  <div class="step-item mb-3">
                    <div class="step-number">2</div>
                    <div class="step-content">
                      <h5 class="text-white mb-2">Verification</h5>
                      <p class="text-white-50 mb-0">The Ebetstream team verifies: identity, account history, behavior, documents provided</p>
                    </div>
                  </div>
                  <div class="step-item mb-3">
                    <div class="step-number">3</div>
                    <div class="step-content">
                      <h5 class="text-white mb-2">Test</h5>
                      <p class="text-white-50 mb-0">Audience verification</p>
                    </div>
                  </div>
                  <div class="step-item mb-3">
                    <div class="step-number">4</div>
                    <div class="step-content">
                      <h5 class="text-white mb-2">Quick Interview (optional)</h5>
                      <p class="text-white-50 mb-0">5-minute video call or video recording</p>
                    </div>
                  </div>
                  <div class="step-item mb-3">
                    <div class="step-number">5</div>
                    <div class="step-content">
                      <h5 class="text-white mb-2">Validation</h5>
                      <p class="text-white-50 mb-0">Awarding of an official badge + access to advanced tools</p>
                    </div>
                  </div>
                  <div class="step-item">
                    <div class="step-number">6</div>
                    <div class="step-content">
                      <h5 class="text-white mb-2">Training</h5>
                      <p class="text-white-50 mb-0">Mini-guides or videos provided by Ebetstream</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Critères de disqualification -->
              <div class="defi_card n11-bg rounded-8 p-4 p-lg-5 mb-4">
                <h2 class="text-white fw-bold mb-4">
                  <i class="fas fa-ban me-2 text-danger"></i>
                  Disqualification / Rejection Criteria
                </h2>
                <ul class="text-white-50">
                  <li>Falsified documents</li>
                  <li>Suspicious activities or multiple accounts</li>
                  <li>Fraudulent betting or match-fixing</li>
                  <li>Insults, toxicity, harassment</li>
                  <li>Refusal to cooperate with the rules</li>
                  <li>Poor past experiences in e-sports</li>
                </ul>
              </div>

              <!-- Formulaire de demande -->
              <div class="defi_card n11-bg rounded-8 p-4 p-lg-5">
                <h2 class="text-white fw-bold mb-4">
                  <i class="fas fa-paper-plane me-2 text-warning"></i>
                  Submit Your Request
                </h2>
                <CertificationForm type="ambassador" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import CertificationForm from '@/components/Pages/Certification/CertificationForm.vue';
</script>

<style scoped>
.page-content-with-space {
  padding-top: 90px;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
}

.defis_section {
  width: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
}

.conditions-list {
  list-style: none;
  padding: 0;
}

.conditions-list li {
  padding: 0.75rem 0;
  padding-left: 2rem;
  position: relative;
}

.conditions-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #FF9F00;
  font-weight: bold;
}

.process-steps {
  position: relative;
}

.step-item {
  display: flex;
  gap: 1.5rem;
  position: relative;
}

.step-item:not(:last-child)::after {
  content: "";
  position: absolute;
  left: 1.25rem;
  top: 3rem;
  width: 2px;
  height: calc(100% + 1rem);
  background: rgba(255, 255, 255, 0.1);
}

.step-number {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF9F00 0%, #FFB84D 100%);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  padding-top: 0.25rem;
}

@media (max-width: 768px) {
  .page-content-with-space {
    padding-top: 60px;
  }
  
  .container-fluid {
    margin-left: 0 !important;
  }
  
  .defis__main {
    margin-left: 0 !important;
  }
}
</style>

