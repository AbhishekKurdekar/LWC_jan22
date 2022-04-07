import { LightningElement, track, wire} from 'lwc';
import getAccounts from '@salesforce/apex/getRecordDataController.getAccounts';

export default class GetDataDisplayData extends LightningElement {
     @track columns = [
          { label: 'Name', fieldName: 'Name' },
          { label: 'Id', fieldName: 'Id'}
      ];
     @track accountList;

     //Method 2
     @wire (getAccounts) wiredAccounts({data,error}){
          if (data) {
               this.accountList = data;
          console.log(data); 
          } else if (error) {
          console.log(error);
          }
     }
}

import { LightningElement, wire, track, api } from 'lwc';
import getCaseList from '@salesforce/apex/dsiplaycases.getCaseList';
import getNext from '@salesforce/apex/dsiplaycases.getNext';
import getPrevious from '@salesforce/apex/dsiplaycases.getPrevious';
import TotalRecords from '@salesforce/apex/dsiplaycases.TotalRecords';

/* eslint-disable no-console */
 /* eslint-disable no-alert */

 const COLS = [
    { label: 'Case Number', fieldName: 'CaseNumber' },
    { label: 'Subject', fieldName: 'Subject' }

 ];
export default class displaycases extends LightningElement {
@track columns = COLS;
@track v_Offset=0;
@track v_TotalRecords;
@track page_size = 10;

//Fetching records from apex class
@wire(getCaseList, { v_Offset: '$v_Offset', v_pagesize: '$page_size' }) cases;

//Executes on the page load
connectedCallback() {
    TotalRecords().then(result=>{
        this.v_TotalRecords = result;
    });
}

previousHandler2(){
    getPrevious({v_Offset: this.v_Offset, v_pagesize: this.page_size}).then(result=>{
        this.v_Offset = result;
        if(this.v_Offset === 0){
            this.template.querySelector('c-paginator').changeView('trueprevious');
        }else{
            this.template.querySelector('c-paginator').changeView('falsenext');
        }
    });
}
nextHandler2(){
    getNext({v_Offset: this.v_Offset, v_pagesize: this.page_size}).then(result=>{
        this.v_Offset = result;
       if(this.v_Offset + 10 > this.v_TotalRecords){
            this.template.querySelector('c-paginator').changeView('truenext');
        }else{
            this.template.querySelector('c-paginator').changeView('falseprevious');
        }
    });
}

changeHandler2(event){
    const det = event.detail;
    this.page_size = det;
}
firstpagehandler(){
    this.v_Offset = 0;
    this.template.querySelector('c-paginator').changeView('trueprevious');
    this.template.querySelector('c-paginator').changeView('falsenext');
}
lastpagehandler(){
    this.v_Offset = this.v_TotalRecords - (this.v_TotalRecords)%(this.page_size);
    this.template.querySelector('c-paginator').changeView('falseprevious');
    this.template.querySelector('c-paginator').changeView('truenext');
}

}
