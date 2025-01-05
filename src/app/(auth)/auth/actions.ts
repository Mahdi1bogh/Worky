"use server"

import { createClient } from "@/supabase/supabaseServer"
import { User } from "@/types/app"

export async function signInWithGithub( path:string) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options:{
        redirectTo:`${path}/auth/callback`
      }
    })
    return {status:200, data, error }
  }
export async function signInWithGoogle(path:string) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options:{
        redirectTo:`${path}/auth/callback`
      }
    })
    return {status:200, data, error }
  }

export async function registerWithEmail({ email }: { email: string }) {
    const supabase = await createClient()
  
    const response = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:"http://localhost:3000/auth/confirm",
      },
    });
  
    return JSON.stringify(response);
  }

export const getUserData = async():Promise<User|null> => {
  const supabase = await createClient()
  const {data:{user}} = await supabase.auth.getUser()
  if(!user) {
    console.log("NO USER ",user)
    return null
  }
  const {data,error} = await supabase.from('users').select('*').eq('id',user.id);
  if(error){
    console.log("Error ",error)
    return null
  }
  return data ? data[0] : null
}

