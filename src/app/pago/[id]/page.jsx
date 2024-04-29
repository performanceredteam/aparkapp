"use client"

import React from 'react'
import NavBar from '../../components/NavBar'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

function IdRegistroPago() {
    const router = useRouter()

    if(typeof window !== 'undefined'){
        const token = window.sessionStorage.getItem('token')  //window.sessionStorage.getItem('token')
        if(!token){
            router.push('/')
        }
    }
    const initialized = useRef(false)
    const placaVehiculo = useParams().id

    const [getdataPlaca, setdataPlaca] = useState([])
    const [getdataInfoIngreso, setdataInfoIngreso] = useState([])
    const [getdataInfoVisitante, setdataInfoVisitante] = useState([])
    const [getdataInfoResidente, setdataInfoResidente] = useState([])
    const [getdataInfoRegistro, setdataInfoRegistro] = useState([])

    const [getdataCalculoSalida, setdataCalculoSalida] = useState([])
    const [getTipoCobro, setTipoCobro] = useState([])

    const resumenVisitanteVehiculo = async () => {
        const token = window.sessionStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/resumenvisitante-info/?placa=${placaVehiculo}&status=1`, {
            method: 'GET',
            headers:{
            "Authorization" : `Token ${token}`,
            }
        })
  
        const dataResumen = await response.json()
        //console.log(dataResumen)
        setdataPlaca(dataResumen.InfoPlacaVisitante)
        setdataInfoIngreso(dataResumen.InfoIngreso)
        setdataInfoVisitante(dataResumen.VisitanteInfo)
        setdataInfoRegistro(dataResumen.RegistroVisitante)
        setdataInfoResidente(dataResumen.PropietarioVisitado)   
            
        
    }

    const salidaFechaHora = async () => {
        const token = window.sessionStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/datetime-info/`, {
          method: 'GET',
          headers:{
            "Authorization" : `Token ${token}`,
          }
        })
    
        const salida = await response.json()
        //console.log(salida.FechaHoraSalida)
        window.sessionStorage.setItem('h_salida', salida.FechaHoraSalida)
        calculoTiempo()
    }

    const calculoTiempo = async () => {
        const token = window.sessionStorage.getItem('token')
        const horaSalida = window.sessionStorage.getItem('h_salida')
        const tipoPago = window.sessionStorage.getItem('cn_config')

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/tiempo-calculo/?placa=${placaVehiculo}&hora=${horaSalida}&cobro=${tipoPago}`, {
          method: 'GET',
          headers:{
            "Authorization" : `Token ${token}`,
          }
        })
    
        const dataCalculoSalida = await response.json()
        //console.log(dataCalculoSalida)
        if(tipoPago == 1){
            setTipoCobro('Min.')
        }else if(tipoPago == 2){
            setTipoCobro('Hrs.')
        }
        window.sessionStorage.setItem('monto', dataCalculoSalida.MontoPagar)
        window.sessionStorage.setItem('tiempo', dataCalculoSalida.DuracionHoraFrac)
        setdataCalculoSalida(dataCalculoSalida)
        
    }
    //function realizandoPago(){
    const realizandoPago = async () => {
        nProgress.start()
            const token = window.sessionStorage.getItem('token')
            const dataInfoIngerso = getdataInfoIngreso
            const dataInfoVisitante = getdataInfoRegistro

            const vi_fecha_hora_salida = window.sessionStorage.getItem('h_salida')
            const pl_placa = dataInfoIngerso.pl_placa
            const pk_slot = dataInfoIngerso.pk_slot
            const vi_visitante = dataInfoVisitante.id
            const fa_monto = window.sessionStorage.getItem('monto')
            const fa_tiempo = window.sessionStorage.getItem('tiempo')
            const ph_propietario = getdataInfoResidente.id

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/vehiculovisita-salida/${getdataInfoIngreso.id}/`, {
                method: 'PUT',
                body: JSON.stringify(
                    {
                        "vi_fecha_hora_salida" : vi_fecha_hora_salida,
                        "pl_placa" : pl_placa,
                        "pk_slot" : pk_slot,
                        "vi_visitante" : vi_visitante,
                        "fa_monto" : fa_monto,
                        "fa_tiempo": fa_tiempo,
                        "ph_propietario" : ph_propietario,
                        "pk_status" : true,
                        "vi_status" : false
                    }
                ),
                headers:{
                "Content-Type":"application/json",
                "Authorization" : `Token ${token}`,
                }
            })

            const dataResponse = await response.json()
            console.log(dataResponse)

            if(dataResponse.Message == 'Success'){
                window.sessionStorage.removeItem('monto')
                window.sessionStorage.removeItem('tiempo')
                window.sessionStorage.removeItem('h_salida')
                router.push('/dashboard')
            }else{
                console.log(dataResponse.Message)
            }

        nProgress.done()
    }

