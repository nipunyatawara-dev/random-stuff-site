export interface CuratedStack {
  id: string;
  title: string;
  tagline: string;
  description: string;
  badge: string;
  iconName: "terminal" | "globe" | "monitor" | "sparkles";
  itemIds: string[];
  roles: Record<string, string>;
}
export const CURATED_STACKS: CuratedStack[] = [
  {
    id: "mac-powerpack",
    title: "A calmer Mac setup",
    tagline: "Launch, switch and organize",
    description:
      "Four focused utilities for launching apps, switching windows and managing your Mac's everyday details.",
    badge: "macOS",
    iconName: "monitor",
    itemIds: [
      "softwares-raycast",
      "softwares-alttab",
      "softwares-mounty",
      "softwares-boring-notch",
    ],
    roles: {
      "softwares-raycast":
        "Launch apps and run everyday commands. Core features have a free tier; paid features are separate.",
      "softwares-alttab": "Switch between windows with visual previews.",
      "softwares-mounty":
        "Work with NTFS drives; check current macOS compatibility before installing.",
      "softwares-boring-notch":
        "Add quick controls around the MacBook notch; check supported hardware.",
    },
  },
  {
    id: "web-studio",
    title: "Design a web interface",
    tagline: "From the first sketch to components",
    description:
      "Sketch a flow, design the interface and choose real components and visual assets for the build.",
    badge: "Design",
    iconName: "sparkles",
    itemIds: [
      "websites-excalidraw",
      "websites-penpot",
      "websites-react-bits",
      "websites-isocons",
      "websites-shader-gradient",
    ],
    roles: {
      "websites-excalidraw":
        "Sketch the structure and user flow before polishing the interface.",
      "websites-penpot":
        "Create layouts and interface designs collaboratively.",
      "websites-react-bits":
        "Choose React interactions; check the component's license before reuse.",
      "websites-isocons": "Find icons with a consistent visual treatment.",
      "websites-shader-gradient":
        "Explore a background treatment when it supports the design.",
    },
  },
  {
    id: "cli-hacker",
    title: "A practical terminal kit",
    tagline: "One terminal, useful tasks",
    description:
      "A terminal alongside tools for web-to-desktop packaging, media conversion and data extraction. Platform requirements differ by tool.",
    badge: "CLI",
    iconName: "terminal",
    itemIds: [
      "softwares-tabby",
      "scripts-pake",
      "scripts-ffmpeg-script",
      "scripts-scrapy",
    ],
    roles: {
      "softwares-tabby": "Use a terminal to run the tools in this kit.",
      "scripts-pake":
        "Package a web app as a desktop app with Rust and Tauri; check the build prerequisites.",
      "scripts-ffmpeg-script":
        "Read FFmpeg's documentation to build a conversion command for your media.",
      "scripts-scrapy":
        "Build a Python data extraction workflow; respect the target site's access rules.",
    },
  },
  {
    id: "ai-lab",
    title: "Explore local AI",
    tagline: "Run, organize and transcribe",
    description:
      "Tools for running local models, working with your documents and transcribing audio. Model downloads and hardware requirements vary.",
    badge: "Local AI",
    iconName: "globe",
    itemIds: [
      "softwares-lm-studio",
      "softwares-jan",
      "softwares-anythingllm",
      "softwares-handy",
    ],
    roles: {
      "softwares-lm-studio":
        "Download a model that fits your machine and try local inference.",
      "softwares-jan":
        "Explore another local model interface; review model licenses separately.",
      "softwares-anythingllm":
        "Connect your documents and a chosen model backend; local operation depends on configuration.",
      "softwares-handy":
        "Try local speech transcription after downloading the required model.",
    },
  },
];
