import { useEffect, useState } from "react";
import '../components/DropZone.css';
function DropZone(props)
{
    console.log(props)

    function changedDropZone(e)
    {   
        props.onChange(e.target.value);
    }

    return (
        <div id="dropZone"> 
            <textarea defaultValue={props.content}
                onChange={changedDropZone}
            >
               
            </textarea>
        
        </div>

    )
}


export default DropZone;