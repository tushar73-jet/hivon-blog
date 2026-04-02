'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
    options: {
      data: {
        full_name: formData.get('name'),
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return redirect('/signup?message=Could not create account: ' + error.message)
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=Sign up successful! Please log in.')
}
