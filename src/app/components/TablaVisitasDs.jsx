"use client"

import React, { useEffect, useState, useRef } from 'react'
import DataTable from 'react-data-table-component'
import { useRouter } from 'next/navigation'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'


function TablaVisitasDs() {
    const router = useRouter()
    const [tablaVisitasDs,  setTablaVisitaDs ] = useState(null)
    const data=[]
    const [records, setRecords] = useState([])
    const initialized = useRef(false)

   


    function irPagos(e){
        router.push(`/pago/${e}`)
    }

    async function getVisitantesDh(){
    //const getVisitantesDh = async () => {
        try{
            
            if(typeof window !== 'undefined'){
                const token = window.sessionStorage.getItem('token')
                if(!token){
                  router.push('/')
                }else{
                   
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/vehiculosparq-dh/`, {
                        method: 'GET',
                        headers:{
                        "Authorization" : `Token ${token}`,
                        }
                    })

                    //console.log(response)

                    //if(response){
                        const tablaVisitasDs  = await response.json()
                        //console.log(JSON.stringify(tablaVisitasDs))
                                              
                       // if (tablaVisitasDs) setTablaVisitaDs(tablaVisitasDs)
                        setTablaVisitaDs(tablaVisitasDs)
                        //console.log(tablaVisitasDs.VehiculosParqueaderoDh[0][1].pl_placa)
                        
                        //console.log(tablaVisitasDs.VehiculosParqueaderoDh)
                        for(let i=0; i < tablaVisitasDs.VehiculosParqueaderoDh.length; i++ ){
                            //console.log(tablaVisitasDs.VehiculosParqueaderoDh[i][1].pl_placa)
                            //console.log(tablaVisitasDs.VehiculosParqueaderoDh[i][1].vh_tipo)
                            const id_registro = '"id":"'+tablaVisitasDs.VehiculosParqueaderoDh[i][1].id+'"'
                            //console.log(id_registro)
                            const pl_placa = '"pl_placa":"'+tablaVisitasDs.VehiculosParqueaderoDh[i][1].pl_placa+'",'
                            const vh_tipo_data = tablaVisitasDs.VehiculosParqueaderoDh[i][1].vh_tipo
                            let vh_tipo = ""
                                if(vh_tipo_data == 1){
                                    vh_tipo = '"vh_tipo":"Carro",'
                                }else if(vh_tipo_data == 2){
                                    vh_tipo = '"vh_tipo":"Moto",'
                                }
                            const pk_slot = '"pk_slot":"'+tablaVisitasDs.VehiculosParqueaderoDh[i][1].pk_slot+'",'
                            const vi_fecha_hora_ingreso = '"vi_fecha_hora_ingreso":"'+tablaVisitasDs.VehiculosParqueaderoDh[i][1].vi_fecha_hora_ingreso+'",'
                            const vd_nombre = '"vd_nombre":"'+tablaVisitasDs.VehiculosParqueaderoDh[i][3].vd_nombre+'",'
                            const ph_propietario = '"ph_propietario":"'+tablaVisitasDs.VehiculosParqueaderoDh[i][4].ph_propietario+'",'
                            //const linkPago = '"link":"Pago"'
                            const dataArray = JSON.parse('{'+pl_placa+vh_tipo+pk_slot+vi_fecha_hora_ingreso+vd_nombre+ph_propietario+id_registro+'}')
                            data.push(dataArray)
                            
                        }
                        //console.log(data)
                        setRecords(data)                          
                         
                    //}
                }
            }
        }catch(error){
            console.log(error)
        }
    }

    const columns = [
        {
            name: "Placa Vehículo",
            grow: 2,
            selector: row => row.pl_placa
        },
        {
            name: "Vehículo",
            selector: row => row.vh_tipo
        },
        {
            name: "Slot",
            selector: row => row.pk_slot
        },
        {
            name: "Fecha",
            selector: row => row.vi_fecha_hora_ingreso.replace("T"," "),
            wrap: true
        },
        {
            name: "Visitante",
            selector: row => row.vd_nombre,
            wrap: true
        },
        {
            name: "Residente",
            selector: row => row.ph_propietario,
            wrap: true
        },
        {
            name: "Ir a Pago",
            cell:(row) => <button onClick={(e) => irPagos(e.target.value)} value={row.pl_placa} 
                            className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-1.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
                          >Salida</button>,
                ignoreRowClick: true,
                allowOverflow: true,
                button: true,
        }
    ]

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
    };

//-----------------------------------------------------------------------
    function onFilter(e){
        //console.log(e.target.value)

        const placaFilter = e.target.value

            if(placaFilter != ''){
                const filteredItems = records.filter(
                    item => item.pl_placa.toUpperCase().includes(placaFilter.toUpperCase()),
                )
                //console.log(filteredItems)
                setRecords(filteredItems)
            }else{  
               getVisitantesDh()
            }
    }
    const inputPlaca = useRef(null);

    function borrar(){
        inputPlaca.current.value=""
        getVisitantesDh()
    }

//-----------------------------------------------------------------------


    useEffect(() => {
        if(!initialized.current) {
            nProgress.start()
                initialized.current = true
                getVisitantesDh()
            nProgress.done()
        }
    },[])


  return (
    <div className="p-4 sm:ml-64">
        <div className='min-w-80 grid gap-4 sm:grid-cols-2 grid-cols-1'> 
            <input type="text"
                ref={inputPlaca}
                onChange={e => onFilter(e)} 
                className='pl-2 appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm'
                placeholder='Placa del Vehículo'
                style={{textTransform: 'uppercase'}}
                maxLength={3}
            ></input>
            <button onClick={ (e) => borrar()}
                className='pl-2 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-1.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800' 
            >X</button>
        </div>
       
        <DataTable 
            columns={columns}
            data={records}
            pagination
            paginationComponentOptions={paginationComponentOptions}
            subHeader
            
        />
    </div>
  )
}

export default TablaVisitasDs