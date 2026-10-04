export const SEARCH_TOPICS = {
  ai: ["ai", "artificial intelligence", "llm", "language model", "chatbot", "machine learning", "generative ai"],
  image: ["image", "images", "photo", "photos", "picture", "pictures", "graphics", "raster", "vector", "drawing", "painting", "screenshot", "image editor", "image editing", "photo editor", "photo editing"],
  development: ["coding", "code", "programming", "developer", "development", "ide", "code editor", "terminal", "api", "react", "web development"],
  video: ["video", "videos", "movie", "movies", "screen recording", "subtitle", "captions", "streaming", "webcam", "video editor", "video editing"],
  audio: ["audio", "music", "sound", "microphone", "podcast", "speech", "karaoke", "daw", "audio editor", "audio editing"],
  documents: ["document", "documents", "pdf", "office", "markdown", "notes", "spreadsheet", "slides", "ebook"],
  compression: ["compression", "compress", "compressor", "optimizer", "optimize", "shrink", "smaller files", "archive", "zip"],
  productivity: ["productivity", "workflow", "task", "tasks", "todo", "to do", "launcher", "clipboard", "focus", "time management"],
  system: ["system", "utility", "utilities", "operating system", "desktop", "monitor", "cleanup", "customization", "menu bar"],
  design: ["design", "ui", "ux", "component", "components", "icons", "animation", "diagram", "whiteboard", "css"],
  automation: ["automation", "automate", "script", "scripts", "agent", "workflow automation", "scraping", "crawler"],
  privacy: ["privacy", "private", "security", "secure", "encryption", "password", "offline", "local first"],
  gaming: ["game", "games", "gaming", "emulator", "playstation", "game engine"],
  networking: ["network", "networking", "remote", "wifi", "server", "self hosted", "cloud", "screen sharing"],
  files: ["file", "files", "file manager", "storage", "backup", "sync", "sharing", "disk", "folder"],
  downloads: ["download", "downloads", "downloader", "torrent", "firmware", "app store"],
  communication: ["communication", "chat", "messaging", "email", "meeting", "conference", "collaboration"],
  education: ["education", "learning", "study", "teaching", "teacher", "course", "flashcards", "typing"],
  research: ["research", "references", "bibliography", "citation", "knowledge", "data", "news", "intelligence"],
  web: ["web", "browser", "website", "internet", "frontend", "web app"],
  media: ["media", "multimedia", "youtube", "stream", "player", "recording", "content"],
} as const;

export type SearchTopic = keyof typeof SEARCH_TOPICS;

