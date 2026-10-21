export interface NewsVideo {
  id: string;

  youtubeId: string;
  source: string;
  label: string;
  title: string;
  duration: string;
  accent: string;
}

export const newsVideos: NewsVideo[] = [
  {
    id: "bbc",
    youtubeId: "6giJejuNhNY",
    source: "BBC News",
    label: "Sierra Madre Shield",
    title: "Sierra Madre: Fighting to save what's left of a vital rainforest in the Philippines",
    duration: "4:25",
    accent: "text-emerald-700",
  },
  {
    id: "aljazeera",
    youtubeId: "zeaE-8rlXGY",
    source: "Al Jazeera",
    label: "South PH Logging",
    title: "Illegal logging and flooding in the southern Philippines",
    duration: "2:23",
    accent: "text-red-600",
  },
  {
    id: "101east",
    youtubeId: "WXy2ZmYDDhU",
    source: "101 East",
    label: "Vanishing Forests",
    title: "Failing the Philippines' Forests",
    duration: "25:01",
    accent: "text-lime-700",
  },
  {
    id: "cbc",
    youtubeId: "4B9IF2zBQAo",
    source: "CBC News",
    label: "Why PH Floods",
    title: "Political flood fight",
    duration: "5:21",
    accent: "text-amber-600",
  },
];