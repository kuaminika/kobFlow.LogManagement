import { useEffect, useState } from "react";
import ExpenseGrid from "../components/ExpenseGrid";
import DropZone from "../components/DropZone";
import "./CsvImport.css";
function CsvImport(props)
{

    const {kCourrier,configs} = props;
    const [csvText, setCsvText] = useState('temp')
    const [expenses, setExpenses] = useState([])  // what comes back from parse
    const [stage, setStage] = useState('input')   // 'input' | 'review' | 'done'
    const [kobHolder, setKobHolder] = useState({                        "id": -1,
                        "name": "unkown account",
                        "ownerId": -1
                    }) ;
    const [kobHolders, setKobHolders] = useState([]) ;

    console.log("CSVImport loading")
    const handleParse = async () => {
        console.log("will send",csvText)
        console.log("at:",`${configs.VITE_URL_IMPORTSERVICE_BASE}/parse-csv-expenses`);
      
      const csvContent = csvText;
      const ownerId = 1; 
       const data = await kCourrier.post(`${configs.VITE_URL_IMPORTSERVICE_BASE}/parse-csv-expenses`,{csvContent, ownerId} );
        
        setExpenses(data.expenses)
        setStage('review')
    }

    useEffect(() => {
        props.kobHolderLoader.Load().then(data => setKobHolders(data))
            .catch(err => console.error('Failed to fetch kobHolders:', err, configs.VITE_URL_KOBHOLDER));
       
    }, []); // empty array = runs once on mount

    const handleConfirm = async () => {
        expenses.forEach(e=>e.kobHolderId = kobHolder.id);

        const data = await  kCourrier.post(`${configs.VITE_URL_IMPORTSERVICE_BASE}/bulk-insert-expenses`, {expenses});
       
        console.log("bulk insert result:", data)
        setStage('done')
    }

        return(
              
             <div id="CsvImport">
                <nav className="stage-nav">
                    <div onClick={()=>setStage("input")    }  className={`stage ${stage=="input"?"active":"non-active"}`}>1. Input</div>
                    <div onClick={()=>setStage("review")    } className={`stage ${stage=="review"?"active":"non-active"}`}>2. Review</div>
                    <div onClick={()=>setStage("done")    } className={`stage ${stage=="done"?"active":"non-active"}`}>3. Done</div>
                </nav>
                
                <div className={`page ${stage=="input"?"active":"non-active"}`}>
                    <select onChange={e=>setKobHolder(JSON.parse(e.target.value))} value={JSON.stringify(kobHolder)}>
                        <option value={JSON.stringify({id:-1,name:"unkown account",ownerId:-1})}>Select kobHolder</option>
                        {kobHolders?.map(kh=> <option key={kh.id} value={JSON.stringify(kh)}>{kh.name}</option>)}
                    </select>
                    <DropZone content={csvText} onChange={setCsvText}></DropZone>       
                    <div className="submitBtn" onClick={handleParse}>submit</div>
                </div>
                <div className={`page ${stage=="review"?"active":"non-active"}`}>
                     <ExpenseGrid expenses= {expenses}
                          onExpensesChange={setExpenses} 
                          kobHolder={kobHolder}
                             onConfirm={handleConfirm}
                            configs={configs}
                            merchantLoader = { props.merchantLoader}
                            expenseCategoryLoader = { props.expenseCategoryLoader} />
                    
                </div>
            </div>

        )
}

export {CsvImport};