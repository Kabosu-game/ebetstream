import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import AmericanFootball from "./pages/AmericanFootball.vue";
import AussieRules from "./pages/AussieRules.vue";
import Bandy from "./pages/Bandy.vue";
import Basketball from "./pages/Basketball.vue";
import Boxing from "./pages/Boxing.vue";
import Cycling from "./pages/Cycling.vue";
import Darts from "./pages/Darts.vue";
import Cricket from "./pages/Cricket.vue";
import ERocketLeague from "./pages/ERocketLeague.vue";
import ECricket from "./pages/ECricket.vue";
import EFighting from "./pages/EFighting.vue";
import EShooter from "./pages/EShooter.vue";
import FifaVolta from "./pages/FifaVolta.vue";
import Floorball from "./pages/Floorball.vue";
import Clans from "./pages/Clans.vue";
import ClanDetail from "./pages/ClanDetail.vue";
import Ebetstart from "./pages/Ebetstart.vue";
import Handball from "./pages/Handball.vue";
import Futsal from "./pages/Futsal.vue";
import IceHockey from "./pages/IceHockey.vue";
import Kabaddi from "./pages/Kabaddi.vue";
import Mma from "./pages/Mma.vue";
import Nba2k from "./pages/Nba2k.vue";
import PenaltyShootout from "./pages/PenaltyShootout.vue";
import Promotions from "./pages/Promotions.vue";
import Rugby from "./pages/Rugby.vue";
import Soccer from "./pages/Soccer.vue";
import Specials from "./pages/Specials.vue";
import Squash from "./pages/Squash.vue";
import TableTenis from "./pages/TableTenis.vue";
import Tennis from "./pages/Tennis.vue";
import VolleyBalls from "./pages/VolleyBalls.vue";
import WaterPolo from "./pages/WaterPolo.vue";
import Wrestling from "./pages/Wrestling.vue";
import CreateAccount from "./pages/CreateAccount.vue";
import LayoutTwo from "./Layouts/LayoutTwo.vue";
import Login from "./pages/Login.vue";
import LayoutThree from "./Layouts/LayoutThree.vue";
import AdminLayout from "./Layouts/AdminLayout.vue";
import Dashboard from "./pages/Dashboard.vue";
import EbetStars from "./pages/EbetStars.vue";

