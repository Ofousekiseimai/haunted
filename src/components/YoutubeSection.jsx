import React from 'react';

const YouTubeSection = ({ videosData }) => {
  const extractYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getThumbnailUrl = (url) => {
    const youtubeId = extractYoutubeId(url);
    if (!youtubeId) return '/fallback-thumbnail.jpg';
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  };

  return (
    <section className=" bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white text-center">
          Σχετικά Βίντεο Δημιουργών στο YouTube
        </h2>
        
        {videosData.playlists.map((playlist, index) => (
          <div key={index} className="py-4 mb-12">
            {/* Channel Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h3 className="text-2xl font-semibold text-white">
                Κανάλι {playlist.channel}
              </h3>
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlist.videos.map((video, vidIndex) => {
                const youtubeId = extractYoutubeId(video.url);
                
                return (
                  <div 
                    key={vidIndex}
                   className="group relative bg-transparent rounded-2xl p-4 overflow-hidden hover:transform hover:scale-[1.02] duration-300 border shadow-xl border-gray-700"
                  > 
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative group"
                    >
                      <div className="relative aspect-video">
                        <img
                          src={getThumbnailUrl(video.url)}
                          alt={`Thumbnail για το βίντεο: ${video.title}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-sm text-white">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                          {video.title}
                        </h4>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
            
            {/* See More Button */}
            <div className="mt-8 flex justify-center">
              <a
                href={playlist.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-pink-400 p-[2px] text-white rounded-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="block bg-gray-900 hover:bg-gray-800 px-6 py-2 rounded-md transition-colors duration-200 font-medium">
                  Δείτε περισσότερα από {playlist.channel}
                </span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default YouTubeSection;