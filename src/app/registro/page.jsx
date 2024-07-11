"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '../components/NavBar'
import { useEffect, useState, useRef } from 'react'
import Select from "react-dropdown-select"
import { useReactToPrint } from "react-to-print";
import InputMask from "react-input-mask";
import Modal from 'react-modal';
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

function Registro() {
  const router = useRouter()
  const [getActionActive1, setActionActive1] = useState([])
  const [getBorderActive1, setBorderActive1] = useState([])
  const [getActionActive2, setActionActive2] = useState([])
  const [getBorderActive2, setBorderActive2] = useState([])
  const [getActionActive3, setActionActive3] = useState([])
  const [getBorderActive3, setBorderActive3] = useState([])
  const [getActionActive4, setActionActive4] = useState([])
  const [getBorderActive4, setBorderActive4] = useState([])

  const [getImpresoraStatus, setImpresoraStatus] = useState(false)
  const [getConjuntoInfo, setConjuntoInfo] = useState([])

  const [getTipoPlacaVehiculo, setTipoPlacaVehiculo] = useState([])
  const [getInfoPlacaVehiculo, setInfoPlacaVehiculo] = useState([])
  const [getInfoCedulaVisitante, setInfoCedulaVisitante] = useState([])

  const [getTorres, setTorres] = useState([])
  const [getApto, setApto] = useState([])
  const [getResidente, setResidente] = useState([])
  const initialized = useRef(false)
  const componentRef = useRef();

  const dataTorresList=[]
  const dataAptosList=[]

  const [getTorreList, setTorreList] = useState([])
  const [getAptoList, setAptoList] = useState([])

  const [getPlacaVehiculo, setPlacaVehiculo] = useState([])
  const [getCedulaVisita, setCedulaVisita] = useState([])
  const [getTelVisita, setTelVisita] = useState([])
  const [getNomVisita, setNomVisita] = useState([])
  const [getdataIngreso, setdataIngreso] = useState([])

  const [modalIsOpen, setIsOpen] = React.useState(false); //Placa
  const [modalIsOpenCedula, setIsOpenCedula] = React.useState(false); //Cedula

  const [getbtnSiguienteResidente, setbtnSiguienteResidente] = useState(true)
  const [getbtnSiguienteVisitante, setbtnSiguienteVisitante] = useState(true)
  const [getbtnFinalizar, setbtnFinalizar] = useState(true)
  const [getbtnNuevaBusqueda, setbtnNuevaBusqueda] = useState(true)

  const [getStatusTorres, setStatusTorres] = useState(false)
  const [getStatusAptos, setStatusAptos] = useState(false)
  const [getStatusLoadigAptosTorres, setStatusLoadigAptosTorres] = useState(true)


  const [getTipoVehiculo, setTipoVehiculo] = useState([])
  const [getSlotVisita, setSlotVisita] = useState([])
  const [getFechaHoraIngresoVisita, setFechaHoraIngresoVisita] = useState([])
  const [getResidenteData, setResidenteData] = useState([])
  const [getVisitanteData, setVisitanteData] = useState([])
  const [getAptoResidente, setAptoResidente] = useState([])
  const [getMensaje, setMensaje] = useState([])
  
  

  if(typeof window !== 'undefined'){
    const token = window.sessionStorage.getItem('token')  //window.sessionStorage.getItem('token')
    if(!token){
      router.push('/')
    }
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
      //console.log(dataConjuntoInfo)
      setMensaje(dataConjuntoInfo.cj_msn.match(/.{1,35}/g).join("<br />"))   
      setConjuntoInfo(dataConjuntoInfo)
    }
  }

  const getAptos= async () => { 
    const token = window.sessionStorage.getItem('token') 
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/apartamentoscasas-buscar/`, {
      method: 'GET',
      headers:{
        "Authorization" : `Token ${token}`,
      }
    })

    if (response){
      const dataTorres = await response.json()
      //setApto(dataTorres)
      //console.log(dataTorres.Torres)

      for(let i = 0; i < dataTorres.Torres.length; i++){
        //console.log(dataTorres.Torres[i].tr_torre)

        const tr_torre = '{"tr_torre":'+dataTorres.Torres[i].tr_torre+'}'
        const dataArrayTorres = JSON.parse(tr_torre)
        dataTorresList.push(dataArrayTorres)
      }

      setTorres(dataTorresList)

      for(let i = 0; i < dataTorres.ApartamentosCasas.length; i++){
        //console.log(dataTorres.ApartamentosCasas[i].ph_apartamentocasa)
        const ph_apartamentocasa = '{"ph_apartamentocasa":'+dataTorres.ApartamentosCasas[i].ph_apartamentocasa+'}'
        const dataArrayAptos = JSON.parse(ph_apartamentocasa)
        dataAptosList.push(dataArrayAptos)
      }

      setApto(dataAptosList)
    }
  }

  //Step 1
  function TipoVheiculo(tipo){
    document.getElementById("step-1").style.display="none"
    window.sessionStorage.setItem('vh_tipo', tipo);
    document.getElementById("step-2").style.visibility="visible"

    const actionActive = "text-blue-600 dark:text-blue-500"
    const border2 = "border-blue-600 rounded-full shrink-0 dark:border-blue-500"
    setBorderActive2(border2)
    setActionActive2(actionActive)

    const actionInactive = "text-gray-500 dark:text-gray-400"
    const border1 = "border-gray-500 rounded-full shrink-0 dark:border-gray-400"
    setActionActive1(actionInactive)
    setBorderActive1(border1)

    if(tipo == 1){
      const maskTipoVehiculo = "aaa-999"
      setTipoPlacaVehiculo(maskTipoVehiculo)
    }else if(tipo == 2){
      const maskTipoVehiculo = "aaa-99a"
      setTipoPlacaVehiculo(maskTipoVehiculo)
    }

  }

  //Step 2
  const getPropietarios= async () => { 
    const token = window.sessionStorage.getItem('token') 
    const getTorreListProp = getTorreList[0].tr_torre
    const getAptoListProp = getAptoList[0].ph_apartamentocasa
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/apartamentos-buscar/?torre=${getTorreListProp}&apto=${getAptoListProp}`, {
      method: 'GET',
      headers:{
        "Authorization" : `Token ${token}`,
      }
    })

    const dataResidentes = await response.json()

    //console.log(dataResidentes)
    const textResidente = dataResidentes.Propietario 
    //Set idPropietario
    window.sessionStorage.setItem('idPropietario', dataResidentes.Propietario.id);
    //console.log(dataResidentes.Propietario)
    setResidenteData('Residente:'+dataResidentes.Propietario.ph_propietario)
    setAptoResidente('Apto:'+dataResidentes.Propietario.ph_torre+'-'+dataResidentes.Propietario.ph_apartamento)
    setbtnSiguienteResidente(false)
    setResidente(textResidente)    
    setStatusTorres(true)
    setStatusAptos(true)
    setbtnNuevaBusqueda(false)
    setStatusLoadigAptosTorres(false)
  }

  function nuevaBusqueda(){
    setStatusTorres(false)
    setStatusAptos(false)
    setbtnNuevaBusqueda(true)
    setStatusLoadigAptosTorres(true)
    setbtnSiguienteResidente(true)
  }

  
  function nextBuscarVehiculo(){
    const idPropietarioExist = window.sessionStorage.getItem('idPropietario')

    if(idPropietarioExist > 0){
      const actionActive = "text-gray-500 dark:text-gray-400"
      const border = "border-gray-500 rounded-full shrink-0 dark:border-gray-400"
      setBorderActive2(border)
      setActionActive2(actionActive)

      const actionInactive1 = "text-gray-500 dark:text-gray-400"
      const border1 = "border-gray-500 rounded-full shrink-0 dark:border-gray-400"
      setActionActive1(actionInactive1)
      setBorderActive1(border1)

      const actionInactive3 = "text-blue-600 dark:text-blue-500"
      const border3 = "border-blue-600 rounded-full shrink-0 dark:border-blue-500"
      setActionActive3(actionInactive3)
      setBorderActive3(border3)

      document.getElementById("step-2").style.display="none"
      document.getElementById("step-3").style.visibility="visible"

    }else{
      document.getElementById("errorTorreApto").style.visibility="visible"
    }
  }

  //Step 3
  //Buscar Placa de Vehiculo
  /*
  Modal.setAppElement('#placaModal');
  Modal.setAppElement('#cedulaModal');
  Modal.setAppElement('#ticketImpresora');
*/
  const customStyles = {
    content: {
      top: '50%',
      left: '63%',
      right: 'auto',
      bottom: 'auto',
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

  function closeModal() {
    setIsOpen(false);
  }

  function closeModalCedula() {
    setIsOpenCedula(false);
  }

  function getPlacaVheiculo(e){
    const placaVehiculo = e.target.value
    setPlacaVehiculo(placaVehiculo)
  }

  function getCedulaVisitante(e){
    const cedulaVisitante = e.target.value
    setCedulaVisita(cedulaVisitante)
  }

  function getNombreVisitante(e){
    const nombreVisita = e.target.value.replace(/[^a-zA-Z\s]*$/gi, '')
    //console.log(nombreVisita)
    setNomVisita(nombreVisita)
  }

  function getTelVisitante(e){
    const telVisitante = e.target.value
    setTelVisita(telVisitante)
  }

  //Asignacion de Slot para Parqueadero
  const SlotParqueadero = async () => { 
    const token = window.sessionStorage.getItem('token')
    const gettipovehiculo = window.sessionStorage.getItem('vh_tipo');
    let tipoVehiculoSlot=""
    if(gettipovehiculo == 1){
      tipoVehiculoSlot = "Carro" 
    }else if(gettipovehiculo == 2){
      tipoVehiculoSlot = "Moto"
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/parqueaderovisita-disponible/?disponible=True&tipovehiculo=${tipoVehiculoSlot}`, {
      method: 'GET',
      headers:{
        "Authorization" : `Token ${token}`,
      }
    })

    const dataSlot = await response.json()
    const totalSlot = dataSlot.ParqueaderosDisponibles.length
    if(totalSlot > 0){
      window.sessionStorage.setItem('pk_slot',dataSlot.ParqueaderosDisponibles[0].pk_slot)
      setTipoVehiculo('Ingreso:'+tipoVehiculoSlot)
      setSlotVisita('Slot:'+dataSlot.ParqueaderosDisponibles[0].pk_slot)
      //console.log(dataSlot.ParqueaderosDisponibles[0].pk_slot)
    }else{
      setInfoPlacaVehiculo("Sin Slots de Parqueaderos")
    }
  }

  //Busca Placa del Vehiculo
  const PlacaVheiculo= async () => { 
    const token = window.sessionStorage.getItem('token')
    const placa = getPlacaVehiculo.toUpperCase()
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/placavisita-buscar/?placa=${placa}`, {
      method: 'GET',
      headers:{
        "Authorization" : `Token ${token}`,
      }
    })
    //console.log(getPlacaVehiculo)
    const dataPlacaVehiculo = await response.json()
    //console.log(dataPlacaVehiculo)
    if(dataPlacaVehiculo.Message == "Success"){
      SlotParqueadero()
      window.sessionStorage.setItem('pl_placa', dataPlacaVehiculo.Placa.pl_placa);
      setInfoPlacaVehiculo(dataPlacaVehiculo.Placa.pl_placa)
    }else{
      setInfoPlacaVehiculo(dataPlacaVehiculo.Message)
      setIsOpen(true);
    }
  }
  //Step 3 Modal Nueva Placa
  const nuevaPlacaVehiculo = async () =>{
    const token = window.sessionStorage.getItem('token')
    const placa = getPlacaVehiculo.toUpperCase()
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/placavisita-registro/`, {
      method: 'POST',
      body: JSON.stringify({'pl_placa': placa}),
      headers:{
        "Content-Type":"application/json",
        "Authorization" : `Token ${token}`,
      }
    })

    const dataNuevaPlacaVehiculo = await response.json()

    if(dataNuevaPlacaVehiculo.Message == "Success"){
      SlotParqueadero()
      window.sessionStorage.setItem('pl_placa', dataNuevaPlacaVehiculo.Placa.pl_placa);
      setInfoPlacaVehiculo(placa)
      closeModal()
    }else{
      setInfoPlacaVehiculo(dataNuevaPlacaVehiculo.Detail.pl_placa)
      setPlacaVehiculo('')
      closeModal()
    }
  }

  //Buscar Cedula Visitante
  const CedulaVisitante= async () => { 
    //console.log(getCedulaVisita.replace(/_/gi, ""))
    const token = window.sessionStorage.getItem('token')
    const cedula = getCedulaVisita.replace(/_/gi, "")
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/cedulavisita-buscar/?cedula=${cedula}`, {
      method: 'GET',
      headers:{
        "Authorization" : `Token ${token}`,
      }
    })
    //console.log(getPlacaVehiculo)
    const dataCedulaVisitante = await response.json()
    //console.log(dataCedulaVisitante)
    if(dataCedulaVisitante.Message == "Success"){
      window.sessionStorage.setItem('vd_cedula', dataCedulaVisitante.CedulaVisitante.vd_cedula);
      window.sessionStorage.setItem('vd_nombre', dataCedulaVisitante.CedulaVisitante.vd_nombre);
      window.sessionStorage.setItem('vd_telefono', dataCedulaVisitante.CedulaVisitante.vd_telefono);
      setInfoCedulaVisitante(dataCedulaVisitante.CedulaVisitante.vd_nombre)
      ingresoCedulaVisitante()
      let OfsCedula = dataCedulaVisitante.CedulaVisitante.vd_cedula
      setVisitanteData('Visitante:'+dataCedulaVisitante.CedulaVisitante.vd_nombre+' '+'Cedula:'+OfsCedula.toString().substring(OfsCedula.length,5)+'***')
      setbtnSiguienteVisitante(false)
    }else{
      setInfoCedulaVisitante(dataCedulaVisitante.Message)
      setIsOpenCedula(true);
    }
  }
  //Registro Cedula Visita
  const ingresoCedulaVisitante = async () => {
    const token = window.sessionStorage.getItem('token')
    const cedula = window.sessionStorage.getItem('vd_cedula')
    const nombre = window.sessionStorage.getItem('vd_nombre')
    const tel = window.sessionStorage.getItem('vd_telefono')
    const ph_propietario = window.sessionStorage.getItem('idPropietario')
    const pl_placa = window.sessionStorage.getItem('pl_placa')
    const pk_slot = window.sessionStorage.getItem('pk_slot')

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/personavisita-registro/`, {
      method: 'PUT',
      body: JSON.stringify({'vd_cedula': cedula, 'ph_propietario': ph_propietario, 'pl_placa': pl_placa, 'pk_slot': pk_slot}),
      headers:{
        "Content-Type":"application/json",
        "Authorization" : `Token ${token}`,
      }
    })

    const dataCedulaVisitante = await response.json()
  }

  // Registro Nuevo Visitante
  const nuevoCedulaVisita = async () => {
    const token = window.sessionStorage.getItem('token')
    const cedula = getCedulaVisita.replace(/_/gi, "")
    const nombre = getNomVisita.toUpperCase()
    const tel = getTelVisita
    const ph_propietario = window.sessionStorage.getItem('idPropietario')
    const pl_placa = window.sessionStorage.getItem('pl_placa')
    const pk_slot = window.sessionStorage.getItem('pk_slot')

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/personavisita-registro/`, {
      method: 'POST',
      body: JSON.stringify({'vd_nombre': nombre, 'vd_cedula': cedula, 'vd_telefono': tel, 'ph_propietario': ph_propietario, 'pl_placa': pl_placa, 'pk_slot': pk_slot}),
      headers:{
        "Content-Type":"application/json",
        "Authorization" : `Token ${token}`,
      }
    })

    const dataCedulaVisitante = await response.json()
    //console.log(dataCedulaVisitante)
    if(dataCedulaVisitante.Message == "Success"){
      window.sessionStorage.setItem('vd_cedula', dataCedulaVisitante.Visitante.vd_cedula);
      setInfoCedulaVisitante(dataCedulaVisitante.Visitante.vd_nombre)
      setVisitanteData('Visitante:'+dataCedulaVisitante.Visitante.vd_nombre+' '+'Cedula:'+dataCedulaVisitante.Visitante.vd_cedula)
      setbtnSiguienteVisitante(false)
      closeModalCedula()
    }else{
      setInfoCedulaVisitante(dataCedulaVisitante.Detail.vd_cedula)
      setCedulaVisita('')
      closeModalCedula()
    }
  }


  //Step 4 Ingreso
  function registroIngreso(){
    const actionActive = "text-gray-500 dark:text-gray-400"
    const border = "border-gray-500 rounded-full shrink-0 dark:border-gray-400"
    setBorderActive2(border)
    setActionActive2(actionActive)

    const actionInactive1 = "text-gray-500 dark:text-gray-400"
    const border1 = "border-gray-500 rounded-full shrink-0 dark:border-gray-400"
    setActionActive1(actionInactive1)
    setBorderActive1(border1)

    const actionInactive3 = "text-gray-500 dark:text-gray-400"
    const border3 = "border-gray-500 rounded-full shrink-0 dark:border-gray-400"
    setActionActive3(actionInactive3)
    setBorderActive3(border3)

    const actionInactive4 = "text-blue-600 dark:text-blue-500"
    const border4 = "border-blue-600 rounded-full shrink-0 dark:border-blue-500"
    setActionActive4(actionInactive4)
    setBorderActive4(border4)

    document.getElementById("step-3").style.display="none"
    document.getElementById("step-4").style.visibility="visible"

    ingresoFechaHora()
  }

  const ingresoFechaHora = async () => {
    const token = window.sessionStorage.getItem('token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/datetime-info/`, {
      method: 'GET',
      headers:{
        "Authorization" : `Token ${token}`,
      }
    })

    const ingreso = await response.json()
    window.sessionStorage.setItem('f_ingreso', ingreso.FechaHoraIngreso)
    setFechaHoraIngresoVisita(ingreso.FechaHoraIngreso)
    registroIngresoVisitanteVehiculo()

  }

  const registroIngresoVisitanteVehiculo = async () => {
    nProgress.start()
      const token = window.sessionStorage.getItem('token')
      const vi_fecha_hora_ingreso = window.sessionStorage.getItem('f_ingreso')
      const pl_placa = window.sessionStorage.getItem('pl_placa')
      const vh_tipo = window.sessionStorage.getItem('vh_tipo')
      const pk_slot = window.sessionStorage.getItem('pk_slot')

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/vehiculovisita-ingreso/`, {
        method: 'POST',
        body: JSON.stringify({'vi_fecha_hora_ingreso': vi_fecha_hora_ingreso, 'pl_placa': pl_placa, 'vh_tipo': vh_tipo, 'pk_slot': pk_slot, 'pk_status' : false}),
        headers:{
          "Content-Type":"application/json",
          "Authorization" : `Token ${token}`,
        }
      })

      const dataIngreso = await response.json()
      //console.log(dataIngreso.Ingreso)

      //Enviar email
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/vehiculovisita-info/?placa=${pl_placa}&status=1`, {
        method: 'GET',
        headers:{
          "Authorization" : `Token ${token}`,
        }
      })

      statusImpresora()
      setdataIngreso(dataIngreso.Ingreso)
      setbtnFinalizar(false)
    nProgress.done()
  }

  const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    }
  );
  
  function imprimirTicket(){
    handlePrint()
    setImpresoraStatus(false)
  }

