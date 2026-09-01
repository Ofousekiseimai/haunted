"use client";

import Image from "next/image";

import { Reveal } from "@/components/ui/reveal";
import type { YoutubeData, YoutubePlaylist } from "@/lib/youtube";
import type { Locale } from "@/lib/locale";
import { getYoutubeCopy } from "@/lib/i18n/ui";

const YOUTUBE_THUMB_HOSTS = ["https://img.youtube.com", "https://i.ytimg.com"];

function isValidYoutubeId(value?: string | null) {
  if (typeof value !== "string") return false;
  return /^[A-Za-z0-9_-]{11}$/.test(value.trim());
}

function sanitizeUrl(url: string) {
  return url.trim();
}

function resolveYoutubeId(url: string, explicitId?: string) {
  const match = sanitizeUrl(url).match(
    /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/,
  );
  if (match && isValidYoutubeId(match[1])) return match[1].trim();
  if (explicitId && isValidYoutubeId(explicitId)) return explicitId.trim();
  return null;
}

function getThumbnailUrl(url: string, explicitId?: string) {
  const id = resolveYoutubeId(url, explicitId);
  return id ? `${YOUTUBE_THUMB_HOSTS[0]}/vi/${id}/maxresdefault.jpg` : null;
}

function getFallbackThumbnail(url: string, explicitId?: string) {
  const id = resolveYoutubeId(url, explicitId);
  return id ? `${YOUTUBE_THUMB_HOSTS[1]}/vi/${id}/hqdefault.jpg` : null;
}

function Rail({ playlist }: { playlist: YoutubePlaylist }) {
  return (
    <div className="reel">
      {playlist.videos.map((video, index) => {
        const thumbnail = getThumbnailUrl(video.url, video.youtubeId);
        const fallback = getFallbackThumbnail(video.url, video.youtubeId);

        return (
          <a
            key={`${video.title}-${index}`}
            href={sanitizeUrl(video.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="reel__item group"
          >
            <div className="reel__plate">
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt={video.title}
                  fill
                  sizes="320px"
                  unoptimized
                  onError={(event) => {
                    const target = event.currentTarget;
                    if (fallback && target.src !== fallback) target.src = fallback;
                  }}
                />
              ) : (
                <span className="mono absolute inset-0 flex items-center justify-center">—</span>
              )}
              {video.duration && <span className="reel__time">{video.duration}</span>}
            </div>
            <span className="mono mono--micro">{playlist.channel}</span>
            <span className="reel__title">{video.title}</span>
          </a>
        );
      })}
    </div>
  );
}

export function YoutubeSection({ data, locale = "el" }: { data: YoutubeData; locale?: Locale }) {
  const copy = getYoutubeCopy(locale);

  if (!data.playlists?.length) return null;

  const channelUrl = data.playlists.find((p) => p.channelUrl)?.channelUrl;

  return (
    <Reveal>
      <section>
        {/*
          One heading for the whole section. The old build rendered a full
          three-column grid per playlist, each under its own giant "YouTube"
          heading — two identical headings stacked down the page — and left
          the saturated thumbnail art at full strength, which detonated the
          palette. Here it is one quiet rail per channel.
        */}
        <div className="shead">
          <div>
            <div className="shead__kicker">
              <span className="mark" aria-hidden="true" />
              <span className="mono">{copy.heading}</span>
            </div>
            <h2 className="shead__title">
              {locale === "en" ? "On screen" : "Στην οθόνη"}
            </h2>
          </div>
          {channelUrl && (
            <a
              href={sanitizeUrl(channelUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="mono tlink"
            >
              {copy.visitChannel}
            </a>
          )}
        </div>

        <div className="flex flex-col gap-10">
          {data.playlists.map((playlist, index) => (
            <div key={`${playlist.channel}-${index}`} className="flex flex-col gap-4">
              {data.playlists.length > 1 && (
                <span className="mono">
                  {copy.channelPrefix} {playlist.channel}
                </span>
              )}
              <Rail playlist={playlist} />
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
