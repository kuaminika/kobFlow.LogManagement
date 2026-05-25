import { useState } from "react";

function ExpenseGrid(props) {
    const { expenses, onExpensesChange, kobHolderName, onConfirm, onCancel } = props;

    const [filters, setFilters] = useState({
        type: 'All',
        merchant: '',
        amountMin: '',
        amountMax: ''
    });

    function updateFilter(field, val) {
        setFilters(prev => ({ ...prev, [field]: val }));
    }

    function update(i, fieldOrFields, val) {
        const updated = expenses.map((e, idx) =>
            idx === i
                ? { ...e, ...(typeof fieldOrFields === 'object' ? fieldOrFields : { [fieldOrFields]: val }) }
                : e
        );
        onExpensesChange(updated);
    }

    function toDateInput(val) {
        if (!val) return '';
        return new Date(val).toISOString().slice(0, 10);
    }

    function remove(i) {
        onExpensesChange(expenses.filter((_, idx) => idx !== i));
    }

    const filtered = expenses.filter((e, i) => {
        e._originalIndex = i; // preserve index for update/remove
        if (filters.type === 'Debit' && e.amount <= 0) return false;
        if (filters.type === 'Credit' && e.amount >= 0) return false;
        if (filters.merchant && !e.merchantName?.toLowerCase().includes(filters.merchant.toLowerCase())) return false;
        if (filters.amountMin !== '' && Math.abs(e.amount) < parseFloat(filters.amountMin)) return false;
        if (filters.amountMax !== '' && Math.abs(e.amount) > parseFloat(filters.amountMax)) return false;
        return true;
    });

    const debits = expenses.filter(e => e.amount > 0).reduce((s, e) => s + e.amount, 0);
    const credits = expenses.filter(e => e.amount < 0).reduce((s, e) => s + Math.abs(e.amount), 0);
    const net = credits - debits;

    return (
        <div id="ExpenseGrid">
            <div className="holder-bar">
                Cardholder for all expenses: <strong>{kobHolderName}</strong>
            </div>

            <div className="summary-row">
                <div className="stat"><span>Debits</span><strong>${debits.toFixed(2)}</strong></div>
                <div className="stat"><span>Credits</span><strong>${credits.toFixed(2)}</strong></div>
                <div className="stat"><span>Net</span><strong style={{ color: net >= 0 ? 'green' : 'red' }}>{net >= 0 ? '+' : ''}${net.toFixed(2)}</strong></div>
            </div>

            <div className="filter-bar">
                <select value={filters.type} onChange={e => updateFilter('type', e.target.value)}>
                    <option>All</option>
                    <option>Debit</option>
                    <option>Credit</option>
                </select>

                <input
                    type="text"
                    placeholder="Merchant..."
                    value={filters.merchant}
                    onChange={e => updateFilter('merchant', e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Min $"
                    value={filters.amountMin}
                    onChange={e => updateFilter('amountMin', e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max $"
                    value={filters.amountMax}
                    onChange={e => updateFilter('amountMax', e.target.value)}
                />

                {(filters.type !== 'All' || filters.merchant || filters.amountMin || filters.amountMax) && (
                    <button onClick={() => setFilters({ type: 'All', merchant: '', amountMin: '', amountMax: '' })}>
                        Clear filters
                    </button>
                )}

                <span className="filter-count">{filtered.length} of {expenses.length}</span>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Merchant</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((e) => {
                        const i = e._originalIndex;
                        return (
                            <tr key={e.id ?? i}>
                                <td><input type="date" value={toDateInput(e.createdDate)} onChange={ev => update(i, 'createdDate', ev.target.value)} /></td>
                                <td><input type="text" value={e.description} onChange={ev => update(i, 'description', ev.target.value)} /></td>
                                <td><input type="text" value={e.merchantName} onChange={ev => update(i, 'merchantName', ev.target.value)} /></td>
                                <td><input type="text" value={e.categoryName} onChange={ev => update(i, 'categoryName', ev.target.value)} /></td>
                                <td><input type="number" step="0.01" value={Math.abs(e.amount).toFixed(2)} onChange={ev => update(i, 'amount', parseFloat(ev.target.value))} /></td>
                                <td><button onClick={() => remove(i)}>✕</button></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="actions">
                <button onClick={onCancel}>Cancel</button>
                <button onClick={() => onConfirm(expenses)}>Confirm & save</button>
            </div>
        </div>
    );
}

export default ExpenseGrid;