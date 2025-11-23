import { LogItem } from './LogItem.js';

function LogFactory( ) {
    const self = this;
    self.createLogItem = (data) => { 
 
   
        let result= new LogItem(data); 
        return result;
    }

}
const logFactory = new LogFactory();
export { logFactory };