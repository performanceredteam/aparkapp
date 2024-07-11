"use client"

import React from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '../components/NavBar'
import Metrics from '../components/Metrics'
import TablaVisitasDs from '../components/TablaVisitasDs'
import TablaPensionDs from '../components/TablaPensionDs'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

function Dashboard() {
  const router = useRouter()
  
  if(typeof window !== 'undefined'){
    const token = window.sessionStorage.getItem('token')    
    if(!token){
      router.push('/')
    }
  }

  const getTipoPago = async () => {
    try{
      const token = window.sessionStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/config-pago/`, {
        method: 'GET',
        headers:{
        "Authorization" : `Token ${token}`,
        }
      })

      const tipoPago = await response.json()
      //console.log(tipoPago)
      window.sessionStorage.setItem('cn_config', tipoPago.Configuracion[0].cn_config)


    }catch(error){
      console.log(error)
    }
  }

  
  useEffect(() => {
    nProgress.done()
    return () => {
      getTipoPago()
      window.sessionStorage.removeItem('fechaActual')
      window.sessionStorage.removeItem('idCaja')
      nProgress.start()
    }
  })

  return (
    <div>    
        <div className='flex'>
          <div className='flex-auto'>
            <NavBar />
          </div>
          <div className='container mx-auto'>
            <div className='flex-auto'>
              <Metrics />
              <TablaVisitasDs />
              <TablaPensionDs />
            </div>
          </div>
          <div className='flex-auto'>
          </div>
        </div>
    </div>
  )
}


export default Dashboard