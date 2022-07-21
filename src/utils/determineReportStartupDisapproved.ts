import dayjs from "dayjs";
import { IFillReportStartupDTO } from "../dtos/IFillReportStartupDTO";
import { IListReportStartupDTO } from "../dtos/IListReportStartupDTO";

 function DetermineReportStartupDisapproved(){
    
     
    function determineStatusDefaultQuestions({default_questions}: IFillReportStartupDTO){

      let verifyStatus = { message: "", question: "" };
     
    default_questions.map(
         (question) => {
            if(Number(question.status) === 2){
               // return question
               verifyStatus = { message: "Reprovado em Perguntas Padrões", question: question.title }
            }
         },
       );

       return verifyStatus
   }
   
    function determineStatusSpecificQuestions({specific_questions}: IFillReportStartupDTO){
      let verifyStatus = { message: "", question: "" };


     specific_questions.map(
         (question) => {
            if(Number(question.status) === 2){
               // return question
               verifyStatus = { message: "Reprovado em Perguntas Especificas", question: question.question }
            }
         },
       );
  
       return verifyStatus


   }

    function determineStatusVariablesByMetrology({metrology}: IFillReportStartupDTO){

      let verifyStatus = { message: "" };
      if (!metrology) {
        return verifyStatus;
      }
      
        // eslint-disable-next-line array-callback-return
        metrology.map((item) => {
          if (item.value > item.variable.max || item.value < item.variable.min) {
            verifyStatus = { message: "Startup reprovada em Metrologia" };
          }
        });
  
  
      return verifyStatus;

   }

   return {
      determineStatusDefaultQuestions,
      determineStatusSpecificQuestions,
      determineStatusVariablesByMetrology
   }
}


async function FinalResultReportStartupDisapproved(startupDisapproved: IListReportStartupDTO[]){
   
   var data = [] 

   await Promise.all(
 
   data =  startupDisapproved.map( (item) => {

      const default_questions = JSON.parse(item.report_startup_fill[0].default_questions_responses[0].default_questions);
      const specific_questions = JSON.parse(item.report_startup_fill[0].specific_questions_responses.specific_questions);
  
      const  default_q =   DetermineReportStartupDisapproved().determineStatusDefaultQuestions({default_questions});
      const specific_q =   DetermineReportStartupDisapproved().determineStatusSpecificQuestions({specific_questions});
      const metro      =   DetermineReportStartupDisapproved().determineStatusVariablesByMetrology({metrology: item.metrology});


   return {
          code_startup: item.code_startup,
          code_op: item.op.code_op,
          desc_product: item.op.desc_product,
          client: item.op.client,
          machine: item.op.machine,
          final_time: dayjs(item.final_time).format('DD/MM/YYYY HH:mm:ss'),
          default_questions : default_q,
          specific_questions : specific_q,
          metrology:  metro,
         
        };
  
    })

    );
    
    return data;
   
//   return  {
//       default_questions : default_q,
//       specific_questions : specific_q,
//       metrology:  metro,
//      }


 }

export { FinalResultReportStartupDisapproved }