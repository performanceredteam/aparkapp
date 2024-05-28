"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function Metrics() {
    const router = useRouter()

    const [metrics,  setMetrics ] = useState(null)
    const [ metricsParq, setMetricsParq] = useState(null)
    
    const getMetricsDh = async () => {
        try{
            if(typeof window !== 'undefined'){
                const token = window.sessionStorage.getItem('token')
                if(!token){
                  router.push('/')
                }else{
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/totvechiculos-dh/`, {
                        method: 'GET',
                        headers:{
                        "Authorization" : `Token ${token}`,
                        }
                    })

                    const responseParq = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/totparqueaderos-dh/`, {
                        method: 'GET',
                        headers:{
                        "Authorization" : `Token ${token}`,
                        }
                    })

                    if(response && responseParq){
                        const metrics  = await response.json()
                        const metricsParq = await responseParq.json()
                        //console.log(data)
                        //console.log(JSON.stringify(metrics.TotalVehiculosParqueadosDh[0].Carro))
                        //MetricDhCarro = metrics.TotalVehiculosParqueadosDh[0]
                        if (metrics) setMetrics(metrics)
                        
                        if (metricsParq) setMetricsParq(metricsParq)
                    }
                }
              }
        }catch(error){
            console.log(error)
        }
    }


    function nuevoIngreso(){
        router.push('/registro')
    }

    useEffect(() => {
        getMetricsDh()
    },[])


  return (
    <div className="p-4 sm:ml-64">
        <div id="toast-default" className="flex max-w-xl space-x-4 m-6 items-center p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
            <div className='flex items-center w-full justify-center'>
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-car" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" /></svg>
                </div>
                <div className="ms-3 text-xl font-normal">{metrics && <h1>Carros: {JSON.stringify(metrics.TotalVehiculosParqueadosDh[0].Carro)} </h1>}</div>
            </div>
        
            <div className='flex items-center w-full justify-center'>
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-motorbike" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 16m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M19 16m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M7.5 14h5l4 -4h-10.5m1.5 4l4 -4" /><path d="M13 6h2l1.5 3l2 4" /></svg>
                </div>
                <div className="ms-3 text-xl font-normal">{metrics && <h1>Motos: {JSON.stringify(metrics.TotalVehiculosParqueadosDh[1].Moto)} </h1>}</div>
            </div>
        </div>

        <div id="toast-default_1" className="flex max-w-xl space-x-4 m-6 items-center p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
            <div className='flex items-center w-full justify-center'>
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-car" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" /></svg>
                </div>
                <div className="ms-3 text-xl font-normal">{metricsParq && <h1>Parqueadero Carro: {JSON.stringify(metricsParq.ParquedaroCarrosDisponibles)} </h1>}</div>
            </div>
        
            <div className='flex items-center w-full justify-center'>
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-motorbike" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 16m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M19 16m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M7.5 14h5l4 -4h-10.5m1.5 4l4 -4" /><path d="M13 6h2l1.5 3l2 4" /></svg>
                </div>
                <div className="ms-3 text-xl font-normal">{metricsParq && <h1>Parqueadero Motos: {JSON.stringify(metricsParq.ParquedaroMotosDisponibles)}  </h1>}</div>
            </div>
        </div>

        <button onClick={(e) => nuevoIngreso()} className='focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>Nuevo Ingreso</button>
   </div>
  )
}

export default Metrics