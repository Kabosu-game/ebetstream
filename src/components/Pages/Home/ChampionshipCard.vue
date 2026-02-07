<template>
  <div 
    class="player_card p-4"
    style="cursor: pointer;"
    @click="$emit('click')"
  >
    <!-- Championship Header -->
    <div class="mb-3">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <span 
          class="status_badge px-3 py-1 badge"
          :class="getStatusClass(championship.status)"
        >
          {{ getStatusLabel(championship.status) }}
        </span>
      </div>
      
      <!-- Game Info -->
      <div class="d-flex align-items-center gap-3 mb-3">
        <div 
          class="game_icon rounded-circle overflow-hidden d-flex align-items-center justify-content-center"
          style="width: 60px; height: 60px; flex-shrink: 0; border: 2px solid #FFD700; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
        >
          <i :class="getGameIcon(championship.game)" class="text-white fs-four"></i>
        </div>
        <div class="flex-grow-1">
          <h5 class="player_name mb-1">{{ championship.game }}</h5>
          <p class="player_score mb-0" style="font-size: 0.85rem;">{{ championship.name }}</p>
        </div>
      </div>
    </div>

    <!-- Championship Info -->
    <div class="player_info mb-3">
      <!-- Dates -->
      <div class="mb-2">
        <p class="player_score mb-1">
          <i class="fas fa-calendar-alt me-1"></i>
          <strong>Start:</strong> {{ formatDate(championship.start_date) }}
        </p>
        <p class="player_score mb-0">
          <i class="fas fa-clock me-1"></i>
          <strong>Registration ends:</strong> {{ formatDate(championship.registration_end_date) }}
        </p>
      </div>

      <!-- Stats -->
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="d-flex align-items-center gap-1">
          <i class="fas fa-users fs-eight text-warning"></i>
          <span class="player_score">{{ championship.validated_registrations_count || 0 }}/{{ championship.max_participants }}</span>
        </div>
        <div class="d-flex align-items-center gap-1">
          <i class="fas fa-coins fs-eight text-warning"></i>
          <span class="player_score">{{ championship.registration_fee }} EBT</span>
        </div>
      </div>

      <!-- Prize Pool -->
      <div v-if="championship.total_prize_pool" class="mb-2">
        <p class="player_score mb-0 text-warning">
          <i class="fas fa-coins me-1"></i>
          <strong>Prize Pool:</strong> {{ championship.total_prize_pool }} EBT
        </p>
      </div>
    </div>

    <!-- Action -->
    <div class="d-flex justify-content-center mt-auto">
      <button 
        class="btn_see_details rounded-4 fw-semibold px-4 py-2"
        @click.stop="$emit('click')"
      >
        <span v-if="championship.status === 'registration_open'">
          <i class="fas fa-user-plus me-2"></i>Register Now
        </span>
        <span v-else>
          <i class="fas fa-eye me-2"></i>View Details
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Championship {
  id: number;
  name: string;
  game: string;
  division: string;
  description?: string;
  registration_fee: number;
  total_prize_pool?: number;
  max_participants: number;
  status: string;
  registration_start_date: string;
  registration_end_date: string;
  start_date: string;
  validated_registrations_count?: number;
}

const props = defineProps<{
  championship: Championship;
}>();

defineEmits<{
  click: [];
}>();

const formatDate = (dateString: string) => {
  if (!dateString) return 'TBA';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

const getStatusLabel = (status: string) => {
  const labels: { [key: string]: string } = {
    'draft': 'Draft',
    'registration_open': 'Registration Open',
    'registration_closed': 'Registration Closed',
    'validated': 'Validated',
    'started': 'Live',
    'finished': 'Finished',
    'cancelled': 'Cancelled'
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  const classes: { [key: string]: string } = {
    'registration_open': 'bg-success',
    'validated': 'bg-warning text-dark',
    'registration_closed': 'bg-info',
    'started': 'bg-danger',
    'finished': 'bg-secondary',
    'cancelled': 'bg-dark'
  };
  return classes[status] || 'bg-secondary';
};

const getGameIcon = (gameName: string) => {
  const lower = gameName.toLowerCase();
  if (lower.includes('pubg')) return 'ti ti-device-gamepad-2';
  if (lower.includes('free fire') || lower.includes('garena')) return 'ti ti-flame';
  if (lower.includes('mobile legends') || lower.includes('mlbb')) return 'ti ti-swords';
  if (lower.includes('cod') || lower.includes('call of duty')) return 'ti ti-gun';
  if (lower.includes('efootball') || lower.includes('fc') || lower.includes('dls') || lower.includes('football')) return 'ti ti-ball-football';
  if (lower.includes('clash royale')) return 'ti ti-crown';
  if (lower.includes('brawl stars')) return 'ti ti-star';
  if (lower.includes('stumble guys')) return 'ti ti-users';
  return 'ti ti-gamepad';
};
</script>

<style scoped>
.player_card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.player_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 159, 0, 0.3);
}

.player_name {
  font-weight: 700;
  font-size: 1.1rem;
}

.player_score {
  font-size: 0.9rem;
  opacity: 0.85;
}

.btn_see_details {
  background-color: #FF9F00;
  color: #000;
  border: none;
  transition: 0.3s;
}

.btn_see_details:hover {
  background-color: #FF9F00;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 159, 0, 0.3);
}
</style>
