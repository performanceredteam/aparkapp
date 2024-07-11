"use client"

import React from 'react'
import NavBar from '../components/NavBar'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Modal from 'react-modal';
import { CurrencyInput } from 'react-currency-mask';
import { useReactToPrint } from "react-to-print";

function Caja() {
    const router = useRouter()
    const initialized = useRef(false)
    const [getRecaudoParking, setRecaudoParking] = useState([])
    const [getRecaudoPension, setRecaudoPension] = useState([])
    const [getRecaudoTotal, setRecaudoTotal] = useState([])
    const [getFechaAct, setFechaAct] = useState([])

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
        statusCaja()
    }

    const getRecaudoStatus = async () => { 
        const token = window.sessionStorage.getItem('token') 

        const getFechaActual = window.sessionStorage.getItem('fechaActual').substring(0,10)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/recaudo-rep?fechafin=${getFechaActual}`, {
          method: 'GET',
          headers:{
            "Authorization" : `Token ${token}`,
          }
        })

        const responseRecaudo = await response.json()
        setRecaudoParking(responseRecaudo.Parking)
        setRecaudoPension(responseRecaudo.Pension)
        setRecaudoTotal(responseRecaudo.Total)
        setFechaAct(getFechaActual)
        
        //console.log(responseRecaudo) $ {getRecaudo.Recaudo}
    }

    const customStyles = {
        content: {
            top: '50%',
            left: '63%',
            right: 'auto',
            bottom: '-30%',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
    
        },
    };

    const [getBtnAbrirCaja, setBtnAbrirCaja] = useState(false)
    const [getBtnCerrarCaja, setBtnCerrarCaja] = useState(true)
    const [getBtnCorteCaja, setBtnCorteCaja] = useState(false)
    const [modalIsOpen, setIsOpen] = useState(false)
    const [modalCorteCajaOpen, setCorteCajaIsOpen] = useState(false)
    const [getMontoInicial, setMontoInicial] = useState(false)
    const [getStatusCaja, setStatusCaja] = useState([])
    const [getFechaApertura, setFechaApertura] = useState([])
    const [getUsuarioCaja, setUsuarioCaja] = useState([])

    const [getBaseCaja, setBaseCaja] = useState([])
    const componentRef = useRef();

    const toMoney = value => {
        const money = Number(value);
    
        if (isNaN(money)) {
          return value;
        }
    
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(money)
    }

    const statusCaja = async () => { 
        const token = window.sessionStorage.getItem('token') 
        const getFechaActual = window.sessionStorage.getItem('fechaActual').substring(0,10)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/apertura-caja?fechaapertura=${getFechaActual}`, {
          method: 'GET',
          headers:{
            "Authorization" : `Token ${token}`,
          }
        })

        const responseStatusCaja = await response.json()
        //console.log(responseStatusCaja.Caja[0])

        if(responseStatusCaja.Caja[0].cj_status_caja == false){
            setBtnAbrirCaja(false)
            setBtnCorteCaja(true)
            setStatusCaja('Cerrada')
        }else{
            window.sessionStorage.setItem('idCaja', responseStatusCaja.Caja[0].id) 
            setBtnAbrirCaja(true)
            setBtnCorteCaja(false)
            setStatusCaja('Iniciada')
            setFechaApertura('el '+ responseStatusCaja.Caja[0].cj_fecha_apertura.substring(0,10) + ' por el Usuario: ')
            setUsuarioCaja(responseStatusCaja.Caja[0].cj_usuario)
            setBaseCaja(responseStatusCaja.Caja[0].cj_base_caja)
            getRecaudoStatus()
        }
        //console.log(responseRecaudo) $ {getRecaudo.Recaudo}
    }

    function modalAbrirCaja(){
        setIsOpen(true)
    }

    function closeModal() {
        setIsOpen(false)
    }

    function montoCaja(originalValue){
        setMontoInicial(originalValue)
    }
    
    const iniciarCaja = async () => { 
        const montoinicial = getMontoInicial
        if(montoinicial != ""){
            const token = window.sessionStorage.getItem('token') 
            const username = window.sessionStorage.getItem('username') 
            
            const getFechaActual = window.sessionStorage.getItem('fechaActual').substring(0,10)
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/apertura-caja/`, {
              method: 'POST',
              body: JSON.stringify({'cj_base_caja':montoinicial,'cj_fecha_apertura':getFechaActual,'cj_usuario':username}),
              headers:{
                "Content-Type":"application/json",
                "Authorization" : `Token ${token}`,
              }
            })
    
            //console.log(response.json())
    
            const responseInicarCaja = await response.json()
            //console.log(responseInicarCaja.Caja)
    
            if(responseInicarCaja.Caja.cj_status_caja == false){
                setBtnAbrirCaja(false)
                setBtnCorteCaja(true)
                setStatusCaja('Cerrada')
            }else{
                setIsOpen(false)
                setBtnAbrirCaja(true)
                setBtnCorteCaja(false)
                window.sessionStorage.setItem('idCaja', responseInicarCaja.Caja.id) 
                setFechaApertura('el '+ responseInicarCaja.Caja.cj_fecha_apertura.substring(0,10) + ' por el Usuario: ')
                setUsuarioCaja(responseInicarCaja.Caja.cj_usuario)
                setBaseCaja(responseInicarCaja.Caja.cj_base_caja)
                setStatusCaja('Iniciada')
            }
        }else{
            alert('Monto Invalido...')
        }
       
        //console.log(responseRecaudo) $ {getRecaudo.Recaudo}
    }
    
    //Cerrar Caja
    const cerrarCaja = async () => { 
        const token = window.sessionStorage.getItem('token') 
        const getFechaActual = window.sessionStorage.getItem('fechaActual').substring(0,10)
        const idCaja =  window.sessionStorage.getItem('idCaja')
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/cierre-caja/${idCaja}/`, {
          method: 'PUT',
          body: JSON.stringify({
            'cj_fecha_cierre':getFechaActual,
            'cj_total_parking':getRecaudoParking,
            'cj_total_pension':getRecaudoPension,
            'cj_gran_total':getRecaudoTotal,
            'cj_status_caja':false}),
          headers:{
            "Content-Type":"application/json",
            "Authorization" : `Token ${token}`,
          }
        })

        //console.log(response.json())

        const responseCerrarCaja = await response.json()
        //console.log(responseCerrarCaja.Message)
        //console.log(responseRecaudo) $ {getRecaudo.Recaudo}
        if(responseCerrarCaja.Message == 'Success'){
            router.push('/dashboard')
        }else{
            alert('Error en Cierre de Caja...')
        }
    }


    //Corte Caja
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
      }
    );

    const corteCaja = async () => {
        const token = window.sessionStorage.getItem('token') 
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/corte-caja/`, {
            method: 'PUT',
            body: JSON.stringify({'status_caja':false}),
            headers:{
              "Content-Type":"application/json",
              "Authorization" : `Token ${token}`,
            }
          })

        const responseCorteCaja = await response.json()
        if(responseCorteCaja.Message == 'Success'){
            handlePrint()
            setBtnCerrarCaja(false)
            setCorteCajaIsOpen(false)
            setBtnCorteCaja(true)
        }else{
            alert('Error en Corte de Caja...')
        }
    }

    function openModalCorteCaja(){
        setCorteCajaIsOpen(true)
    }

    function closeModalCorteCaja(){
        setCorteCajaIsOpen(false)
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
                                    <span class="font-medium">Caja: {getStatusCaja} {getFechaApertura} {getUsuarioCaja}</span>
                            </div>
                        </div>
                        <div className="min-h-[100px] rounded-lg text-gray-500 bg-white shadow dark:text-gray-400 dark:bg-gray-800">
                            <div className='pt-8 flex items-center w-full justify-center'>
                                <div className="ms-3 text-xl font-normal">
                                    <button
                                        className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800' 
                                        disabled={getBtnAbrirCaja}  
                                        onClick={(e) => modalAbrirCaja()}        
                                    >
                                        Abrir Caja
                                    </button>
                                    <button
                                        className='focus:outline-none text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800' 
                                        disabled={getBtnCorteCaja} 
                                        onClick={(e) => openModalCorteCaja()}
                                    >
                                        Corte Caja
                                    </button>
                                    <button
                                        className='focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                                        disabled={getBtnCerrarCaja}  
                                        onClick={(e) => cerrarCaja()}
                                    >
                                        Cerrar Caja
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="min-h-[100px] rounded-lg text-gray-500 bg-white shadow dark:text-gray-400 dark:bg-gray-800">
                            <div className='pt-8 flex items-center w-full justify-center'>
                                <div className="ms-3 text-xl font-normal">
                                    <p>Base Caja: {toMoney(getBaseCaja)}</p>
                                    <p>Parking Total: {toMoney(getRecaudoParking)}</p>
                                    <p>Pensión Total: {toMoney(getRecaudoPension)}</p>
                                    <p>Total: <b>{toMoney((getRecaudoTotal))}</b></p>
                                </div>
                            </div>
                        </div>


                        <div id='abrirCaja'>
                            <Modal
                                isOpen={modalIsOpen}
                                onRequestClose={closeModal}
                                style={customStyles}
                                contentLabel="Abrir Caja"
                            >
                                <h2>Abrir Caja</h2>
                                <div className='m-6 grid gap-4 sm:grid-cols-2 grid-cols-2'> 
                                    <p className='text-gray-500 bg-white dark:text-gray-400 dark:bg-gray-800'>Monto Inicial</p>
                                    <CurrencyInput
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        onChangeValue={(event, originalValue, maskedValue) => {
                                            montoCaja(originalValue);
                                        }}
                                    />
                                </div>
                               
                                <div className='m-6 grid gap-4 sm:grid-cols-2 grid-cols-2'> 
                                <button onClick={closeModal} className='focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
                                    Cerrar
                                </button>
                                <button className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800' 
                                    onClick={(e) => iniciarCaja()}>
                                    Iniciar Caja
                                </button>
                                </div>
                            </Modal>
                        </div>

                        <div id='corteCaja'>
                            <Modal
                                isOpen={modalCorteCajaOpen}
                                onRequestClose={closeModalCorteCaja}
                                style={customStyles}
                                contentLabel="Corte Caja"
                            >
                                <div ref={componentRef}>
                                    <p class="overflow-y-auto h-auto" >
                                        <img className='rounded-full h-32' src="/AparkApp.png" alt="AparkApp" />
                                        {'Corte de Caja'} <br></br>
                                        {'Fecha: '+getFechaAct} <br></br>
                                        {'Usuario: '+getUsuarioCaja} <br></br>
                                        {'--------------------------------------------------'}<br></br>
                                        {'Base Caja: '+ toMoney(getBaseCaja)}<br></br>
                                        {'Parking Total: '+toMoney(getRecaudoParking)}<br></br>
                                        {'Pensión Total: '+toMoney(getRecaudoPension)}<br></br>
                                        {'Total: '+toMoney((getRecaudoTotal))}<br></br>
                                        {'---------------------------------------------------'}<br></br>
                                        {'Lenin Soft - 304-522-5936'}
                                    </p>
                                </div>
                                <div className='m-6 grid gap-4 sm:grid-col-1 grid-cols-1'> 
                                    <button className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800' 
                                        onClick={(e) => corteCaja()}>
                                        Aceptar
                                    </button>
                                    <button className='focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800' 
                                        onClick={(e) => closeModalCorteCaja()}>
                                        Cancelar
                                    </button>
                                </div>


                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Caja