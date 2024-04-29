"use client"

import React from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

function LogOut() {
  const router = useRouter()

  if(typeof window !== 'undefined'){
    const token = window.sessionStorage.getItem('token')  //window.sessionStorage.getItem('token')
    if(!token){
      router.push('/')
    }else{
      window.sessionStorage.clear()
      router.push('/')
    }
  }

  return (
    <div>Cerrando Sesión...</div>
  )
}

export default LogOut