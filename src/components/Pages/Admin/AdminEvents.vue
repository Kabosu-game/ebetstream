<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6 d-flex justify-content-between align-items-center">
      <div>
        <h2 class="text-white fw-bold mb-2">Event Management</h2>
        <p class="text-white-50">Manage all platform events</p>
      </div>
      <button class="btn_primary" @click="openCreateModal">
        <IconPlus :size="18" class="me-2" />Create Event
      </button>
    </div>

    <!-- Filters -->
    <div class="d-flex gap-3 mb-4 flex-wrap">
      <input 
        v-model="searchQuery" 
        type="text" 
        class="form-control n11-bg text-white border-secondary" 
        placeholder="Search by title, location, type..."
        style="max-width: 300px;"
      />
      <select v-model="filterStatus" class="form-select n11-bg text-white border-secondary" style="max-width: 200px;">
        <option value="">All Status</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <select v-model="filterTime" class="form-select n11-bg text-white border-secondary" style="max-width: 200px;">
        <option value="">All Events</option>
        <option value="upcoming">Upcoming</option>
        <option value="ongoing">Ongoing</option>
        <option value="past">Past</option>
      </select>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else class="pay_method__table">
      <div class="pay_method__table-scrollbar overflow-x-auto">
        <table class="w-100 text-center p2-bg">
          <thead>
            <tr>
              <th class="text-white p-3">ID</th>
              <th class="text-white p-3">Image</th>
              <th class="text-white p-3">Title</th>
              <th class="text-white p-3">Type</th>
              <th class="text-white p-3">Location</th>
              <th class="text-white p-3">Start Date</th>
              <th class="text-white p-3">End Date</th>
              <th class="text-white p-3">Registrations</th>
              <th class="text-white p-3">Status</th>
              <th class="text-white p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in events" :key="event.id" class="border-top border-secondary">
              <td class="text-white p-3">{{ event.id }}</td>
              <td class="p-3">
                <img 
                  v-if="event.image_url" 
                  :src="event.image_url" 
                  alt="Event image"
                  style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;"
                />
                <span v-else class="text-white-50">No image</span>
              </td>
              <td class="text-white p-3">{{ event.title }}</td>
              <td class="text-white p-3">{{ event.type || 'N/A' }}</td>
              <td class="text-white p-3">{{ event.location || 'N/A' }}</td>
              <td class="text-white p-3">{{ formatDate(event.start_at) }}</td>
              <td class="text-white p-3">{{ event.end_at ? formatDate(event.end_at) : 'N/A' }}</td>
              <td class="text-white p-3">
                <div class="d-flex align-items-center justify-content-center gap-2">
                  <span class="badge bg-info">
                    {{ event.registrations_count || 0 }}
                    <span v-if="event.max_participants">/ {{ event.max_participants }}</span>
                  </span>
                  <button 
                    class="btn btn-sm btn-info text-white" 
                    @click="viewRegistrations(event)" 
                    title="View Registrations"
                    style="min-width: 35px; height: 35px; padding: 0; display: flex; align-items: center; justify-content: center;"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                </div>
              </td>
              <td class="p-3">
                <span :class="['badge', getStatusClass(event.status)]">
                  {{ getStatusLabel(event.status) }}
                </span>
              </td>
              <td class="p-3">
                <div class="d-flex gap-2 justify-content-center">
                  <button 
                    class="btn btn-sm btn-primary" 
                    @click="editEvent(event)" 
                    title="Edit Event"
                  >
                    <IconPencil :size="16" />
                  </button>
                  <button 
                    class="btn btn-sm btn-danger" 
                    @click="deleteEvent(event.id)" 
                    title="Delete Event"
                  >
                    <IconTrash :size="16" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="events.length === 0">
              <td colspan="10" class="text-white p-5 text-center">No events found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Event Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="popup-overlay" @click.self="closeModal">
      <div class="popup-box p-5 rounded-4 shadow-lg n11-bg" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
        <h3 class="fw-bold mb-4 text-center text-white">
          {{ editingEvent ? 'Edit Event' : 'Create Event' }}
        </h3>
        
        <form @submit.prevent="saveEvent">
          <div class="form-group mb-3">
            <label class="text-white mb-2 d-block">Title *</label>
            <input 
              v-model="eventForm.title"
              type="text" 
              class="form-control n11-bg text-white border-secondary" 
              placeholder="Event title"
              required
            />
          </div>

          <div class="form-group mb-3">
            <label class="text-white mb-2 d-block">Description</label>
            <textarea 
              v-model="eventForm.description"
              class="form-control n11-bg text-white border-secondary" 
              rows="4"
              placeholder="Event description"
            ></textarea>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group mb-3">
                <label class="text-white mb-2 d-block">Start Date *</label>
                <input 
                  v-model="eventForm.start_at"
                  type="datetime-local" 
                  class="form-control n11-bg text-white border-secondary" 
                  required
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group mb-3">
                <label class="text-white mb-2 d-block">End Date</label>
                <input 
                  v-model="eventForm.end_at"
                  type="datetime-local" 
                  class="form-control n11-bg text-white border-secondary" 
                />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group mb-3">
                <label class="text-white mb-2 d-block">Location</label>
                <input 
                  v-model="eventForm.location"
                  type="text" 
                  class="form-control n11-bg text-white border-secondary" 
                  placeholder="Event location"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group mb-3">
                <label class="text-white mb-2 d-block">Type</label>
                <input 
                  v-model="eventForm.type"
                  type="text" 
                  class="form-control n11-bg text-white border-secondary" 
                  placeholder="Event type (e.g., Tournament, Match, etc.)"
                />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group mb-3">
                <label class="text-white mb-2 d-block">Status</label>
                <select 
                  v-model="eventForm.status"
                  class="form-select n11-bg text-white border-secondary"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group mb-3">
                <label class="text-white mb-2 d-block">Max Participants</label>
                <input 
                  v-model.number="eventForm.max_participants"
                  type="number" 
                  min="1"
                  class="form-control n11-bg text-white border-secondary" 
                  placeholder="Maximum participants"
                />
              </div>
            </div>
          </div>

          <div class="form-group mb-3">
            <label class="text-white mb-2 d-block">Registration Deadline</label>
            <input 
              v-model="eventForm.registration_deadline"
              type="datetime-local" 
              class="form-control n11-bg text-white border-secondary" 
            />
          </div>

          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Event Image</label>
            <input 
              ref="imageInput"
              type="file" 
              accept="image/*"
              class="form-control n11-bg text-white border-secondary" 
              @change="handleImageChange"
            />
            <small class="text-white-50 mt-1 d-block">Max size: 5MB (JPEG, PNG, JPG, GIF, WEBP)</small>
            <div v-if="eventForm.image_preview" class="mt-3">
              <img 
                :src="eventForm.image_preview" 
                alt="Preview"
                style="max-width: 200px; max-height: 200px; border-radius: 8px;"
              />
            </div>
            <div v-else-if="editingEvent && editingEvent.image_url" class="mt-3">
              <p class="text-white-50 small mb-2">Current image:</p>
              <img 
                :src="editingEvent.image_url" 
                alt="Current"
                style="max-width: 200px; max-height: 200px; border-radius: 8px;"
              />
            </div>
          </div>

          <div v-if="error" class="alert alert-danger mb-4">{{ error }}</div>
          
          <div class="d-flex gap-3">
            <button 
              type="submit" 
              class="btn_primary flex-fill" 
              :disabled="saving"
            >
              <span v-if="saving">Saving...</span>
              <span v-else>{{ editingEvent ? 'Update Event' : 'Create Event' }}</span>
            </button>
            <button type="button" class="btn_secondary" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
    </Teleport>

    <!-- Registrations Modal -->
    <Teleport to="body">
      <div v-if="showRegistrationsModal" class="popup-overlay" @click.self="closeRegistrationsModal">
        <div class="popup-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="text-white fw-bold mb-0">
              Registrations - {{ currentEvent?.title }}
            </h3>
            <button class="btn-close btn-close-white" @click="closeRegistrationsModal"></button>
          </div>

          <div v-if="loadingRegistrations" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <div v-else>
            <div class="mb-3">
              <p class="text-white-50 mb-0">
                Total: <strong class="text-white">{{ registrations.length }}</strong> registration(s)
              </p>
            </div>

            <div class="table-responsive">
              <table class="table table-dark table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Country</th>
                    <th>Registration Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="reg in registrations" :key="reg.id">
                    <td>{{ reg.id }}</td>
                    <td>{{ reg.pseudo }}</td>
                    <td>{{ reg.email }}</td>
                    <td>{{ reg.phone || 'N/A' }}</td>
                    <td>{{ reg.country || 'N/A' }}</td>
                    <td>{{ formatDate(reg.created_at) }}</td>
                  </tr>
                  <tr v-if="registrations.length === 0">
                    <td colspan="6" class="text-center text-white-50 py-4">
                      No registrations for this event
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import apiClient from '@/utils/axios';
import { IconPlus, IconPencil, IconTrash } from '@tabler/icons-vue';

