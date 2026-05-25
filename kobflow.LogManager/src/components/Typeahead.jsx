function Typeahead({ value, items, onSelect, placeholder }) {
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

    return (
        <div style={{ position: 'relative' }}>
            <input
                type="text"
                value={query}
                placeholder={placeholder}
                onChange={e => { setQuery(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
            />
            {open && filtered.length > 0 && (
                <ul style={{
                    position: 'absolute', zIndex: 10, top: '100%', left: 0, right: 0,
                    background: 'var(--color-background-primary)',
                    border: '0.5px solid var(--color-border-secondary)',
                    borderRadius: 'var(--border-radius-md)',
                    listStyle: 'none', margin: '2px 0', padding: '4px 0',
                    maxHeight: '200px', overflowY: 'auto'
                }}>
                    {filtered.map(item => (
                        <li key={item.id}
                            onMouseDown={() => handleSelect(item)}
                            style={{ padding: '6px 10px', cursor: 'pointer', fontSize: 13 }}
                            onMouseEnter={e => e.target.style.background = 'var(--color-background-secondary)'}
                            onMouseLeave={e => e.target.style.background = 'transparent'}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}