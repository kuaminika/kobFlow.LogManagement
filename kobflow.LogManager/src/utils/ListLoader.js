function ListLoader({ context,kCourrier, configs }) {


    const self = this;


    self.Load= async function() {
        try {

              const result = await kCourrier.get(`${configs[`VITE_URL_${context.toUpperCase()}`]}`)
                        .then(data => {return data.subject})
                        .catch(err => console.error('Failed to fetch merchants:', err));

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