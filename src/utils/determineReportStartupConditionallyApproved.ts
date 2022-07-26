import dayjs from "dayjs";
import { IFillReportStartupDTO } from "../dtos/IFillReportStartupDTO";
import { IListReportStartupDTO } from "../dtos/IListReportStartupDTO";


function DetermineReportStartupConditionallyApproved(){
    
     
   function determineStatusDefaultQuestions({default_questions}: IFillReportStartupDTO){

     let verifyStatus = { message: "", question: "" };
    
   default_questions.map(
        (question) => {
           if(Number(question.status) === 3){
              // return question
              verifyStatus = { message: "Aprovado condicionalmente em Perguntas Padrões", question: question.title }
           }
        },
      );

      return verifyStatus
  }

  
   function determineStatusSpecificQuestions({specific_questions}: IFillReportStartupDTO){
     let verifyStatus = { message: "", question: "" };


    specific_questions.map(
        (question) => {
           if(Number(question.status) === 3){
              // return questio
              verifyStatus = { message: "Aprovado condicionalmente em Perguntas Especificas", question: question.question }
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
           verifyStatus = { message: "Aprovado condicionalmente em Metrologia" };
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

async function FinalResultReportStartupConditionallyApproved(startupConditionallyApproved: IListReportStartupDTO[]){
   
   var data = [] 

   await Promise.all(
 
   data =  startupConditionallyApproved.map( (item) => {


      
      const default_questions = JSON.parse(item.report_startup_fill[0].default_questions_responses[0].default_questions);
      const specific_questions = JSON.parse(item.report_startup_fill[0].specific_questions_responses.specific_questions) || [];
  
      const  default_q =   DetermineReportStartupConditionallyApproved().determineStatusDefaultQuestions({default_questions});
      const specific_q =   DetermineReportStartupConditionallyApproved().determineStatusSpecificQuestions({specific_questions});
      // const metro      =   DetermineReportStartupConditionallyApproved().determineStatusVariablesByMetrology({metrology: item.metrology});


   return {
          code_startup: item.code_startup,
          code_op: item.op.code_op,
          desc_product: item.op.desc_product,
          client: item.op.client,
          status: item.status.description,
          machine: item.op.machine,
          start_time: dayjs(item.start_time).format('DD/MM/YYYY HH:mm:ss'),
          default_questions : default_q,
          specific_questions : specific_q,
         //  metrology:  metro,
         
        };
  
    })

    );
    
    return data;
   



 }

export { FinalResultReportStartupConditionallyApproved }