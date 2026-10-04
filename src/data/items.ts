import { getTopicsForItem, type SearchTopic } from "@/lib/search-topics";

export interface Item {
  id: string;
  title: string;
  description: string;
  website?: string;
  github?: string;
  category: string;
  tags: string[];
  topics: SearchTopic[];
  searchTerms?: string[];
  image?: string;
  isNew?: boolean;
}

type RawItem = Omit<Item, "id" | "topics">;

/** Extract a favicon URL from a website URL */
function getFaviconUrl(url?: string): string | undefined {
  if (!url || url === "#") return undefined;
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return undefined;
  }
}

const rawItems: RawItem[] = [
  {
    "title": "Tabby",
    "description": "A terminal for a more modern age.",
    "website": "https://tabby.sh",
    "github": "https://github.com/Eugeny/tabby",
    "category": "Softwares",
    "tags": [
      "terminal",
      "all"
    ]
  },
  {
    "title": "React Bits",
    "description": "A huge library of animated React components.",
    "website": "https://reactbits.dev",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://reactbits.dev/favicon.ico"
  },
  {
    "title": "WizTree",
    "description": "Find what's eating your disk space on Windows.",
    "website": "https://diskanalyzer.com",
    "category": "Softwares",
    "tags": [
      "windows"
    ],
    "image": "https://diskanalyzer.com/favicon.ico"
  },
  {
    "title": "Raycast",
    "description": "The best launcher for macOS. Replaces Spotlight.",
    "website": "https://raycast.com",
    "github": "https://github.com/raycast",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
  },
  {
    "title": "Ffmpeg Script",
    "description": "Quickly convert MKV to MP4 without losing quality.",
    "website": "#",
    "category": "Scripts",
    "tags": [
      "macos",
      "windows",
      "linux"
    ]
  },
  {
    "title": "Chris Titus WinUtil",
    "description": "Windows utility to debloat, install apps, and adjust system settings.",
    "website": "https://christitus.com/one-tool-for-everything/",
    "category": "Scripts",
    "tags": [
      "windows"
    ]
  },
  {
    "title": "PlayCover",
    "description": "Run iOS apps and games on Apple Silicon Macs with keyboard support.",
    "website": "https://playcover.io",
    "github": "https://github.com/PlayCover/PlayCover/",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/PlayCover.png"
  },
  {
    "title": "FMHY",
    "description": "The largest collection of free stuff on the internet (tools, piracy, etc).",
    "website": "https://fmhy.net/",
    "github": "https://github.com/fmhy/bookmarks",
    "category": "Websites",
    "tags": [
      "all"
    ],
  },
  {
    "title": "Github Store",
    "description": "A free app store to browse and install apps from GitHub releases.",
    "website": "https://www.github-store.org/",
    "github": "https://github.com/rainxchzed/Github-Store/",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/rainxchzed.png"
  },
  {
    "title": "Awesome Swift Apps",
    "description": "List of open-source macOS applications built with Swift.",
    "github": "https://github.com/jaywcjlove/awesome-swift-macos-apps/",
    "category": "Websites",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/jaywcjlove.png"
  },
  {
    "title": "Popcorn Time",
    "description": "Watch movies and TV shows instantly via torrent streaming.",
    "website": "https://popcorntime.app",
    "github": "https://github.com/popcorntime/popcorntime",
    "category": "Softwares",
    "tags": [
      "macos",
      "windows",
      "linux"
    ],
    "image": "https://github.com/popcorntime.png"
  },
  {
    "title": "Brisk",
    "description": "An ultra-fast, modern download manager for macOS and Linux.",
    "github": "https://github.com/BrisklyDev/brisk/",
    "category": "Softwares",
    "tags": [
      "macos",
      "linux"
    ],
    "image": "https://github.com/BrisklyDev.png"
  },
  {
    "title": "Cobalt",
    "description": "Download media from YouTube, Twitter, and more without ads or tracking.",
    "website": "https://cobalt.tools/",
    "category": "Websites",
    "tags": [
      "all"
    ],
  },
  {
    "title": "Mole",
    "description": "A terminal tool for deep macOS cleanup and app uninstallation.",
    "website": "https://x.com/HiTw93/status/2037873590461464915",
    "github": "https://github.com/tw93/Mole",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/tw93.png"
  },
  {
    "title": "Vert",
    "description": "Securely convert files locally in your browser using WebAssembly.",
    "website": "https://vert.sh/",
    "github": "https://github.com/VERT-sh/VERT",
    "category": "Websites",
    "tags": [
      "all"
    ]
  },
  {
    "title": "Mounty",
    "description": "A tiny tool to re-mount write-protected NTFS volumes on macOS.",
    "website": "https://mounty.app/",
    "github": "https://github.com/tuxera/ntfs-3g",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://mounty.app/favicon.ico"
  },
  {
    "title": "Isocons",
    "description": "A free collection of customizable isometric icons.",
    "website": "https://www.isocons.app/",
    "category": "Websites",
    "tags": [
      "all"
    ]
  },
  {
    "title": "Boring Notch",
    "description": "Turns your MacBook notch into a dynamic, functional hub.",
    "website": "https://theboring.name/",
    "github": "https://github.com/TheBoredTeam/boring.notch/?tab=readme-ov-file",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/TheBoredTeam.png"
  },
  {
    "title": "Darkwrite",
    "description": "A distraction-free, eye-candy note-taking and to-do app.",
    "website": "https://darkwrite.app/",
    "github": "https://github.com/astudentinearth/darkwrite",
    "category": "Softwares",
    "tags": [
      "all"
    ]
  },
  {
    "title": "UTM",
    "description": "Run virtual machines (Windows, Linux) on iOS and macOS.",
    "website": "https://getutm.app",
    "github": "https://github.com/utmapp/UTM",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/utmapp.png"
  },
  {
    "title": "WinApps",
    "description": "Run Windows apps like Office and Adobe on Linux through a guided installer.",
    "github": "https://github.com/winapps-org/winapps",
    "category": "Softwares",
    "tags": [
      "linux"
    ],
    "image": "https://github.com/winapps-org.png"
  },
  {
    "title": "EdClub",
    "description": "Educational platform for typing, vocabulary, and more.",
    "website": "https://www.edclub.com/sportal/",
    "category": "Websites",
    "tags": [
      "all"
    ]
  },
  {
    "title": "MAS",
    "description": "Microsoft Activation Scripts - Open source Windows/Office activator.",
    "website": "https://massgrave.dev",
    "github": "https://github.com/massgravel/Microsoft-Activation-Scripts",
    "category": "Scripts",
    "tags": [
      "windows"
    ],
    "image": "https://github.com/massgravel.png"
  },
  {
    "title": "niri",
    "description": "A scrollable-tiling Wayland compositor.",
    "website": "https://niri-wm.github.io/niri/",
    "github": "https://github.com/YaLTeR/niri",
    "category": "Softwares",
    "tags": [
      "linux"
    ],
    "image": "https://github.com/YaLTeR.png"
  },
  {
    "title": "Spicetify CLI",
    "description": "Command-line tool to customize the Spotify desktop app.",
    "website": "https://spicetify.app",
    "github": "https://github.com/spicetify/cli",
    "category": "Softwares",
    "tags": [
      "macos",
      "windows",
      "linux"
    ],
    "image": "https://github.com/spicetify.png"
  },
  {
    "title": "Win11Debloat",
    "description": "Debloat and tweak Windows 11.",
    "github": "https://github.com/Raphire/Win11Debloat",
    "category": "Scripts",
    "tags": [
      "windows"
    ],
    "image": "https://github.com/Raphire.png"
  },
  {
    "title": "DockDoor",
    "description": "Dock alternative for macOS.",
    "website": "https://dockdoor.net/",
    "github": "https://github.com/ejbills/DockDoor",
    "category": "Softwares",
    "tags": [
      "macos"
    ]
  },
  {
    "title": "Shine",
    "description": "Open-source project from Blade04208.",
    "github": "https://github.com/Blade04208/shine/",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/Blade04208.png"
  },
  {
    "title": "Gemini Watermark Remover",
    "description": "Watermark removal tool.",
    "website": "https://pilio.ai/gemini-watermark-remover",
    "github": "https://github.com/journey-ad/gemini-watermark-remover",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/journey-ad.png"
  },
  {
    "title": "shadPS4",
    "description": "PlayStation 4 emulator.",
    "website": "https://shadps4.net/",
    "github": "https://github.com/shadps4-emu/shadPS4",
    "category": "Softwares",
    "tags": [
      "windows",
      "linux"
    ],
    "image": "https://github.com/shadps4-emu.png"
  },
  {
    "title": "Mate Engine",
    "description": "Game engine project.",
    "website": "https://store.steampowered.com/app/3625270/MateEngine/",
    "github": "https://github.com/shinyflvre/Mate-Engine",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/shinyflvre.png"
  },
  {
    "title": "Cline",
    "description": "Open-source AI coding assistant.",
    "website": "https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev",
    "github": "https://github.com/cline/cline",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/cline.png"
  },
  {
    "title": "FaceFusion",
    "description": "Face swap and enhancement toolkit.",
    "website": "https://facefusion.io",
    "github": "https://github.com/allenk/facefusion",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/allenk.png"
  },
  {
    "title": "Droppy",
    "description": "Self-hosted file sharing app.",
    "github": "https://github.com/iordv/Droppy",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/iordv.png"
  },
  {
    "title": "Open Researcher",
    "description": "Automated research assistant.",
    "github": "https://github.com/firecrawl/open-researcher",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/firecrawl.png"
  },
  {
    "title": "Cloudflare Error Page",
    "description": "Custom Cloudflare error page template.",
    "website": "https://virt.moe/cferr/editor/",
    "github": "https://github.com/donlon/cloudflare-error-page",
    "category": "Scripts",
    "tags": [
      "all"
    ],
    "image": "https://github.com/donlon.png"
  },
  {
    "title": "LM Studio",
    "description": "Run local LLMs on your machine.",
    "website": "https://lmstudio.ai/",
    "github": "https://github.com/lmstudio-ai",
    "category": "Softwares",
    "tags": [
      "macos",
      "windows",
      "linux"
    ],
    "image": "https://lmstudio.ai/favicon.ico"
  },
  {
    "title": "Shader Gradient",
    "description": "Generate shader-style gradients.",
    "website": "https://shadergradient.co/",
    "category": "Websites",
    "tags": [
      "all"
    ]
  },
  {
    "title": "OpenScreen",
    "description": "Screen sharing and remote control.",
    "website": "https://openscreen.vercel.app",
    "github": "https://github.com/siddharthvaddem/openscreen",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/siddharthvaddem.png"
  },
  {
    "title": "FineTune",
    "description": "A macOS menu bar app for per-app volume control, multi-device output, audio routing, and 10-band EQ.",
    "github": "https://github.com/ronitsingh10/FineTune",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/ronitsingh10.png"
  },
  {
    "title": "Net-Bar",
    "description": "Network status bar app.",
    "github": "https://github.com/iad1tya/Net-Bar",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/iad1tya.png"
  },
  {
    "title": "Ear (web)",
    "description": "Unofficial web app to control Nothing/CMF audio devices on PC/Mac.",
    "website": "https://earweb.bttl.xyz/",
    "github": "https://github.com/radiance-project/ear-web/issues",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://earweb.bttl.xyz/favicon.ico"
  },
  {
    "title": "Scrcpy GUI",
    "description": "A modern, high-performance Windows GUI for scrcpy.",
    "github": "https://github.com/kil0bit-kb/scrcpy-gui",
    "category": "Softwares",
    "tags": [
      "windows"
    ],
    "image": "https://github.com/kil0bit-kb.png"
  },
  {
    "title": "CodexBar",
    "description": "MacOS menu bar app to track OpenAI/Claude usage quotas.",
    "website": "https://codexbar.app",
    "github": "https://github.com/steipete/CodexBar",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/steipete.png"
  },
  {
    "title": "Excalidraw",
    "description": "Virtual collaborative whiteboard with hand-drawn feel diagrams.",
    "website": "https://excalidraw.com",
    "github": "https://github.com/excalidraw/excalidraw",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://excalidraw.com/favicon.ico"
  },
  {
    "title": "Corca",
    "description": "Math formula editor with LaTeX export and live collaboration.",
    "website": "https://corca.app",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://corca.app/favicon.ico"
  },
  {
    "title": "Quick Subtitles",
    "description": "Generate subtitles for videos in seconds on iOS.",
    "website": "https://apps.apple.com/us/app/quick-subtitles/id6747410609",
    "category": "Softwares",
    "tags": [
      "ios"
    ]
  },
  {
    "title": "Transmission",
    "description": "Fast, easy, and free BitTorrent client for Mac, Windows, and Linux.",
    "website": "https://transmissionbt.com",
    "github": "https://github.com/transmission/transmission/issues",
    "category": "Softwares",
    "tags": [
      "macos",
      "windows",
      "linux"
    ],
    "image": "https://github.com/transmission.png"
  },
  {
    "title": "iLovePDF",
    "description": "Free online tools to merge, split, compress, and convert PDFs.",
    "website": "https://www.ilovepdf.com/",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://www.ilovepdf.com/favicon.ico"
  },
  {
    "title": "Mini-Agent",
    "description": "Open-source agent framework from MiniMax-AI.",
    "website": "https://www.minimax.io/",
    "github": "https://github.com/MiniMax-AI/Mini-Agent",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/MiniMax-AI.png"
  },
  {
    "title": "BetterCapture",
    "description": "The macOS screen recorder for the rest of us - always free and open source with a native look and feel.",
    "website": "https://bettercapture.app/",
    "github": "https://github.com/jsattler/BetterCapture",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/jsattler.png"
  },
  {
    "title": "Hidden",
    "description": "An ultra-light MacOS utility that helps hide menu bar icons.",
    "website": "https://d.foundation/opensource",
    "github": "https://github.com/dwarvesf/hidden",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/dwarvesf.png"
  },
  {
    "title": "IINA",
    "description": "The modern video player for macOS.",
    "website": "https://iina.io",
    "github": "https://github.com/iina/iina",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/iina.png"
  },
  {
    "title": "Torph",
    "description": "Dependency-free animated text component.",
    "website": "https://torph.lochie.me/",
    "github": "https://github.com/lochie/torph",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://torph.lochie.me/og.png"
  },
  {
    "title": "Scrollbar",
    "description": "Simple online scrollbar editor.",
    "website": "https://scrollbar.app",
    "github": "https://github.com/henripar/scrollbar",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://github.com/henripar.png"
  },
  {
    "title": "BentoPDF",
    "description": "A Privacy First PDF Toolkit.",
    "website": "https://bentopdf.com/",
    "github": "https://github.com/alam00000/bentopdf",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/alam00000.png"
  },
  {
    "title": "PS4 Game Scraper",
    "description": "PS4 Game Scraper.",
    "github": "https://github.com/NookieAI/PS4-Game-Scraper",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/NookieAI.png"
  },
  {
    "title": "CopyCat Clipboard",
    "description": "Clipboard history manager to search and paste recent clips across apps.",
    "website": "https://www.entilitystudio.com/copycat-clipboard",
    "github": "https://github.com/raj457036/CopyCat-Clipboard",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/raj457036.png"
  },
  {
    "title": "Sileo",
    "description": "Beautiful Toast Notifications for React.",
    "website": "https://sileo.aaryan.design/",
    "github": "https://github.com/hiaaryan/sileo",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://sileo.aaryan.design/favicon.ico"
  },
  {
    "title": "Battery-Toolkit",
    "description": "Control the platform power state of your Apple Silicon Mac.",
    "github": "https://github.com/mhaeuser/Battery-Toolkit",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/mhaeuser.png"
  },
  {
    "title": "MagicPods",
    "description": "Battery status, ear detection, and popup indicators for AirPods on Windows.",
    "website": "https://magicpods.app",
    "github": "https://github.com/steam3d/MagicPods-Windows",
    "category": "Softwares",
    "tags": [
      "windows"
    ],
    "image": "https://github.com/steam3d.png"
  },
  {
    "title": "IPSW Downloads",
    "description": "Download current and previous versions of Apple's iOS, iPadOS, macOS, watchOS, tvOS, audioOS and visionOS firmware.",
    "website": "https://ipsw.me/",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://ipsw.me/favicon.ico"
  },
  {
    "title": "Carbon Design System",
    "description": "IBM's open source design system for products and digital experiences.",
    "website": "https://www.carbondesignsystem.com",
    "github": "https://github.com/carbon-design-system/carbon",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://github.com/carbon-design-system.png"
  },
  {
    "title": "Poke",
    "description": "Privacy-focused client with a YouTube front-end, translation tools, and maps.",
    "website": "https://poketube.fun/",
    "github": "https://github.com/TecharoHQ/anubis",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://poketube.fun/favicon.ico"
  },
  {
    "title": "NouTube Desktop",
    "description": "Ad-free YouTube desktop application.",
    "github": "https://github.com/nonbili/NouTube-Desktop",
    "category": "Softwares",
    "tags": [
      "macos",
      "windows",
      "linux"
    ],
    "image": "https://github.com/nonbili.png"
  },
  {
    "title": "NouTube",
    "description": "Ad-free YouTube client.",
    "github": "https://github.com/nonbili/NouTube",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/nonbili.png"
  },
  {
    "title": "Lucide Animated",
    "description": "Beautiful animated icons for Lucide.",
    "website": "https://lucide-animated.com/",
    "github": "https://github.com/pqoqubbw/icons",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://lucide-animated.com/favicon.ico"
  },
  {
    "title": "Scrapy",
    "description": "A fast high-level web crawling and scraping framework for Python.",
    "website": "https://scrapy.org",
    "github": "https://github.com/scrapy/scrapy",
    "category": "Scripts",
    "tags": [
      "all"
    ],
    "image": "https://github.com/scrapy.png"
  },
  {
    "title": "The Component Gallery",
    "description": "A collection of components from the best Design Systems.",
    "website": "https://component.gallery/",
    "github": "https://github.com/elastic/eui",
    "category": "Websites",
    "tags": [
      "all"
    ]
  },
  {
    "title": "Metrolist",
    "description": "A simple to-do list taking design cues from the Metro design language.",
    "website": "https://metrolist.cc/",
    "github": "https://github.com/MetrolistGroup/Metrolist",
    "category": "Softwares",
    "tags": [
      "android"
    ],
    "image": "https://github.com/MetrolistGroup.png"
  },
  {
    "title": "Karaoke Eternal",
    "description": "Open karaoke party system.",
    "website": "https://www.karaoke-eternal.com",
    "github": "https://github.com/bhj/KaraokeEternal",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/bhj.png"
  },
  {
    "title": "Shadcn Admin",
    "description": "Admin Dashboard UI built with Shadcn and Vite.",
    "website": "https://shadcn-admin.netlify.app/",
    "github": "https://github.com/satnaing/shadcn-admin",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://github.com/satnaing.png"
  },
  {
    "title": "FlyCut Caption",
    "description": "React component for editing subtitles with speech recognition and timeline waveforms.",
    "website": "https://caption.flycut.co",
    "github": "https://github.com/x007xyz/flycut-caption",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/x007xyz.png"
  },
  {
    "title": "Awesome Self-Hosted",
    "description": "A list of Free Software network services and web applications which can be hosted on your own servers.",
    "website": "https://awesome-selfhosted.net/",
    "github": "https://github.com/awesome-selfhosted/awesome-selfhosted",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://github.com/awesome-selfhosted.png"
  },
  {
    "title": "WinShot",
    "description": "A Windows screenshot tool with annotation, crop, and export features.",
    "website": "http://winshot.claudekit.cc/",
    "github": "https://github.com/mrgoonie/winshot",
    "category": "Softwares",
    "tags": [
      "windows"
    ],
    "image": "https://github.com/mrgoonie.png"
  },
  {
    "title": "Stats",
    "description": "macOS system monitor in your menu bar.",
    "website": "https://mac-stats.com",
    "github": "https://github.com/exelban/stats",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/exelban.png"
  },
  {
    "title": "API Mega List",
    "description": "A powerhouse collection of APIs you can start using immediately to build everything from simple automations to full-scale applications.",
    "github": "https://github.com/cporter202/API-mega-list",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://github.com/cporter202.png"
  },
  {
    "title": "Gopeed",
    "description": "A modern download manager that supports all platforms. Built with Golang and Flutter.",
    "website": "https://gopeed.com",
    "github": "https://github.com/GopeedLab/gopeed",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/GopeedLab.png"
  },
  {
    "title": "Bulk Crap Uninstaller",
    "description": "Remove large amounts of unwanted applications quickly.",
    "website": "https://www.bcuninstaller.com/",
    "github": "https://github.com/Klocman/Bulk-Crap-Uninstaller",
    "category": "Softwares",
    "tags": [
      "windows"
    ],
    "image": "https://github.com/Klocman.png"
  },
  {
    "title": "Delphi Tools",
    "description": "A collection of small, low stakes and low effort web tools including calculators, converters, and generators.",
    "website": "https://delphi.tools/",
    "github": "https://github.com/1612elphi/delphitools",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://delphi.tools/favicon.ico"
  },
  {
    "title": "AnythingLLM",
    "description": "Desktop app to run, chat with, and query local LLMs on your machine.",
    "website": "https://anythingllm.com",
    "github": "https://github.com/Mintplex-Labs/anything-llm",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/Mintplex-Labs.png"
  },
  {
    "title": "LLMFit",
    "description": "Hundreds of models & providers. One command to find what runs on your hardware.",
    "github": "https://github.com/AlexsJones/llmfit",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/AlexsJones.png"
  },
  {
    "title": "Onyx",
    "description": "Open-source web chat interface that connects to local and cloud LLM providers.",
    "website": "https://www.onyx.app",
    "github": "https://github.com/onyx-dot-app/onyx",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/onyx-dot-app.png"
  },
  {
    "title": "Jan",
    "description": "An open source alternative to ChatGPT that runs 100% offline on your computer.",
    "website": "https://jan.ai",
    "github": "https://github.com/janhq/jan/releases/latest",
    "category": "Softwares",
    "tags": [
      "macos",
      "windows",
      "linux"
    ],
    "image": "https://github.com/janhq.png"
  },
  {
    "title": "Flow",
    "description": "Experimental tool from Google Labs for visual AI workflows.",
    "website": "https://labs.google/fx/tools/flow",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://labs.google/favicon.ico"
  },
  {
    "title": "WorldMonitor",
    "description": "Dashboard for live global news tracking, geopolitical events, and infrastructure monitoring.",
    "website": "https://worldmonitor.app",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/koala73.png"
  },
  {
    "title": "Penpot",
    "description": "The open-source design tool for design and code collaboration.",
    "website": "https://penpot.app",
    "github": "https://github.com/penpot/penpot",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://github.com/penpot.png"
  },
  {
    "title": "Visual Explainer",
    "description": "Agent skill that generates rich HTML pages or slide decks for diagrams, diff reviews, plan audits, data tables, and project recaps.",
    "github": "https://github.com/nicobailon/visual-explainer",
    "category": "Scripts",
    "tags": [
      "all"
    ],
    "image": "https://github.com/nicobailon.png"
  },
  {
    "title": "FluxMarkdown",
    "description": "Beautiful Markdown previews in macOS Finder QuickLook with Mermaid, KaTeX, GFM, charts, and export.",
    "github": "https://github.com/xykong/flux-markdown",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/xykong.png"
  },
  {
    "title": "TypeWhisper",
    "description": "Local, on-device speech-to-text for macOS, Windows, and iOS with no cloud or API keys.",
    "website": "https://www.typewhisper.com/",
    "github": "https://github.com/TypeWhisper",
    "category": "Softwares",
    "tags": [
      "macos",
      "windows",
      "ios"
    ],
    "image": "https://github.com/TypeWhisper.png"
  },
  {
    "title": "VibeUI",
    "description": "92 layout prompts for UI generation covering auth, pricing, heroes, bento grids, and dashboards.",
    "website": "https://vibeui.online/",
    "category": "Websites",
    "tags": [
      "all"
    ]
  },
  {
    "title": "CompressO",
    "description": "A 100% free, offline, and open-source video and image compression app. Compress any file to a tiny size without quality loss. Available for Mac, Windows, and Linux.",
    "website": "https://compresso.codeforreal.com/",
    "github": "https://github.com/codeforreal1/compressO",
    "category": "Softwares",
    "tags": [
      "macos",
      "windows",
      "linux"
    ]
  },
  {
    "title": "Reclip",
    "description": "Lightweight, self-hosted media downloader with a clean web UI. Download videos from almost any website. Easy to deploy and run on your own server.",
    "github": "https://github.com/averygan/reclip",
    "category": "Scripts",
    "tags": [
      "all"
    ],
    "image": "https://github.com/averygan.png"
  },
  {
    "title": "Clicky",
    "description": "macOS cursor companion that reads screen context and speaks explanations in real time.",
    "website": "https://www.clicky.so/",
    "github": "https://github.com/farzaa/clicky",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/farzaa.png"
  },
  {
    "title": "ytDownloader",
    "description": "A free, open-source desktop video downloader. Download videos and audio from YouTube, TikTok, Instagram, Twitter, Twitch, and 1000+ more sites.",
    "website": "https://aandrew-me.github.io/ytDownloader/",
    "category": "Softwares",
    "tags": [
      "macos",
      "windows",
      "linux"
    ]
  },
  {
    "title": "VidBee",
    "description": "Archive video, audio, and transcripts from YouTube, TikTok, and other platforms for offline search and backup.",
    "website": "https://vidbee.org/",
    "category": "Softwares",
    "tags": [
      "all"
    ]
  },
  {
    "title": "Webcam & Mic Test",
    "description": "In-browser webcam and microphone tester to check video quality, resolution, and frame rates.",
    "website": "https://webcammictest.com/",
    "category": "Websites",
    "tags": [
      "all"
    ]
  },
  {
    "title": "Dither",
    "description": "A vector dithering tool for the web and Adobe Illustrator. Apply stylish dithering effects to images and graphics to create retro halftone-style art. Open source.",
    "website": "https://dither.fun/",
    "github": "https://github.com/Shpigford/dither",
    "category": "Scripts",
    "tags": [
      "all"
    ],
    "image": "https://github.com/Shpigford.png"
  },
  {
    "title": "Recordly",
    "description": "Open-source desktop screen recorder and editor for polished demos, walkthroughs, and product videos with auto-zooms, cursor polish, backgrounds, and timeline editing.",
    "website": "https://recordly.dev/",
    "github": "https://github.com/webadderallorg/Recordly",
    "category": "Softwares",
    "tags": [
      "macos",
      "windows",
      "linux"
    ],
    "image": "https://github.com/webadderallorg.png"
  },
  {
    "title": "Clop",
    "description": "Image, video, PDF, and clipboard optimizer for macOS. Automatically compresses copied media, screen recordings, screenshots, and files so they are smaller and easier to share.",
    "website": "https://lowtechguys.com/clop/",
    "github": "https://github.com/FuzzyIdeas/Clop",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/FuzzyIdeas.png"
  },
  {
    "title": "Parcel - Delivery Tracking",
    "description": "Delivery tracking app for iPhone, iPad, Mac, Apple Vision, and Apple Watch with carrier recognition, barcode scanning, Amazon integration, widgets, maps, and push notifications.",
    "website": "https://apps.apple.com/gb/app/parcel-delivery-tracking/id375589283",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/b7/34/5c/b7345cbd-843b-3679-22fc-82fe99898552/AppIcon-0-0-1x_U007epad-0-0-0-1-0-0-85-220.png/512x512bb.jpg"
  },
  {
    "title": "Latest",
    "description": "Free, open-source macOS utility that checks whether your apps are up to date, shows what changed, and helps update Mac App Store and Sparkle-based apps.",
    "website": "https://max.codes/latest/",
    "github": "https://github.com/mangerlahn/Latest",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/mangerlahn.png"
  },
  {
    "title": "Caveman",
    "description": "Agent skill that trims verbose assistant replies to reduce token usage.",
    "github": "https://github.com/JuliusBrussee/caveman",
    "category": "Scripts",
    "tags": [
      "all"
    ],
    "image": "https://github.com/JuliusBrussee.png"
  },
  {
    "title": "Dot Matrix",
    "description": "React component library of expressive dot matrix loaders that you install via the shadcn registry and own as local code.",
    "website": "https://dotmatrix.zzzzshawn.cloud/",
    "github": "https://github.com/zzzzshawn/matrix",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://dotmatrix.zzzzshawn.cloud/og.png"
  },
  {
    "title": "Evil Charts",
    "description": "Open-source chart UI website built with shadcn and Recharts, with handcrafted chart components and docs.",
    "website": "https://evilcharts.com/docs",
    "github": "https://github.com/legions-developer/evilcharts",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://evilcharts.com/og/og-image.png"
  },
  {
    "title": "OmniGet",
    "description": "Open-source desktop app for studying online courses and books, with notes, flashcards, focus tools, and media downloads.",
    "website": "https://discord.gg/jgdxyPy7Vn",
    "github": "https://github.com/tonhowtf/omniget",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/tonhowtf.png"
  },
  {
    "title": "ASCII Magic",
    "description": "Free browser tool that turns images and videos into ASCII art in real time, with PNG and MP4 export.",
    "website": "https://www.ascii-magic.com/",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://ascii-magic.com/og.jpg"
  },
  {
    "title": "Thide",
    "description": "Lightweight Windows 10/11 app to hide or show the taskbar with system tray and CLI control.",
    "github": "https://github.com/amnweb/thide",
    "category": "Softwares",
    "tags": [
      "windows"
    ],
    "image": "https://github.com/amnweb.png"
  },
  {
    "title": "mapcn",
    "description": "Beautiful map components with zero config and one-command setup.",
    "website": "https://mapcn.dev",
    "github": "https://github.com/AnmolSaini16/mapcn",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://github.com/AnmolSaini16.png"
  },
  {
    "title": "BrewStation",
    "description": "Homebrew GUI browser, searcher, and manager with app snapshot saving and restoring.",
    "github": "https://github.com/hreinssondev/BrewStation",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/hreinssondev.png"
  },
  {
    "title": "unlumen UI",
    "description": "Copy-ready React, TypeScript, Tailwind, Motion, and shadcn components for building polished interfaces fast.",
    "website": "https://ui.unlumen.com/components",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://ui.unlumen.com/favicon.ico"
  },
  {
    "title": "Deck.Gallery",
    "description": "Gallery of presentation decks, slide designs, reports, and brand guidelines.",
    "website": "https://deck.gallery/",
    "category": "Websites",
    "tags": [
      "all"
    ],
    "image": "https://deck.gallery/favicon.ico"
  },
  {
    "title": "VirtualBuddy",
    "description": "Virtualize macOS 12 and later on Apple Silicon with a friendly virtual machine GUI.",
    "github": "https://github.com/insidegui/VirtualBuddy",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/insidegui.png"
  },
  {
    "title": "Mos",
    "description": "Lightweight macOS utility for smooth mouse scrolling and independent scroll direction settings.",
    "website": "http://mos.caldis.me",
    "github": "https://github.com/Caldis/Mos",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/Caldis.png"
  },
  {
    "title": "RuView",
    "description": "Detect presence, movement, and vital signs through walls using commodity WiFi signals and ESP32 sensors.",
    "website": "https://Cognitum.One/RuView",
    "github": "https://github.com/ruvnet/RuView",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/ruvnet.png"
  },
  {
    "title": "WhatCable",
    "description": "A macOS menu bar app to identify the charging and data transfer capabilities of your USB-C cables.",
    "website": "https://www.whatcable.uk/",
    "github": "https://github.com/darrylmorley/whatcable",
    "category": "Softwares",
    "tags": [
      "macos"
    ],
    "image": "https://github.com/darrylmorley.png"
  },
  {
    "title": "Free Claude Code",
    "description": "Reverse proxy to route Claude Code commands through Gemini, DeepSeek, or local LLMs.",
    "github": "https://github.com/Alishahryar1/free-claude-code",
    "category": "Scripts",
    "tags": [
      "all"
    ],
    "image": "https://github.com/Alishahryar1.png"
  },
  {
    "title": "Open Design",
    "description": "An open-source, local-first alternative to Claude Design that turns local coding agents into design engines.",
    "website": "https://open-design.ai",
    "github": "https://github.com/nexu-io/open-design",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/nexu-io.png"
  },
  {
    "title": "Atomic Chat",
    "description": "Open-source app to download and run language models locally.",
    "website": "https://atomic.chat/",
    "github": "https://github.com/AtomicBot-ai/Atomic-Chat",
    "category": "Softwares",
    "tags": [
      "macos",
      "windows",
      "linux"
    ],
    "image": "https://github.com/AtomicBot-ai.png"
  },
  {
    "title": "Omi",
    "description": "Open-source wearable device and software for capturing audio and transcripts.",
    "website": "https://www.omi.me/",
    "github": "https://github.com/BasedHardware/omi",
    "category": "Softwares",
    "tags": [
      "all"
    ],
    "image": "https://github.com/BasedHardware.png"
  },
  {
    "title": "FluentFlyout",
    "description": "Modern, customizable flyouts for Windows 11 following Fluent 2 Design principles.",
    "website": "https://fluentflyout.com/",
    "github": "https://github.com/unchihugo/FluentFlyout",
    "category": "Softwares",
    "tags": [
      "windows"
    ],
    "image": "https://github.com/unchihugo.png"
  },
  {
    "title": "LocalSend",
    "description": "An open-source, cross-platform alternative to AirDrop for sharing files over local networks.",
    "website": "https://localsend.org",
    "github": "https://github.com/localsend/localsend",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Syncthing",
    "description": "A continuous file synchronization program that syncs files between devices securely and privately.",
    "website": "https://syncthing.net",
    "github": "https://github.com/syncthing/syncthing",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "KDE Connect",
    "description": "A tool that enables secure communication and integration between your computer and mobile devices.",
    "website": "https://kdeconnect.kde.org",
    "github": "https://github.com/KDE/kdeconnect-kde",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "RustDesk",
    "description": "An open-source remote desktop client and server written in Rust, serving as an alternative to TeamViewer.",
    "website": "https://rustdesk.com",
    "github": "https://github.com/rustdesk/rustdesk",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Zotero",
    "description": "A free, easy-to-use tool to help you collect, organize, annotate, cite, and share research sources.",
    "website": "https://www.zotero.org",
    "github": "https://github.com/zotero/zotero",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "JabRef",
    "description": "An open-source bibliography reference manager using BibTeX and BibLaTeX as its native formats.",
    "website": "https://www.jabref.org",
    "github": "https://github.com/JabRef/jabref",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "KeePass",
    "description": "A free, open-source, light-weight password manager with a highly customizable and secure database.",
    "website": "https://keepass.info",
    "category": "Softwares",
    "tags": ["windows"]
  },
  {
    "title": "KeePassXC",
    "description": "A community fork of KeePassX, providing a modern, cross-platform offline password manager.",
    "website": "https://keepassxc.org",
    "github": "https://github.com/keepassxreboot/keepassxc",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Cryptomator",
    "description": "Multi-platform client-side encryption tool that secures your cloud storage files before they leave your device.",
    "website": "https://cryptomator.org",
    "github": "https://github.com/cryptomator/cryptomator",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "FreeFileSync",
    "description": "A folder comparison and synchronization software that creates and manages backup copies of files.",
    "website": "https://freefilesync.org",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Jitsi Meet",
    "description": "A secure, fully featured, and completely free video conferencing service requiring no account.",
    "website": "https://meet.jit.si",
    "github": "https://github.com/jitsi/jitsi-meet",
    "category": "Websites",
    "tags": ["all"]
  },
  {
    "title": "Element",
    "description": "A secure, decentralized messenger app for group chat and collaboration built on the Matrix protocol.",
    "website": "https://element.io",
    "github": "https://github.com/vector-im/element-web",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Firefox",
    "description": "A free, privacy-respecting, open-source web browser developed by Mozilla.",
    "website": "https://www.mozilla.org/firefox/",
    "github": "https://github.com/mozilla/gecko-dev",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "LibreWolf",
    "description": "A custom Firefox fork focused on privacy, security, and user freedom out-of-the-box.",
    "website": "https://librewolf.net",
    "github": "https://github.com/librewolf-community",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Waterfox",
    "description": "A privacy-focused, high-performance web browser based on Firefox that respects user choice.",
    "website": "https://www.waterfox.net",
    "github": "https://github.com/WaterfoxCo/Waterfox",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Zen Browser",
    "description": "A beautiful, modern, and highly customisable Firefox fork built for speed and privacy.",
    "website": "https://zen-browser.app",
    "github": "https://github.com/zen-browser/desktop",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Chromium",
    "description": "The open-source web browser project that serves as the foundation for Google Chrome and other browsers.",
    "website": "https://www.chromium.org",
    "github": "https://github.com/chromium/chromium",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Mozilla Thunderbird",
    "description": "A free, open-source email, newsroom, chat, and calendar client configured for security.",
    "website": "https://www.thunderbird.net",
    "github": "https://github.com/mozilla/thunderbird-bin",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Mailspring",
    "description": "A fast, modern email client with search, translation, tracking, and dark themes.",
    "website": "https://getmailspring.com",
    "github": "https://github.com/Foundry376/Mailspring",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "LibreOffice",
    "description": "Open-source office suite with word processor, spreadsheet, and presentation editors.",
    "website": "https://www.libreoffice.org",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "OnlyOffice",
    "description": "An open-source office suite offering secure collaborative document editors for text, spreadsheets, and slides.",
    "website": "https://www.onlyoffice.com",
    "github": "https://github.com/ONLYOFFICE/DocumentServer",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "OpenBoard",
    "description": "A free, open-source interactive whiteboard software designed for schools and universities.",
    "website": "https://openboard.ch",
    "github": "https://github.com/OpenBoard-org/OpenBoard",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Draw.io",
    "description": "A free, professional online diagramming tool and flowchart maker.",
    "website": "https://app.diagrams.net",
    "github": "https://github.com/jgraph/drawio",
    "category": "Websites",
    "tags": ["all"]
  },
  {
    "title": "Okular",
    "description": "A universal document viewer developed by KDE, supporting PDF, EPUB, images, and markdown.",
    "website": "https://okular.kde.org",
    "github": "https://github.com/KDE/okular",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "PDFsam",
    "description": "A free and open-source desktop application to split, merge, mix, rotate, and extract PDF pages.",
    "website": "https://pdfsam.org",
    "github": "https://github.com/torakiki/pdfsam",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Obsidian",
    "description": "Markdown-based note-taking app that stores notes in local plain text files.",
    "website": "https://obsidian.md",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Logseq",
    "description": "A privacy-first, open-source outliner and knowledge base for note-taking and task management.",
    "website": "https://logseq.com",
    "github": "https://github.com/logseq/logseq",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Dendron",
    "description": "A hierarchical, local-first note-taking tool that integrates directly into VS Code.",
    "website": "https://www.dendron.so",
    "github": "https://github.com/dendronhq/dendron",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Joplin",
    "description": "An open-source note-taking and to-do application with end-to-end encryption and cloud sync support.",
    "website": "https://joplinapp.org",
    "github": "https://github.com/laurent22/joplin",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Trilium Notes",
    "description": "A hierarchical note-taking application designed for building large personal knowledge bases.",
    "website": "https://github.com/zadam/trilium",
    "github": "https://github.com/zadam/trilium",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "AppFlowy",
    "description": "An open-source Notion alternative built with Flutter and Rust for privacy and customization.",
    "website": "https://www.appflowy.io",
    "github": "https://github.com/AppFlowy-IO/AppFlowy",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "AFFiNE",
    "description": "A modern workspace that fuses documentation, whiteboards, and database tables, serving as a Notion/Miro alternative.",
    "website": "https://affine.pro",
    "github": "https://github.com/toeverything/AFFiNE",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Super Productivity",
    "description": "An open-source to-do list and time tracker with integrations for Jira, GitHub, and GitLab.",
    "website": "https://super-productivity.com",
    "github": "https://github.com/johannesjo/super-productivity",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "BreakTimer",
    "description": "A customizable break-timer application to help you manage screen-time and avoid eye strain.",
    "website": "https://breaktimer.app",
    "github": "https://github.com/tom-james-watson/breaktimer-app",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "VLC Media Player",
    "description": "A free, open-source, cross-platform multimedia player that plays almost all audio/video formats.",
    "website": "https://www.videolan.org/vlc/",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Navidrome",
    "description": "A self-hosted, lightweight personal music streaming server compatible with Subsonic.",
    "website": "https://www.navidrome.org",
    "github": "https://github.com/navidrome/navidrome",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Jellyfin",
    "description": "A free software media system that puts you in control of managing and streaming your media files.",
    "website": "https://jellyfin.org",
    "github": "https://github.com/jellyfin/jellyfin",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Nora",
    "description": "A beautiful, minimalistic, and modern open-source desktop music player for local files.",
    "website": "https://github.com/NoraPlayer/Nora",
    "github": "https://github.com/NoraPlayer/Nora",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Strawberry Player",
    "description": "A high-quality music player and collection organizer geared towards audiophiles and collectors.",
    "website": "https://www.strawberrymusicplayer.org",
    "github": "https://github.com/strawberrymusicplayer/strawberry",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Ardour",
    "description": "Digital audio workstation for recording, editing, mixing, and mastering audio.",
    "website": "https://ardour.org",
    "github": "https://github.com/Ardour/ardour",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "LMMS",
    "description": "A free, open-source digital audio workstation for producing music by synthesising and sequencing sounds.",
    "website": "https://lmms.io",
    "github": "https://github.com/LMMS/lmms",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "f.lux",
    "description": "An application that warms up your computer display color temperature to match the time of day.",
    "website": "https://justgetflux.com",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Blanket",
    "description": "A simple ambient noise player designed to help you focus and increase your productivity.",
    "website": "https://github.com/rafaelmardojai/blanket",
    "github": "https://github.com/rafaelmardojai/blanket",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "GIMP",
    "description": "The GNU Image Manipulation Program, a professional open-source raster graphics editor.",
    "website": "https://www.gimp.org",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Krita",
    "description": "A professional open-source painting program designed for digital artists, concept art, and illustrators.",
    "website": "https://krita.org",
    "github": "https://github.com/KDE/krita",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Inkscape",
    "description": "Open-source vector graphics editor supporting SVG, PDF, and EPS formats.",
    "website": "https://inkscape.org",
    "github": "https://github.com/inkscape/inkscape",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Pinta",
    "description": "An open-source drawing and image editing program modeled after Paint.NET for simpler workflows.",
    "website": "https://pinta-project.com",
    "github": "https://github.com/PintaProject/Pinta",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "CopyQ",
    "description": "An advanced clipboard manager with searchable history, formatting preservation, and scripting support.",
    "website": "https://hluk.github.io/CopyQ/",
    "github": "https://github.com/hluk/CopyQ",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Lap Photo Manager",
    "description": "A local-first, privacy-respecting photo organizer for large libraries built with Tauri and Rust.",
    "website": "https://julyx10.github.io/lap/",
    "github": "https://github.com/julyx10/lap",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "digiKam",
    "description": "An advanced open-source digital photo management application for importing, organizing, and editing photos.",
    "website": "https://www.digikam.org",
    "github": "https://github.com/KDE/digikam",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "darktable",
    "description": "An open-source photography workflow application and raw developer that behaves like a virtual lighttable.",
    "website": "https://www.darktable.org",
    "github": "https://github.com/darktable-org/darktable",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "RawTherapee",
    "description": "A high-performance raw photo processing software designed for modifying digital images.",
    "website": "https://www.rawtherapee.com",
    "github": "https://github.com/Beep6581/RawTherapee",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Flameshot",
    "description": "An easy-to-use screenshot utility with built-in annotation tools and sharing features.",
    "website": "https://flameshot.org",
    "github": "https://github.com/flameshot-org/flameshot",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Ksnip",
    "description": "A feature-rich screenshot tool that offers drawing tools, watermarks, and crop capabilities.",
    "website": "https://github.com/ksnip/ksnip",
    "github": "https://github.com/ksnip/ksnip",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "OBS Studio",
    "description": "Free and open-source software for video recording and live streaming.",
    "website": "https://obsproject.com",
    "github": "https://github.com/obsproject/obs-studio",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Audacity",
    "description": "A free, easy-to-use, multi-track audio editor and recorder.",
    "website": "https://www.audacityteam.org",
    "github": "https://github.com/audacity/audacity",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "HandBrake",
    "description": "A tool for converting video from nearly any format to a selection of modern, widely supported codecs.",
    "website": "https://handbrake.fr",
    "github": "https://github.com/HandBrake/HandBrake",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Kdenlive",
    "description": "A professional open-source non-linear video editor developed by the KDE community.",
    "website": "https://kdenlive.org",
    "github": "https://github.com/KDE/kdenlive",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "LosslessCut",
    "description": "A lightweight cross-platform tool for extremely fast and lossless cutting of video and audio files.",
    "website": "https://github.com/mifi/lossless-cut",
    "github": "https://github.com/mifi/lossless-cut",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Qalculate!",
    "description": "A multi-purpose, cross-platform desktop calculator featuring advanced unit conversions and expressions.",
    "website": "https://qalculate.github.io",
    "github": "https://github.com/Qalculate/qalculate-gtk",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "SpeedCrunch",
    "description": "A fast, high-precision algebraic desktop calculator with keyboard-friendly interface.",
    "website": "https://speedcrunch.org",
    "github": "https://github.com/speedcrunch/SpeedCrunch",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "PeaZip",
    "description": "A free file archiver and utility for opening zip, rar, and 7z archives with strong encryption.",
    "website": "https://peazip.github.io",
    "github": "https://github.com/peazip/PeaZip",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Filelight",
    "description": "A utility to visualize disk usage by drawing a set of concentric segmented rings.",
    "website": "https://apps.kde.org/filelight/",
    "github": "https://github.com/KDE/filelight",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Crossdirstat",
    "description": "A cross-platform disk usage analysis tool similar to WinDirStat showing directory trees and treemaps.",
    "website": "https://github.com/Jelmerro/crossdirstat",
    "github": "https://github.com/Jelmerro/crossdirstat",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Double Commander",
    "description": "A cross-platform two-panel file manager inspired by Total Commander.",
    "website": "https://doublecmd.sourceforge.io",
    "github": "https://github.com/doublecmd/doublecmd",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "muCommander",
    "description": "A lightweight, cross-platform file manager with a dual-pane interface.",
    "website": "https://www.mucommander.com",
    "github": "https://github.com/mucommander/mucommander",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "TagSpaces",
    "description": "An open-source personal data manager that helps you organize and tag files locally.",
    "website": "https://www.tagspaces.org",
    "github": "https://github.com/tagspaces/tagspaces",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "SpaceDrive",
    "description": "A cross-platform local-first file manager with a beautiful modern interface built on Rust.",
    "website": "https://www.spacedrive.com",
    "github": "https://github.com/spacedriveapp/spacedrive",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Persepolis Download Manager",
    "description": "Desktop GUI client for the aria2 download utility.",
    "website": "https://persepolisdm.github.io",
    "github": "https://github.com/persepolisdm/persepolis",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Duplicati",
    "description": "A free backup client that securely stores encrypted, incremental backups on local storage and cloud drives.",
    "website": "https://www.duplicati.com",
    "github": "https://github.com/duplicati/duplicati",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Glances",
    "description": "An open-source system monitoring tool that displays system metrics in a terminal or web interface.",
    "website": "https://nicolargo.github.io/glances/",
    "github": "https://github.com/nicolargo/glances",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "GSmartControl",
    "description": "A graphical user interface for smartctl, exposing SMART disk drive health status and diagnostic tests.",
    "website": "https://gsmartcontrol.shadedlands.com",
    "github": "https://github.com/kzsolt/gsmartcontrol",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Actiona",
    "description": "An open-source automation utility that allows you to automate tasks on your system using a visual editor.",
    "website": "https://actiona.tools",
    "github": "https://github.com/Jxtkez/actiona",
    "category": "Softwares",
    "tags": ["windows", "linux"]
  },
  {
    "title": "Lapce",
    "description": "A lightning-fast desktop code editor written in Rust with built-in remote development support.",
    "website": "https://lapce.dev",
    "github": "https://github.com/lapce/lapce",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Zed",
    "description": "A high-performance, collaborative code editor written in Rust by the creators of Atom and Tree-sitter.",
    "website": "https://zed.dev",
    "github": "https://github.com/zed-industries/zed",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Espanso",
    "description": "A lightweight, cross-platform text expander written in Rust to automate typing tasks.",
    "website": "https://espanso.org",
    "github": "https://github.com/espanso/espanso",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Asyar",
    "description": "A local-first, open-source productivity launcher designed as an alternative to Raycast, built with Tauri and Rust.",
    "website": "https://asyar.org",
    "github": "https://github.com/Xoshbin/asyar-launcher",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Ueli",
    "description": "A customizable keystroke launcher for Windows and macOS to quickly launch apps, files, and web links.",
    "website": "https://ueli.app",
    "github": "https://github.com/oliverschwendener/ueli",
    "category": "Softwares",
    "tags": ["windows", "macos"]
  },
  {
    "title": "Seafile",
    "description": "An open-source cloud storage and file sync platform designed for high performance and reliability.",
    "website": "https://www.seafile.com",
    "github": "https://github.com/haiwen/seafile",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Nextcloud",
    "description": "A self-hosted productivity platform allowing you to share files, collaborate, and manage calendar/contacts securely.",
    "website": "https://nextcloud.com",
    "github": "https://github.com/nextcloud/desktop",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Input Leap",
    "description": "A software utility that allows you to share one keyboard and mouse between multiple computers on a local network.",
    "github": "https://github.com/input-leap/input-leap",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "OpenRGB",
    "description": "An open-source RGB lighting control software that acts as a unified hub for all your lighting hardware.",
    "website": "https://openrgb.org",
    "github": "https://github.com/CalcProgrammer1/OpenRGB",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "Paperless-ngx",
    "description": "A document management system that transforms your physical documents into a searchable online archive.",
    "website": "https://docs.paperless-ngx.com",
    "github": "https://github.com/paperless-ngx/paperless-ngx",
    "category": "Softwares",
    "tags": ["windows", "macos", "linux"]
  },
  {
    "title": "LiteParse",
    "description": "A lightweight, fast document parsing library by LlamaIndex for extracting text and structure from PDFs and other files.",
    "website": "https://developers.llamaindex.ai/liteparse/",
    "github": "https://github.com/run-llama/liteparse",
    "category": "Websites",
    "tags": ["all"]
  },
  {
    "title": "Motion",
    "description": "Production-grade animation library for React, JavaScript, and Vue. The successor to Framer Motion with a tiny footprint.",
    "website": "https://motion.dev",
    "category": "Websites",
    "tags": ["all"]
  },
  {
    "title": "Bklit UI",
    "description": "A component library built on top of shadcn/ui to help you build charts and data visualizations more easily.",
    "website": "https://bklit.com",
    "github": "https://github.com/bklit/bklit-ui",
    "category": "Websites",
    "tags": ["all"]
  },
  {
    "title": "Transitions.dev",
    "description": "A collection of the most essential copy-paste CSS transitions for web apps, ready to drop into any project.",
    "website": "https://transitions.dev",
    "category": "Websites",
    "tags": ["all"]
  },
  {
    "title": "termcn",
    "description": "Beautiful, accessible, and customizable terminal UI components for React. Built on Ink and OpenTUI, distributed via shadcn.",
    "website": "https://www.termcn.dev",
    "github": "https://github.com/Aniket-508/termcn",
    "category": "Websites",
    "tags": ["all"]
  },
  {
    "title": "noMeiryoUI",
    "description": "Tool to change default system fonts on Windows 8.1, 10, and 11.",
    "github": "https://github.com/Tatsu-syo/noMeiryoUI",
    "category": "Softwares",
    "tags": ["windows"]
  },
  {
    "title": "Windhawk",
    "description": "Windows desktop customization app to install taskbar, Start menu, and system tweaks.",
    "website": "https://windhawk.net/",
    "github": "https://github.com/ramensoftware/windhawk",
    "category": "Softwares",
    "tags": ["windows"]
  },
  {
    "title": "Textream",
    "description": "A free macOS teleprompter app for streamers, interviewers, and presenters that highlights your script in real-time as you speak in a Dynamic Island overlay.",
    "website": "https://github.com/f/textream",
    "github": "https://github.com/f/textream",
    "category": "Softwares",
    "tags": ["macos"],
    "image": "https://github.com/f.png"
  },
  {
    "title": "Orchard",
    "description": "A native macOS app and GUI for Apple's container tooling to manage containers, machines, and local Kubernetes clusters.",
    "website": "https://orchard.andon.dev/",
    "github": "https://github.com/andrew-waters/orchard",
    "category": "Softwares",
    "tags": ["macos"]
  },
  {
    "title": "Keyty",
    "description": "Display keyboard shortcuts, keystrokes, and mouse clicks in real time for macOS demos, recordings, and livestreams.",
    "website": "https://keyty.app/",
    "github": "https://github.com/keytyapp/Keyty",
    "category": "Softwares",
    "tags": ["macos"]
  },
  {
    "title": "Senumy",
    "description": "A comprehensive directory and IPA library for iOS jailbreak tools, tweaks, sideloading utilities, and modded apps.",
    "website": "https://senumy.com/",
    "category": "Websites",
    "tags": ["all"]
  },
  {
    "title": "Itsycal",
    "description": "A tiny menu bar calendar for macOS with Mac Calendar app integration, event creation, and keyboard navigation.",
    "website": "https://www.mowglii.com/itsycal/",
    "github": "https://github.com/sfsam/Itsycal",
    "category": "Softwares",
    "tags": ["macos"]
  },
  {
    "title": "KeyCastr",
    "description": "An open-source keystroke visualizer for macOS that displays keystrokes on-screen in real time.",
    "website": "https://github.com/keycastr/keycastr",
    "github": "https://github.com/keycastr/keycastr",
    "category": "Softwares",
    "tags": ["macos"],
    "image": "https://github.com/keycastr.png"
  },
  {
    "title": "Keka",
    "description": "The macOS file archiver — extract and compress 7Z, ZIP, TAR, GZ, RAR, and other archive formats with password protection.",
    "website": "https://www.keka.io/en/",
    "github": "https://github.com/aonez/Keka",
    "category": "Softwares",
    "tags": ["macos"]
  },
  {
    "title": "Handy",
    "description": "A free, open-source, cross-platform speech-to-text desktop app that lets you dictate anywhere with local AI.",
    "website": "https://handy.computer/",
    "github": "https://github.com/cjpais/Handy",
    "category": "Softwares",
    "tags": ["macos", "windows", "linux"]
  },
  {
    "title": "ZenNotes",
    "description": "A keyboard-first, Vim-native Markdown notes app with local files, KaTeX math, Mermaid diagrams, and cross-device sync.",
    "website": "https://zennotes.org/",
    "github": "https://github.com/ZenNotes/zennotes",
    "category": "Softwares",
    "tags": ["macos", "windows", "linux"]
  },
  {
    "title": "Doppi",
    "description": "A clean, native music player for Mac and iOS designed to play and organize your local offline music collection.",
    "website": "https://doppi.app/mac/",
    "category": "Softwares",
    "tags": ["macos"]
  },
  {
    "title": "PixelPlayer",
    "description": "A privacy-first Android music player built with Material 3 Expressive featuring offline playback, synced lyrics, and equalizer presets.",
    "website": "https://github.com/PixelPlayerHQ/PixelPlayer",
    "github": "https://github.com/PixelPlayerHQ/PixelPlayer",
    "category": "Softwares",
    "tags": ["android"],
    "image": "https://github.com/PixelPlayerHQ.png"
  },
  {
    "title": "RunCatNeo",
    "description": "A cute running cat animation on your macOS menu bar whose running speed changes according to CPU usage.",
    "website": "https://runcat-dev.github.io/RunCatNeo/",
    "github": "https://github.com/runcat-dev/RunCatNeo",
    "category": "Softwares",
    "tags": ["macos"]
  },
  {
    "title": "Printed Matter",
    "description": "The world's largest non-profit organization and archive dedicated to the dissemination, appreciation, and distribution of artists' books and publications.",
    "website": "https://www.printedmatter.org/",
    "category": "Websites",
    "tags": ["all"]
  },
  {
    "title": "DigiBouquet",
    "description": "A free online tool to build and share personalized digital flower bouquets with custom greeting cards and flower meanings.",
    "website": "https://digibouquet.net/",
    "category": "Websites",
    "tags": ["all"]
  },
  {
    "title": "Screendrop",
    "description": "A native, free, and self-hostable macOS screenshot and screen recording app designed as an open-source Loom alternative.",
    "website": "https://github.com/fayazara/Screendrop",
    "github": "https://github.com/fayazara/Screendrop",
    "category": "Softwares",
    "tags": ["macos"],
    "image": "https://github.com/fayazara.png"
  },
  {
    "title": "Quick Image Converter",
    "description": "Free online image converter — convert JPG, PNG, WebP, AVIF and HEIC right in your browser. Fast, private, no sign-up needed.",
    "website": "https://quickimgconvert.com/",
    "category": "Websites",
    "tags": ["all"]
  },
  {
    "title": "Steam Market Fee Calculator",
    "description": "An open-source calculator to estimate Steam Community Market fees, buyer costs, and seller proceeds in integer precision.",
    "website": "https://steamvaults.org/tools/steam-market-fee-calculator",
    "github": "https://github.com/hyunjun12312/steam-market-fee-calculator",
    "category": "Websites",
    "tags": ["all"]
  }
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const idCounts = new Map<string, number>();

// Mark the last 6 items in the raw array as "new"
const NEW_ITEM_COUNT = 6;
const newItemTitles = new Set(
  rawItems.slice(-NEW_ITEM_COUNT).map(i => i.title)
);

export const items: Item[] = rawItems.map((item) => {
  const baseId = `${slugify(item.category) || "category"}-${slugify(item.title) || "item"}`;
  const count = idCounts.get(baseId) ?? 0;
  idCounts.set(baseId, count + 1);

  // Auto-populate image from website favicon if missing
  const image = item.image || getFaviconUrl(item.website) || getFaviconUrl(item.github);

  return {
    ...item,
    topics: getTopicsForItem(item.title),
    image,
    isNew: newItemTitles.has(item.title),
    id: count === 0 ? baseId : `${baseId}-${count + 1}`,
  };
});

/** Helper to get category accent color */
export const CATEGORY_COLORS: Record<string, { accent: string; accentBg: string; accentBorder: string }> = {
  Websites: { accent: "#a3e635", accentBg: "rgba(163,230,53,0.08)", accentBorder: "rgba(163,230,53,0.3)" },
  Softwares: { accent: "#38bdf8", accentBg: "rgba(56,189,248,0.08)", accentBorder: "rgba(56,189,248,0.3)" },
  Scripts: { accent: "#fbbf24", accentBg: "rgba(251,191,36,0.08)", accentBorder: "rgba(251,191,36,0.3)" },
};
