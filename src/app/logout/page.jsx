"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import Log from '../components/Log'

function LogOut() {
  const router = useRouter()

  if(typeof window !== 'undefined'){
    const token = window.sessionStorage.getItem('token')  //window.sessionStorage.getItem('token')
    if(!token){
      router.push('/')
    }else{
      Log(window.sessionStorage.getItem('username'),'Cierre Session',window.sessionStorage.getItem('token'))
      window.sessionStorage.clear()
      router.push('/')
    }
  }

  return (
    <div>Cerrando Sesión...</div>
  )
}

export default LogOut