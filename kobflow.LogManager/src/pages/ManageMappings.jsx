import { useState, useEffect } from "react";
import "./ManageMappings.css";

// Reusable "phrase -> target" mapping page (merchants today, categories later).
// A mapping is one phrase linked to one target: { id, [targetKey]: targetId, phrase }.
// During an import, a CSV row goes to that target when its description CONTAINS the phrase.
//
// Props:
//   context       - label for the target, e.g. "Merchant" or "Category"
//   targetLoader  - ListLoader for the targets shown on the left (items: { id, name })
//   listLoader    - ListLoader for the mappings (getAll returns every mapping;
//                   the page filters them per target)
//   targetKey     - field on a mapping that holds the target id, e.g. "merchantId" or "categoryId"
function ManageMappings({ context, targetLoader, listLoader: mappingLoader, targetKey }) {

    const [targets, setTargets] = useState([]);
    const [mappings, setMappings] = useState([]);
    const [selectedTargetId, setSelectedTargetId] = useState(null);
    const [targetQuery, setTargetQuery] = useState("");

    const [newPhrase, setNewPhrase] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [pendingIds, setPendingIds] = useState(new Set());
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);

        const load = async () => {
            try {
                const [loadedTargets, loadedMappings] = await Promise.all([
                    targetLoader.Load(),
                    mappingLoader.Load({ forceRefresh: true }),
                ]);
                if (cancelled) return;
                setTargets(loadedTargets || []);
                setMappings(loadedMappings || []);
            } catch (err) {
                console.error(`Failed to load ${context} list or mappings:`, err);
                if (!cancelled) setError(`Could not load ${context} list or mappings.`);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        load();
        return () => { cancelled = true; };
    }, [targetLoader, mappingLoader]);

    const filteredTargets = targets.filter(m =>  m.name.toLowerCase().includes(targetQuery.toLowerCase()));

    const selectedTarget = targets.find(m => m.id === selectedTargetId);
    const targetMappings = mappings.filter(m => m[targetKey] === selectedTargetId);

    function countFor(targetId) {
        return mappings.filter(m => m[targetKey] === targetId).length;
    }

    function selectTarget(target) {
        setSelectedTargetId(target.id);
        setIsAdding(false);
        setNewPhrase("");
        setError("");
    }

    function normalize(phrase) {
        return phrase.trim().replace(/\s+/g, " ").toUpperCase();
    }

    function handleAddSave() {
        const phrase = normalize(newPhrase);
        if (!phrase) return;

        // A phrase can only point to one target.
        const existing = mappings.find(m => normalize(m.phrase) === phrase);
        if (existing) {
            const owner = targets.find(m => m.id === existing[targetKey]);
            setError(`"${phrase}" is already mapped to ${owner ? owner.name : `another ${context.toLowerCase()}`}.`);
            return;
        }

        setIsSaving(true);
        setError("");
        mappingLoader.create({ [targetKey]: selectedTargetId, phrase })
            .then(created => {
                setMappings(prev => [...prev, created]);
                setNewPhrase("");
                setIsAdding(false);
            })
            .catch(err => {
                console.error("Failed to add mapping:", err);
                setError("Could not add the phrase.");
            })
            .finally(() => setIsSaving(false));
    }

    function handleAddKeyDown(e) {
        if (e.key === "Enter") handleAddSave();
        if (e.key === "Escape") { setIsAdding(false); setNewPhrase(""); }
    }

    function handleDelete(mapping) {
        if (!window.confirm(`Remove "${mapping.phrase}" from ${selectedTarget.name}?`)) return;

        setPendingIds(prev => new Set(prev).add(mapping.id));
        setError("");
        mappingLoader.delete(mapping)
            .then(() => {
                setMappings(prev => prev.filter(m => m.id !== mapping.id));
            })
            .catch(err => {
                console.error("Failed to delete mapping:", err);
                setError("Could not remove the phrase.");
            })
            .finally(() => {
                setPendingIds(prev => {
                    const next = new Set(prev);
                    next.delete(mapping.id);
                    return next;
                });
            });
    }

    if (isLoading) {
        return (
            <div className="mappings">
                <h2>Manage {context} Mappings</h2>
                <p className="mappings__hint">Loading {context} list and mappings…</p>
            </div>
        );
    }

    return (
        <div className="mappings">
            <h2>Manage {context} Mappings</h2>

            <div className="mappings__layout">

                {/* Left: targets (merchants, categories, ...) */}
                <aside className="mappings__targets">
                    <input
                        type="text"
                        placeholder={`Search ${context.toLowerCase()}...`}
                        value={targetQuery}
                        onChange={e => setTargetQuery(e.target.value)}
                    />
                    <ul>
                        {filteredTargets.map(target => (
                            <li key={target.id}>
                                <button
                                    className={
                                        "mappings__target" +
                                        (target.id === selectedTargetId ? " mappings__target--selected" : "")
                                    }
                                    onClick={() => selectTarget(target)}
                                >
                                    <span>{target.name}</span>
                                    <span className="mappings__count">{countFor(target.id)}</span>
                                </button>
                            </li>
                        ))}
                        {filteredTargets.length === 0 && (
                            <li className="mappings__hint">No {context.toLowerCase()} matches "{targetQuery}"</li>
                        )}
                    </ul>
                </aside>

                {/* Right: phrases for the selected target */}
                <section className="mappings__phrases">
                    {!selectedTarget ? (
                        <p className="mappings__hint">Select a {context.toLowerCase()} to see its phrases.</p>
                    ) : (
                        <>
                            <div className="mappings__phrases-header">
                                <h3>{selectedTarget.name}: phrases</h3>
                                <button
                                    className="mappings__add"
                                    onClick={() => setIsAdding(true)}
                                    disabled={isAdding}
                                    title="Add a phrase"
                                >
                                    +
                                </button>
                            </div>

                            <p className="mappings__hint">
                                A CSV row goes to {selectedTarget.name} when its description contains one of these phrases.
                            </p>

                            {isAdding && (
                                <div className="mappings__new">
                                    <input
                                        autoFocus
                                        type="text"
                                        value={newPhrase}
                                        placeholder="e.g. AMZN MKTP"
                                        onChange={e => setNewPhrase(e.target.value)}
                                        onKeyDown={handleAddKeyDown}
                                        disabled={isSaving}
                                    />
                                    <button onClick={handleAddSave} disabled={isSaving || !newPhrase.trim()}>
                                        {isSaving ? "Saving…" : "Save"}
                                    </button>
                                    <button
                                        onClick={() => { setIsAdding(false); setNewPhrase(""); setError(""); }}
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}

                            {error && <p className="mappings__error">{error}</p>}

                            <div className="mappings__chips">
                                {targetMappings.map(mapping => {
                                    const isPending = pendingIds.has(mapping.id);
                                    return (
                                        <span
                                            key={mapping.id}
                                            className={"mappings__chip" + (isPending ? " mappings__chip--pending" : "")}
                                        >
                                            {mapping.phrase}
                                            <button
                                                className="mappings__chip-remove"
                                                onClick={() => handleDelete(mapping)}
                                                disabled={isPending}
                                                title="Remove phrase"
                                            >
                                                −
                                            </button>
                                        </span>
                                    );
                                })}
                                {targetMappings.length === 0 && !isAdding && (
                                    <p className="mappings__hint">No phrases yet. Click + to add one.</p>
                                )}
                            </div>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}

export default ManageMappings;