"use client"
import Link from 'next/link'
import { useAuth } from '../../components/AuthContext'
import { useState } from 'react'

export default function SignUpPage() {
  const { signInWithEmail, signInWithGoogle } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <div className="mx-auto max-w-md card p-8 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="text-neutral-600">Join ArbuqConcept for exclusive drops</p>
      </div>
      <form className="space-y-4" onSubmit={(e)=>{e.preventDefault(); signInWithEmail(email, name)}}>
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input className="w-full border rounded-md px-3 py-2" type="text" placeholder="Your Name" value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="w-full border rounded-md px-3 py-2" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input className="w-full border rounded-md px-3 py-2" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary w-full">Create Account</button>
      </form>
      <button className="btn w-full border" onClick={() => signInWithGoogle()}>Continue with Google</button>
      <p className="text-center text-sm text-neutral-600">Already have an account? <Link className="underline" href="/sign-in">Sign in</Link></p>
    </div>
  )
}

