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
import { root } from 'postcss';


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

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bobot-api/reporteingresos-rep?fechaini=${startDate}&fechafin=${endDate}`, {
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
                    console.log(tablaVisitasData.Generando)
                    //console.log(tablaVisitasDs.VehiculosParqueaderoDh)
                    for(let i=0; i < tablaVisitasData.Generando.length; i++ ){
                        const vi_fecha_hora_ingreso = '"vi_fecha_hora_ingreso":"'+tablaVisitasData.Generando[i].vi_fecha_hora_ingreso.replace("T"," ")+'",'
                        const vi_fecha_hora_salida = '"vi_fecha_hora_salida":"'+tablaVisitasData.Generando[i].vi_fecha_hora_salida.replace("T"," ")+'",'
                        const pl_placa = '"pl_placa":"'+tablaVisitasData.Generando[i].pl_placa+'",'
                        const pk_slot = '"pk_slot":"'+tablaVisitasData.Generando[i].pk_slot+'",'
                        const vd_cedula = '"vd_cedula":"'+tablaVisitasData.Generando[i].vd_cedula+'",'
                        const vd_nombre = '"vd_nombre":"'+tablaVisitasData.Generando[i].vd_nombre+'",'
                        const ph_propietario = '"ph_propietario":"'+tablaVisitasData.Generando[i].ph_propietario+'",'
                        const ph_apartamento = '"ph_apartamento":"'+tablaVisitasData.Generando[i].ph_apartamento+'",'
                        const ph_torre = '"ph_torre":"'+tablaVisitasData.Generando[i].ph_torre+'",'
                        const fa_tiempo = '"fa_tiempo":"'+tablaVisitasData.Generando[i].fa_tiempo+'",'
                        const fa_monto = '"fa_monto":"'+tablaVisitasData.Generando[i].fa_monto+'"'

                        const dataArray = JSON.parse('{'+vi_fecha_hora_ingreso+vi_fecha_hora_salida+pl_placa+pk_slot+vd_cedula+vd_nombre+ph_propietario+ph_apartamento+
                        ph_torre+fa_tiempo+fa_monto+'}')
                        data.push(dataArray)
                        
                    }
                    //console.log(data)
                    setRecords(data)
                    nProgress.done()                          
                        
                //}
            }catch(error){
                console.log(error)
            }
        }


      const columns = [
        {
            name: "Fecha Ingreso",
            selector: row => row.vi_fecha_hora_ingreso,
            wrap: true
        },
        {
            name: "Fecha Salida",
            selector: row => row.vi_fecha_hora_salida,
            wrap: true
        },
        {
            name: "Placa",
            selector: row => row.pl_placa
        },
        {
            name: "Slot",
            selector: row => row.pk_slot
        },
        {
            name: "Cedula Visitante",
            selector: row => row.vd_cedula
        },
        {
            name: "Nombre Visitante",
            selector: row => row.vd_nombre
        },
        {
            name: "Propietario",
            selector: row => row.ph_propietario
        },
        {
            name: "Apartamento",
            selector: row => row.ph_apartamento
        },
        {
            name: "Torre",
            selector: row => row.ph_torre
        },
        {
            name: "Tiempo",
            selector: row => row.fa_tiempo
        },
        {
            name: "Monto",
            selector: row => row.fa_monto
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
                            <span class="font-medium">Informe de Registro de Visitantes</span>
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