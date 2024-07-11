"use client"

import React from 'react'
import NavBar from '../components/NavBar'
//import RepIngresosVisita from '../components/RepIngresosVisita'
import { useRouter } from 'next/navigation'

function Reportes() {
  const router = useRouter()

  if(typeof window !== 'undefined'){
    const token = window.sessionStorage.getItem('token')  //window.sessionStorage.getItem('token')
    if(!token){
        router.push('/')
    }
  }


  function btnRepIngresoVisita(e){
    router.push(`/reporte/${e}`)
  }
  
  return (
    <div>
        <div className='flex'>
          <div className='flex-auto'>
            <NavBar />
          </div>
          <div className='container mx-auto'>
            <div className='flex-auto'>
              <div className="p-4 sm:ml-64">
                <button 
                  className='focus:outline-none  text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
                  onClick={(e) => btnRepIngresoVisita(e.target.value)} value={1}>
                  Reporte Ingreso de Visitantes
                </button>

                <button 
                  className='focus:outline-none  text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
                  onClick={(e) => btnRepIngresoVisita(e.target.value)} value={2}>
                  Reporte Ingreso de Pensión
                </button>
              </div>

            </div>
          </div>
          <div className='flex-auto'>
          </div>
        </div>
    </div>
  )
}

export default Reportes