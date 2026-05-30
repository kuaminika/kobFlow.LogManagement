import { useState, useRef } from "react";

function Typeahead({ value, items, onSelect, placeholder, onInputChange }) {
    const [query, setQuery] = useState(value || '');
    const [open, setOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const listRef = useRef(null);

    const filtered = items.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);

    function handleSelect(item) {
        setQuery(item.name);
        setOpen(false);
        setHighlightedIndex(-1);
        onSelect(item);
    }

    function handleKeyDown(e) {
        console.log("Key down:", e.key, "Open:", open, "Highlighted index:", highlightedIndex);
        if (!open || filtered.length === 0) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                setOpen(true);
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = (highlightedIndex + 1) % filtered.length;
            setHighlightedIndex(next);
            scrollIntoView(next);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = (highlightedIndex - 1 + filtered.length) % filtered.length;
            setHighlightedIndex(prev);
            scrollIntoView(prev);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightedIndex >= 0) {
                handleSelect(filtered[highlightedIndex]);
            }
        } else if (e.key === 'Escape') {
            setOpen(false);
            setHighlightedIndex(-1);
        }
    }

    function scrollIntoView(index) {
        const list = listRef.current;
        if (!list) return;
        const item = list.children[index];
        item?.scrollIntoView({ block: 'nearest' });
    }

    return (
        <div className="typeahead">
            <input
                type="text"
                value={query}
                placeholder={placeholder}
                onChange={e => {
                    setQuery(e.target.value);
                    setOpen(true);
                    setHighlightedIndex(-1);
                    onInputChange?.(e.target.value);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => { setOpen(false); setHighlightedIndex(-1); }, 150)}
                onKeyDown={handleKeyDown}
            />
            {open && filtered.length > 0 && (
                <ul ref={listRef}>
                    {filtered.map((item, index) => (
                        <li
                            key={item.id}
                            className={index === highlightedIndex ? 'highlighted' : ''}
                            onMouseDown={() => handleSelect(item)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Typeahead;