"use client"

import React, { useEffect, useState, useRef } from 'react'
import DataTable from 'react-data-table-component'
import { useRouter } from 'next/navigation'
import { format } from "date-fns";
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

function TablaPensionDs() {
    const initialized = useRef(false)
    const data=[]
    const [getDataTablePension, setDataTablePension] = useState([])

    async function getDataPension(){
        nProgress.start()
            try{
                const token = window.sessionStorage.getItem('token')
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/pension/`, {
                    method: 'GET',
                    headers:{
                        "Authorization" : `Token ${token}`,
                    }
                })

                const dataResponse = await response.json()

                for(let i=0; i < dataResponse.Pension.length; i++){
                    const date = new Date()
                    if(format(date, 'yyyy-MM-dd') > format(dataResponse.Pension[i].pe_fecha_fin, 'yyyy-MM-dd')){
                        console.log(dataResponse.Pension[i].pe_id)
                        console.log(dataResponse.Pension[i].pe_placa)
                        console.log(dataResponse.Pension[i].pe_slot)

                        const token = window.sessionStorage.getItem('token')
                        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/pension-status/${dataResponse.Pension[i].pe_id}/`, {
                            method: 'PUT',
                            body: JSON.stringify(
                                {    
                                    "pe_placa":dataResponse.Pension[i].pe_placa,
                                    "pe_status": false
                                }
                            ),
                            headers:{
                                "Content-Type":"application/json",
                                "Authorization" : `Token ${token}`,
                            }
                        })

                        const dataStatus = await response.json()
                        console.log(dataStatus)

                        const responseSlot = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/parqueaderovisita-actdisponible/${dataResponse.Pension[i].pe_slot}/`, {
                            method: 'PUT',
                            body: JSON.stringify(
                                {    
                                    "pk_slot":dataResponse.Pension[i].pe_slot,
                                    "pk_status":true   
                                }
                            ),
                            headers:{
                                "Content-Type":"application/json",
                                "Authorization" : `Token ${token}`,
                            }
                        })

                        const dataSlot = await responseSlot.json()
                        console.log(dataSlot)

                    }

                }

                try{
                    //statusPension()
                    const token = window.sessionStorage.getItem('token')
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/pension/`, {
                        method: 'GET',
                        headers:{
                            "Authorization" : `Token ${token}`,
                        }
                    })
        
                    const dataResponse = await response.json()
        
                    for(let i=0; i < dataResponse.Pension.length; i++){
        
                        const pe_placa = '"pe_placa":"'+dataResponse.Pension[i].pe_placa+'",'
                        const pe_nombre = '"pe_nombre":"'+dataResponse.Pension[i].pe_nombre+'",'
                        const pe_fecha_ini = '"pe_fecha_ini":"'+format(dataResponse.Pension[i].pe_fecha_ini, 'yyyy-MM-dd')+'",'
                        const pe_fecha_fin = '"pe_fecha_fin":"'+format(dataResponse.Pension[i].pe_fecha_fin, 'yyyy-MM-dd')+'",'
                        const pe_slot = '"pe_slot":"'+dataResponse.Pension[i].pe_slot+'",'
                        const pe_tipo_vehiculo = dataResponse.Pension[i].pe_tipo_vehiculo
                        let vh_tipo = ""
                            if(pe_tipo_vehiculo == 1){
                                vh_tipo = '"vh_tipo":"Carro"'
                            }else if(pe_tipo_vehiculo == 2){
                                vh_tipo = '"vh_tipo":"Moto"'
                            }
        
                        const dataArray = JSON.parse('{'+pe_placa+pe_nombre+pe_fecha_ini+pe_fecha_fin+pe_slot+vh_tipo+'}')
                        data.push(dataArray)
                    }
                    //console.log(data)
                    setDataTablePension(data)
                    
                }catch(error){
                    console.log(error)
                }

                
            }catch(error){
                console.log(error)
            }
        nProgress.done()
    }

    const columns = [
        {
            name: "Placa Vehículo",
            grow: 2,
            selector: row => row.pe_placa
        },
        {
            name: "Vehículo",
            selector: row => row.vh_tipo
        },
        {
            name: "Slot",
            selector: row => row.pe_slot
        },
        {
            name: "Nombre",
            selector: row => row.pe_nombre
        },
        {
            name: "Fecha Inicio",
            selector: row => row.pe_fecha_ini,
            wrap: true
        },
        {
            name: "Fecha Fin",
            selector: row => row.pe_fecha_fin,
            wrap: true
        }
    ]

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
    };

    const date = new Date()
    const dateMayor = new Date()
    const fecha = format(dateMayor.setDate(dateMayor.getDate() + 2), 'yyyy-MM-dd')
    //console.log(fecha)

    const conditionalRowStyles = [

        {
            when: row => row.pe_fecha_fin > format(date, 'yyyy-MM-dd'),
            style: {
                backgroundColor: 'rgba(63, 195, 128, 0.9)', //verde
                color: 'white',
                '&:hover': {
                    cursor: 'not-allowed',
                },
            },
        },

        {
            when: row => row.pe_fecha_fin > format(date, 'yyyy-MM-dd') && row.pe_fecha_fin <= fecha,
            style: {
                backgroundColor: 'rgba(248, 148, 6, 0.9)', //naranja
                color: 'white',
                '&:hover': {
                    cursor: 'not-allowed',
                },
            },
        },

        {
            when: row => row.pe_fecha_fin <= format(date, 'yyyy-MM-dd'),
            style: {
                backgroundColor: 'rgba(242, 38, 19, 0.9)', //rojo
                color: 'white',
                '&:hover': {
                    cursor: 'not-allowed',
                },
            },
        },
        
    ]

    

    useEffect(() => {
        if(!initialized.current) {
            nProgress.start()
                initialized.current = true
                getDataPension()
            nProgress.done()
        }
    },[])

  return (
    <div className="p-4 sm:ml-64">
        <DataTable 
            title="Pensión de Vehículos"
            columns={columns}
            data={getDataTablePension}
            pagination
            paginationComponentOptions={paginationComponentOptions}
            conditionalRowStyles={conditionalRowStyles}
            subHeader
        />
    </div>
  )
}

export default TablaPensionDs