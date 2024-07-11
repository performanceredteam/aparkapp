"use client"
import React from 'react'
import RepIngresosVisita from '../../components/RepIngresosVisita'
import RepIngresoPension from '@/app/components/RepIngresoPension'
import { useParams } from 'next/navigation'
import NavBar from '../../components/NavBar'

function ReporteId() {
    const idReporte = useParams().id
    console.log('Reporte:'+idReporte)

  return (
    <div>
        <div className='flex'>
          <div className='flex-auto'>
            <NavBar />
          </div>
          <div className='container mx-auto'>
            <div className='flex-auto'>
              {idReporte == 1 &&  <RepIngresosVisita /> }
              {idReporte == 2 &&  <RepIngresoPension />}
            </div>
          </div>
          <div className='flex-auto'>
          </div>
        </div>
    </div>
  )
}

export default ReporteId