import  {logFactory} from "../models/LogFactory"
import { kCourrier } from "./Kourrier"; 


function LogFetcher()
{
        const self = this;
       
        console.log("loading LogFetcher")
        self.GetAllLogs = async function(){

         
                let url =  import.meta.env.VITE_URL_GETLOGS;

                console.log(`fetching logs at ${url}`);
            const result = await    kCourrier.get(url).then(r=>{
              if(!r.success) throw "was not able to fetch";

                  let result =     r.data.map((el,i)=>{

                        return logFactory.createLogItem({...el});
                    });
              return result;


            }).catch(err=>{
              console.error(err);
              return []
            });

            console.log(result);
            return result;
            
          
        }
}

        const logFetcher = new LogFetcher();
export {logFetcher}