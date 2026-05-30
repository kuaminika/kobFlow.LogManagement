function ListLoader({ context,kCourrier, configs, cacher}) {


    const self = this;


    self.Load= async function() {
        try {

              const cacheHit = cacher ? cacher.get(context) : null;
              if(cacheHit)
              {
                console.log(`Cache hit for context ${context}:`, cacheHit);
                return cacheHit;
              }
              console.log(`Cache miss for context ${context}. Fetching from server...`)
              const result = await kCourrier.get(`${configs[`VITE_URL_${context.toUpperCase()}`]}`)
                        .then(data => {return data.subject})
                        .catch(err => console.error('Failed to fetch merchants:', err));

              if (cacher) {
                cacher.set(context, result);
              }

              return result;

        }
        catch(err)        {
            console.error(`Failed to load list for context ${context}:`, err)
        }
    }


    self.delete = async function(item)
    {
        try{
            const result = await kCourrier.post(`${configs.VITE_URL_FORDELETE}`,{context:"Flows", requestAction:"delete", sourceContext:context, payLoad:{id:item.id}})
            console.log("delete result:", result)
            return result;
        }
        catch(err)
        {
            console.error(`Failed to delete item with id ${item.id} for context ${context}:`, err)
        }
    }



}

export default ListLoader;