//Finalizar
function finalizarRegistro(){
  window.sessionStorage.removeItem('idPropietario')
  window.sessionStorage.removeItem('vh_tipo')
  window.sessionStorage.removeItem('pl_placa')
  window.sessionStorage.removeItem('pk_slot')
  window.sessionStorage.removeItem('vd_cedula')
  window.sessionStorage.removeItem('f_ingreso')
  window.sessionStorage.removeItem('vd_nombre')
  window.sessionStorage.removeItem('vd_telefono')
  
  router.push('/dashboard')
        
}



  useEffect(() => {
    if(!initialized.current) {
      nProgress.start()
        initialized.current = true
        
          getAptos()
          
          
          //getResidentes()
          window.sessionStorage.removeItem('idPropietario')
          window.sessionStorage.removeItem('vh_tipo')
          window.sessionStorage.removeItem('pl_placa')
          window.sessionStorage.removeItem('pk_slot')
          window.sessionStorage.removeItem('vd_cedula')
          window.sessionStorage.removeItem('f_ingreso')
          window.sessionStorage.removeItem('vd_nombre')
          window.sessionStorage.removeItem('vd_telefono')

          document.getElementById("step-2").style.visibility="hidden" 
          document.getElementById("errorTorreApto").style.visibility="hidden" 

          document.getElementById("step-3").style.visibility="hidden" 
          document.getElementById("step-4").style.visibility="hidden" 

          const action1 = "text-blue-600 dark:text-blue-500"
          const border1 = "border-blue-600 rounded-full shrink-0 dark:border-blue-500"
          const action2 = "text-gray-500 dark:text-gray-400"
          const border2 = "border-gray-500 rounded-full shrink-0 dark:border-gray-400"
          const action3 = "text-gray-500 dark:text-gray-400"
          const border3 = "border-gray-500 rounded-full shrink-0 dark:border-gray-400"
          const action4 = "text-gray-500 dark:text-gray-400"
          const border4 = "border-gray-500 rounded-full shrink-0 dark:border-gray-400"
          setActionActive1(action1)
          setBorderActive1(border1)
          setActionActive2(action2)
          setBorderActive2(border2)
          setActionActive3(action3)
          setBorderActive3(border3)
          setActionActive4(action4)
          setBorderActive4(border4)

          setbtnSiguienteResidente(true)
          setbtnSiguienteVisitante(true)
          setbtnFinalizar(true)
          setbtnNuevaBusqueda(true)
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
                <ol className="items-center w-full space-y-4 m-6 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
                    <li className={`flex items-center ${getActionActive1}  space-x-2.5 rtl:space-x-reverse`}>
                        <span className={`flex items-center justify-center w-8 h-8 border ${getBorderActive1}`}>
                            1
                        </span>
                        <span>
                            <h3 className="font-medium leading-tight">Vehículo</h3>
                          
                        </span>
                    </li>
                    <li className={`flex items-center ${getActionActive2} space-x-2.5 rtl:space-x-reverse`}>
                        <span className={`flex items-center justify-center w-8 h-8 border ${getBorderActive2}`}>
                            2
                        </span>
                        <span>
                            <h3 className="font-medium leading-tight">Residente</h3>
                            
                        </span>
                    </li>
                    <li className={`flex items-center ${getActionActive3} space-x-2.5 rtl:space-x-reverse`}>
                        <span className={`flex items-center justify-center w-8 h-8 border ${getBorderActive3} `}>
                            3
                        </span>
                        <span>
                            <h3 className="font-medium leading-tight">Visitante</h3>
                        </span>
                    </li>
                    <li className={`flex items-center ${getActionActive4} space-x-2.5 rtl:space-x-reverse`}>
                        <span className={`flex items-center justify-center w-8 h-8 border ${getBorderActive4} `}>
                            4
                        </span>
                        <span>
                            <h3 className="font-medium leading-tight">Ingreso</h3>
                        </span>
                    </li>
                </ol>
              


                <div id="step-1" className='m-6 grid gap-4 sm:grid-cols-2 grid-cols-1'>
                    <div className='min-h-[100px] rounded-lg text-gray-500 bg-white shadow dark:text-gray-400 dark:bg-gray-800" '>
                      <div className='m-6 grid gap-4 sm:grid-cols-1 grid-cols-1'>
                            <button className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
                              onClick={(e) => TipoVheiculo(1)}>Carro</button>
                      </div>
                    </div>
                    
                    <div className="min-h-[100px] rounded-lg text-gray-500 bg-white shadow dark:text-gray-400 dark:bg-gray-800">
                      <div className='m-6 grid gap-4 sm:grid-cols-1 grid-cols-1'>
                          <button className='focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900'
                          onClick={(e) => TipoVheiculo(2)}>Moto</button>
                      </div>
                    </div>
                </div>

                <div id="step-2">
                  <div className='m-6 grid gap-4 sm:grid-cols-2 grid-cols-1'>
                    <Select options={getTorres} placeholder="Torres" labelField='tr_torre' valueField='tr_torre' onChange={getTorreList => setTorreList(getTorreList)}
                    loading={getStatusLoadigAptosTorres} disabled={getStatusTorres}/>
                    <Select options={getApto} placeholder="Apartamentos" labelField='ph_apartamentocasa' valueField='ph_apartamentocasa' onChange={getAptoList => setAptoList(getAptoList)}
                    loading={getStatusLoadigAptosTorres} disabled={getStatusAptos}/>
                  </div>
                  
                  <div className="min-h-[100px] rounded-lg text-gray-500 bg-white shadow dark:text-gray-400 dark:bg-gray-800 sm:grid-cols-12 grid-cols-12">
                    <div className='pt-8 flex items-center w-full justify-center'>
                      <div className="ms-3 text-xl font-normal"><h1><b>{getResidente.ph_propietario}</b></h1> 
                        <p>Tel: <b>{getResidente.ph_telefono}</b></p>
                        <p>Email: {getResidente.ph_mail}</p>
                        <p>Torre: <b>{getResidente.ph_torre}</b> Apto: <b>{getResidente.ph_apartamento}</b> </p>
                      </div>
                    </div>
                  </div>

                  <div className='m-6 grid gap-4 sm:grid-cols-3 grid-cols-1'>
                  <button className='focus:outline-none text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800' 
                      onClick={(e) => nuevaBusqueda()} disabled={getbtnNuevaBusqueda}>Nueva Busqueda</button>
                    <button className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800' 
                      onClick={(e) => getPropietarios()}>Buscar Propietario</button>
                    <button className='focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800' 
                      onClick={(e) => nextBuscarVehiculo()} disabled={getbtnSiguienteResidente}  >Siguiente</button>
                  </div>

                  <div id="errorTorreApto" className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert"> 
                    <span className="font-medium">Error!</span> Selecciones una Torre/Apartamento. 
                  </div>
                </div>


                <div id="step-3">
                  <div className='m-6 grid gap-4 sm:grid-cols-2 grid-cols-2'> 
                      <p className='text-gray-500 bg-white dark:text-gray-400 dark:bg-gray-800'>Placa Vehículo</p>
                      <InputMask mask={getTipoPlacaVehiculo} id="placaVehiculo" onChange={(e) => getPlacaVheiculo(e)} 
                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" style={{textTransform: 'uppercase'}}/>
                  </div>
                  <div className='m-6 grid gap-4 sm:grid-cols-2 grid-cols-2'> 
                    <button className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800' 
                      onClick={(e) => PlacaVheiculo()}>Buscar Placa</button>
                    <p></p>
                  </div>

                  <div className="min-h-[100px] rounded-lg text-gray-500 bg-white shadow dark:text-gray-400 dark:bg-gray-800 sm:grid-cols-12 grid-cols-12">
                    <div className='pt-8 flex items-center w-full justify-center'>
                      <div className="ms-3 text-xl font-normal">
                          <h1>{getInfoPlacaVehiculo}</h1> 
                      </div>
                    </div>
                  </div>

                  <div className='m-6 grid gap-4 sm:grid-cols-2 grid-cols-2'> 
                      <p className='text-gray-500 bg-white dark:text-gray-400 dark:bg-gray-800'>Cédula Visitante</p>
                      <InputMask mask="99999999999"  onChange={(e) => getCedulaVisitante(e)} 
                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                  </div>
                  <div className='m-6 grid gap-4 sm:grid-cols-2 grid-cols-2'> 
                      <button className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800' 
                        onClick={(e) => CedulaVisitante()}>Buscar Cedula</button>
                      
                  </div>
                  <div className="min-h-[100px] rounded-lg text-gray-500 bg-white shadow dark:text-gray-400 dark:bg-gray-800 sm:grid-cols-12 grid-cols-12">
                      <div className='pt-8 flex items-center w-full justify-center'>
                        <div className="ms-3 text-xl font-normal">
                            <h1>{getInfoCedulaVisitante}</h1> 
                        </div>
                      </div>
                  </div>
                  <div className='m-6 grid gap-4 sm:grid-cols-2 grid-cols-2'> 
                      <p></p>
                      <button className='focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800' 
                        onClick={(e) => registroIngreso()} disabled={getbtnSiguienteVisitante}>Siguiente</button>
                  </div>
                </div>

                <div id="step-4">
                  <div className="min-h-[100px] rounded-lg text-gray-500 bg-white shadow dark:text-gray-400 dark:bg-gray-800 sm:grid-cols-12 grid-cols-12">
                    <div className='pt-8 flex items-center w-full justify-center'>
                      <div className="ms-3 text-xl font-normal">
                        <h1>Registro de Ingreso</h1>
                        <p>Placa: <b>{getdataIngreso.pl_placa}</b></p>
                        <p>Fecha y Hora: <b>{getdataIngreso.vi_fecha_hora_ingreso}</b></p>
                        <p>Slot: <b>{getdataIngreso.pk_slot}</b></p>
                      </div>
                    </div>
                    <div className='m-6 grid gap-4 sm:grid-cols-2 grid-cols-2'> 
                      <p></p>
                      <button className='focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800' 
                        onClick={e => finalizarRegistro()} disabled={getbtnFinalizar}>Finalizar</button>
                    </div>
                  </div>

                </div>

                <div id='placaModal'>
                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Placa Vehículo"
                  >
                    <h2>Registro Nueva Placa</h2>
                    <div className='m-6 grid gap-4 sm:grid-cols-2 grid-cols-2'> 
                      <p className='text-gray-500 bg-white dark:text-gray-400 dark:bg-gray-800'>Nueva Placa Vehículo</p>
                      <InputMask mask={getTipoPlacaVehiculo} onChange={(e) => getPlacaVheiculo(e)} 
                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" style={{textTransform: 'uppercase'}}/>
                    </div>
                    <div className='m-6 grid gap-4 sm:grid-cols-2 grid-cols-2'> 
                      <button onClick={closeModal} className='focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
                          Cerrar
                      </button>
                      <button className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800' 
                        onClick={(e) => nuevaPlacaVehiculo()}>
                          Registrar Placa
                      </button>
                    </div>
                  </Modal>
                </div>

                <div id='cedulaModal'>
                  <Modal
                    isOpen={modalIsOpenCedula}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Cédula Visitante"
                  >
                    <h2>Registro Cédula Visitante</h2>
                    <div className='m-6 grid gap-4 sm:grid-cols-2 grid-cols-2'> 
                      <p className='text-gray-500 bg-white dark:text-gray-400 dark:bg-gray-800'>Cédula Visitante</p>
                      <InputMask mask="99999999999" onChange={(e) => getCedulaVisitante(e)} 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                      <p className='text-gray-500 bg-white dark:text-gray-400 dark:bg-gray-800'>Nombre Visitante</p>
                      <input type='text' onChange={e => getNombreVisitante(e)} required className='mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm' style={{textTransform: 'uppercase'}}/>
                      
                      <p className='text-gray-500 bg-white dark:text-gray-400 dark:bg-gray-800'>Teléfono Visitante</p>
                      <InputMask mask="999-999-9999" onChange={(e) => getTelVisitante(e)} 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                      
                      
                    <div className='m-6 grid gap-4 sm:grid-cols-2 grid-cols-2'> 
                      <button onClick={closeModalCedula} className='focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
                          Cerrar
                      </button>
                      <button className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800' 
                        onClick={(e) => nuevoCedulaVisita()}>
                          Registrar Visitante
                      </button>
                    </div>
                  </Modal>
                </div>

                <div id='ticketImpresora'>
                  <Modal
                    isOpen={getImpresoraStatus}
                    onRequestClose={closeModal}
                    style={customStylesTicket}
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
                        {getFechaHoraIngresoVisita}<br></br>
                        {getTipoVehiculo+' Placa:'+getInfoPlacaVehiculo}<br></br>
                        {getSlotVisita}<br></br>
                        {getVisitanteData}<br></br>
                        {getResidenteData+' '+getAptoResidente}<br></br>
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
    </div>
  )
}

export default Registro