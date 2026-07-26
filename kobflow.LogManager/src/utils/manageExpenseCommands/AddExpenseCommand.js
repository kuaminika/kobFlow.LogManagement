function AddExpenseCommand({listLoader})
{
  const self = this; 

  self.execute = async function({rawNewItem,stateFns})
  {
     const {setIsAdding,setIsSaving,setItems} = stateFns;
     
        setIsSaving(true);
        listLoader.create(rawNewItem)
            .then((newItem) => {
                console.log("will now add:", newItem); 
                
                setItems(previousState=>{
                    console.log(`There are ${previousState.length} in the list`);

                    const newState=  [...previousState, newItem];

                    console.log(`There will be  ${newState.length} in the list`);
                    return newState
                });
                setIsAdding(false);
            })
            .catch(err => {
                console.error("Failed to add item:", err);
            })
            .finally(() => {
                setIsSaving(false);
            });
    
  }
}

export default AddExpenseCommand;