import Maintenance from "./pages/Maintenance.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/maintenance",
      component: Maintenance,
      meta: { 
        title: "Maintenance - Ebetstream",
        layout: false // Pas de layout pour la page de maintenance
      },
    },
    {
      path: "/",
      component: Home,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/ebetstars",
      component: EbetStars,
      meta: { title: "eBetStars - Ebetstream" },
    },
    {
      path: "/american-football",
      component: AmericanFootball,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/aussie-rules",
      component: AussieRules,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/bandy",
      component: Bandy,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/basketball",
      component: Basketball,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/boxing",
      component: Boxing,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/cycling",
      component: Cycling,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/cricket",
      component: Cricket,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/darts",
      component: Darts,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/ecricket",
      component: ECricket,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/efighting",
      component: EFighting,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/erocket-league",
      component: ERocketLeague,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/eshooter",
      component: EShooter,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/fifa-volta",
      component: FifaVolta,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/floorball",
      component: Floorball,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/futsal",
      component: Futsal,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/handball",
      component: Handball,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/ice-hockey",
      component: IceHockey,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/kabaddi",
      component: Kabaddi,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/mma",
      component: Mma,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/nba-2k",
      component: Nba2k,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/penalty-shootout",
      component: PenaltyShootout,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/promotions",
      component: Promotions,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/clans",
      component: Clans,
      meta: { title: "Clans - Ebetstream" },
    },
    {
      path: "/clans/:id",
      component: ClanDetail,
      meta: { title: "Clan Details - Ebetstream" },
    },
    {
      path: "/ebetstart",
      component: Ebetstart,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/rugby",
      component: Rugby,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/soccer",
      component: Soccer,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/specials",
      component: Specials,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/squash",
      component: Squash,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/table-tennis",
      component: TableTenis,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/tennis",
      component: Tennis,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/volleyball",
      component: VolleyBalls,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/waterpolo",
      component: WaterPolo,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/wrestling",
      component: Wrestling,
      meta: { title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/create-account",
      component: CreateAccount,
      meta: { layout: LayoutTwo, title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/create-acount",
      redirect: "/create-account",
    },
    {
      path: "/login",
      component: Login,
      meta: { layout: LayoutTwo, title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/forgot-password",
      component: () => import("./pages/ForgotPassword.vue"),
      meta: { layout: LayoutTwo, title: "Forgot Password - Ebetstream" },
    },
    {
      path: "/reset-password",
      component: () => import("./pages/ResetPassword.vue"),
      meta: { layout: LayoutTwo, title: "Reset Password - Ebetstream" },
    },
    {
      path: "/dashboard",
      component: Dashboard ,
      meta: { layout: LayoutThree, title: "Ebetstream - Sports betting platform" },
    },
    {
      path: "/profile",
      component: () => import("./pages/Profile.vue"),
      meta: { layout: LayoutThree, title: "Profile - Ebetstream" },
    },
    {
      path: "/challenges",
      component: () => import("./pages/Challenges.vue"),
      meta: { title: "P2P Challenges - Ebetstream" },
    },
    {
      path: "/challenges/:id",
      component: () => import("./pages/ChallengeDetail.vue"),
      meta: { title: "Challenge Details - Ebetstream" },
    },
    {
      path: "/challenges/:id/live",
      component: () => import("./pages/ChallengeLiveStream.vue"),
      meta: { title: "Challenge Live Stream - Ebetstream" },
    },
    {
      path: "/federations",
      component: () => import("./pages/Federations.vue"),
      meta: { title: "Fédérations - Ebetstream" },
    },
    {
      path: "/federations/register",
      component: () => import("./pages/FederationRegister.vue"),
      meta: { title: "Inscrivez votre fédération - Ebetstream" },
    },
    {
      path: "/federations/:id",
      component: () => import("./pages/FederationDetail.vue"),
      meta: { title: "Détails Fédération - Ebetstream" },
    },
    {
      path: "/marketplace",
      component: () => import("./pages/Marketplace.vue"),
      meta: { title: "Team Marketplace - Ebetstream" },
    },
    {
      path: "/ballon-dor",
      component: () => import("./pages/BallonDor.vue"),
      meta: { title: "Ballon d'Or EBETSTREAM - Vote" },
    },
    {
      path: "/ballon-dor/results",
      component: () => import("./pages/BallonDorResults.vue"),
      meta: { title: "Résultats Ballon d'Or EBETSTREAM" },
    },
    {
      path: "/streams",
      component: () => import("./pages/Streams.vue"),
      meta: { title: "Streaming Live - Ebetstream" },
    },
    {
      path: "/streams/:id",
      component: () => import("./pages/StreamView.vue"),
      meta: { title: "Stream - Ebetstream" },
    },
    {
      path: "/streams/create",
      component: () => import("./pages/StreamCreate.vue"),
      meta: { title: "Create a Stream - Ebetstream" },
    },
    {
      path: "/championships",
      component: () => import("./pages/Championships.vue"),
      meta: { title: "Championships - Ebetstream" },
    },
    {
      path: "/championships/:id",
      component: () => import("./pages/ChampionshipDetail.vue"),
      meta: { title: "Championship Details - Ebetstream" },
    },
    {
      path: "/ambassadors",
      component: () => import("./pages/Ambassadors.vue"),
      meta: { title: "Ambassadeurs - Ebetstream" },
    },
    {
      path: "/ambassadors/:id",
      component: () => import("./pages/AmbassadorDetail.vue"),
      meta: { title: "Détails Ambassadeur - Ebetstream" },
    },
    {
      path: "/players",
      component: () => import("./pages/Players.vue"),
      meta: { title: "Top Joueurs - Ebetstream" },
    },
    {
      path: "/players/:id",
      component: () => import("./pages/PlayerDetail.vue"),
      meta: { title: "Détails Joueur - Ebetstream" },
    },
    {
      path: "/partners",
      component: () => import("./pages/Partners.vue"),
      meta: { title: "Partenaires - Ebetstream" },
    },
    {
      path: "/partners/:id",
      component: () => import("./pages/PartnerDetail.vue"),
      meta: { title: "Détails Partenaire - Ebetstream" },
    },
    {
      path: "/events",
      component: () => import("./pages/Events.vue"),
      meta: { title: "Événements - Ebetstream" },
    },
    {
      path: "/events/:id",
      component: () => import("./pages/EventDetail.vue"),
      meta: { title: "Détails Événement - Ebetstream" },
    },
    {
      path: "/games/category/:id",
      component: () => import("./pages/GameCategory.vue"),
      meta: { title: "Game Category - Ebetstream" },
    },
    {
      path: "/games/:id",
      component: () => import("./pages/GameDetail.vue"),
      meta: { title: "Détails Jeu - Ebetstream" },
    },
    {
      path: "/pubg-mobile",
      component: () => import("./pages/GameByName.vue"),
      meta: { title: "PUBG Mobile - Ebetstream" },
    },
    {
      path: "/garena-free-fire",
      component: () => import("./pages/GameByName.vue"),
      meta: { title: "Garena Free Fire - Ebetstream" },
    },
    {
      path: "/mobile-legends",
      component: () => import("./pages/GameByName.vue"),
      meta: { title: "Mobile Legends: Bang Bang - Ebetstream" },
    },
    {
      path: "/mobile-legends-bang-bang",
      component: () => import("./pages/GameByName.vue"),
      meta: { title: "Mobile Legends: Bang Bang - Ebetstream" },
    },
    {
      path: "/admin",
      component: () => import("./pages/AdminDashboard.vue"),
      meta: { layout: AdminLayout, title: "Dashboard Admin - Ebetstream" },
    },
    // Company Pages
    {
      path: "/about",
      component: () => import("./pages/About.vue"),
      meta: { title: "À propos - eBetStream" },
    },
    {
      path: "/contact",
      component: () => import("./pages/Contact.vue"),
      meta: { title: "Contact - eBetStream" },
    },
    {
      path: "/careers",
      component: () => import("./pages/Careers.vue"),
      meta: { title: "Carrières - eBetStream" },
    },
    // Legal Pages
    {
      path: "/privacy",
      component: () => import("./pages/Privacy.vue"),
      meta: { title: "Politique de Confidentialité - eBetStream" },
    },
    {
      path: "/terms",
      component: () => import("./pages/Terms.vue"),
      meta: { title: "Conditions Générales - eBetStream" },
    },
    {
      path: "/cookies",
      component: () => import("./pages/Cookies.vue"),
      meta: { title: "Politique des Cookies - eBetStream" },
    },
    // Support Pages
    {
      path: "/help",
      component: () => import("./pages/Help.vue"),
      meta: { title: "Centre d'Aide - eBetStream" },
    },
    {
      path: "/faq",
      component: () => import("./pages/Faq.vue"),
      meta: { title: "FAQ - eBetStream" },
    },
    {
      path: "/support",
      component: () => import("./pages/Support.vue"),
      meta: { title: "Support - eBetStream" },
    },
    // Certification Pages
    {
      path: "/become-organizer",
      component: () => import("./pages/BecomeOrganizer.vue"),
      meta: { title: "Become a Certified Organizer - eBetStream" },
    },
    {
      path: "/become-referee",
      component: () => import("./pages/BecomeReferee.vue"),
      meta: { title: "Become a Certified Referee - eBetStream" },
    },
    {
      path: "/become-ambassador",
      component: () => import("./pages/BecomeAmbassador.vue"),
      meta: { title: "Become a Certified Ambassador - eBetStream" },
    },
    {
      path: "/become-agent",
      component: () => import("./pages/BecomeAgent.vue"),
      meta: { title: "Become a Recharge Agent - eBetStream" },
    },
  ],
});
