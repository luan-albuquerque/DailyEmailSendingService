import dayjs from "dayjs";
import { IFillReportStartupDTO } from "../dtos/IFillReportStartupDTO";
import { IListReportStartupDTO } from "../dtos/IListReportStartupDTO";


 function determineStatusReportStartup(status:number): String {

   if(status == 1){
      return "Aprovado"
   }else if(status == 2){
      return "Reprovado"
   }else if( status == 3){
      return "Aprovado com condicional";
   }else{
      return "Status Indeterminado"
   }
   
}

async function FinalResultReportStartupApproved(startupApproved: IListReportStartupDTO[]){
   
   var data = [] 

   await Promise.all(
 
   data = startupApproved.map( (item) => {

   return {
          code_startup: item.code_startup,
          code_op: item.op.code_op,
          desc_product: item.op.desc_product,
          client: item.op.client,
          machine: item.op.machine,
          status: determineStatusReportStartup(item.status.id),
          final_time: dayjs(item.final_time).format('DD/MM/YYYY HH:mm:ss'),

        };
  
    })

    );
    
    return data;
   
startupApproved
 }

export { FinalResultReportStartupApproved }