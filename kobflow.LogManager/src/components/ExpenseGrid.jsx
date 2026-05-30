import { useState,useEffect } from "react";
import {kCourrier} from "./../utils/Kourrier";
import Typeahead from "./Typeahead";
import "./ExpenseGrid.css";
function ExpenseGrid(props) {
    const { expenses, onExpensesChange, kobHolder, onConfirm, onCancel, configs,merchantLoader,expenseCategoryLoader } = props;

    const [filters, setFilters] = useState({
        type: 'All',
        merchant: '',
        amountMin: '',
        amountMax: '',
        category:''
    });

    function createMap(items) {
        const map = {};
        items?.forEach(i => map[i.name] = i);
        return map;
    }
    const [merchants, setMerchants] = useState([]);
    const [categories, setCategories] = useState([]);
    const merchantMap = createMap(merchants); 
    const categoryMap = createMap(categories);
    useEffect(() => {
        merchantLoader.Load().then(data => setMerchants(data))
            .catch(err => console.error('Failed to fetch merchants:', err, configs.VITE_URL_MERCHANT));
        expenseCategoryLoader.Load().then(data => setCategories(data))
            .catch(err => console.error('Failed to fetch categories:', err, configs.VITE_URL_EXPENSE_CATEGORY));
   
    }, []); // empty array = runs once on mount

    function updateFilter(field, val) {
        setFilters(prev => ({ ...prev, [field]: val }));
    }

    async function addMissingMerchant(i,name)
    {
        const finalName = typeaheadValues[`${i}_merchant`] || name;
        alert("TODO: add merchant: "+i+finalName)
        const addResult= await kCourrier.post(`${configs.VITE_URL_FORADD}`,{context:"Flows", requestAction:"add", sourceContext:"Merchant", payLoad :{name:finalName}})
        console.log("add merchant result:", addResult)
        const newMerchantList = [...merchants, addResult.subject];
        setMerchants(newMerchantList);
        update(i, { merchantName: addResult.subject.name, merchantId: addResult.subject.id });
    }
    async function addMissingCategory(i,name)
    {
        const finalName = typeaheadValues[`${i}_category`] || name;
        alert("TODO: add category: "+finalName)
        const addResult = await kCourrier.post(`${configs.VITE_URL_FORADD}`,{context:"Flows", requestAction:"add", sourceContext:"ExpenseCategory", payLoad:{name:finalName}})
        console.log("add category result:", addResult)
        const newCategoryList = [...categories, addResult.subject];
        setCategories(newCategoryList);
        update(i, { categoryName: addResult.subject.name, categoryId: addResult.subject.id });
    }

    function update(i, fieldOrFields, val) {
        const updated = expenses.map((e, idx) =>
            idx === i
                ? { ...e, ...(typeof fieldOrFields === 'object' ? fieldOrFields : { [fieldOrFields]: val }) }
                : e
        );
        console.log("updating expense index", i, "fieldOrFields:", fieldOrFields, "val:", val);
        console.log("updated expenses:", updated);
        onExpensesChange(updated);
    }

    function toDateInput(val) {
        if (!val) return '';
        return new Date(val).toISOString().slice(0, 10);
    }

    function remove(i) {
        onExpensesChange(expenses.filter((_, idx) => idx !== i));
    }
    console.log("rendering grid with expenses:", expenses);
    const filtered = expenses.filter((e, i) => {
        e._originalIndex = i; // preserve index for update/remove
        if (filters.type === 'Debit' && e.amount <= 0) return false;
        if (filters.type === 'Credit' && e.amount >= 0) return false;
        if (filters.category && !e.categoryName?.toLowerCase().includes(filters.category.toLowerCase())) return false;
        if (filters.merchant && !e.merchantName?.toLowerCase().includes(filters.merchant.toLowerCase())) return false;
        if (filters.amountMin !== '' && Math.abs(e.amount) < parseFloat(filters.amountMin)) return false;
        if (filters.amountMax !== '' && Math.abs(e.amount) > parseFloat(filters.amountMax)) return false;
        return true;
    });

    const [typeaheadValues, setTypeaheadValues] = useState({});

    function setRowTypeahead(i, field, val) {
        setTypeaheadValues(prev => ({ ...prev, [`${i}_${field}`]: val }));
    }

    // Replace the debits/credits/net vars with this:
    const categoryTotals = filtered.reduce((acc, e) => {
        const label = e.categoryName || 'Uncategorized';
        acc[label] = (acc[label] || 0) + e.amount;
        return acc;
    }, {});

    const total = filtered.reduce((sum, e) => sum + e.amount, 0);

    return (
        <div id="ExpenseGrid">
            <div className="holder-bar">
                Cardholder for all expenses: <strong>{kobHolder?.name}.   </strong>Total is : {total.toFixed(2)}
            </div>
            
            <div className="summary-row">
                {Object.entries(categoryTotals).map(([cat, total]) => (
                    <div className="stat" key={cat}>
                        <span>{cat}</span>
                        <strong style={{ color: total < 0 ? 'green' : 'inherit' }}>
                            {total < 0 ? '-' : ''}${Math.abs(total).toFixed(2)}
                        </strong>
                    </div>
                ))}
            </div>

            <div className="filter-bar">
                <input type="text" placeholder="Category..." value={filters.category} 
                    onChange={e => updateFilter('category', e.target.value)} />
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
               
                {( filters.merchant || filters.amountMin || filters.amountMax || filters.category) && (
                    <button onClick={() => setFilters({ type: 'All', merchant: '', amountMin: '', amountMax: '', category: '' })}>
                        Clear filters
                    </button>
                )}

                <span className="filter-count">{filtered.length} of {expenses.length}</span>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Merchant</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((e) => {
                        const i = e._originalIndex;
                        return (
                            <tr key={e.id ?? i}>
                                <td>{e.id}</td>
                                <td><input type="date" value={toDateInput(e.createdDate)} onChange={ev => update(i, 'createdDate', ev.target.value)} /></td>
                                <td><input type="text" value={e.description} onChange={ev => update(i, 'description', ev.target.value)} /></td>
                                <td><Typeahead
                                    value={e.merchantName}
                                    items={merchants}
                                    placeholder="Select Merchant"
                                    onSelect={item =>update(i,{ merchantName: item.name, merchantId: item.id }) }
                                    onInputChange={val => setRowTypeahead(i, 'merchant', val)}
                                /></td>
                                <td><Typeahead
                                    value={e.categoryName}
                                    items={categories}
                                    placeholder="Select Category"
                                    onSelect={item => update(i,{'categoryName': item.name, 'categoryId': item.id}) }
                                    onInputChange={val => setRowTypeahead(i, 'category', val)}
                                /></td>
                                <td><input type="number" step="0.01" value={Math.abs(e.amount).toFixed(2)} onChange={ev => update(i, 'amount', parseFloat(ev.target.value))} /></td>
                                <td><button onClick={() => remove(i)}>✕</button></td>
                                <td>
                                    {(merchantMap[e.merchantName]==undefined )&& <div className={"addMerchantBtn"} onClick={() => addMissingMerchant(i,e.merchantName)}>Add Missing Merchant</div>}
                           
                                </td>
                                <td>
                                    {(categoryMap[e.categoryName]==undefined )&& <div className={"addCategoryBtn"} onClick={() => addMissingCategory(i,e.categoryName)}>Add Missing Category</div>}</td>
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