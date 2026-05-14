import basketball from "@/assets/images/icon/basketball.png";
import soccer from "@/assets/images/icon/soccer-icon.png";
import tennis from "@/assets/images/icon/tennis.png";
import cricket from "@/assets/images/icon/cricket.png";
import eCricket from "@/assets/images/icon/ecricket.png";
import iceHockey from "@/assets/images/icon/ice-hockey.png";
import iconNBA from "@/assets/images/icon/nba2k.png";
import volta from "@/assets/images/icon/fifa-volta.png";
import amiricanFootball from "@/assets/images/icon/america-football.png";
import volleyball from "@/assets/images/icon/volleyball.png";
import penalty from "@/assets/images/icon/penalty-shootout.png";
import handball from "@/assets/images/icon/handball.png";
import tableTennis from "@/assets/images/icon/table-tennis.png";
import kabaddi from "@/assets/images/icon/kabaddi.png";
import efighting from "@/assets/images/icon/efighting.png";
import erocket from "@/assets/images/icon/erocket-league.png";
import aussie from "@/assets/images/icon/aussie-rules.png";
import rugby from "@/assets/images/icon/rugby.png";
import eShooter from "@/assets/images/icon/eshooter.png";
import boxing from "@/assets/images/icon/boxing.png";
import mma from "@/assets/images/icon/boxing.png";
import futsal from "@/assets/images/icon/futsal.png";
import bandy from  "@/assets/images/icon/bandy.png";
import waterpolo from  "@/assets/images/icon/waterpolo.png";
import floorball from  "@/assets/images/icon/floorball.png";
import cycling from  "@/assets/images/icon/cycling.png";
import specials from  "@/assets/images/icon/specials.png";
import darts from  "@/assets/images/icon/darts.png";
import squash from  "@/assets/images/icon/squash.png";
import wrestling from  "@/assets/images/icon/wrestling.png";

export const popularData = [
  {
    id: 57940,
    image: soccer,
    labelKey: "sports.soccer",
    href: "/soccer",
  },
  {
    id: 13736,
    image: tennis,
    labelKey: "sports.tennis",
    href: "/tennis",
  },
  {
    id: 20998,
    image: basketball,
    labelKey: "sports.basketball",
    href: "/basketball",
  },
  {
    id: 9058,
    image: cricket,
    labelKey: "sports.cricket",
    href: "/cricket",
  },
  {
    id: 41066,
    image: eCricket,
    labelKey: "sports.ecricket",
    href: "/ecricket",
  },
  {
    id: 57911,
    image: amiricanFootball,
    labelKey: "sports.american_football",
    href: "/american-football",
  },
  {
    id: 33764,
    image: iceHockey,
    labelKey: "sports.ice_hockey",
    href: "/ice-hockey",
  },
  {
    id: 20140,
    image: iconNBA,
    labelKey: "sports.nba_2k",
    href: "/nba-2k",
  },
  {
    id: 26979,
    image: volleyball,
    labelKey: "sports.volleyball",
    href: "/volleyball",
  },
  {
    id: 26344,
    image: volta,
    labelKey: "sports.fifa_volta",
    href: "/fifa-volta",
  },
  {
    id: 29537,
    image: penalty,
    labelKey: "sports.penalty_shootout",
    href: "/penalty-shootout",
  },
  {
    id: 18039,
    image: handball,
    labelKey: "sports.handball",
    href: "/handball",
  },
  {
    id: 3550,
    image: tableTennis,
    labelKey: "sports.table_tennis",
    href: "/table-tennis",
  },
];

export const otherSportsData = [
  {
    id: 12232,
    image: kabaddi,
    labelKey: "sports.kabaddi",
    href: "/kabaddi",
  },
  {
    id: 20341,
    image: efighting,
    labelKey: "sports.efighting",
    href: "/efighting",
  },
  {
    id: 51272,
    image: erocket,
    labelKey: "sports.erocket_league",
    href: "/erocket-league",
  },
  {
    id: 55534,
    image: aussie,
    labelKey: "sports.aussie_rules",
    href: "/aussie-rules",
  },
  {
    id: 38128,
    image: rugby,
    labelKey: "sports.rugby",
    href: "/rugby",
  },
  {
    id: 22880,
    image: eShooter,
    labelKey: "sports.eshooter",
    href: "/eshooter",
  },
  {
    id: 16407,
    image: boxing,
    labelKey: "sports.boxing",
    href: "/boxing",
  },
  {
    id: 35315,
    image: mma,
    labelKey: "sports.mma",
    href: "/mma",
  },
  {
    id: 36847,
    image: futsal,
    labelKey: "sports.futsal",
    href: "/futsal",
  },
  {
    id: 21618,
    image: bandy,
    labelKey: "sports.bandy",
    href: "/bandy",
  },
  {
    id: 46537,
    image: waterpolo,
    labelKey: "sports.waterpolo",
    href: "/waterpolo",
  },
  {
    id: 52015,
    image: floorball,
    labelKey: "sports.floorball",
    href: "/floorball",
  },
  {
    id: 11840,
    image: cycling,
    labelKey: "sports.cycling",
    href: "/cycling",
  },
  {
    id: 42481,
    image: specials,
    labelKey: "sports.specials",
    href: "/specials",
  },
  {
    id: 36378,
    image: darts,
    labelKey: "sports.darts",
    href: "/darts",
  },
  {
    id: 26395,
    image: squash,
    labelKey: "sports.squash",
    href: "/squash",
  },
  {
    id: 29229,
    image: wrestling,
    labelKey: "sports.wrestling",
    href: "/wrestling",
  },
];

export const navItemData = [
  {
    id: 112232,
    labelKey: "nav.home",
    href: "/",
  },
  {
    id: 200004,
    labelKey: "nav.clans",
    href: "/clans",
  },
  {
    id: 200003,
    labelKey: "nav.ebetstars",
    href: "/ebetstars",
  },
  {
    id: 200005,
    labelKey: "nav.federations",
    href: "/federations",
  },
  {
    id: 200007,
    labelKey: "nav.marketplace",
    href: "/marketplace",
  },
  {
    id: 200008,
    labelKey: "nav.others",
    href: "#",
    hasSubmenu: true,
    submenu: [
      {
        id: 200006,
        labelKey: "nav.ballon_dor",
        href: "/ballon-dor",
      },
      {
        id: 120341,
        labelKey: "nav.streams",
        href: "/streams",
      },
      {
        id: 200001,
        labelKey: "nav.events",
        href: "/events",
      },
      {
        id: 200002,
        labelKey: "nav.challenges",
        href: "/challenges",
      },
      {
        id: 200009,
        labelKey: "nav.championships",
        href: "/championships",
      },
    ],
  },
];
