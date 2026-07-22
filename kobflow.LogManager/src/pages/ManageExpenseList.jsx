import { useEffect,useState } from "react";

function ManageExpenseList({ context, listLoaders  })
{
    console.log(listLoaders)
    const [isLoading, setIsLoading] = useState(true);   
    const {listLoader_expenseCategory,
        listLoader_expense,listLoader_kobHolder,listLoader_merchant} = listLoaders

    const [items, setItems] = useState([]);
   // const addCommand = new HandleAddCommand({listLoader_expense});
   
   useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        const loadItems = async () => {
            try {
                const loadedItems = await listLoader_expense.Load();
                if (!cancelled) setItems(loadedItems);
            } catch (err) {
                console.error("Failed to load items:", err);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };
        loadItems();
        return () => { cancelled = true; };
    }, [listLoader_expense]);
    return <></>
}

export default ManageExpenseList;