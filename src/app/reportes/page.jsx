"use client"

import React from 'react'
import NavBar from '../components/NavBar'
import RepIngresosVisita from '../components/RepIngresosVisita'

function Reportes() {
  if(typeof window !== 'undefined'){
    const token = window.sessionStorage.getItem('token')  //window.sessionStorage.getItem('token')
    if(!token){
        router.push('/')
    }
  }
  
  return (
    <div>
        <div className='flex'>
          <div className='flex-auto'>
            <NavBar />
          </div>
          <div className='container mx-auto'>
            <div className='flex-auto'>
              <RepIngresosVisita />
            </div>
          </div>
          <div className='flex-auto'>
          </div>
        </div>
    </div>
  )
}

export default Reportes