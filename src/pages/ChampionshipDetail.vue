<template>
  <div class="page-content-with-space">
    <!-- Championship Details Section -->
    <section class="defis_section py-6 position-relative overflow-hidden pb-120">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 gx-0 gx-lg-4">
            <div class="defis__main">
              <!-- Loading State -->
              <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <!-- Error State -->
              <div v-else-if="error" class="text-center py-5">
                <div class="alert alert-danger">
                  {{ error }}
                </div>
                <button class="btn_primary mt-3" @click="$router.push('/championships')">
                  <i class="fas fa-arrow-left me-2"></i>
                  Back to Championships
                </button>
              </div>

              <!-- Championship Details -->
              <div v-else-if="championship">
                <!-- Header -->
                <div class="row mb-5">
                  <div class="col-12">
                    <button class="btn_secondary mb-4" @click="$router.push('/championships')">
                      <i class="fas fa-arrow-left me-2"></i>
                      Back
                    </button>
                    
                    <div class="defis_content">
                      <div class="d-flex align-items-center gap-3 mb-3">
                        <span class="division_badge" :class="`division_${championship.division}`">
                          <i class="fas fa-trophy me-2"></i>
                          Division {{ championship.division }}
                        </span>
                        <span 
                          class="status_badge px-3 py-1 badge"
                          :class="getStatusClass(championship.status)"
                        >
                          {{ getStatusLabel(championship.status) }}
                        </span>
                      </div>
                      <h2 class="hero_title mb-4">
                        <span class="text_gradient">{{ championship.game }}</span><br />
                        {{ championship.name }}
                      </h2>
                      <p v-if="championship.description" class="hero_subtitle">
                        {{ championship.description }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Main Content -->
                <div class="row g-4">
                  <!-- Left Column - Championship Info -->
                  <div class="col-lg-8">
                    <!-- Championship Details Card -->
                    <div class="defi_card n11-bg rounded-8 p-4 p-lg-6 mb-4">
                      <h4 class="fw-bold mb-4 text-white">Championship Information</h4>
                      
                      <!-- Dates -->
                      <div class="row g-4 mb-4">
                        <div class="col-md-6">
                          <div class="info_item p-3 rounded" style="background: rgba(255, 255, 255, 0.05);">
                            <div class="d-flex align-items-center gap-2 mb-2">
                              <i class="fas fa-calendar-alt text-warning"></i>
                              <span class="fw-bold text-white">Start Date</span>
                            </div>
                            <p class="mb-0 text-white-50">{{ formatDate(championship.start_date) }}</p>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="info_item p-3 rounded" style="background: rgba(255, 255, 255, 0.05);">
                            <div class="d-flex align-items-center gap-2 mb-2">
                              <i class="fas fa-clock text-info"></i>
                              <span class="fw-bold text-white">Registration Ends</span>
                            </div>
                            <p class="mb-0 text-white-50">{{ formatDate(championship.registration_end_date) }}</p>
                          </div>
                        </div>
                      </div>

                      <!-- Stats -->
                      <div class="row g-4 mb-4">
                        <div class="col-md-4">
                          <div class="info_item p-3 rounded text-center" style="background: rgba(255, 255, 255, 0.05);">
                            <div class="d-flex align-items-center justify-content-center gap-2 mb-2">
                              <i class="fas fa-users text-warning"></i>
                            </div>
                            <h5 class="fw-bold text-white mb-1">
                              {{ championship.validated_registrations_count || 0 }}/{{ championship.max_participants }}
                            </h5>
                            <p class="mb-0 text-white-50 small">Participants</p>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="info_item p-3 rounded text-center" style="background: rgba(255, 255, 255, 0.05);">
                            <div class="d-flex align-items-center justify-content-center gap-2 mb-2">
                              <i class="fas fa-coins text-warning"></i>
                            </div>
                            <h5 class="fw-bold text-white mb-1">{{ championship.registration_fee }} EBT</h5>
                            <p class="mb-0 text-white-50 small">Entry Fee</p>
                          </div>
                        </div>
                        <div class="col-md-4" v-if="championship.total_prize_pool">
                          <div class="info_item p-3 rounded text-center" style="background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255, 215, 0, 0.3);">
                            <div class="d-flex align-items-center justify-content-center gap-2 mb-2">
                              <i class="fas fa-coins text-warning"></i>
                            </div>
                            <h5 class="fw-bold text-warning mb-1">{{ championship.total_prize_pool }} EBT</h5>
                            <p class="mb-0 text-white-50 small">Prize Pool</p>
                          </div>
                        </div>
                      </div>

                      <!-- Prize Distribution -->
                      <div v-if="championship.prize_distribution" class="mb-4">
                        <h5 class="fw-bold mb-3 text-white">Prize Distribution</h5>
                        <div class="row g-3">
                          <div 
                            v-for="(prize, position) in championship.prize_distribution" 
                            :key="position"
                            class="col-md-6"
                          >
                            <div class="prize_item p-3 rounded d-flex justify-content-between align-items-center" style="background: rgba(255, 255, 255, 0.05);">
                              <div>
                                <span class="fw-bold text-white">{{ position }}</span>
                                <span class="text-white-50 ms-2">Place</span>
                              </div>
                              <span class="fw-bold text-warning">{{ prize }} EBT</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Rules -->
                      <div v-if="championship.rules" class="mb-4">
                        <h5 class="fw-bold mb-3 text-white">Rules</h5>
                        <div class="rules_content p-3 rounded" style="background: rgba(255, 255, 255, 0.05);">
                          <p class="text-white-50 mb-0" style="white-space: pre-line;">{{ championship.rules }}</p>
                        </div>
                      </div>

                      <!-- Registration Button -->
                      <div v-if="!isRegistered" class="mt-4">
                        <!-- Check if registration is open -->
                        <div v-if="isRegistrationOpen" class="mb-3">
                          <button 
                            class="btn_primary w-100 py-3"
                            @click="showRegistrationModal = true"
                            :disabled="(championship.validated_registrations_count || 0) >= championship.max_participants"
                          >
                            <i class="fas fa-user-plus me-2"></i>
                            {{ (championship.validated_registrations_count || 0) >= championship.max_participants ? 'Championship Full' : 'Register Now' }}
                          </button>
                        </div>
                        
                        <!-- Registration not open yet -->
                        <div v-else-if="!hasRegistrationStarted" class="alert alert-info">
                          <i class="fas fa-clock me-2"></i>
                          <strong>Registrations will start on:</strong> {{ formatDate(championship.registration_start_date) }}
                        </div>
                        
                        <!-- Registration closed -->
                        <div v-else class="alert alert-warning">
                          <i class="fas fa-ban me-2"></i>
                          <strong>Registrations closed on:</strong> {{ formatDate(championship.registration_end_date) }}
                        </div>
                      </div>
                      
                      <!-- Already registered -->
                      <div v-if="isRegistered" class="mt-4">
                        <div class="alert alert-success">
                          <i class="fas fa-check-circle me-2"></i>
                          You are registered for this championship!
                        </div>
                      </div>
                    </div>

                    <!-- Matches Card -->
                    <div v-if="matches.length > 0" class="defi_card n11-bg rounded-8 p-4 p-lg-6 mb-4">
                      <h4 class="fw-bold mb-4 text-white">Scheduled Matches</h4>
                      <div class="matches_list">
                        <div 
                          v-for="match in matches" 
                          :key="match.id"
                          class="match_card p-4 mb-3 rounded"
                          style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);"
                        >
                          <div class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                              <span class="badge bg-warning text-dark me-2">Round {{ match.round_number }}</span>
                              <span class="text-white-50 small">
                                <i class="fas fa-clock me-1"></i>
                                {{ formatDate(match.scheduled_at) }}
                              </span>
                            </div>
                            <span class="badge" :class="getMatchStatusClass(match.status)">
                              {{ getMatchStatusLabel(match.status) }}
                            </span>
                          </div>
                          
                          <div class="match_teams d-flex align-items-center justify-content-between mb-3">
                            <div class="team_info d-flex align-items-center gap-3">
                              <div class="team_avatar">
                                <img 
                                  v-if="match.player1?.team_logo" 
                                  :src="getTeamLogoUrl(match.player1.team_logo)" 
                                  :alt="match.player1?.team_name"
                                  style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;"
                                />
                                <i v-else class="fas fa-users" style="font-size: 2rem; color: #FFD700;"></i>
                              </div>
                              <div>
                                <h6 class="mb-0 text-white">{{ match.player1?.team_name || 'Team 1' }}</h6>
                                <p class="mb-0 text-white-50 small">
                                  @{{ match.player1?.user?.username || match.player1?.player_username || 'player1' }}
                                </p>
                              </div>
                            </div>
                            
                            <div class="vs_text text-center mx-3">
                              <span class="text-white-50 fw-bold">VS</span>
                            </div>
                            
                            <div class="team_info d-flex align-items-center gap-3">
                              <div>
                                <h6 class="mb-0 text-white text-end">{{ match.player2?.team_name || 'Team 2' }}</h6>
                                <p class="mb-0 text-white-50 small text-end">
                                  @{{ match.player2?.user?.username || match.player2?.player_username || 'player2' }}
                                </p>
                              </div>
                              <div class="team_avatar">
                                <img 
                                  v-if="match.player2?.team_logo" 
                                  :src="getTeamLogoUrl(match.player2.team_logo)" 
                                  :alt="match.player2?.team_name"
                                  style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;"
                                />
                                <i v-else class="fas fa-users" style="font-size: 2rem; color: #FFD700;"></i>
                              </div>
                            </div>
                          </div>

                          <!-- Betting Options - Only show when match is ongoing -->
                          <div v-if="match.status === 'ongoing'" class="match_betting_options">
                            <div class="betting_buttons d-flex gap-2 justify-content-center">
                              <button 
                                class="btn_bet_option"
                                @click="selectBet(match, 'player1_win', getOddsNumber(match.player1_odds))"
                                :disabled="!isAuthenticated"
                              >
                                <span class="bet_team_name">{{ match.player1?.team_name || 'Team 1' }}</span>
                                <span class="bet_odds">{{ formatOdds(match.player1_odds) }}x</span>
                              </button>
                              <button 
                                v-if="match.draw_odds"
                                class="btn_bet_option"
                                @click="selectBet(match, 'draw', getOddsNumber(match.draw_odds, 3.00))"
                                :disabled="!isAuthenticated"
                              >
                                <span class="bet_team_name">Draw</span>
                                <span class="bet_odds">{{ formatOdds(match.draw_odds, 3.00) }}x</span>
                              </button>
                              <button 
                                class="btn_bet_option"
                                @click="selectBet(match, 'player2_win', getOddsNumber(match.player2_odds))"
                                :disabled="!isAuthenticated"
                              >
                                <span class="bet_team_name">{{ match.player2?.team_name || 'Team 2' }}</span>
                                <span class="bet_odds">{{ formatOdds(match.player2_odds) }}x</span>
                              </button>
                            </div>
                          </div>

                          <!-- Match Result (if completed) -->
                          <div v-if="match.status === 'completed'" class="match_result text-center">
                            <div class="d-flex align-items-center justify-content-center gap-3">
                              <span class="fw-bold text-white">{{ match.player1_score || 0 }}</span>
                              <span class="text-white-50">-</span>
                              <span class="fw-bold text-white">{{ match.player2_score || 0 }}</span>
                            </div>
                            <div v-if="match.winner_id" class="mt-2">
                              <span class="badge bg-success">
                                Winner: {{ match.winner_id === match.player1_id ? (match.player1?.team_name || 'Team 1') : (match.player2?.team_name || 'Team 2') }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Standings Card -->
                    <div v-if="championship.status === 'started' || championship.status === 'finished'" class="defi_card n11-bg rounded-8 p-4 p-lg-6">
                      <h4 class="fw-bold mb-4 text-white">Standings</h4>
                      <div v-if="standingsLoading" class="text-center py-3">
                        <div class="spinner-border spinner-border-sm text-primary"></div>
                      </div>
                      <div v-else-if="standings.length > 0" class="standings_table">
                        <div 
                          v-for="(standing, index) in standings" 
                          :key="standing.id"
                          class="standing_item p-3 mb-2 rounded d-flex align-items-center justify-content-between"
                          style="background: rgba(255, 255, 255, 0.05);"
                        >
                          <div class="d-flex align-items-center gap-3">
                            <span class="position_badge fw-bold" :class="getPositionClass(index + 1)">
                              #{{ index + 1 }}
                            </span>
                            <div>
                              <h6 class="mb-0 text-white">{{ standing.player_name || standing.user?.username }}</h6>
                              <p class="mb-0 text-white-50 small">
                                {{ standing.matches_won }}W - {{ standing.matches_lost }}L - {{ standing.matches_drawn }}D
                              </p>
                            </div>
                          </div>
                          <div class="text-end">
                            <span class="fw-bold text-warning">{{ standing.points }} pts</span>
                          </div>
                        </div>
                      </div>
                      <div v-else class="text-center py-3">
                        <p class="text-white-50">No standings available yet.</p>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column - Sidebar -->
                  <div class="col-lg-4">
                    <!-- Quick Info Card -->
                    <div class="defi_card n11-bg rounded-8 p-4 mb-4">
                      <h5 class="fw-bold mb-3 text-white">Quick Info</h5>
                      <div class="quick_info">
                        <div class="info_row mb-3">
                          <span class="text-white-50">Game:</span>
                          <span class="text-white fw-bold">{{ championship.game }}</span>
                        </div>
                        <div class="info_row mb-3">
                          <span class="text-white-50">Division:</span>
                          <span class="text-white fw-bold">Division {{ championship.division }}</span>
                        </div>
                        <div class="info_row mb-3">
                          <span class="text-white-50">Status:</span>
                          <span class="badge" :class="getStatusClass(championship.status)">
                            {{ getStatusLabel(championship.status) }}
                          </span>
                        </div>
                        <div class="info_row mb-3">
                          <span class="text-white-50">Participants:</span>
                          <span class="text-white fw-bold">
                            {{ championship.validated_registrations_count || 0 }}/{{ championship.max_participants }}
                          </span>
                        </div>
                        <div class="info_row">
                          <span class="text-white-50">Entry Fee:</span>
                          <span class="text-warning fw-bold">{{ championship.registration_fee }} EBT</span>
                        </div>
                      </div>
                    </div>

                    <!-- Registration Status -->
                    <div v-if="isRegistered && userRegistration" class="defi_card n11-bg rounded-8 p-4">
                      <h5 class="fw-bold mb-3 text-white">Your Registration</h5>
                      <div class="registration_info">
                        <div class="info_row mb-2">
                          <span class="text-white-50">Status:</span>
                          <span class="badge" :class="getRegistrationStatusClass(userRegistration.status)">
                            {{ getRegistrationStatusLabel(userRegistration.status) }}
                          </span>
                        </div>
                        <div class="info_row mb-2">
                          <span class="text-white-50">Registered:</span>
                          <span class="text-white">{{ formatDate(userRegistration.registered_at) }}</span>
                        </div>
                        <div v-if="userRegistration.current_position" class="info_row">
                          <span class="text-white-50">Current Position:</span>
                          <span class="text-warning fw-bold">#{{ userRegistration.current_position }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- No data state -->
              <div v-else class="text-center py-5">
                <div class="alert alert-warning">
                  <p class="mb-2">Unable to load championship data.</p>
                  <p class="mb-0 small text-white-50">Loading: {{ loading }}, Error: {{ error || 'None' }}, Championship: {{ championship ? 'Loaded' : 'Not loaded' }}</p>
                </div>
                <button class="btn_primary mt-3" @click="loadChampionship">
                  <i class="fas fa-sync me-2"></i>
                  Retry
                </button>
                <button class="btn_secondary mt-3 ms-2" @click="$router.push('/championships')">
                  <i class="fas fa-arrow-left me-2"></i>
                  Back to Championships
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Registration Modal -->
    <div v-if="showRegistrationModal" class="popup-overlay" @click.self="closeRegistrationModal">
      <div class="popup-box p-5 rounded-4 shadow-lg n11-bg" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
        <h3 class="fw-bold mb-4 text-center text-white">Registration Form – EBETSTREAM Championship</h3>
        
        <div class="mb-4">
          <div class="alert alert-info">
            <h5 class="text-white mb-2">📋 Championship Information</h5>
            <div class="row g-2 text-white-50 small">
              <div class="col-6"><strong>Game:</strong> {{ championship?.game }}</div>
              <div class="col-6"><strong>Division:</strong> {{ championship?.division }}</div>
            </div>
          </div>
        </div>

        <form @submit.prevent="registerForChampionship" enctype="multipart/form-data">
          <h5 class="text-white mb-3">1️⃣ Player / Team Leader Information</h5>
          
          <div class="form-group mb-3">
            <label class="text-white mb-2 d-block">Full Name *</label>
            <input 
              v-model="registrationForm.full_name" 
              type="text" 
              class="form-control n11-bg text-white border-secondary" 
              required 
              placeholder="Your full name"
            />
          </div>

          <div class="form-group mb-3">
            <label class="text-white mb-2 d-block">EBETSTREAM Username *</label>
            <input 
              v-model="registrationForm.player_username" 
              type="text" 
              class="form-control n11-bg text-white border-secondary" 
              required 
              placeholder="Your EBETSTREAM username"
            />
          </div>

          <div class="form-group mb-3">
            <label class="text-white mb-2 d-block">E-mail *</label>
            <input 
              v-model="registrationForm.contact_email" 
              type="email" 
              class="form-control n11-bg text-white border-secondary" 
              required 
              placeholder="your.email@example.com"
            />
          </div>

          <div class="form-group mb-3">
            <label class="text-white mb-2 d-block">Team Name *</label>
            <input 
              v-model="registrationForm.team_name" 
              type="text" 
              class="form-control n11-bg text-white border-secondary" 
              required 
              placeholder="Your team name"
            />
          </div>

          <div class="form-group mb-3">
            <label class="text-white mb-2 d-block">Game *</label>
            <input 
              type="text" 
              :value="championship?.game" 
              class="form-control n11-bg text-white border-secondary" 
              disabled
            />
            <small class="text-white-50">The game is determined by the selected championship</small>
          </div>

          <div class="form-group mb-3">
            <label class="text-white mb-2 d-block">Team Logo</label>
            <input 
              ref="teamLogoInput"
              type="file" 
              accept="image/*"
              @change="handleLogoUpload"
              class="form-control n11-bg text-white border-secondary" 
            />
            <small class="text-white-50">Accepted formats: JPG, PNG, GIF (max 5MB)</small>
            <div v-if="registrationForm.team_logo_preview" class="mt-2">
              <img :src="registrationForm.team_logo_preview" alt="Team Logo Preview" style="max-width: 150px; max-height: 150px; border-radius: 8px;" />
            </div>
          </div>

          <div class="form-group mb-3">
            <label class="text-white mb-2 d-block">Selected Division *</label>
            <input 
              type="text" 
              :value="`Division ${championship?.division}`" 
              class="form-control n11-bg text-white border-secondary" 
              disabled
            />
            <small class="text-white-50">The division is determined by the selected championship</small>
          </div>

          <div class="form-group mb-3">
            <label class="text-white mb-2 d-block">Player Names or Usernames *</label>
            <div v-for="(player, index) in registrationForm.players_list" :key="index" class="d-flex gap-2 mb-2">
              <input 
                v-model="registrationForm.players_list[index]" 
                type="text" 
                class="form-control n11-bg text-white border-secondary" 
                required
                :placeholder="`Player ${index + 1}`"
              />
              <button 
                v-if="registrationForm.players_list.length > 1"
                type="button" 
                @click="removePlayer(index)" 
                class="btn btn-sm btn-danger"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            <button type="button" @click="addPlayer" class="btn btn-sm btn-secondary mt-2">
              <i class="fas fa-plus me-1"></i> Add a Player
            </button>
            <small class="text-white-50 d-block mt-2">Add at least one player</small>
          </div>

          <div class="form-group mb-4">
            <div class="form-check">
              <input 
                v-model="registrationForm.accept_terms" 
                class="form-check-input" 
                type="checkbox" 
                id="acceptTerms"
                required
              />
              <label class="form-check-label text-white" for="acceptTerms">
                I confirm that my team will participate in official matches and accept the rules of the EBETSTREAM Championship *
              </label>
            </div>
          </div>

          <!-- Payment Info -->
          <div class="alert alert-info mb-4">
            <div class="d-flex justify-content-between align-items-center">
              <span class="text-white">Registration Fee:</span>
              <span class="fw-bold text-white">{{ championship?.registration_fee || 0 }} EBT</span>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-2">
              <span class="text-white-50 small">Your Balance:</span>
              <span class="fw-bold" :class="hasEnoughBalance ? 'text-success' : 'text-danger'">
                {{ userBalance.toFixed(2) }} EBT
              </span>
            </div>
            <div v-if="!hasEnoughBalance" class="mt-2">
              <small class="text-danger">
                <i class="fas fa-exclamation-triangle me-1"></i>
                Insufficient balance. Please add funds to your account.
              </small>
            </div>
          </div>

          <div v-if="registrationError" class="alert alert-danger mb-4">{{ registrationError }}</div>
          <div v-if="registrationSuccess" class="alert alert-success mb-4">{{ registrationSuccess }}</div>

          <div class="d-flex gap-3">
            <button 
              type="submit" 
              class="btn_primary flex-fill" 
              :disabled="registering || !hasEnoughBalance"
            >
              <span v-if="registering">Processing...</span>
              <span v-else>
                <i class="fas fa-credit-card me-2"></i>
                Pay & Register
              </span>
            </button>
            <button 
              type="button" 
              class="btn_secondary" 
              @click="closeRegistrationModal"
              :disabled="registering"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Bet Modal -->
    <div v-if="showBetModal" class="popup-overlay" @click.self="closeBetModal">
      <div class="popup-box p-5 rounded-4 shadow-lg n11-bg" style="max-width: 500px;">
        <h3 class="fw-bold mb-4 text-center text-white">Place a Bet</h3>
        <div v-if="selectedMatch" class="mb-4">
          <div class="text-white mb-2">
            <strong>{{ selectedMatch.player1?.team_name || 'Team 1' }} vs {{ selectedMatch.player2?.team_name || 'Team 2' }}</strong>
          </div>
          <div class="text-white-50 mb-3">
            Your choice: 
            <span class="text-warning fw-bold">
              {{ selectedBetType === 'player1_win' ? (selectedMatch.player1?.team_name || 'Team 1') + ' (Win)' : 
                 selectedBetType === 'draw' ? 'Draw' : 
                 (selectedMatch.player2?.team_name || 'Team 2') + ' (Win)' }}
            </span>
          </div>
          <div class="text-white-50 mb-3">
            Odds: <span class="text-warning fw-bold">{{ formatOdds(selectedOdds) }}x</span>
          </div>
        </div>
        <div class="form-group mb-4">
          <label class="text-white mb-2 d-block">Bet Amount</label>
          <input 
            v-model.number="betAmount" 
            type="number" 
            step="0.01"
            min="0.01"
            class="form-control n11-bg text-white border-secondary" 
            placeholder="0.00"
            required
          />
          <div class="text-white-50 small mt-2">
            Available Balance: <span class="text-warning">{{ formatNumber(walletBalance) }} EBT</span>
          </div>
          <div v-if="betAmount > 0 && selectedOdds > 0" class="text-white-50 small mt-2">
            Potential win: <span class="text-success fw-bold">{{ formatNumber(betAmount * selectedOdds) }} EBT</span>
          </div>
        </div>
        <div v-if="betError" class="alert alert-danger mb-4">
          {{ betError }}
        </div>
        <div class="d-flex gap-3">
          <button 
            type="button" 
            class="btn_primary flex-fill" 
            @click="placeBet" 
            :disabled="placingBet || !betAmount || betAmount <= 0 || !selectedBetType || walletBalance <= 0"
          >
            <span v-if="placingBet">Processing...</span>
            <span v-else-if="walletBalance <= 0">Insufficient balance</span>
            <span v-else>Confirm Bet</span>
          </button>
          <button type="button" class="btn_secondary" @click="closeBetModal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/utils/axios';
import { getStorageUrl } from '@/config/constants';

interface Championship {
  id: number;
  name: string;
  game: string;
  division: string;
  description?: string;
  rules?: string;
  registration_fee: number;
  total_prize_pool?: number;
  prize_distribution?: { [key: string]: number };
  max_participants: number;
  status: string;
  registration_start_date: string;
  registration_end_date: string;
  start_date: string;
  validated_registrations_count?: number;
  matches?: any[];
}

interface ChampionshipRegistration {
  id: number;
  status: string;
  player_name: string;
  registered_at: string;
  current_position?: number;
  matches_won: number;
  matches_lost: number;
  matches_drawn: number;
  points: number;
  user?: {
    username: string;
  };
}

const route = useRoute();
const router = useRouter();

const championship = ref<Championship | null>(null);
const userRegistration = ref<ChampionshipRegistration | null>(null);
const standings = ref<ChampionshipRegistration[]>([]);
const matches = ref<any[]>([]);
const loading = ref(false);
const standingsLoading = ref(false);
const error = ref('');
const isRegistered = ref(false);
const showRegistrationModal = ref(false);
const registering = ref(false);
const registrationError = ref('');
const registrationSuccess = ref('');
const userBalance = ref(0);
const isAuthenticated = ref(false);
const showBetModal = ref(false);
const selectedMatch = ref<any | null>(null);
const selectedBetType = ref<string>('');
const selectedOdds = ref(0);
const betAmount = ref(0);
const betError = ref('');
const placingBet = ref(false);
const walletBalance = ref(0);

const registrationForm = ref({
  full_name: '',
  player_username: '',
  contact_email: '',
  team_name: '',
  team_logo: null as File | null,
  team_logo_preview: '',
  players_list: [''],
  accept_terms: false,
  contact_phone: '',
  additional_info: '',
});

const teamLogoInput = ref<HTMLInputElement | null>(null);

const hasEnoughBalance = computed(() => {
  if (!championship.value) return false;
  return userBalance.value >= championship.value.registration_fee;
});

const isRegistrationOpen = computed(() => {
  if (!championship.value) return false;
  const now = new Date();
  const startDate = new Date(championship.value.registration_start_date);
  const endDate = new Date(championship.value.registration_end_date);
  const statusValid = ['registration_open', 'draft'].includes(championship.value.status);
  return statusValid && now >= startDate && now <= endDate && (championship.value as any).is_active;
});

const hasRegistrationStarted = computed(() => {
  if (!championship.value) return false;
  const now = new Date();
  const startDate = new Date(championship.value.registration_start_date);
  return now >= startDate;
});

const loadChampionship = async () => {
  try {
    loading.value = true;
    error.value = '';
    championship.value = null; // Reset championship
    const championshipId = route.params.id;

    console.log('Loading championship ID:', championshipId);

    const response = await apiClient.get(`/championships/${championshipId}`);

    console.log('Championship response:', response.data);

    if (response.data && response.data.success && response.data.data) {
      championship.value = response.data.data;
      isRegistered.value = response.data.is_registered || false;
      userRegistration.value = response.data.user_registration || null;
      matches.value = response.data.data.matches || [];
      
      console.log('Championship loaded:', championship.value);
      console.log('Championship ID:', championship.value?.id);
      console.log('Championship name:', championship.value?.name);
      console.log('Matches loaded:', matches.value);
      console.log('Matches count:', matches.value.length);
    } else {
      error.value = response.data?.message || 'Failed to load championship';
      console.error('Invalid response format:', response.data);
      championship.value = null;
    }
  } catch (err: any) {
    console.error('Error loading championship:', err);
    console.error('Error details:', err.response?.data);
    console.error('Error status:', err.response?.status);
    if (err.response?.status === 404) {
      error.value = 'Championship not found';
    } else {
      const errorMessage = err.response?.data?.message || err.message || 'Error loading championship';
      error.value = errorMessage;
    }
    championship.value = null; // Ensure championship is null on error
  } finally {
    loading.value = false;
  }
};

const loadStandings = async () => {
  if (!championship.value) return;
  
  try {
    standingsLoading.value = true;
    const response = await apiClient.get(`/championships/${championship.value.id}/standings`);
    
    if (response.data.success) {
      standings.value = response.data.data;
    }
  } catch (err: any) {
    console.error('Error loading standings:', err);
  } finally {
    standingsLoading.value = false;
  }
};

const loadUserBalance = async () => {
  try {
    const response = await apiClient.get('/wallet');
    if (response.data.success) {
      userBalance.value = parseFloat(response.data.data.balance || 0);
    }
  } catch (err: any) {
    console.error('Error loading balance:', err);
  }
};

const handleLogoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    registrationForm.value.team_logo = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      registrationForm.value.team_logo_preview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const addPlayer = () => {
  registrationForm.value.players_list.push('');
};

const removePlayer = (index: number) => {
  if (registrationForm.value.players_list.length > 1) {
    registrationForm.value.players_list.splice(index, 1);
  }
};

const registerForChampionship = async () => {
  if (!championship.value) return;

  try {
    registering.value = true;
    registrationError.value = '';
    registrationSuccess.value = '';

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('full_name', registrationForm.value.full_name);
    formData.append('player_username', registrationForm.value.player_username);
    formData.append('contact_email', registrationForm.value.contact_email);
    formData.append('team_name', registrationForm.value.team_name);
    if (registrationForm.value.team_logo) {
      formData.append('team_logo', registrationForm.value.team_logo);
    }
    formData.append('players_list', JSON.stringify(registrationForm.value.players_list.filter(p => p.trim() !== '')));
    formData.append('accept_terms', registrationForm.value.accept_terms ? '1' : '0');
    if (registrationForm.value.contact_phone) {
      formData.append('contact_phone', registrationForm.value.contact_phone);
    }
    if (registrationForm.value.additional_info) {
      formData.append('additional_info', registrationForm.value.additional_info);
    }

    const response = await apiClient.post(`/championships/${championship.value.id}/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      registrationSuccess.value = 'Registration successful! Payment processed.';
      setTimeout(() => {
        closeRegistrationModal();
        loadChampionship();
        loadUserBalance();
      }, 2000);
    } else {
      registrationError.value = response.data.message || 'Registration failed';
    }
  } catch (err: any) {
    console.error('Error registering:', err);
    registrationError.value = err.response?.data?.message || 'Error registering for championship';
  } finally {
    registering.value = false;
  }
};

const closeRegistrationModal = () => {
  showRegistrationModal.value = false;
  registrationForm.value = {
    full_name: '',
    player_username: '',
    contact_email: '',
    team_name: '',
    team_logo: null,
    team_logo_preview: '',
    players_list: [''],
    accept_terms: false,
    contact_phone: '',
    additional_info: '',
  };
  if (teamLogoInput.value) {
    teamLogoInput.value.value = '';
  }
  registrationError.value = '';
  registrationSuccess.value = '';
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'TBA';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
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

const getRegistrationStatusLabel = (status: string) => {
  const labels: { [key: string]: string } = {
    'pending': 'Pending',
    'paid': 'Paid',
    'validated': 'Validated',
    'rejected': 'Rejected',
    'cancelled': 'Cancelled'
  };
  return labels[status] || status;
};

const getRegistrationStatusClass = (status: string) => {
  const classes: { [key: string]: string } = {
    'pending': 'bg-warning text-dark',
    'paid': 'bg-info',
    'validated': 'bg-success',
    'rejected': 'bg-danger',
    'cancelled': 'bg-secondary'
  };
  return classes[status] || 'bg-secondary';
};

const getPositionClass = (position: number) => {
  if (position === 1) return 'text-warning';
  if (position === 2) return 'text-secondary';
  if (position === 3) return 'text-warning';
  return 'text-white-50';
};

const getMatchStatusLabel = (status: string) => {
  const labels: { [key: string]: string } = {
    'scheduled': 'Scheduled',
    'ongoing': 'Live',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };
  return labels[status] || status;
};

const getMatchStatusClass = (status: string) => {
  const classes: { [key: string]: string } = {
    'scheduled': 'bg-info',
    'ongoing': 'bg-danger',
    'completed': 'bg-success',
    'cancelled': 'bg-secondary'
  };
  return classes[status] || 'bg-secondary';
};

const getTeamLogoUrl = (logoPath: string) => {
  if (!logoPath) return '';
  if (logoPath.startsWith('http')) return logoPath;
  return getStorageUrl(logoPath);
};

const selectBet = (match: any, betType: string, odds: number | string) => {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    alert('You must be logged in to place a bet');
    router.push('/login');
    return;
  }
  
  selectedMatch.value = match;
  selectedBetType.value = betType;
  selectedOdds.value = getOddsNumber(odds);
  betAmount.value = 0;
  betError.value = '';
  showBetModal.value = true;
  loadWalletBalance();
};

const loadWalletBalance = async () => {
  try {
    const response = await apiClient.get('/wallet');
    if (response.data.success) {
      walletBalance.value = parseFloat(response.data.data.balance || 0);
    }
  } catch (err) {
    console.error('Error loading wallet:', err);
  }
};

const placeBet = async () => {
  betError.value = '';
  
  if (!selectedMatch.value) {
    betError.value = 'Please select a match';
    return;
  }
  
  if (!selectedBetType.value) {
    betError.value = 'Please select a bet type';
    return;
  }
  
  if (!betAmount.value || betAmount.value <= 0) {
    betError.value = 'Amount must be greater than 0';
    return;
  }
  
  if (betAmount.value > walletBalance.value) {
    betError.value = `Insufficient balance. Your available balance is ${walletBalance.value.toFixed(2)} EBT`;
    return;
  }
  
  try {
    placingBet.value = true;
    betError.value = '';
    const response = await apiClient.post(
      '/bets',
      {
        championship_match_id: selectedMatch.value.id,
        bet_type: selectedBetType.value,
        amount: betAmount.value
      }
    );
    
    if (response.data.success) {
      alert('Bet placed successfully!');
      closeBetModal();
      await loadWalletBalance();
      await loadUserBalance();
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Error placing bet';
    betError.value = errorMessage;
  } finally {
    placingBet.value = false;
  }
};

const closeBetModal = () => {
  showBetModal.value = false;
  selectedMatch.value = null;
  selectedBetType.value = '';
  selectedOdds.value = 0;
  betAmount.value = 0;
  betError.value = '';
};

const formatNumber = (num: number) => {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatOdds = (odds: number | string | undefined, defaultValue: number = 2.00): string => {
  if (!odds) return defaultValue.toFixed(2);
  const numOdds = typeof odds === 'string' ? parseFloat(odds) : odds;
  if (isNaN(numOdds)) return defaultValue.toFixed(2);
  return numOdds.toFixed(2);
};

const getOddsNumber = (odds: number | string | undefined, defaultValue: number = 2.00): number => {
  if (!odds) return defaultValue;
  const numOdds = typeof odds === 'string' ? parseFloat(odds) : odds;
  if (isNaN(numOdds)) return defaultValue;
  return numOdds;
};

onMounted(async () => {
  try {
    console.log('ChampionshipDetail mounted');
    const token = localStorage.getItem("auth_token");
    isAuthenticated.value = !!token;
    console.log('Is authenticated:', isAuthenticated.value);
    await loadChampionship();
    console.log('After loadChampionship, championship.value:', championship.value);
    if (championship.value && (championship.value.status === 'started' || championship.value.status === 'finished')) {
      loadStandings();
    }
    loadUserBalance();
    if (isAuthenticated.value) {
      loadWalletBalance();
    }
  } catch (e) {
    console.error('Error in onMounted:', e);
    error.value = 'Failed to initialize page';
  }
});
</script>

<style scoped>
.page-content-with-space {
  padding-top: 90px;
}

.defis_section {
  width: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
}

.division_badge {
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.division_1 {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #000;
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
}

.division_2 {
  background: linear-gradient(135deg, #C0C0C0 0%, #808080 100%);
  color: #000;
  box-shadow: 0 5px 15px rgba(192, 192, 192, 0.3);
}

.division_3 {
  background: linear-gradient(135deg, #CD7F32 0%, #8B4513 100%);
  color: #fff;
  box-shadow: 0 5px 15px rgba(205, 127, 50, 0.3);
}

.info_item {
  transition: all 0.3s ease;
}

.info_item:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  transform: translateY(-2px);
}

.quick_info .info_row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.quick_info .info_row:last-child {
  border-bottom: none;
}

.standings_table {
  max-height: 600px;
  overflow-y: auto;
}

.standing_item {
  transition: all 0.3s ease;
}

.standing_item:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  transform: translateX(5px);
}

.position_badge {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.popup-box {
  max-height: 90vh;
  overflow-y: auto;
}

.btn_primary {
  background-color: #FF9F00;
  color: #000;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.3s;
  cursor: pointer;
}

.btn_primary:hover:not(:disabled) {
  background-color: #FFB340;
  transform: translateY(-2px);
}

.btn_primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn_secondary {
  background: transparent;
  border: 2px solid #FF9F00;
  color: #FF9F00;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.3s;
  cursor: pointer;
}

.btn_secondary:hover:not(:disabled) {
  background-color: #FF9F00;
  color: #000;
}

.match_betting_options {
  margin-top: 1rem;
}

.betting_buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn_bet_option {
  flex: 1;
  min-width: 80px;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.btn_bet_option:hover:not(:disabled) {
  background: rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.6);
  transform: translateY(-2px);
}

.btn_bet_option:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bet_team_name {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  font-size: 0.7rem;
}

.bet_odds {
  font-weight: 700;
  color: #FFD700;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .page-content-with-space {
    padding-top: 60px;
  }
  
  .hero_title {
    font-size: 1.8rem;
  }
  
  .container-fluid {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}
</style>

