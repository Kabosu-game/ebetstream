<template>
  <div class="langu position-relative">
    <Listbox v-model="selectedPerson">
      <div class="langu__head mt-3 mt-sm-2 mt-md-1">
        <ListboxButton class="d-flex align-items-center relative w-100">
          <img
            class="rounded-5 me-1"
            width="{16}"
            height="{16}"
            :src="selectedPerson.srcImage"
            alt="icon"
          />
          <span class="d-flex gap-1 align-items-center truncate">
            {{ selectedPerson.name }}
            <IconArrowBadgeDownFilled
              width="20"
              height="20"
              class="n5-color mt-1"
              aria-hidden="true"
            />
          </span>
          <span
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
          >
          </span>
        </ListboxButton>

        <ListboxOptions
          class="langu__items p2-bg mt-5 max-h-60 rounded-md focus:outline-none px-3 py-2 cpoint w-120 shadow-sm"
        >
          <ListboxOption
            class="relative cursor-default select-none py-2"
            v-for="person in languages"
            :key="person.id"
            :value="person"
            as="template"
            v-slot="{ active, selected }"
          >
            <div class="d-flex flex-nowrap">
              <img
                class="rounded-5 me-3 object-fit-contain"
                width="{16}"
                height="{16}"
                :src="person.srcImage"
                alt="icon"
              />
              <span
                class="block text-nowrap"
                :class="{ 'font-medium': active, 'font-normal': !active }"
              >
                {{ person.name }}
              </span>
              <span
                v-show="selected"
                class="absolute inset-y-0 left-0 flex pl-3"
              >
              </span>
            </div>
          </ListboxOption>
        </ListboxOptions>
      </div>
    </Listbox>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { IconArrowBadgeDownFilled } from "@tabler/icons-vue";
import { useI18n } from "vue-i18n";
import english from "@/assets/images/icon/lang-usa.png";
import france from "@/assets/images/icon/lang-france.png";

const { locale } = useI18n();

const languages = [
  {
    id: "en",
    code: "en",
    srcImage: english,
    name: "English",
  },
  {
    id: "fr",
    code: "fr",
    srcImage: france,
    name: "Français",
  },
];

// Get current language from localStorage or default to English
const getCurrentLanguage = () => {
  const savedLocale = localStorage.getItem("app_language") || "en";
  return languages.find(lang => lang.code === savedLocale) || languages[0];
};

const selectedPerson = ref(getCurrentLanguage());

// Watch for language changes
watch(selectedPerson, (newLang) => {
  locale.value = newLang.code;
  localStorage.setItem("app_language", newLang.code);
  // Reload to update all components
  window.location.reload();
});

onMounted(() => {
  // Set initial language
  locale.value = selectedPerson.value.code;
});
</script>

<style scoped></style>
