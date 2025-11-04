import { lazy } from "react";
import ComingSoon from "../components/ComingSoon";
import {
  Timer,
  TimerReset,
  Cherry,
  Flag,
  GraduationCap,
  Gift,
  Shuffle,
  Hash,
  Clock,
  ClipboardCheck,
  Users,
  Presentation,
  Calculator,
  Radio,
  Globe,
  type LucideIcon,
} from "lucide-react";

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
  icon: LucideIcon;
  component: React.ComponentType;
  implemented: boolean;
}

export const routes: RouteConfig[] = [
  {
    name: "Stopwatch",
    path: "/",
    icon: Timer,
    component: Stopwatch,
    implemented: true,
  },
  {
    name: "Countdown",
    path: "/countdown",
    icon: TimerReset,
    component: Countdown,
    implemented: true,
  },
  {
    name: "Pomodoro",
    path: "/pomodoro",
    icon: Cherry,
    component: PomodoroTimer,
    implemented: true,
  },
  {
    name: "Race",
    path: "/race-timers",
    icon: Flag,
    component: RaceTimers,
    implemented: true,
  },
  {
    name: "Classroom",
    path: "/classroom-timers",
    icon: GraduationCap,
    component: ClassroomTimers,
    implemented: true,
  },
  {
    name: "Holiday",
    path: "/holiday-timers",
    icon: Gift,
    component: () => ComingSoon({ title: "Holiday", icon: "🎄" }),
    implemented: false,
  },
  {
    name: "Name Picker",
    path: "/random-name-pickers",
    icon: Shuffle,
    component: RandomNamePickers,
    implemented: true,
  },
  {
    name: "Numbers",
    path: "/random-number-generators",
    icon: Hash,
    component: RandomNumberGenerators,
    implemented: true,
  },
  {
    name: "Clocks",
    path: "/clocks",
    icon: Clock,
    component: Clocks,
    implemented: true,
  },
  {
    name: "Exam",
    path: "/exam-timers",
    icon: ClipboardCheck,
    component: ExamTimers,
    implemented: true,
  },
  {
    name: "Groups",
    path: "/group-generators",
    icon: Users,
    component: GroupGenerator,
    implemented: true,
  },
  {
    name: "Presentation",
    path: "/presentation-timers",
    icon: Presentation,
    component: PresentationTimers,
    implemented: true,
  },
  {
    name: "Tally",
    path: "/tally-counters",
    icon: Calculator,
    component: TallyCounters,
    implemented: true,
  },
  {
    name: "Remote",
    path: "/remote-timer",
    icon: Radio,
    component: RemoteTimer,
    implemented: true,
  },
  {
    name: "World",
    path: "/global-time",
    icon: Globe,
    component: GlobalTime,
    implemented: true,
  },
];
