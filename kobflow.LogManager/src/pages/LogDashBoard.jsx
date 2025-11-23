import { useEffect, useState } from "react";
import { LogCard } from "../components/LogCard";
import { logFetcher } from "../utils/LogFetcher";
 
 

function LogDashBoard()
{
     function whenMountingFn()
    { 
        logFetcher.GetAllLogs().then(function(fetchedLogs){
                        console.log("fetchedLogs",fetchedLogs);
                      setLogs(fetchedLogs);
             });

    }
    let dpenencyArray= [];
    const cleanUpAfterFirstUseFn =  useEffect(whenMountingFn,dpenencyArray); 

   const [logs,setLogs]= useState([]);
   


    return <>
        <nav>
              <div className="flex flex-wrap gap-4 mb-6">
    <input type="text" placeholder="Search message..." className="border rounded p-2 flex-1" id="searchInput" />
    <select className="border rounded p-2" id="levelFilter">
      <option value="">All Levels</option>
      <option value="INFO">INFO</option>
      <option value="WARN">WARN</option>
      <option value="ERROR">ERROR</option>
      <option value="CRITICAL">CRITICAL</option>
    </select>
    <select className="border rounded p-2" id="serviceFilter">
      <option value="">All Services</option>
      <option value="Gateway">Gateway</option>
      <option value="Auth">Auth</option>
      <option value="Payments">Payments</option>
    </select>
  </div>

        </nav>
        <main>
            <div className="grid grid-cols-1 gap-4">
                {logs.map((el,i)=>{
                    return <LogCard logItem ={el} key={`logItem-${i}`} ></LogCard>
                })}
                 
            </div>
        </main>
       
    </>
}

export {LogDashBoard};