useEffect(() => {
    if(!initialized.current) {
        nProgress.start()
            initialized.current = true
            window.sessionStorage.removeItem('monto')
            window.sessionStorage.removeItem('tiempo')
            window.sessionStorage.removeItem('h_salida')
            salidaFechaHora() 
            resumenVisitanteVehiculo()    
        nProgress.done()
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
                        <div className="p-4 sm:ml-64">
                            <div className="items-center w-full space-y-4 m-6 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
                                <div className='m-6 grid gap-4 sm:grid-cols-2 grid-cols-2'>
                                    <div className='min-h-[100px] rounded-lg text-gray-500 bg-white shadow dark:text-gray-400 dark:bg-gray-800" '>
                                        <div className='pt-8 flex items-center w-full justify-center'>
                                            <div className="ms-3 text-xl font-normal">
                                                <h1>Placa Vehículo: <b>{getdataPlaca.pl_placa}</b></h1>
                                                <p>Fecha y Hora Ingreso: <b>{getdataInfoIngreso.vi_fecha_hora_ingreso}</b></p>
                                                <p>Slot: <b>{getdataInfoIngreso.pk_slot}</b></p>
                                                <hr />
                                                <p>Visitante: <b>{getdataInfoVisitante.vd_nombre}</b></p>
                                                <p>Cédula: {getdataInfoVisitante.vd_cedula}</p>
                                                <p>Tel: {getdataInfoVisitante.vd_telefono}</p>
                                                <hr />
                                                <p>Residente: {getdataInfoResidente.ph_propietario}</p>
                                                <p>Apartamento: {getdataInfoResidente.ph_torre} - {getdataInfoResidente.ph_apartamento}</p>
                                                <p>Tel: {getdataInfoResidente.ph_telefono}</p>
                                            </div>
                                        </div>
                                    </div>
                                        
                                    <div className="min-h-[100px] rounded-lg text-gray-500 bg-white shadow dark:text-gray-400 dark:bg-gray-800">
                                        <div className='pt-8 flex items-center w-full justify-center'>
                                            <div className="ms-3 text-xl font-normal">
                                                <h1>Fecha y Hora: <b>{getdataCalculoSalida.FechaHoraSalida}</b></h1>
                                                <p>Tiempo: <b>{getdataCalculoSalida.DuracionHoraFrac}</b> {getTipoCobro}</p>
                                                <hr />
                                                <p>Monto: <b>${getdataCalculoSalida.MontoPagar}</b></p>
                                                <p>Tiempo Gratis: {getdataCalculoSalida.HoraGratis} {getTipoCobro}</p>
                                                <hr />
                                                <div className='m-6 grid gap-4 sm:grid-cols-1 grid-cols-1'>
                                                    <button
                                                        className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
                                                        onClick={(e) => realizandoPago()}>
                                                        Registrar Salida
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex-auto'>
                </div>
            </div>
        </div>
    )
}

export default IdRegistroPago