interface Event {
  id: number;
  title: string;
  description?: string | null;
  start_at: string;
  end_at?: string | null;
  location?: string | null;
  image?: string | null;
  image_url?: string | null;
  status: string;
  type?: string | null;
  max_participants?: number | null;
  registration_deadline?: string | null;
  registrations_count?: number;
  created_at: string;
  updated_at: string;
}

interface EventRegistration {
  id: number;
  event_id: number;
  pseudo: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  created_at: string;
  updated_at: string;
}

const events = ref<Event[]>([]);
const loading = ref(false);
const searchQuery = ref('');
const filterStatus = ref('');
const filterTime = ref('');
const showModal = ref(false);
const editingEvent = ref<Event | null>(null);
const saving = ref(false);
const error = ref('');
const imageInput = ref<HTMLInputElement | null>(null);
const showRegistrationsModal = ref(false);
const currentEvent = ref<Event | null>(null);
const registrations = ref<EventRegistration[]>([]);
const loadingRegistrations = ref(false);

const eventForm = ref({
  title: '',
  description: '',
  start_at: '',
  end_at: '',
  location: '',
  type: '',
  status: 'published',
  max_participants: null as number | null,
  registration_deadline: '',
  image_preview: '' as string | null,
  image_file: null as File | null,
});

const loadEvents = async () => {
  try {
    loading.value = true;
    const params: any = {
      limit: 100
    };
    
    // Filtre par statut (draft, published, cancelled)
    if (filterStatus.value) {
      params.status = filterStatus.value;
    }
    
    // Filtre par période (upcoming, ongoing, past) - utilise un paramètre différent
    if (filterTime.value) {
      params.time = filterTime.value; // upcoming, ongoing, past
    }
    
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }

    const response = await apiClient.get('/admin/events', { params });
    if (response.data.success) {
      events.value = response.data.data?.data || response.data.data || [];
      // Debug: vérifier que registrations_count est chargé
      console.log('Events loaded:', events.value.map(e => ({ id: e.id, title: e.title, registrations_count: e.registrations_count })));
    }
  } catch (err: any) {
    console.error('Error loading events:', err);
    error.value = err.response?.data?.message || 'Error loading events';
  } finally {
    loading.value = false;
  }
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    draft: 'Draft',
    published: 'Published',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    draft: 'bg-secondary',
    published: 'bg-success',
    cancelled: 'bg-danger',
  };
  return classes[status] || 'bg-secondary';
};

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDateTimeLocal = (dateString: string | null) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const openCreateModal = () => {
  console.log('openCreateModal called');
  editingEvent.value = null;
  eventForm.value = {
    title: '',
    description: '',
    start_at: '',
    end_at: '',
    location: '',
    type: '',
    status: 'published',
    max_participants: null,
    registration_deadline: '',
    image_preview: null,
    image_file: null,
  };
  showModal.value = true;
  error.value = '';
  console.log('showModal.value:', showModal.value);
};

