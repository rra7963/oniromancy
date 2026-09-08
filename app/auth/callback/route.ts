import { NextResponse } from 'next/server'
// The client you just imported above
import { createClient } from '@/services/supabase/server'
import { cookies } from 'next/headers'
import { processReferralAction } from '@/app/actions/referral'
import { DAILY_LOGIN_BONUS } from '@/types'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const rawNext = searchParams.get('next')
  const next = rawNext && rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Process Referral if cookie exists
      try {
        const cookieStore = await cookies()
        const ivt = cookieStore.get('ivt_code')?.value
        
        if (ivt) {
          const { data: { user } } = await supabase.auth.getUser()
          
          if (user && user.id !== ivt) {
               try {
                 // Check if profile exists, if not create it
                 const { data: existingProfile } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('id', user.id)
                    .single()
                 
                 if (!existingProfile) {
                     console.log(`[AuthCallback] Creating profile for ${user.id} before referral...`)
                     await supabase.from('profiles').insert({
                         id: user.id,
                         email: user.email!,
                         name: user.user_metadata?.name || user.email?.split('@')[0],
                         credits: DAILY_LOGIN_BONUS
                     })
                     // Wait a bit for propagation
                     await new Promise(r => setTimeout(r, 500))
                 }

                 await processReferralAction(user.id, ivt)
               } catch (profileErr) {
                   console.error('[AuthCallback] Failed to ensure profile or process referral:', profileErr)
               }
          }
        }
      } catch (e) {
        console.error('Callback referral error:', e)
      }

      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else {
        const canonicalOrigin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.oniromancy.com').replace(/\/$/, '')
        return NextResponse.redirect(`${canonicalOrigin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth?error=Could not authenticate user`)
}
