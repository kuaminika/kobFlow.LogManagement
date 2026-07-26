function UpdateExpenseCommand({ listLoader_expense }) {
    const self = this;

    self.Execute = async function({ item,editingDraft,  seStateFns, addPending, removePending }) {
        const {setItems, setEditingId, setEditingDraft, setIsSaving} = seStateFns;
        setIsSaving(true);
        addPending(item.id);

        try {
            const response = await listLoader_expense.update(editingDraft);
            const updatedItem = response.subject;
            setItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
            setEditingId(null);
            setEditingDraft(null);
        } catch (err) {
            console.error("Failed to update expense:", err);
        } finally {
            setIsSaving(false);
            removePending(item.id);
        }
    }
}

export default UpdateExpenseCommand;