const editEvent = (event: Event) => {
  editingEvent.value = event;
  eventForm.value = {
    title: event.title,
    description: event.description || '',
    start_at: formatDateTimeLocal(event.start_at),
    end_at: formatDateTimeLocal(event.end_at || null),
    location: event.location || '',
    type: event.type || '',
    status: event.status,
    max_participants: event.max_participants || null,
    registration_deadline: formatDateTimeLocal(event.registration_deadline || null),
    image_preview: null,
    image_file: null,
  };
  showModal.value = true;
  error.value = '';
};

const closeModal = () => {
  showModal.value = false;
  editingEvent.value = null;
  error.value = '';
  if (imageInput.value) {
    imageInput.value.value = '';
  }
};

const handleImageChange = (e: Event | any) => {
  const target = (e.target || (e as any).target) as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      error.value = 'Image size must be less than 5MB';
      return;
    }
    eventForm.value.image_file = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      eventForm.value.image_preview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const saveEvent = async () => {
  try {
    saving.value = true;
    error.value = '';
    
    console.log('Saving event...', { editingEvent: editingEvent.value, eventForm: eventForm.value });
    
    const formData = new FormData();
    formData.append('title', eventForm.value.title);
    if (eventForm.value.description) {
      formData.append('description', eventForm.value.description);
    }
    
    if (!eventForm.value.start_at) {
      error.value = 'Start date is required';
      saving.value = false;
      return;
    }
    
    formData.append('start_at', new Date(eventForm.value.start_at).toISOString());
    if (eventForm.value.end_at) {
      formData.append('end_at', new Date(eventForm.value.end_at).toISOString());
    }
    if (eventForm.value.location) {
      formData.append('location', eventForm.value.location);
    }
    if (eventForm.value.type) {
      formData.append('type', eventForm.value.type);
    }
    formData.append('status', eventForm.value.status);
    if (eventForm.value.max_participants) {
      formData.append('max_participants', eventForm.value.max_participants.toString());
    }
    if (eventForm.value.registration_deadline) {
      formData.append('registration_deadline', new Date(eventForm.value.registration_deadline).toISOString());
    }
    if (eventForm.value.image_file) {
      formData.append('image', eventForm.value.image_file);
    }
    
    // Log FormData contents
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    
    let response;
    if (editingEvent.value) {
      console.log('Updating event:', editingEvent.value.id);
      response = await apiClient.put(`/admin/events/${editingEvent.value.id}`, formData);
    } else {
      console.log('Creating new event');
      response = await apiClient.post('/admin/events', formData);
    }
    
    console.log('Response:', response.data);
    
    if (response.data.success) {
      closeModal();
      await loadEvents();
      alert(editingEvent.value ? 'Event updated successfully!' : 'Event created successfully!');
    } else {
      error.value = response.data.message || 'Unknown error occurred';
    }
  } catch (err: any) {
    console.error('Error saving event:', err);
    console.error('Error response:', err.response);
    
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      const errorMessages = Object.keys(errors).map(key => {
        return `${key}: ${Array.isArray(errors[key]) ? errors[key].join(', ') : errors[key]}`;
      });
      error.value = errorMessages.join('\n');
    } else {
      error.value = err.response?.data?.message || err.message || (editingEvent.value ? 'Error updating event' : 'Error creating event');
    }
  } finally {
    saving.value = false;
  }
};

