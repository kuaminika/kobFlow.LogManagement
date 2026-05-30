import { useState,useEffect } from "react";
function ManageList({ context, listLoader, onAdd, onEdit, onDelete }) {

    const [query, setQuery] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [newName, setNewName] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
        const loadItems = async () => {
            const loadedItems = await listLoader.Load();
            setItems(loadedItems);
        };
        loadItems();
    }, [listLoader]);

    const filtered = items.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );

    function handleDelete(item) {
        if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
            onDelete(item);
        }
    }

    function handleEditStart(item) {
        setEditingId(item.id);
        setEditingName(item.name);
    }

    function handleEditSave(item) {
        if (editingName.trim() && editingName !== item.name) {
            onEdit({ ...item, name: editingName.trim() });
        }
        setEditingId(null);
    }

    function handleEditKeyDown(e, item) {
        if (e.key === "Enter") handleEditSave(item);
        if (e.key === "Escape") setEditingId(null);
    }

    function handleAddSave() {
        if (newName.trim()) {
            onAdd({ name: newName.trim() });
            setNewName("");
            setIsAdding(false);
        }
    }

    function handleAddKeyDown(e) {
        if (e.key === "Enter") handleAddSave();
        if (e.key === "Escape") { setIsAdding(false); setNewName(""); }
    }

    return (
        <div className="manage-list">
            <h2>Manage {context}</h2>

            <div className="manage-list__toolbar">
                <input
                    type="text"
                    placeholder={`Search ${context}...`}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
                <button onClick={() => setIsAdding(true)} disabled={isAdding}>
                    + Add
                </button>
            </div>

            <ul className="manage-list__items">
                {isAdding && (
                    <li className="manage-list__item manage-list__item--new">
                        <input
                            autoFocus
                            type="text"
                            value={newName}
                            placeholder={`New ${context} name...`}
                            onChange={e => setNewName(e.target.value)}
                            onKeyDown={handleAddKeyDown}
                        />
                        <button onClick={handleAddSave}>Save</button>
                        <button onClick={() => { setIsAdding(false); setNewName(""); }}>Cancel</button>
                    </li>
                )}

                {filtered.map(item => (
                    <li key={item.id} className="manage-list__item">
                        {editingId === item.id ? (
                            <>
                                <input
                                    autoFocus
                                    type="text"
                                    value={editingName}
                                    onChange={e => setEditingName(e.target.value)}
                                    onKeyDown={e => handleEditKeyDown(e, item)}
                                />
                                <button onClick={() => handleEditSave(item)}>Save</button>
                                <button onClick={() => setEditingId(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <span>{item.name}</span>
                                <button onClick={() => handleEditStart(item)}>Edit</button>
                                <button onClick={() => onDelete(item)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}

                {filtered.length === 0 && !isAdding && (
                    <li className="manage-list__empty">No results for "{query}"</li>
                )}
            </ul>
        </div>
    );
}

export default ManageList;