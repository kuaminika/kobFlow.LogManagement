import { useEffect, useState } from "react";
import Typeahead from "../components/Typeahead";
import Expense from "../models/Expense";
import LoadExpenseCommand from "../utils/manageExpenseCommands/LoadExpenseCommand";
import AddExpenseCommand from "../utils/manageExpenseCommands/AddExpenseCommand";
 import UpdateExpenseCommand from "../utils/manageExpenseCommands/UpdateExpenseCommand"
import DeleteExpenseCommand from "../utils/manageExpenseCommands/DeleteExpenseCommand"
 import "./ManageExpenseList.css"; // adjust path to wherever you save it
function ManageExpenseList({ context, listLoaders }) {


    const loadExpenseCommand  = new LoadExpenseCommand({listLoaders});
   
    const { listLoader_expenseCategory, listLoader_expense, listLoader_kobHolder, listLoader_merchant } = listLoaders;
    const addCommand = new AddExpenseCommand({listLoader:listLoader_expense})
    const updateCommand = new UpdateExpenseCommand({listLoader_expense})
    const deleteCommand = new DeleteExpenseCommand({listLoader: listLoader_expense });


    const [items, setItems] = useState([]);
    const [merchants, setMerchants] = useState([]);
    const [categories, setCategories] = useState([]);
    const [kobHolders, setKobHolders] = useState([]);

    const [query, setQuery] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingDraft, setEditingDraft] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newDraft, setNewDraft] = useState(() => new Expense());

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [pendingIds, setPendingIds] = useState(new Set());

      
    useEffect(() => {
            let cancelled = false;
            setIsLoading(true);

            loadExpenseCommand.execute({
                isCancelled: () => cancelled,   // <-- must be an arrow fn reading the closure var each time, not `cancelled` itself
                setItems,
                setMerchants,
                setCategories,
                setKobHolders
            })
                .catch(err => console.error("Failed to load expenses:", err))
                .finally(() => { if (!cancelled) setIsLoading(false); });

            return () => { cancelled = true; };
        }, [listLoader_expense, listLoader_merchant, listLoader_expenseCategory, listLoader_kobHolder]);





    function addPending(id) {
        setPendingIds(prev => new Set(prev).add(id));
    }

    function removePending(id) {
        setPendingIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    }





    const filtered = items.filter(item => {
        const q = query.toLowerCase();
         
        return item.description?.toLowerCase().includes(q) ||
            item.merchantName?.toLowerCase().includes(q) ||
            item.categoryName?.toLowerCase().includes(q) ||
            item.kobHolderName?.toLowerCase().includes(q)|| 
            item.amount==q;
    });

    function toDateInput(val) {
        if (!val) return '';
        return new Date(val).toISOString().slice(0, 10);
    }

    function handleEditStart(item) {
        setEditingId(item.id);
        setEditingDraft({ ...item });
    }

    function handleEditCancel() {
        setEditingId(null);
        setEditingDraft(null);
    }

    function updateEditingDraft(fields) {
        setEditingDraft(prev => ({ ...prev, ...fields }));
    }

    function handleEditSave(item) {
          updateCommand.Execute({
                item,
                editingDraft,
                seStateFns:{setItems, setEditingId, setEditingDraft, setIsSaving},            
                addPending,
                removePending
            });
    }

    function updateNewDraft(fields) {
        setNewDraft(prev => ({ ...prev, ...fields }));
    }

    function handleAddSave() {
        if (!newDraft.description.trim()) return;
        addCommand.execute({
            rawNewItem: newDraft,
            stateFns :{
                        setIsAdding: (val) => {
                            setIsAdding(val);
                            if (!val) setNewDraft(new Expense());
                        },
                        setIsSaving,
                        setItems
                    }
        });
    }

    function handleAddCancel() {
        setIsAdding(false);
        setNewDraft(new Expense());
    }

    return (
        <div className="expense-table">
            <h2>Manage {context}</h2>

            <div className="expense-table__toolbar">
                <input
                    type="text"
                    placeholder={`Search ${context}...`}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    disabled={isLoading}
                />
                <button onClick={() => setIsAdding(true)} disabled={isAdding || isLoading}>
                    + Add
                </button>
            </div>

            {isLoading ? (
                <p className="expense-table__loading">Loading {context}…</p>
            ) : (
                <table className="expense-table__table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Merchant</th>
                            <th>Category</th>
                            <th>KobHolder</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isAdding && (
                            <tr className="expense-table__item expense-table__item--new">
                                <td>
                                    <input
                                        type="date"
                                        value={toDateInput(newDraft.createdDate)}
                                        onChange={e => updateNewDraft({ createdDate: e.target.value })}
                                        disabled={isSaving}
                                    />
                                </td>
                                <td>
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Description"
                                        value={newDraft.description}
                                        onChange={e => updateNewDraft({ description: e.target.value })}
                                        disabled={isSaving}
                                    />
                                </td>
                                <td>
                                    <Typeahead
                                        value={newDraft.merchantName}
                                        items={merchants}
                                        placeholder="Select Merchant"
                                        onSelect={sel => updateNewDraft({ merchantName: sel.name, merchantId: sel.id })}
                                    />
                                </td>
                                <td>
                                    <Typeahead
                                        value={newDraft.categoryName}
                                        items={categories}
                                        placeholder="Select Category"
                                        onSelect={sel => updateNewDraft({ categoryName: sel.name, categoryId: sel.id })}
                                    />
                                </td>
                                <td>
                                    <Typeahead
                                        value={newDraft.kobHolderName}
                                        items={kobHolders}
                                        placeholder="Select KobHolder"
                                        onSelect={sel => updateNewDraft({ kobHolderName: sel.name, kobHolderId: sel.id })}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newDraft.amount}
                                        onChange={e => updateNewDraft({ amount: parseFloat(e.target.value) || 0 })}
                                        disabled={isSaving}
                                    />
                                </td>
                                <td>
                                    <button onClick={handleAddSave} disabled={isSaving}>
                                        {isSaving ? "Saving…" : "Save"}
                                    </button>
                                    <button onClick={handleAddCancel} disabled={isSaving}>
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        )}

                        {filtered.map(item => {
                            const isPending = pendingIds.has(item.id);
                            const isEditing = editingId === item.id;
                            return (
                                <tr key={item.id} className="expense-table__item">
                                    {isEditing ? (
                                        <>
                                            <td>
                                                <input
                                                    type="date"
                                                    value={toDateInput(editingDraft.createdDate)}
                                                    onChange={e => updateEditingDraft({ createdDate: e.target.value })}
                                                    disabled={isPending}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={editingDraft.description}
                                                    onChange={e => updateEditingDraft({ description: e.target.value })}
                                                    disabled={isPending}
                                                />
                                            </td>
                                            <td>
                                                <Typeahead
                                                    value={editingDraft.merchantName}
                                                    items={merchants}
                                                    placeholder="Select Merchant"
                                                    onSelect={sel => updateEditingDraft({ merchantName: sel.name, merchantId: sel.id })}
                                                />
                                            </td>
                                            <td>
                                                <Typeahead
                                                    value={editingDraft.categoryName}
                                                    items={categories}
                                                    placeholder="Select Category"
                                                    onSelect={sel => updateEditingDraft({ categoryName: sel.name, categoryId: sel.id })}
                                                />
                                            </td>
                                            <td>
                                                <Typeahead
                                                    value={editingDraft.kobHolderName}
                                                    items={kobHolders}
                                                    placeholder="Select KobHolder"
                                                    onSelect={sel => updateEditingDraft({ kobHolderName: sel.name, kobHolderId: sel.id })}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={editingDraft.amount}
                                                    onChange={e => updateEditingDraft({ amount: parseFloat(e.target.value) || 0 })}
                                                    disabled={isPending}
                                                />
                                            </td>
                                            <td>
                                                <button onClick={() => handleEditSave(item)} disabled={isPending}>
                                                    {isPending ? "Saving…" : "Save"}
                                                </button>
                                                <button onClick={handleEditCancel} disabled={isPending}>
                                                    Cancel
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{toDateInput(item.createdDate)}</td>
                                            <td>{item.description}</td>
                                            <td>{item.merchantName}</td>
                                            <td>{item.categoryName}</td>
                                            <td>{item.kobHolderName}</td>
                                            <td>{Number(item.amount).toFixed(2)}</td>
                                            <td>
                                                <button onClick={() => handleEditStart(item)} disabled={isPending}>
                                                    Edit
                                                </button>
                                                <button onClick={() => deleteCommand.execute({item,stateFns: { setItems, addPending, removePending },confirmFn:window.confirm})} disabled={isPending}>
                                                    {isPending ? "Deleting…" : "Delete"}
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}

                        {filtered.length === 0 && !isAdding && (
                            <tr>
                                <td colSpan={7} className="expense-table__empty">No results for "{query}"</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ManageExpenseList;