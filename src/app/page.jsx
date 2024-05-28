"use client"

import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

function Home() {
  //const sesionExist = window.sessionStorage.getItem('token')
  //if(sesionExist){
  //  window.sessionStorage.removeItem('token')
  //}
  const router = useRouter()

  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async e =>{
    e.preventDefault()
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/api-token-auth/`, {
      method: 'POST',
      body: JSON.stringify({'username': usuario, 'password': password}),
      headers:{
        "Content-Type":"application/json",
      }
    })

    const data = await res.json()

    if(data.token){
      //console.log(data)
      window.sessionStorage.setItem('token', data.token);
      window.sessionStorage.setItem('username', data.user);
      window.sessionStorage.setItem('name', data.name);
      window.sessionStorage.setItem('last', data.last);
      router.push('/dashboard')
    }else{
      alert("Error valide Usuario/Password")
    }

  }


  
  return (
    <div className='flex h-screen w-screen items-center justify-center bg-gray-50'>
      <div className='z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl'>
        <div className='flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16'>
          <img className='rounded-full h-13' src="/AparkApp.png" alt="AparkApp" />
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16'>
          <div>
            <label htmlFor="user" className='block text-xs text-gray-600 uppercase'>Usuario</label>
            <input type="text" name="" id="user" placeholder='Usuario' required className='mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm'
            onChange={e => setUsuario(e.target.value)}
            style={{textTransform: 'lowercase'}}
            />
          </div>
          
          <div>
            <label htmlFor="password" className='block text-xs text-gray-600 uppercase'>Password</label>
            <input type="password" name="" id="password" placeholder='Password' required className='mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm'
            onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type='submit' className='flex h-10 w-full bg-green-300 text-gray-600 items-center justify-center rounded-md border text-sm transition-all focus:outline-none'>Conectar</button>

          <p className='text-center text-sm text-gray-600'>Lenin Soft</p>
        </form>
      </div>
     
    </div>
  )
}

export default Home