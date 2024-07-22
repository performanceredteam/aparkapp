"use client"

import React from 'react'
import NavBar from '../../components/NavBar'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { useReactToPrint } from "react-to-print";
import nProgress from 'nprogress'
import Modal from 'react-modal';
import 'nprogress/nprogress.css'
import { CurrencyInput } from 'react-currency-mask';
import Log from '../../components/Log'

const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  )

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

    const [getImpresoraStatus, setImpresoraStatus] = useState(false)
    const [getreImpresoraStatus, setreImpresoraStatus] = useState(false)
    const [getConjuntoInfo, setConjuntoInfo] = useState([])
    const componentRef = useRef();

    const [getFechaHoraIngreso, setFechaHoraIngreso] = useState([])
    const [getFechaHoraSalida, setFechaHoraSalida] = useState([])
    const [getTipoVehiculo, setTipoVehiculo] = useState([])

    const [getMensaje, setMensaje] = useState([])
    const [getOfsCedula, setOfsCedula] = useState([])
    const [getTicketId, setTicketId] = useState([])

    let statusImp = false


    const toMoney = value => {
        const money = Number(value);
    
        if (isNaN(money)) {
          return value;
        }
    
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(money)
    }


    //Modal.setAppElement('#ticketImpresora');
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

    const customStylesTicket = {
        content: {
        top: '50%',
        left: '63%',
        right: 'auto',
        bottom: '-30%',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    
        },
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
      }
    );
    
    function imprimirTicket(){
        handlePrint()
        setImpresoraStatus(false)
        router.push('/dashboard')
    }

    function reImprimirTicket(){
        
        dataConjuntoTicket()
        setreImpresoraStatus(true)
    }

    function reImprimirTicketf(){
        handlePrint()
        setreImpresoraStatus(false)
    }
    

    //Data Conjunto
    const dataConjuntoTicket = async () => {
        const token = window.sessionStorage.getItem('token') 
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/conjunto/`, {
            method: 'GET',
            headers:{
            "Authorization" : `Token ${token}`,
            }
        }) 

        const dataConjunto = await response.json()
        const dataConjuntoInfo = dataConjunto.Conjunto[0]

            setMensaje(dataConjuntoInfo.cj_msn.match(/.{1,35}/g).join("<br />"))   
            setConjuntoInfo(dataConjuntoInfo)
    }

    //Set Impresora
    const statusImpresora = async () => {
        const token = window.sessionStorage.getItem('token') 
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/impresora/`, {
        method: 'GET',
        headers:{
            "Authorization" : `Token ${token}`,
        }
        }) 

        const dataImpresora = await response.json()
        const statusImpresoraInfo = dataImpresora.Impresora[0].cg_impresora
        //console.log(statusImpresoraInfo)
        setImpresoraStatus(statusImpresoraInfo)
        statusImp = statusImpresoraInfo
        

        if(statusImpresoraInfo === true){
        const token = window.sessionStorage.getItem('token') 
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/conjunto/`, {
            method: 'GET',
            headers:{
            "Authorization" : `Token ${token}`,
            }
        }) 

        const dataConjunto = await response.json()
        const dataConjuntoInfo = dataConjunto.Conjunto[0]

            setMensaje(dataConjuntoInfo.cj_msn.match(/.{1,35}/g).join("<br />"))   
            setConjuntoInfo(dataConjuntoInfo)
        }
    }

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

        setFechaHoraIngreso(dataResumen.InfoIngreso.vi_fecha_hora_ingreso.replace('T',' '))
        setTicketId(dataResumen.InfoIngreso.in_tk_id)
        let OfsCedula = dataResumen.VisitanteInfo.vd_cedula
        setOfsCedula(OfsCedula.toString().substring(OfsCedula.length,5))
        //console.log(dataResumen.InfoIngreso.vh_tipo)
        if(dataResumen.InfoIngreso.vh_tipo == 1){
            setTipoVehiculo('Carro')
        }else if(dataResumen.InfoIngreso.vh_tipo == 2){
            setTipoVehiculo('Moto')
        }
            
        
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
        setFechaHoraSalida(salida.FechaHoraSalida.replace('T',' '))
        calculoTiempo()
    }

    const calculoTiempo = async () => {
        nProgress.start()
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
        nProgress.done()
    }
    //function realizandoPago(){
    const realizandoPago = async () => {
        nProgress.start()
            statusImpresora() 
        
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
            //console.log(dataResponse)

            if(dataResponse.Message == 'Success'){
                Log(window.sessionStorage.getItem('username'),'Registro Salida de Vehiculo Visitante Placa:'+pl_placa+',Monto:'+fa_monto+
                        ',Tiempo:'+fa_tiempo+',Salida'+vi_fecha_hora_salida+',Propietario Id'+ph_propietario,
                        window.sessionStorage.getItem('token')
                    )
                
                await delay(2000)
                
                window.sessionStorage.removeItem('monto')
                window.sessionStorage.removeItem('tiempo')
                window.sessionStorage.removeItem('h_salida')
            
                if(statusImp != true){
                    await delay(5000)
                    router.push('/dashboard')
                }
                
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
                                <div className='m-6 grid gap-4 sm:grid-cols-2 grid-cols-1'>
                                    <div className='min-h-[100px] rounded-lg text-gray-500 bg-white shadow dark:text-gray-400 dark:bg-gray-800" '>
                                        <div className='pt-8 flex items-center w-full justify-center'>
                                            <div className="ms-3 text-xl font-normal">
                                                <h1>Placa Vehículo: <b>{getdataPlaca.pl_placa}</b></h1>
                                                <p>Fecha y Hora Ingreso: <b>{getFechaHoraIngreso}</b></p>
                                                <p>Slot: <b>{getdataInfoIngreso.pk_slot}</b></p>
                                                <hr />
                                                <p>Visitante: <b>{getdataInfoVisitante.vd_nombre}</b></p>
                                                <p>Cédula: {getOfsCedula}****</p>
                                                <p>Tel: {getdataInfoVisitante.vd_telefono}</p>
                                                <hr />
                                                <p>Residente: {getdataInfoResidente.ph_propietario}</p>
                                                <p>Apartamento: {getdataInfoResidente.ph_torre} - {getdataInfoResidente.ph_apartamento}</p>
                                                <p>Tel: {getdataInfoResidente.ph_telefono}</p>

                                                <div className='m-6 grid gap-4 sm:grid-cols-1 grid-cols-1'>
                                                    <button
                                                        className='focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                                                        onClick={(e) => reImprimirTicket()}>
                                                        Re-Imprimir Ticket
                                                    </button>
                                                </div>
                                            </div>
                                                
                                        </div>
                                    </div>
                                        
                                    <div className="min-h-[100px] rounded-lg text-gray-500 bg-white shadow dark:text-gray-400 dark:bg-gray-800">
                                        <div className='pt-8 flex items-center w-full justify-center'>
                                            <div className="ms-3 text-xl font-normal">
                                                <h1>Fecha y Hora: <b>{getFechaHoraSalida}</b></h1>
                                                <p>Tiempo: <b>{getdataCalculoSalida.DuracionHoraFrac}</b> {getTipoCobro}</p>
                                                <hr />
                                                <p>Monto: <b>{toMoney(getdataCalculoSalida.MontoPagar)}</b></p>
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
                    <div id='ticketImpresora'>
                        <Modal
                            isOpen={getImpresoraStatus}
                            
                            style={customStyles}
                            contentLabel="Imprimir Ticket"
                        >
                            <div ref={componentRef}>
                            <p class="overflow-y-auto h-auto" >
                                <img className='rounded-full h-32' src="/AparkApp.png" alt="AparkApp" />
                                {getConjuntoInfo.cj_nombre} <br></br>
                                {getConjuntoInfo.cj_direccion} <br></br>
                                {getConjuntoInfo.cj_ciudad} <br></br>
                                {getConjuntoInfo.cj_tel} <br></br>
                                {'--------------------------------------------------'}<br></br>
                                {'Ingreso:'+getFechaHoraIngreso}<br></br>
                                {'Salida:'+getFechaHoraSalida}<br></br>
                                {'--------------------------------------------------'}<br></br>
                                {'Egreso:'+getTipoVehiculo+' Placa:'+getdataPlaca.pl_placa}<br></br>
                                {'Slot:'+getdataInfoIngreso.pk_slot}<br></br>
                                {'Visitante:'+getdataInfoVisitante.vd_nombre+' Cedula:'+getOfsCedula+'***'}<br></br>
                                {'Residente:'+getdataInfoResidente.ph_propietario+' Apto:'+getdataInfoResidente.ph_torre+'-'+getdataInfoResidente.ph_apartamento}<br></br>
                                {'Tiempo Libre:'+getdataCalculoSalida.HoraGratis+' '+getTipoCobro}<br></br>
                                {'---------------------------------------------------'}<br></br>
                                {'Tiempo:'+getdataCalculoSalida.DuracionHoraFrac+' '+getTipoCobro}<br></br>
                                {'Monto:'+toMoney(getdataCalculoSalida.MontoPagar)}<br></br>
                                {'---------------------------------------------------'}<br></br>
                                <div dangerouslySetInnerHTML={{ __html: getMensaje }}/>
                                {'---------------------------------------------------'}<br></br>
                                {'Ticket #'}{getTicketId}<br></br>
                                {'Ticket No Fiscal'} <br></br>
                                {'Lenin Soft - 304-522-5936'}
                            </p>
                            </div>
                            <div className='m-6 grid gap-4 sm:grid-col-1 grid-cols-1'> 
                                <button className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800' 
                                    onClick={(e) => imprimirTicket()}>
                                    Imprimir Ticket
                                </button>
                            </div>

                        </Modal>
                    </div>

                    <div id='ticketReImpresora'>
                        <Modal
                            isOpen={getreImpresoraStatus}
                            style={customStylesTicket}
                            contentLabel="Re-Imprimir Ticket"
                        >
                            <div ref={componentRef}>
                            <p class="overflow-y-auto h-auto" >
                            <img className='rounded-full h-32' src="/AparkApp.png" alt="AparkApp" />
                                {getConjuntoInfo.cj_nombre} <br></br>
                                {getConjuntoInfo.cj_direccion} <br></br>
                                {getConjuntoInfo.cj_ciudad} <br></br>
                                {getConjuntoInfo.cj_tel} <br></br>
                                {'--------------------------------------------------'}<br></br>
                                {getFechaHoraIngreso}<br></br>
                                {'Ingreso:'+getTipoVehiculo+' Placa:'+getdataPlaca.pl_placa}<br></br>
                                {'Slot:'+getdataInfoIngreso.pk_slot}<br></br>
                                {'Visitante:'+getdataInfoVisitante.vd_nombre}<br></br>
                                {'Cedula:'+getOfsCedula+'***'}<br></br>
                                {'Residente:'+getdataInfoResidente.ph_propietario+' Apto:'+getdataInfoResidente.ph_torre+'-'+getdataInfoResidente.ph_apartamento}<br></br>
                                {'---------------------------------------------------'}<br></br>
                                <div dangerouslySetInnerHTML={{ __html: getMensaje }}/>
                                {'---------------------------------------------------'}<br></br>
                                {'Ticket #'}{getTicketId}<br></br>
                                {'Ticket No Fiscal'} <br></br>
                                {'Lenin Soft - 304-522-5936'}
                            </p>
                            </div>
                            <div className='m-6 grid gap-4 sm:grid-col-1 grid-cols-1'> 
                                <button className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800' 
                                    onClick={(e) => reImprimirTicketf()}>
                                    Re-Imprimir Ticket
                                </button>
                            </div>

                        </Modal>
                    </div>
                </div>
                <div className='flex-auto'>
                </div>
            </div>
        </div>
    )
}

export default IdRegistroPago