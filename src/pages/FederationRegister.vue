<template>
  <div class="page-content-with-space">
    <section class="defis_section py-6 position-relative overflow-hidden pb-120">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 gx-0 gx-lg-4">
            <div class="defis__main">
              <!-- Header -->
              <div class="text-center mb-5">
                <button class="btn_secondary mb-4" @click="$router.push('/federations')">
                  <i class="fas fa-arrow-left me-2"></i>
                  Retour aux fédérations
                </button>
                <span class="hero_badge mb-3 d-inline-block">
                  🏆 Inscrivez votre fédération
                </span>
                <h1 class="text-white fw-bold mb-3">Rejoignez EBETSTREAM</h1>
                <p class="text-white-50">
                  Créez votre compte fédération et organisez vos championnats sur notre plateforme
                </p>
              </div>

              <!-- Formulaire -->
              <div class="defi_card n11-bg rounded-8 p-4 p-lg-5">
                <form @submit.prevent="submitForm" class="federation-form">
                  <div class="row g-3">
                    <!-- Informations de base -->
                    <div class="col-12">
                      <h3 class="text-white fw-bold mb-3">
                        <i class="fas fa-info-circle me-2 text-warning"></i>
                        Informations de base
                      </h3>
                    </div>

                    <div class="col-12">
                      <label class="form-label text-white">Nom de la fédération *</label>
                      <input
                        v-model="form.name"
                        type="text"
                        class="form-control n11-bg text-white border-secondary"
                        placeholder="Ex: Fédération Française d'Esport"
                        required
                      />
                    </div>

                    <div class="col-12">
                      <label class="form-label text-white">Description</label>
                      <textarea
                        v-model="form.description"
                        class="form-control n11-bg text-white border-secondary"
                        rows="4"
                        placeholder="Décrivez votre fédération, ses objectifs, ses activités..."
                      ></textarea>
                    </div>

                    <div class="col-12">
                      <label class="form-label text-white">Logo de la fédération</label>
                      <input
                        type="file"
                        accept="image/*"
                        @change="handleLogoChange"
                        class="form-control n11-bg text-white border-secondary"
                      />
                      <small class="text-white-50">Format: JPG, PNG, GIF, WEBP (max 5MB)</small>
                      <div v-if="logoPreview" class="mt-3">
                        <img :src="logoPreview" alt="Logo preview" class="rounded" style="max-width: 200px; max-height: 200px;" />
                      </div>
                    </div>

                    <!-- Contact -->
                    <div class="col-12 mt-4">
                      <h3 class="text-white fw-bold mb-3">
                        <i class="fas fa-envelope me-2 text-warning"></i>
                        Informations de contact
                      </h3>
                    </div>

                    <div class="col-md-6">
                      <label class="form-label text-white">Site web</label>
                      <input
                        v-model="form.website"
                        type="url"
                        class="form-control n11-bg text-white border-secondary"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div class="col-md-6">
                      <label class="form-label text-white">Email</label>
                      <input
                        v-model="form.email"
                        type="email"
                        class="form-control n11-bg text-white border-secondary"
                        placeholder="contact@federation.com"
                      />
                    </div>

                    <div class="col-md-6">
                      <label class="form-label text-white">Téléphone</label>
                      <input
                        v-model="form.phone"
                        type="tel"
                        class="form-control n11-bg text-white border-secondary"
                        placeholder="+33 1 23 45 67 89"
                      />
                    </div>

                    <!-- Localisation -->
                    <div class="col-12 mt-4">
                      <h3 class="text-white fw-bold mb-3">
                        <i class="fas fa-map-marker-alt me-2 text-warning"></i>
                        Localisation
                      </h3>
                    </div>

                    <div class="col-md-6">
                      <label class="form-label text-white">Pays</label>
                      <input
                        v-model="form.country"
                        type="text"
                        class="form-control n11-bg text-white border-secondary"
                        placeholder="France"
                      />
                    </div>

                    <div class="col-md-6">
                      <label class="form-label text-white">Ville</label>
                      <input
                        v-model="form.city"
                        type="text"
                        class="form-control n11-bg text-white border-secondary"
                        placeholder="Paris"
                      />
                    </div>

                    <div class="col-12">
                      <label class="form-label text-white">Adresse complète</label>
                      <textarea
                        v-model="form.address"
                        class="form-control n11-bg text-white border-secondary"
                        rows="2"
                        placeholder="123 Rue Example, 75001 Paris"
                      ></textarea>
                    </div>

                    <!-- Messages -->
                    <div v-if="error" class="col-12">
                      <div class="alert alert-danger">
                        {{ error }}
                      </div>
                    </div>

                    <div v-if="success" class="col-12">
                      <div class="alert alert-success">
                        <i class="fas fa-check-circle me-2"></i>
                        {{ success }}
                      </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="col-12 mt-4">
                      <button 
                        type="submit" 
                        class="btn_primary w-100 py-3"
                        :disabled="loading"
                      >
                        <span v-if="loading">
                          <i class="fas fa-spinner fa-spin me-2"></i>
                          Sending...
                        </span>
                        <span v-else>
                          <i class="fas fa-paper-plane me-2"></i>
                          Soumettre la demande
                        </span>
                      </button>
                      <p class="text-white-50 small mt-3 text-center">
                        Votre demande sera examinée par notre équipe. Vous recevrez une notification une fois la décision prise.
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import apiClient from "@/utils/axios";

const router = useRouter();

const form = ref({
  name: "",
  description: "",
  website: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  address: "",
});

const logoFile = ref<File | null>(null);
const logoPreview = ref<string | null>(null);
const loading = ref(false);
const error = ref("");
const success = ref("");

const handleLogoChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    logoFile.value = target.files[0];
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      logoPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(logoFile.value);
  }
};

const submitForm = async () => {
  try {
    loading.value = true;
    error.value = "";
    success.value = "";

    // Check authentication
    const token = localStorage.getItem("auth_token");
    if (!token) {
      error.value = "Vous devez être connecté pour créer une fédération";
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append("name", form.value.name);
    if (form.value.description) formData.append("description", form.value.description);
    if (form.value.website) formData.append("website", form.value.website);
    if (form.value.email) formData.append("email", form.value.email);
    if (form.value.phone) formData.append("phone", form.value.phone);
    if (form.value.country) formData.append("country", form.value.country);
    if (form.value.city) formData.append("city", form.value.city);
    if (form.value.address) formData.append("address", form.value.address);
    if (logoFile.value) formData.append("logo", logoFile.value);

    const response = await apiClient.post("/federations", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      success.value = response.data.message || "Votre demande a été soumise avec succès !";
      setTimeout(() => {
        router.push("/federations");
      }, 3000);
    } else {
      error.value = response.data.message || "Error submitting request";
    }
  } catch (err: any) {
    console.error("Error submitting federation:", err);
    if (err.response?.status === 401) {
      error.value = "Vous devez être connecté pour créer une fédération";
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      error.value = err.response?.data?.message || "Error submitting request";
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        error.value = Object.values(errors).flat().join(", ");
      }
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.defis_section {
  width: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
}
</style>

