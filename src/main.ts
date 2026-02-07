import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import { router } from "./route";
import "./assets/scss/style.scss";
import i18n from "./i18n";
import { MAINTENANCE_MODE } from "./config/maintenance";

// Redirection vers la page de maintenance si activée
router.beforeEach((to) => {
  // Si le mode maintenance est activé et qu'on n'est pas déjà sur la page de maintenance
  if (MAINTENANCE_MODE && to.path !== "/maintenance") {
    return "/maintenance";
  }
  
  // Si le mode maintenance est désactivé et qu'on est sur la page de maintenance, rediriger vers la home
  if (!MAINTENANCE_MODE && to.path === "/maintenance") {
    return "/";
  }

  if (to.meta && typeof to.meta.title === "string") {
    document.title = to.meta.title;
  } else {
    document.title = "Default Title";
  }
  window.scrollTo(0, 0);
});

const app = createApp(App);

app.use(router);
app.use(i18n);

app.mount("#app");
