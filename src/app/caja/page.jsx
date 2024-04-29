"use client"

import React from 'react'
import NavBar from '../components/NavBar'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

function Caja() {
    const router = useRouter()
    const initialized = useRef(false)
    const [getRecaudo, setRecaudo] = useState([])
    
    if(typeof window !== 'undefined'){
        const token = window.sessionStorage.getItem('token')  //window.sessionStorage.getItem('token')
        if(!token){
          router.push('/')
        }
    }
    
    const FechaHora = async () => {
        const token = window.sessionStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/datetime-info/`, {
          method: 'GET',
          headers:{
            "Authorization" : `Token ${token}`,
          }
        })
    
        const fechaActual = await response.json()
        //console.log(fechaActual)
        window.sessionStorage.setItem('fechaActual', fechaActual.FechaHoraIngreso)
        getRecaudoStatus()
    }

    const getRecaudoStatus = async () => { 
        const token = window.sessionStorage.getItem('token') 

        const getFechaActual = window.sessionStorage.getItem('fechaActual').substring(0,10)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/recaudo-rep?fechaini=${getFechaActual}&fechafin=${getFechaActual}`, {
          method: 'GET',
          headers:{
            "Authorization" : `Token ${token}`,
          }
        })

        const responseRecaudo = await response.json()
        setRecaudo(responseRecaudo)
        //console.log(responseRecaudo)
    }

    useEffect(() => {
        if(!initialized.current) {
            initialized.current = true
            nProgress.start()
                FechaHora()
            nProgress.done()
        }
    })
    
  return (
    <div className='container mx-auto'>
        <div className='flex'>
            <div className='flex-auto'>
                <NavBar />
            </div>
            <div className='container mx-auto'>
                <div className='flex-auto'>
                    <div className="p-4 sm:ml-64">
                        <div class="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800" role="alert">
                            <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                            </svg>
                                    <span class="sr-only">Info</span>
                            <div>
                                    <span class="font-medium">Recaudo</span>
                            </div>
                        </div>
                        <div className="min-h-[100px] rounded-lg text-gray-500 bg-white shadow dark:text-gray-400 dark:bg-gray-800">
                            <div className='pt-8 flex items-center w-full justify-center'>
                                <div className="ms-3 text-xl font-normal">
                                    <p>$ {getRecaudo.Recaudo}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Caja