const deleteEvent = async (id: number) => {
  if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
    return;
  }
  
  try {
    const response = await apiClient.delete(`/admin/events/${id}`);
    
    if (response.data.success) {
      await loadEvents();
      alert('Event deleted successfully!');
    }
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error deleting event');
  }
};

const viewRegistrations = async (event: Event) => {
  currentEvent.value = event;
  showRegistrationsModal.value = true;
  loadingRegistrations.value = true;
  registrations.value = [];

  try {
    const response = await apiClient.get(`/admin/events/${event.id}/registrations`);
    if (response.data.success) {
      registrations.value = response.data.data;
    }
  } catch (err: any) {
    console.error('Error loading registrations:', err);
    alert('Error loading registrations: ' + (err.response?.data?.message || err.message));
  } finally {
    loadingRegistrations.value = false;
  }
};

const closeRegistrationsModal = () => {
  showRegistrationsModal.value = false;
  currentEvent.value = null;
  registrations.value = [];
};

// Watch for filter changes
watch([searchQuery, filterStatus, filterTime], () => {
  const timeout = setTimeout(() => {
    loadEvents();
  }, 500);
  
  return () => clearTimeout(timeout);
});

onMounted(() => {
  loadEvents();
});
</script>

<style scoped>
.popup-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(5px);
  display: flex !important;
  align-items: center;
  justify-content: center;
  z-index: 99999 !important;
  padding: 1rem;
  overflow-y: auto;
}

.popup-box {
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  z-index: 100000;
}

.popup-box .form-control,
.popup-box .form-select {
  color: white;
}

.popup-box .form-control:focus,
.popup-box .form-select:focus {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #FF9F00;
  color: white;
}

.popup-box input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
</style>

