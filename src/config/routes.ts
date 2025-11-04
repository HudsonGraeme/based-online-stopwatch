import { lazy } from "react";
import ComingSoon from "../components/ComingSoon";

const Stopwatch = lazy(() => import("../Stopwatch"));
const Countdown = lazy(() => import("../Countdown"));
const PomodoroTimer = lazy(() => import("../PomodoroTimer"));
const RaceTimers = lazy(() => import("../RaceTimers"));
const ClassroomTimers = lazy(() => import("../ClassroomTimers"));
const RandomNamePickers = lazy(() => import("../RandomNamePickers"));
const RandomNumberGenerators = lazy(() => import("../RandomNumberGenerators"));
const Clocks = lazy(() => import("../Clocks"));
const ExamTimers = lazy(() => import("../ExamTimers"));
const PresentationTimers = lazy(() => import("../PresentationTimers"));
const TallyCounters = lazy(() => import("../TallyCounters"));
const GroupGenerator = lazy(() => import("../GroupGenerator"));
const RemoteTimer = lazy(() => import("../RemoteTimer"));
const GlobalTime = lazy(() => import("../GlobalTime"));

export interface RouteConfig {
  name: string;
  path: string;
  icon: string;
  component: React.ComponentType;
  implemented: boolean;
}

export const routes: RouteConfig[] = [
  {
    name: "Stopwatch",
    path: "/",
    icon: "SW",
    component: Stopwatch,
    implemented: true,
  },
  {
    name: "Countdown",
    path: "/countdown",
    icon: "CD",
    component: Countdown,
    implemented: true,
  },
  {
    name: "Pomodoro",
    path: "/pomodoro",
    icon: "PM",
    component: PomodoroTimer,
    implemented: true,
  },
  {
    name: "Race Timers",
    path: "/race-timers",
    icon: "RT",
    component: RaceTimers,
    implemented: true,
  },
  {
    name: "Classroom Timers",
    path: "/classroom-timers",
    icon: "CT",
    component: ClassroomTimers,
    implemented: true,
  },
  {
    name: "Holiday Timers",
    path: "/holiday-timers",
    icon: "HT",
    component: () => ComingSoon({ title: "Holiday Timers", icon: "HT" }),
    implemented: false,
  },
  {
    name: "Random Name Pickers",
    path: "/random-name-pickers",
    icon: "RN",
    component: RandomNamePickers,
    implemented: true,
  },
  {
    name: "Random Number Generators",
    path: "/random-number-generators",
    icon: "RG",
    component: RandomNumberGenerators,
    implemented: true,
  },
  {
    name: "Clocks",
    path: "/clocks",
    icon: "CL",
    component: Clocks,
    implemented: true,
  },
  {
    name: "Exam Timers",
    path: "/exam-timers",
    icon: "ET",
    component: ExamTimers,
    implemented: true,
  },
  {
    name: "Group Generator",
    path: "/group-generators",
    icon: "GG",
    component: GroupGenerator,
    implemented: true,
  },
  {
    name: "Presentation Timers",
    path: "/presentation-timers",
    icon: "PT",
    component: PresentationTimers,
    implemented: true,
  },
  {
    name: "Tally Counters",
    path: "/tally-counters",
    icon: "TC",
    component: TallyCounters,
    implemented: true,
  },
  {
    name: "Remote Timer",
    path: "/remote-timer",
    icon: "RM",
    component: RemoteTimer,
    implemented: true,
  },
  {
    name: "Global Time",
    path: "/global-time",
    icon: "GT",
    component: GlobalTime,
    implemented: true,
  },
];
