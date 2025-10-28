"use client";

import Image from "next/image";

import type { YoutubeData } from "@/lib/youtube";

const YOUTUBE_THUMB_HOSTS = ["https://img.youtube.com", "https://i.ytimg.com"];

function isValidYoutubeId(value?: string | null) {
  if (typeof value !== "string") {
    return false;
  }

  const trimmed = value.trim();
  return /^[A-Za-z0-9_-]{11}$/.test(trimmed);
}

function sanitizeUrl(url: string) {
  return url.trim();
}

function resolveYoutubeId(url: string, explicitId?: string) {
  const cleanedUrl = sanitizeUrl(url);
  const match = cleanedUrl.match(
    /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,
  );
  if (match && isValidYoutubeId(match[1])) {
    return match[1].trim();
  }

  if (explicitId && isValidYoutubeId(explicitId)) {
    return explicitId.trim();
  }

  return null;
}

function getThumbnailUrl(url: string, explicitId?: string) {
  const youtubeId = resolveYoutubeId(url, explicitId);
  if (!youtubeId) {
    return null;
  }

  return `${YOUTUBE_THUMB_HOSTS[0]}/vi/${youtubeId}/maxresdefault.jpg`;
}

function getFallbackThumbnail(url: string, explicitId?: string) {
  const youtubeId = resolveYoutubeId(url, explicitId);
  if (!youtubeId) {
    return null;
  }

  return `${YOUTUBE_THUMB_HOSTS[1]}/vi/${youtubeId}/hqdefault.jpg`;
}

export function YoutubeSection({ data }: { data: YoutubeData }) {
  if (!data.playlists?.length) {
    return null;
  }

  return (
    <section className="bg-n-8 py-12">
      <div className="container space-y-12">
        <h2 className="text-center text-3xl font-bold text-n-1 md:text-4xl">
          Σχετικά Βίντεο Δημιουργών στο YouTube
        </h2>

        {data.playlists.map((playlist, index) => (
          <div key={`${playlist.channel}-${index}`} className="space-y-8 py-4">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <h3 className="text-2xl font-semibold text-n-1">
                Κανάλι {playlist.channel}
              </h3>
              {playlist.channelUrl && (
                <a
                  href={sanitizeUrl(playlist.channelUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-color-1 transition hover:text-color-5"
                >
                  Επίσκεψη καναλιού →
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {playlist.videos.map((video, videoIndex) => {
                const thumbnail = getThumbnailUrl(video.url, video.youtubeId);
                const fallback = getFallbackThumbnail(video.url, video.youtubeId);

                return (
                  <div
                    key={`${video.title}-${videoIndex}`}
                    className="group overflow-hidden rounded-2xl border border-n-7 bg-transparent p-4 shadow-xl transition duration-300 hover:scale-[1.02]"
                  >
                    <a
                      href={sanitizeUrl(video.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                      aria-label={`Δείτε το βίντεο: ${video.title}`}
                    >
                      <div className="relative aspect-video overflow-hidden rounded-lg">
                        {thumbnail ? (
                          <Image
                            src={thumbnail}
                            alt={`Thumbnail για το βίντεο: ${video.title}`}
                            fill
                            className="object-cover transition duration-300 group-hover:scale-105"
                            sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
                            unoptimized
                            onError={(event) => {
                              const target = event.currentTarget;
                              if (fallback && target.src !== fallback) {
                                target.src = fallback;
                              }
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-n-7 text-sm text-n-4">
                            Δεν υπάρχει διαθέσιμο thumbnail
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/10" />
                        {video.duration && (
                          <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs text-n-1">
                            {video.duration}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="text-xl font-semibold text-n-1 transition group-hover:text-color-1">
                          {video.title}
                        </h4>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>

            {playlist.channelUrl && (
              <div className="flex justify-center">
                <a
                  href={sanitizeUrl(playlist.channelUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-gradient-to-r from-color-5 via-color-1 to-color-6 p-[2px] text-n-1 transition duration-300 hover:scale-[1.03]"
                  aria-label={`Δείτε περισσότερα από το κανάλι ${playlist.channel}`}
                >
                  <span className="block rounded-md bg-n-8 px-6 py-2">
                    Δείτε περισσότερα από {playlist.channel}
                  </span>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
