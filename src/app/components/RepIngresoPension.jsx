"use client"

import React, {useEffect, useState} from 'react'
import DataTable from 'react-data-table-component'
import { useRouter } from 'next/navigation'
import DatePicker, {registerLocale} from "react-datepicker";
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
registerLocale('es', es);
import { format } from "date-fns";

function RepIngresosVisita() {
    const data=[]

    const [getstartDate, setStartDate] = useState(new Date()) 
    const [getendDate, setEndDate] = useState(null) 
    const [tablaVisitasReporte,  setTablaVisitaReporte ] = useState(null)
    const [records, setRecords] = useState([])

    const [getbtnCsvStatus, setbtnCsvStatu] = useState(true)

    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        //if(!end == null){
           setEndDate(end);
        //}
        
      };
    
    const toMoney = value => {
        const money = Number(value);
    
        if (isNaN(money)) {
          return value;
        }
    
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(money)
    }

      async function getReporteVisitantes(){
        //const getVisitantesDh = async () => {
            setbtnCsvStatu(false)
            const token = window.sessionStorage.getItem('token')
            const startDate = format(getstartDate, "yyyy-MM-dd") 
            const endDate = format(getendDate, "yyyy-MM-dd") 
            //console.log(startDate)
            //console.log(endDate)
            try{
                nProgress.start()

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/reporte-pension/?fechaini=${startDate}&fechafin=${endDate}`, {
                    method: 'GET',
                    headers:{
                    "Authorization" : `Token ${token}`,
                    }
                })

                //console.log(response)

                //if(response){
                    const tablaVisitasData  = await response.json()
                    //console.log(JSON.stringify(tablaVisitasDs))
                                            
                    // if (tablaVisitasDs) setTablaVisitaDs(tablaVisitasDs)
                    setTablaVisitaReporte(tablaVisitasData)
                    console.log(tablaVisitasData.Reporte)
                    //console.log(tablaVisitasDs.VehiculosParqueaderoDh)
                    for(let i=0; i < tablaVisitasData.Reporte.length; i++ ){
                        const pe_placa = '"pe_placa":"'+tablaVisitasData.Reporte[i].pe_placa+'",'
                        const pe_nombre = '"pe_nombre":"'+tablaVisitasData.Reporte[i].pe_nombre+'",'
                        const pe_cedula = '"pe_cedula":"'+tablaVisitasData.Reporte[i].pe_cedula+'",'
                        const pe_fecha_ini = '"pe_fecha_ini":"'+tablaVisitasData.Reporte[i].pe_fecha_ini.replace("T00:00:00"," ")+'",'
                        const pe_fecha_fin = '"pe_fecha_fin":"'+tablaVisitasData.Reporte[i].pe_fecha_fin.replace("T"," ")+'",'
                        const pe_monto = '"pe_monto":"'+tablaVisitasData.Reporte[i].pe_monto+'",'
                        const pe_slot = '"pe_slot":"'+tablaVisitasData.Reporte[i].pe_slot+'",'
                        const pe_tipo_vehiculo_set = tablaVisitasData.Reporte[i].pe_tipo_vehiculo
                            let pe_tipo_vehiculo_get =""
                            if(pe_tipo_vehiculo_set == 1){
                                pe_tipo_vehiculo_get = '"pe_tipo_vehiculo":"Carro",'
                            }else if(pe_tipo_vehiculo_set == 2){
                                pe_tipo_vehiculo_get = '"pe_tipo_vehiculo":"Moto",'
                            }
                        const pe_status_set = tablaVisitasData.Reporte[i].pe_status
                            let pe_status_get=""
                            if(pe_status_set == true){
                                pe_status_get = '"pe_status":"Activo"'
                            }else if(pe_status_set == false){
                                pe_status_get = '"pe_status":"Inactivo"'
                            }
                        
                        

                        const dataArray = JSON.parse('{'+
                            pe_placa+
                            pe_nombre+
                            pe_cedula+
                            pe_fecha_ini+
                            pe_fecha_fin+
                            pe_monto+
                            pe_slot+
                            pe_tipo_vehiculo_get+
                            pe_status_get
                            +'}')
                        data.push(dataArray)
                        
                    }
                    console.log(data)
                    setRecords(data)
                    nProgress.done()                          
                        
                //}
            }catch(error){
                console.log(error)
            }
        }


      const columns = [
        {
            name: "Placa",
            selector: row => row.pe_placa,
            wrap: true
        },
        {
            name: "Nombre",
            selector: row => row.pe_nombre,
            wrap: true
        },
        {
            name: "Cedula",
            selector: row => row.pe_cedula
        },
        {
            name: "Fecha Ingreso",
            selector: row => row.pe_fecha_ini
        },
        {
            name: "Fecha Salida",
            selector: row => row.pe_fecha_fin
        },
        {
            name: "Monto",
            selector: row => toMoney(row.pe_monto)
        },
        {
            name: "Slot",
            selector: row => row.pe_slot
        },
        {
            name: "Vehículo",
            selector: row => row.pe_tipo_vehiculo
        },
        {
            name: "Estado",
            selector: row => row.pe_status
        }
    ]

    function convertArrayOfObjectsToCSV(array) {
        let result;
    
        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const keys = Object.keys(records[0]);
    
        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;
    
        array.forEach(item => {
            let ctr = 0;
            keys.forEach(key => {
                if (ctr > 0) result += columnDelimiter;
    
                result += item[key];
                
                ctr++;
            });
            result += lineDelimiter;
        });
    
        return result;
    }

    function downloadCSV(array) {
        nProgress.start()
            const link = document.createElement('a');
            let csv = convertArrayOfObjectsToCSV(array);
            if (csv == null) return;
        
            const filename = 'export.csv';
        
            if (!csv.match(/^data:text\/csv/i)) {
                csv = `data:text/csv;charset=utf-8,${csv}`;
            }
        
            link.setAttribute('href', encodeURI(csv));
            link.setAttribute('download', filename);
            link.click();
        nProgress.done()
    }

    useEffect(() => {
        setbtnCsvStatu(true)
    },[])

  return (
    <div className='container mx-auto'>
        <div className='flex-auto'>
            <div className="p-4 sm:ml-64">
                <div class="flex items-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                    <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                        <span class="sr-only">Info</span>
                        <div>
                            <span class="font-medium">Reporte de Registro de Pensión</span>
                        </div>
                </div>
                <div className="items-center w-full space-y-4 m-6 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
                    
                    <div className='m-6 grid gap-4 sm:grid-cols-1 grid-cols-1'>
                        <div className='pt-8 flex items-center w-full justify-center'>
                            
                            <div className="ms-3 text-xl font-normal">
                            <p className=' flex h-8'> Seleccione Rango de Fechas</p>
                            <DatePicker
                                selected={getstartDate}
                                onChange={onChange}
                                startDate={getstartDate}
                                endDate={getendDate}
                                selectsRange
                                inline
                                dateFormat="yyyy-MM-dd"
                                locale="es"
                            />
                            </div>
                        </div>
                    </div>
                    <div className='m-6 grid gap-4 sm:grid-cols-1 grid-cols-1'>
                        <button
                            className='focus:outline-none  text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
                            onClick={(e) => getReporteVisitantes()}>
                            Generar Informe
                        </button>
                    </div>
                </div>
            </div>
            <div className="p-4 sm:ml-64">
                <button className='focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'  
                    onClick={(e) => downloadCSV(records)} disabled={getbtnCsvStatus} >CSV Reporte</button>
                <DataTable 
                    columns={columns}
                    data={records}
                    pagination
                />
            </div>
        </div>
    </div>
  )
}

export default RepIngresosVisita