function HandleDeleteCommand()
{
    function execute(item) 
    {
        if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
            addPending(item.id);
            listLoader.delete(item)
                .then(response => {
                    console.log("Deleted:", item);
                    console.log("Here's the response:", response);

                    const updatedList = items.filter(i => i.id !== item.id);
                    setItems(updatedList);
                })
                .catch(err => {
                    console.error("Failed to delete item:", err);
                })
                .finally(() => {
                    removePending(item.id);
                });
        }
    }

}

export default HandleDeleteCommand;