<template>
  <li
    v-for="navItemSingle in navItemData"
    :key="navItemSingle.id"
    class="dropdown"
    :class="{ 
      'show-dropdown': navItemSingle.hasSubmenu,
      'dropdown-open': openSubmenu === navItemSingle.id
    }"
  >
    <!-- Item with submenu -->
    <div v-if="navItemSingle.hasSubmenu" class="nav-item-with-submenu position-relative">
      <a
        href="#"
        :class="['navunik', 'dropdown-toggle', 'nav-dropdown-toggle']"
        @click.stop="toggleSubmenu(navItemSingle.id)"
      >
        {{ navItemSingle.linkText }}
        <IconChevronDown
          v-if="openSubmenu !== navItemSingle.id"
          class="nav-dropdown-icon"
          :size="18"
          stroke="1.5"
        />
        <IconChevronUp
          v-else
          class="nav-dropdown-icon"
          :size="18"
          stroke="1.5"
        />
      </a>
      <ul 
        v-if="openSubmenu === navItemSingle.id"
        class="dropdown-menu show"
        @click.stop
      >
        <li v-for="subItem in navItemSingle.submenu" :key="subItem.id">
          <router-link
            :to="subItem.href"
            class="dropdown-item"
            :class="{ active: isActive(subItem.href) }"
            @click="closeSubmenu"
          >
            {{ subItem.linkText }}
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Regular item without submenu -->
    <router-link
      v-else
      :class="['navunik', isActive(navItemSingle.href) ? 'active' : '']"
      :to="navItemSingle.href"
    >
      {{ navItemSingle.linkText }}
    </router-link>
  </li>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-vue";
import { navItemData } from "../../assets/data/navData";
import { useRoute } from "vue-router";

const route = useRoute();
const openSubmenu = ref<number | null>(null);

const isActive = (href: string) => {
  return route.path === href;
};

const toggleSubmenu = (id: number) => {
  openSubmenu.value = openSubmenu.value === id ? null : id;
};

const closeSubmenu = () => {
  openSubmenu.value = null;
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.nav-item-with-submenu')) {
    openSubmenu.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.dropdown-menu {
  background: #1a1f3a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.5rem 0;
  min-width: 180px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  margin-top: 0.5rem;
  display: block !important;
}

/* Responsive: en mode mobile, position relative au lieu de absolute */
@media (max-width: 991px) {
  .dropdown-menu {
    position: static !important;
    margin-top: 0.5rem;
    margin-left: 1rem;
    width: calc(100% - 2rem);
    box-shadow: none;
    border: none;
    border-left: 2px solid rgba(102, 126, 234, 0.3);
    border-radius: 0;
    padding-left: 1rem;
  }
  
  .nav-item-with-submenu {
    display: flex;
    flex-direction: column;
  }
}

.dropdown-item {
  color: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 1rem;
  text-decoration: none;
  display: block;
  transition: all 0.3s ease;
}

.dropdown-item:hover,
.dropdown-item.active {
  background: rgba(102, 126, 234, 0.2);
  color: white;
}

.nav-item-with-submenu {
  position: relative;
}

.dropdown-toggle {
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

/* Masquer le ::after FontAwesome qui ne s'affiche pas correctement */
.nav-dropdown-toggle::after {
  display: none !important;
}

.nav-dropdown-icon {
  flex-shrink: 0;
  opacity: 0.9;
  transition: transform 0.2s ease;
}
</style>
