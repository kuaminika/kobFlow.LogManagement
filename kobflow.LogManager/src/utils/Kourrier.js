function Kourrier()
{
    const self = this;
    self.post = async function(fullURL,data,headerRules){
          console.log("doing post with :",data,JSON.stringify(data))
            console.log("posting:"+fullURL);
            //    headerRules = headerRules || {  'Content-Type': 'application/json'  };
            if (!headerRules || typeof headerRules !== 'object' || headerRules instanceof Map) {
                headerRules = { 'Content-Type': 'application/json' };
            }
            const postOptions = {
                     method: 'POST',
                     body: JSON.stringify(data),
                     headers: headerRules
                   }
            const prms = fetch(fullURL,postOptions).then(response => {
                       if (typeof(response) == "object") resolve(response);
                       if(typeof(response)== "string")  resolve(JSON.parse(response));
                   });

        const result = await prms;
        return result;
      
    }

    self.get = async function(url){

         const dataPromise =  fetch(url).then(r=>{
                    console.log(r);
                    return r.json();
        });   

        const result = await dataPromise;
        console.log(result);
        return result;
    }
}

const kCourrier = new Kourrier();
export {kCourrier};