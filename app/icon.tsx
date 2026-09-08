import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 192,
  height: 192,
}
export const contentType = 'image/png'

// Cache for 1 year (31536000 seconds) to minimize Edge Function usage
export const revalidate = 31536000

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 144,
          background: '#050508',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#d4af37', // mystic-gold
          borderRadius: '50%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(168,85,247,0.2) 100%)',
            borderRadius: '50%',
          }}
        />
        {/* Eclipse Icon Simulation */}
        <div style={{ position: 'relative', width: 144, height: 144, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a7 7 0 1 0 10 10" />
          </svg>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
