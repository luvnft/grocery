import { createClient } from '@/utils/supabase/server'
import Mic from '@/components/Mic'
import { cookies } from 'next/headers'
import React from 'react'
import AuthButton from '@/components/AuthButton'
import Header from '@/components/Header'


export default function Index() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore);

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-cente">

      <Header/>
        <main className="flex-1 flex flex-col">
          <Mic />
        </main>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs text-spilltNavy">
        <p>
          Powered by{' '}
          <a
            href="https://arvrtise/"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Arvrtise
          </a>
        </p>
      </footer>
    </div>
  )
}