// Topic membership is intentionally curated by item title. Platform support stays
// in Item.tags and is not mixed into this discovery taxonomy.
const TOPIC_ITEMS: Record<SearchTopic, readonly string[]> = {
  ai: [
    "Cline", "Open Researcher", "LM Studio", "CodexBar", "Mini-Agent", "FlyCut Caption",
    "AnythingLLM", "LLMFit", "Onyx", "Jan", "Flow", "WorldMonitor", "TypeWhisper",
    "VibeUI", "Clicky", "VidBee", "Caveman", "Free Claude Code", "Open Design",
    "Atomic Chat", "Omi", "Handy",
  ],
  image: [
    "Isocons", "Gemini Watermark Remover", "FaceFusion", "Shader Gradient", "Excalidraw",
    "WinShot", "Dither", "CompressO", "Clop", "ASCII Magic", "GIMP", "Krita", "Inkscape",
    "Pinta", "Lap Photo Manager", "digiKam", "darktable", "RawTherapee", "Flameshot", "Ksnip",
    "Screendrop", "Quick Image Converter",
  ],
  development: [
    "Tabby", "React Bits", "Awesome Swift Apps", "Spicetify CLI", "Mate Engine", "Cline",
    "Cloudflare Error Page", "Mini-Agent", "Torph", "Scrollbar", "Sileo", "Carbon Design System",
    "Lucide Animated", "Scrapy", "The Component Gallery", "Shadcn Admin", "API Mega List",
    "Penpot", "Visual Explainer", "VibeUI", "Caveman", "Dot Matrix", "Evil Charts", "mapcn",
    "unlumen UI", "Free Claude Code", "Open Design", "Dendron", "Lapce", "Zed", "Motion",
    "Bklit UI", "Transitions.dev", "termcn", "Orchard",
  ],
  video: [
    "Ffmpeg Script", "Popcorn Time", "Cobalt", "Gemini Watermark Remover", "FaceFusion",
    "Quick Subtitles", "BetterCapture", "IINA", "NouTube Desktop", "NouTube", "FlyCut Caption",
    "CompressO", "Reclip", "ytDownloader", "VidBee", "Webcam & Mic Test", "Recordly", "Clop",
    "ASCII Magic", "VLC Media Player", "Jellyfin", "OBS Studio", "HandBrake", "Kdenlive",
    "LosslessCut", "Textream", "Keyty", "KeyCastr", "Screendrop",
  ],
  audio: [
    "FineTune", "Ear (web)", "Quick Subtitles", "MagicPods", "Karaoke Eternal", "FlyCut Caption",
    "TypeWhisper", "ytDownloader", "VidBee", "Webcam & Mic Test", "VLC Media Player", "Navidrome",
    "Jellyfin", "Nora", "Strawberry Player", "Ardour", "LMMS", "Blanket", "OBS Studio",
    "Audacity", "LosslessCut", "Textream", "Handy", "Doppi", "PixelPlayer",
  ],
  documents: [
    "Corca", "iLovePDF", "BentoPDF", "CopyCat Clipboard", "FluxMarkdown", "Clop", "Deck.Gallery",
    "Zotero", "JabRef", "LibreOffice", "OnlyOffice", "OpenBoard", "Draw.io", "Okular", "PDFsam",
    "Obsidian", "Logseq", "Dendron", "Joplin", "Trilium Notes", "AppFlowy", "AFFiNE", "Paperless-ngx",
    "LiteParse", "ZenNotes", "Printed Matter",
  ],
  compression: [
    "Ffmpeg Script", "Vert", "iLovePDF", "BentoPDF", "CompressO", "Clop", "HandBrake",
    "LosslessCut", "PeaZip", "Keka",
  ],
  productivity: [
    "Raycast", "Boring Notch", "Darkwrite", "EdClub", "DockDoor", "CopyCat Clipboard", "Metrolist",
    "Delphi Tools", "AnythingLLM", "Clicky", "Parcel - Delivery Tracking", "Latest", "OmniGet",
    "Mos", "Zotero", "JabRef", "LibreOffice", "OnlyOffice", "Obsidian", "Logseq", "Dendron",
    "Joplin", "Trilium Notes", "AppFlowy", "AFFiNE", "Super Productivity", "BreakTimer", "Blanket",
    "CopyQ", "Qalculate!", "SpeedCrunch", "TagSpaces", "Actiona", "Espanso", "Asyar", "Ueli",
    "Nextcloud", "Textream", "Keyty", "Itsycal", "KeyCastr", "Handy", "ZenNotes", "Screendrop",
    "DigiBouquet", "Steam Market Fee Calculator",
  ],
  system: [
    "Tabby", "WizTree", "Raycast", "Chris Titus WinUtil", "Mole", "Mounty", "Boring Notch", "UTM",
    "WinApps", "MAS", "niri", "Spicetify CLI", "Win11Debloat", "DockDoor", "Shine", "Net-Bar",
    "Scrcpy GUI", "CodexBar", "Hidden", "Battery-Toolkit", "Stats", "Bulk Crap Uninstaller", "Latest",
    "Thide", "BrewStation", "VirtualBuddy", "Mos", "WhatCable", "FluentFlyout", "f.lux", "Filelight",
    "Crossdirstat", "Glances", "GSmartControl", "Asyar", "Ueli", "Input Leap", "OpenRGB",
    "noMeiryoUI", "Windhawk", "Orchard", "Senumy", "Itsycal", "RunCatNeo",
  ],
  design: [
    "React Bits", "Isocons", "Shader Gradient", "Excalidraw", "Torph", "Scrollbar", "Sileo",
    "Carbon Design System", "Lucide Animated", "The Component Gallery", "Shadcn Admin", "Penpot",
    "Visual Explainer", "VibeUI", "Dither", "Recordly", "Dot Matrix", "Evil Charts", "ASCII Magic",
    "mapcn", "unlumen UI", "Deck.Gallery", "Open Design", "FluentFlyout", "OpenBoard", "Draw.io",
    "GIMP", "Krita", "Inkscape", "Pinta", "Motion", "Bklit UI", "Transitions.dev", "termcn",
    "noMeiryoUI", "Printed Matter", "DigiBouquet",
  ],
  automation: [
    "Ffmpeg Script", "Chris Titus WinUtil", "MAS", "Win11Debloat", "Cline", "Open Researcher",
    "Mini-Agent", "Scrapy", "API Mega List", "Visual Explainer", "Reclip", "Caveman", "Free Claude Code",
    "Actiona", "Espanso",
  ],
  privacy: [
    "Vert", "Droppy", "Transmission", "BentoPDF", "Poke", "NouTube Desktop", "NouTube",
    "AnythingLLM", "Jan", "TypeWhisper", "CompressO", "Clicky", "VidBee", "Webcam & Mic Test",
    "Atomic Chat", "LocalSend", "Syncthing", "KDE Connect", "RustDesk", "KeePass", "KeePassXC",
    "Cryptomator", "FreeFileSync", "Jitsi Meet", "Element", "Firefox", "LibreWolf", "Waterfox",
    "Zen Browser", "Mozilla Thunderbird", "OnlyOffice", "Logseq", "Joplin", "AppFlowy", "Duplicati",
    "Seafile", "Nextcloud", "Quick Image Converter",
  ],
  gaming: ["PlayCover", "shadPS4", "Mate Engine", "PS4 Game Scraper", "Steam Market Fee Calculator"],
  networking: [
    "Droppy", "OpenScreen", "Net-Bar", "Scrcpy GUI", "Transmission", "Awesome Self-Hosted", "Reclip",
    "RuView", "LocalSend", "Syncthing", "KDE Connect", "RustDesk", "Jitsi Meet", "Element", "Navidrome",
    "Jellyfin", "Seafile", "Nextcloud", "Input Leap",
  ],
  files: [
    "WizTree", "Github Store", "Mole", "Vert", "Mounty", "Droppy", "iLovePDF", "BentoPDF",
    "CopyCat Clipboard", "Bulk Crap Uninstaller", "CompressO", "VidBee", "Clop", "LocalSend", "Syncthing",
    "FreeFileSync", "Okular", "PDFsam", "CopyQ", "Lap Photo Manager", "digiKam", "PeaZip", "Filelight",
    "Crossdirstat", "Double Commander", "muCommander", "TagSpaces", "SpaceDrive", "Duplicati", "Seafile",
    "Nextcloud", "Paperless-ngx", "LiteParse", "Keka", "Quick Image Converter",
  ],
  downloads: [
    "Github Store", "Popcorn Time", "Brisk", "Cobalt", "Transmission", "IPSW Downloads", "NouTube Desktop",
    "NouTube", "Gopeed", "Reclip", "ytDownloader", "VidBee", "OmniGet", "Persepolis Download Manager",
    "Senumy",
  ],
  communication: [
    "OpenScreen", "Excalidraw", "Corca", "Penpot", "Webcam & Mic Test", "Jitsi Meet", "Element",
    "Mozilla Thunderbird", "Mailspring", "OnlyOffice", "OpenBoard", "AFFiNE", "Zed", "Nextcloud",
  ],
  education: ["EdClub", "Clicky", "OmniGet", "OpenBoard", "Printed Matter"],
  research: [
    "Open Researcher", "WorldMonitor", "Visual Explainer", "VidBee", "OmniGet", "Zotero", "JabRef",
    "Obsidian", "Logseq", "Trilium Notes", "Paperless-ngx", "LiteParse",
  ],
  web: [
    "FMHY", "Vert", "Cloudflare Error Page", "Ear (web)", "Poke", "Scrapy", "Awesome Self-Hosted",
    "API Mega List", "Delphi Tools", "Webcam & Mic Test", "mapcn", "Firefox", "LibreWolf", "Waterfox",
    "Zen Browser", "Chromium", "Motion", "Transitions.dev", "DigiBouquet", "Quick Image Converter",
    "Steam Market Fee Calculator",
  ],
  media: [
    "Popcorn Time", "Cobalt", "Spicetify CLI", "FaceFusion", "FineTune", "Quick Subtitles", "BetterCapture",
    "IINA", "MagicPods", "Poke", "NouTube Desktop", "NouTube", "Karaoke Eternal", "FlyCut Caption",
    "Reclip", "ytDownloader", "VidBee", "Recordly", "OmniGet", "VLC Media Player", "Navidrome", "Jellyfin",
    "Nora", "Strawberry Player", "Ardour", "LMMS", "OBS Studio", "Audacity", "HandBrake", "Kdenlive",
    "LosslessCut", "Doppi", "PixelPlayer",
  ],
};

const topicsByTitle = new Map<string, SearchTopic[]>();

for (const [topic, titles] of Object.entries(TOPIC_ITEMS) as [SearchTopic, readonly string[]][]) {
  for (const title of titles) {
    const topics = topicsByTitle.get(title) ?? [];
    if (!topics.includes(topic)) topics.push(topic);
    topicsByTitle.set(title, topics);
  }
}

export function getTopicsForItem(title: string): SearchTopic[] {
  const topics = topicsByTitle.get(title);
  if (!topics?.length) {
    throw new Error(`Missing curated search topics for item: ${title}`);
  }
  return [...topics];
}

export function isSearchTopic(value: string): value is SearchTopic {
  return value in SEARCH_TOPICS;
}
