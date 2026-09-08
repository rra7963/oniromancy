import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'Oniromancy AI - Dream Visualizer & Tarot'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Cache for 1 year (31536000 seconds) to minimize Edge Function usage
export const revalidate = 31536000

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: '#050508',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#d4af37',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ 
            fontSize: 80, 
            border: '4px solid #d4af37', 
            borderRadius: '50%', 
            width: 100, 
            height: 100, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginRight: 30
          }}>
            O
          </div>
          <div style={{ fontSize: 80, fontWeight: 'bold' }}>Oniromancy AI</div>
        </div>
        <div style={{ fontSize: 30, color: '#94a3b8', marginTop: 20 }}>
          Dream Analysis • Visual Tarot • Horoscope
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
