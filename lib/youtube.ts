import { promises as fs } from "fs";
import path from "path";

const YOUTUBE_DATA_PATH = path.join(process.cwd(), "public", "data", "youtube.json");

export interface YoutubeVideo {
  title: string;
  url: string;
  youtubeId?: string;
  duration?: string;
}

export interface YoutubePlaylist {
  title?: string;
  channel: string;
  channelUrl?: string;
  videos: YoutubeVideo[];
}

export interface YoutubeData {
  playlists: YoutubePlaylist[];
}

export async function getYoutubeData(): Promise<YoutubeData | null> {
  try {
    const raw = await fs.readFile(YOUTUBE_DATA_PATH, "utf8");
    const parsed = JSON.parse(raw) as YoutubeData;
    if (!parsed.playlists?.length) {
      return null;
    }
    return parsed;
  } catch (error) {
    console.warn("Failed to read youtube data:", error);
    return null;
  }
}
