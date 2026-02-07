<template>
  <div class="maintenance-page">
    <div class="maintenance-container">
      <div class="maintenance-content">
        <!-- Icon -->
        <div class="maintenance-icon">
          <i class="fas fa-tools"></i>
        </div>

        <!-- Title -->
        <h1 class="maintenance-title">Site en Maintenance</h1>

        <!-- Message -->
        <p class="maintenance-message">
          Nous effectuons actuellement des améliorations pour vous offrir une meilleure expérience.
          <br />
          Nous serons de retour très bientôt !
        </p>

        <!-- Countdown (optional) -->
        <div class="maintenance-info">
          <p class="maintenance-subtitle">
            <i class="fas fa-clock me-2"></i>
            Merci de votre patience
          </p>
        </div>

        <!-- Decorative elements -->
        <div class="maintenance-decoration">
          <div class="decoration-circle circle-1"></div>
          <div class="decoration-circle circle-2"></div>
          <div class="decoration-circle circle-3"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page de maintenance - Pas de logique nécessaire
</script>

<style scoped>
.maintenance-page {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

.maintenance-container {
  position: relative;
  z-index: 2;
  max-width: 600px;
  width: 100%;
}

.maintenance-content {
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 4rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.maintenance-icon {
  font-size: 5rem;
  color: #FF9F00;
  margin-bottom: 2rem;
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.maintenance-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1.5rem;
  background: linear-gradient(90deg, #FF9F00, #FFD700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.maintenance-message {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  margin-bottom: 2rem;
}

.maintenance-info {
  margin-top: 2rem;
}

.maintenance-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  display: inline-flex;
  align-items: center;
}

.maintenance-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 159, 0, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-30px) scale(1.1);
    opacity: 0.5;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .maintenance-content {
    padding: 3rem 1.5rem;
  }

  .maintenance-icon {
    font-size: 4rem;
  }

  .maintenance-title {
    font-size: 2rem;
  }

  .maintenance-message {
    font-size: 1rem;
  }
}
</style>

