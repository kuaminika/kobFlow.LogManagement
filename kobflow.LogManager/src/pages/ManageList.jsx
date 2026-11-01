import { useState, useEffect } from "react";
import "./ManageList.css"


function ManageList({ context, listLoader  }) {

    const [query, setQuery] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [newName, setNewName] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [items, setItems] = useState([]);

    // --- new: loading state tracking ---
    const [isLoading, setIsLoading] = useState(true);      // initial list load
    const [isSaving, setIsSaving] = useState(false);        // add / edit save in flight
    const [pendingIds, setPendingIds] = useState(new Set()); // ids currently being deleted/edited

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        const loadItems = async () => {
            try {
                const loadedItems = await listLoader.Load();
                if (!cancelled) setItems(loadedItems);
            } catch (err) {
                console.error("Failed to load items:", err);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };
        loadItems();
        return () => { cancelled = true; };
    }, [listLoader]);

    const filtered = items.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );

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

    function handleDelete(item) {
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

    function handleEditStart(item) {
        setEditingId(item.id);
        setEditingName(item.name);
    }

    function handleEditSave(item) {
        if (editingName.trim() && editingName !== item.name) {

            const updateToDo = { ...item, name: editingName.trim() };

            setIsSaving(true);
            addPending(item.id);

            listLoader.update(updateToDo)
                .then(response => {
                    console.log("This is the updated item", updateToDo);
                    console.log("the update is recorded:", response);
                    const updatedItem = response.subject;
                    const updatedList = items.map(i => i.id === updatedItem.id ? updatedItem : i);

                    setItems(updatedList);
                    setEditingId(null);
                })
                .catch(err => {
                    console.error("Failed to update item:", err);
                })
                .finally(() => {
                    setIsSaving(false);
                    removePending(item.id);
                });
        } else {
            setEditingId(null);
        }
    }

    function handleEditKeyDown(e, item) {
        if (e.key === "Enter") handleEditSave(item);
        if (e.key === "Escape") setEditingId(null);
    }

    function handleAddSave() {
        if (newName.trim()) {
            setIsSaving(true);
            listLoader.create({ name: newName.trim() })
                .then((newItem) => {
                    console.log(`There are ${items.length} in the list`);
                    console.log("will now add:", newItem);
                    const updatedList = [...items, newItem];

                    console.log(`There will be  ${updatedList.length} in the list`);

                    setNewName("");
                    setItems(updatedList);
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

    function handleAddKeyDown(e) {
        if (e.key === "Enter") handleAddSave();
        if (e.key === "Escape") { setIsAdding(false); setNewName(""); }
    }

    return (
        <div className="simple-list">
            <h2>Manage {context}</h2>

            <div className="simple-list__toolbar">
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
                <p className="simple-list__loading">Loading {context}…</p>
            ) : (
                <ul className="simple-list__items">
                    {isAdding && (
                        <li className="simple-list__item simple-list__item--new">
                            <input
                                autoFocus
                                type="text"
                                value={newName}
                                placeholder={`New ${context} name...`}
                                onChange={e => setNewName(e.target.value)}
                                onKeyDown={handleAddKeyDown}
                                disabled={isSaving}
                            />
                            <button onClick={handleAddSave} disabled={isSaving}>
                                {isSaving ? "Saving…" : "Save"}
                            </button>
                            <button
                                onClick={() => { setIsAdding(false); setNewName(""); }}
                                disabled={isSaving}
                            >
                                Cancel
                            </button>
                        </li>
                    )}

                    {filtered.map(item => {
                        const isPending = pendingIds.has(item.id);
                        return (
                            <li key={item.id} className="simple-list__item">
                                {editingId === item.id ? (
                                    <>
                                        <input
                                            autoFocus
                                            type="text"
                                            value={editingName}
                                            onChange={e => setEditingName(e.target.value)}
                                            onKeyDown={e => handleEditKeyDown(e, item)}
                                            disabled={isPending}
                                        />
                                        <button onClick={() => handleEditSave(item)} disabled={isPending}>
                                            {isPending ? "Saving…" : "Save"}
                                        </button>
                                        <button onClick={() => setEditingId(null)} disabled={isPending}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span>{item.name}</span>
                                        <button onClick={() => handleEditStart(item)} disabled={isPending}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(item)} disabled={isPending}>
                                            {isPending ? "Deleting…" : "Delete"}
                                        </button>
                                    </>
                                )}
                            </li>
                        );
                    })}

                    {filtered.length === 0 && !isAdding && (
                        <li className="simple-list__empty">No results for "{query}"</li>
                    )}
                </ul>
            )}
        </div>
    );
}

export default ManageList;
