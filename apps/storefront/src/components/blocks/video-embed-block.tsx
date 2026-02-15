import React from 'react'

interface VideoEmbedBlockProps {
  heading?: string
  description?: string
  url: string
  provider?: 'youtube' | 'vimeo' | 'custom'
  poster?: {
    url: string
    alt?: string
  }
  autoplay?: boolean
  aspectRatio?: '16:9' | '4:3' | '1:1'
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  return match ? match[1] : null
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/(?:vimeo\.com\/)(\d+)/)
  return match ? match[1] : null
}

const aspectRatioClasses: Record<string, string> = {
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
}

export const VideoEmbedBlock: React.FC<VideoEmbedBlockProps> = ({
  heading,
  description,
  url,
  provider = 'youtube',
  poster,
  autoplay = false,
  aspectRatio = '16:9',
}) => {
  const arClass = aspectRatioClasses[aspectRatio] || aspectRatioClasses['16:9']

  const renderVideo = () => {
    if (provider === 'youtube') {
      const videoId = extractYouTubeId(url)
      if (!videoId) return null
      const params = new URLSearchParams({
        rel: '0',
        ...(autoplay ? { autoplay: '1', mute: '1' } : {}),
      })
      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
          title={heading || 'Video'}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )
    }

    if (provider === 'vimeo') {
      const videoId = extractVimeoId(url)
      if (!videoId) return null
      const params = new URLSearchParams({
        ...(autoplay ? { autoplay: '1', muted: '1' } : {}),
      })
      return (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?${params.toString()}`}
          title={heading || 'Video'}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      )
    }

    return (
      <video
        src={url}
        poster={poster?.url}
        controls
        autoPlay={autoplay}
        muted={autoplay}
        className="absolute inset-0 w-full h-full object-cover"
      />
    )
  }

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {heading && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ds-foreground mb-4 text-center">
            {heading}
          </h2>
        )}
        {description && (
          <p className="text-ds-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            {description}
          </p>
        )}
        <div
          className={`relative ${arClass} w-full overflow-hidden rounded-xl bg-ds-card border border-ds-border`}
        >
          {renderVideo()}
        </div>
      </div>
    </section>
  )
}
