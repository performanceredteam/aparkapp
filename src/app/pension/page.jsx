"use client"

import React, {useEffect, useState, useRef}  from 'react'
import NavBar from '../components/NavBar'
import InputMask from "react-input-mask";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
registerLocale('es', es);
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { format } from "date-fns";
import { useRouter } from 'next/navigation'
import Modal from 'react-modal';
import { useReactToPrint } from "react-to-print";

function Pension() {

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

    const initialized = useRef(false)
    const router = useRouter()
    const componentRef = useRef();

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [getTipoCarro, setTipoCarro] = useState(false);
    const [getTipoMoto, setTipoMoto] = useState(false);
    const [getTipoPlacaVehiculo, setTipoPlacaVehiculo] = useState([])
    const [getTipoVehiculo, setTipoVehiculo] = useState([])
    const [getVehiculo, setVehiculo] = useState([])
    const [getPlaca, setPlaca] = useState([])
    const [getNombre, setNombre] = useState([])
    const [getCedula, setCedula] = useState([])
    const [getParking, setParking] = useState([])
    const [getMonto, setMonto] = useState([])

    const [getStatusPlaca, setStatusPlaca] = useState(true)
    const [getStatusNombre, setStatusNombre] = useState(true)
    const [getStatusCedula, setStatusCedula] = useState(true)
    const [getStatusFechaIni, setStatusFechaIni] = useState(true)
    const [getStatusFechaFin, setStatusFechaFin] = useState(true)
    const [getStatusBtnGuardar, setStatusBtnGuardar] = useState(true)

    const [getMontoPension, setMontoPension] = useState([])
    const [getMontoPensionN, setMontoPensionN] = useState([])

    const [getStatusModel, setStatusModel] = useState(false);
    const [getConjuntoInfo, setConjuntoInfo] = useState([])
    const [getMensaje, setMensaje] = useState([])

    const [getPlacaTk, setPlacaTk] = useState([])
    const [getNombreTk, setNombreTk] = useState([])
    const [getCedulaTk, setCedulaTk] = useState([])
    const [getFechaIniTk, setFechaIniTk] = useState([])
    const [getFechaFinTk, setFechaFinTk] = useState([])


    function handleOptionChange(e){
        //console.log(e.target.value)
        setStatusPlaca(false)
        setStatusNombre(false)
        setStatusCedula(false)
        setStatusFechaIni(false)
        setStatusFechaFin(false)
        setStatusBtnGuardar(false)

        if(e.target.value == 1){
            setTipoCarro(true)
            setTipoMoto(false)
            const maskTipoVehiculo = "aaa-999"
            setTipoPlacaVehiculo(maskTipoVehiculo)
            setTipoVehiculo(1)
            SlotParqueadero("Carro")
            setVehiculo("Carro")
        }else if(e.target.value == 2){
            setTipoCarro(false)
            setTipoMoto(true)
            const maskTipoVehiculo = "aaa-99a"
            setTipoPlacaVehiculo(maskTipoVehiculo)
            setTipoVehiculo(2)
            SlotParqueadero("Moto")
            setVehiculo("Moto")
        }
    }

    const toMoney = value => {
        const money = Number(value);
    
        if (isNaN(money)) {
          return value;
        }
    
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(money)
    }

    //Monto de Pension por Dia
    const CostoPension = async () => {
        const token = window.sessionStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/costopension`, {
          method: 'GET',
          headers:{
            "Authorization" : `Token ${token}`,
          }
        })
    
        const montoPension = await response.json()
        //console.log(montoPension.Monto[0].cp_monto)
        //setMontoPension(montoPension.Monto[0].cp_monto)
        //console.log(toMoney(montoPension.Monto[0].cp_monto))
        setMontoPension(toMoney(montoPension.Monto[0].cp_monto))
        setMontoPensionN(montoPension.Monto[0].cp_monto)
    
    }
    
    //Elimina numeros y caracteres especiales de nombre
    function dataNombre(e){
        const nombre = e.target.value.replace(/[^a-zA-Z\s]*$/gi, '')
        //console.log(nombre)
        setNombre(nombre)
    }

    //Calcula el monto a cobrar de la pension por dia
    function calculoMonto(date){
        setEndDate(date)
        //console.log(startDate)
        //console.log(getMontoPensionN)

        const diffFechaIni = startDate
        const diffFechaFin = date
        const monto = getMontoPensionN

        const diff = Math.round((diffFechaFin - diffFechaIni) / (1000*60*60*24))

        //console.log(diff*monto)
        setMonto(diff*monto)
        setMontoPension(toMoney(diff*monto))
    }
    
    //Parqueadero Disponible
    const SlotParqueadero = async (vehiculo) => { 
        const tipoVehiculoSlot = vehiculo
        //console.log(tipoVehiculoSlot)
        const token = window.sessionStorage.getItem('token')

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/parqueaderovisita-disponible/?disponible=True&tipovehiculo=${tipoVehiculoSlot}`, {
            method: 'GET',
            headers:{
              "Authorization" : `Token ${token}`,
            }
          })

          const parking = await response.json()
          const ultPark = parking.ParqueaderosDisponibles.length-1
          const lenPark = parking.ParqueaderosDisponibles.length
          if(lenPark >= 1){
            setParking(parking.ParqueaderosDisponibles[ultPark].pk_slot)
          }else{
            alert("Sin Parqueaderos disponibles")
            router.push("/dashboard")
          }          
    }

    const GuardarRegistro = async () => {
        const placa = getPlaca
        const nombre = getNombre
        const cedula = getCedula
        const fechaini = format(startDate, "yyyy-MM-dd")
        const fechafin = format(endDate, "yyyy-MM-dd")
        const monto = getMonto
        const slot = getParking
        const vehiculo = getTipoVehiculo

        if(placa != "" && nombre != "" && cedula != ""){
            nProgress.start()
                /*console.log(placa.toUpperCase())
                console.log(nombre.toUpperCase())
                console.log(cedula.replace(/_/gi, ""))
                console.log(fechaini)
                console.log(fechafin)
                console.log(monto)
                console.log(slot)
                console.log(vehiculo)*/

                setNombreTk(nombre.toUpperCase())
                setPlacaTk(placa.toUpperCase())
                setCedulaTk(cedula.replace(/_/gi, ""))
                setFechaIniTk(fechaini)
                setFechaFinTk(fechafin)

                setStatusModel(true)

                const token = window.sessionStorage.getItem('token')
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/pension/`, {
                    method: 'POST',
                    body: JSON.stringify(
                        {
                            "pe_placa": placa.toUpperCase(),
                            "pe_nombre": nombre.toUpperCase(),
                            "pe_cedula": cedula.replace(/_/gi, ""),
                            "pe_fecha_ini": fechaini,
                            "pe_fecha_fin": fechafin,
                            "pe_monto": monto,
                            "pe_slot": slot,
                            "pe_tipo_vehiculo": vehiculo
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
                    const token = window.sessionStorage.getItem('token')
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/parqueaderovisita-actdisponible/${slot}/`, {
                        method: 'PUT',
                        body: JSON.stringify(
                            {    
                                "pk_slot":slot,
                                "pk_status":false   
                            }
                        ),
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization" : `Token ${token}`,
                        }
                    })

                    const reponseUpPark = await response.json()
                        if(reponseUpPark.Message == 'Updated'){
                            
                        }
                }
            nProgress.done()
        }else{
            alert("Todos los campos deben ser informados")
        }
    }

    //Data Conjunto
    const dataConjunto = async () => {
        const token = window.sessionStorage.getItem('token') 
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/conjunto/`, {
            method: 'GET',
            headers:{
            "Authorization" : `Token ${token}`,
            }
        }) 

        const dataConjunto = await response.json()
        const dataConjuntoInfo = dataConjunto.Conjunto[0]
        //console.log(dataConjuntoInfo)
        setMensaje(dataConjuntoInfo.cj_msn.match(/.{1,35}/g).join("<br />"))   
        setConjuntoInfo(dataConjuntoInfo)
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
      }
    );

    function imprimirTicket(){
        handlePrint()
        setStatusModel(false)
        router.push('/dashboard')
      }
       
    useEffect(() => { 
        if(!initialized.current) {
            nProgress.start()
                initialized.current = true
                CostoPension()
                dataConjunto()
            nProgress.done()
        }
    })

  return (
    <div className='flex'>
        <div className='flex-auto'>
            <NavBar />
        </div>
        <div className='container mx-auto'>
            <div className='flex-auto'>
            <div className="p-4 sm:ml-64">
                
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <div class="flex items-center mb-4 gap-x-2 px-24">
                                <input type="radio" value="1" id="radio1"
                                 checked={getTipoCarro}
                                 onChange={(e) => handleOptionChange(e)}
                                 className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <label for="radio1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Carro</label>

                                <input type="radio" value="2" id="radio2"
                                checked={getTipoMoto}
                                onChange={(e) => handleOptionChange(e)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <label for="radio2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Moto</label>
                            </div>



                            <label for="placa" className="block text-sm font-medium leading-6 text-gray-900">Placa</label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"> 
                                <InputMask mask={getTipoPlacaVehiculo} 
                                    disabled={getStatusPlaca}
                                    onChange={(e) => setPlaca(e.target.value)}
                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" style={{textTransform: 'uppercase'}}/>
                                </div>
                            </div>

                            <br />

                            <label for="nombre" className="block text-sm font-medium leading-6 text-gray-900">Nombre</label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"> 
                                <input type="text" 
                                    disabled={getStatusNombre}
                                    onChange={(e) => dataNombre(e)}
                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                    style={{textTransform: 'uppercase'}}
                                    ></input>
                                </div>
                            </div>

                            <br />

                            <label for="cedula" className="block text-sm font-medium leading-6 text-gray-900">Cedula</label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"> 
                                <InputMask mask="99999999999" 
                                    disabled={getStatusCedula}
                                    onChange={(e) => setCedula(e.target.value)}
                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
                                </div>
                            </div>

                            <br />

                            <label for="fini" className="block text-sm font-medium leading-6 text-gray-900">Fecha Inicio</label>
                            <div className="mt-2">
                                <DatePicker 
                                    showIcon
                                    selected={startDate} 
                                    onChange={(date) => setStartDate(date)}
                                    dateFormat="yyyy-MM-dd"
                                    locale="es"
                                    disabled={getStatusFechaIni}
                                    minDate={new Date()}
                                />
                            </div>
                            
                            <br />
                            <label for="ffin" className="block text-sm font-medium leading-6 text-gray-900">Fecha Fin</label>
                            <div className="mt-2">
                                <DatePicker 
                                    showIcon
                                    selected={endDate} 
                                    //onChange={(date) => setEndDate(date)}
                                    onChange={(date) => calculoMonto(date)}
                                    dateFormat="yyyy-MM-dd"
                                    locale="es"
                                    disabled={getStatusFechaFin}
                                    minDate={new Date()}
                                />
                            </div>

                            <br />
                        
                            <label for="costo" className="block text-sm font-medium leading-6 text-gray-900">Monto</label>
                            <div className="mt-2"> 
                                {getMontoPension}
                            </div>

                            <br />

                            <label for="slot" className="block text-sm font-medium leading-6 text-gray-900">Slot</label>
                            <div className="mt-2">
                                {getParking} 
                            </div>

                            <br />

                            <label for="vehiculo" className="block text-sm font-medium leading-6 text-gray-900">Vehículo</label>
                            <div className="mt-2"> 
                                {getVehiculo}
                            </div>

                            <br />

                            <button
                                disabled={getStatusBtnGuardar}
                                onClick={(e) => GuardarRegistro()}
                                className='flex h-10 w-96 focus:outline-none items-center justify-center text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
                            >
                            Guardar Registro
                            </button>
                            
                        </div>
                    </div>
                
                <div id='ticket'>
                    <Modal
                        isOpen={getStatusModel}
                        onRequestClose={true}
                        style={customStyles}
                        contentLabel="Registro Pensión"
                    >
                        <div ref={componentRef}>
                            <p class="overflow-y-auto h-auto" >
                            <img className='rounded-full h-32' src="/AparkApp.png" alt="AparkApp" />
                                {getConjuntoInfo.cj_nombre} <br></br>
                                {getConjuntoInfo.cj_direccion} <br></br>
                                {getConjuntoInfo.cj_ciudad} <br></br>
                                {getConjuntoInfo.cj_tel} <br></br>
                                {'--------------------------------------------------'}<br></br>
                                {'Vehículo: '+getVehiculo}<br></br>
                                {'Placa: '+getPlacaTk} <br></br>
                                {'Nombre: '+getNombreTk} <br></br>
                                {'Cedula: '+getCedulaTk} <br></br>
                                {'--------------------------------------------------'}<br></br>
                                {'Fecha Inicio: '+getFechaIniTk}<br></br>
                                {'Fecha Fin: '+getFechaFinTk}<br></br>
                                {'Slot: '+getParking}<br></br>
                                {'---------------------------------------------------'}<br></br>
                                {'Monto: '+getMontoPension} <br></br>
                                {'---------------------------------------------------'}<br></br>
                                <div dangerouslySetInnerHTML={{ __html: getMensaje }}/>
                                {'---------------------------------------------------'}<br></br>
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
                
            </div>
            </div>
        </div>
        <div className='flex-auto'>
        </div>
    </div>
  )
}

export default Pension