import { useState } from "react";

function Typeahead({ value, items, onSelect, placeholder, onInputChange }) {
    const [query, setQuery] = useState(value || '');
    const [open, setOpen] = useState(false);

    const filtered = items.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);

    function handleSelect(item) {
        setQuery(item.name);
        setOpen(false);
        onSelect(item);
    }
//TODO: handle case when query doesn't match any item - show "Add new item" option and call onSelect with null or special value when clicked, so parent can decide what to do (e.g. open modal to create new merchant/category)
    return (
        <div className={"typeahead"} >
            <input
                type="text"
                value={query}
                placeholder={placeholder}
                onChange={e => { setQuery(e.target.value); setOpen(true); onInputChange?.(e.target.value) }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
            />
            {open && filtered.length > 0 && (
                <ul  onBlur={() => setTimeout(() => setOpen(false), 150)}>
                    {filtered.map(item => (
                        <li key={item.id} onMouseDown={() => handleSelect(item)}>
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Typeahead;