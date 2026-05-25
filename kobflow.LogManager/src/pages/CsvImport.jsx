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

    const handleConfirm = async () => {
        await fetch('/api/bulk-insert-expenses', {
            method: 'POST',
            body: JSON.stringify(expenses)
        })
        setStage('done')
    }

        return(
             <div id="CsvImport">
                <div onClick={()=>setStage("input")}>restart</div>
                <div className={`page ${stage=="input"?"active":"non-active"}`}>
                    <DropZone content={csvText} onChange={setCsvText}></DropZone>       
                    <div className="submitBtn" onClick={handleParse}>submit</div>
                </div>
                <div className={`page ${stage=="review"?"active":"non-active"}`}>
                     <ExpenseGrid expenses= {expenses}
                          onExpensesChange={setExpenses} 
                             onConfirm={handleConfirm}/>
                    
                </div>
            </div>

        )
}

export {CsvImport};