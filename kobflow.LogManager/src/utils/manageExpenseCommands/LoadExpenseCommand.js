function LoadExpenseCommand({listLoaders})
{
    const { listLoader_expenseCategory, listLoader_expense, listLoader_kobHolder, listLoader_merchant } = listLoaders;
    const self = this; 


    self.execute = async function({isCancelled,setItems,setMerchants,setCategories,setKobHolders})
    {
        const [expenseList, merchantList, categoryList, kobHolderList] = await Promise.all([
            listLoader_expense.Load(),
            listLoader_merchant.Load(),
            listLoader_expenseCategory.Load(),
            listLoader_kobHolder.Load()
        ]);

        if (isCancelled()) return;
        setItems(expenseList);
        setMerchants(merchantList);
        setCategories(categoryList);
        setKobHolders(kobHolderList);



    }
}

export default LoadExpenseCommand;