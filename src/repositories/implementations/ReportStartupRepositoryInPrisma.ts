import { PrismaClient } from "@prisma/client"
import dayjs from "dayjs"
import { IListReportStartupDTO } from "../../dtos/IListReportStartupDTO"
import { prismaClient } from "../../prismaClient"
import { IReportStartupRepositoryInPrisma } from "../IReportStartupRepositoryInPrisma"

class ReportStartupRepositoryInPrisma implements IReportStartupRepositoryInPrisma{


   async listStartupReprovedAndClosed(): Promise<IListReportStartupDTO[]> {
    const dataAtual = new Date(dayjs().locale('pt-br').subtract(4,'hour').format('YYYY-MM-DDTHH:mm:ssZ'))
    const dataAnterior = new Date(dayjs().locale('pt-br').subtract(28, 'hours').format('YYYY-MM-DDTHH:mm:ss'))

    console.log({
        dataAtual,
        dataAnterior
    });
    
     
       return prismaClient.reportStartup.findMany({
            select: {
                open: true,
                code_startup: true,
                op:{
                    select:{
                        client: true,
                        code_op: true,
                        code_product: true,
                        desc_product: true,
                        machine: true,
                        product_mold: true,

                    }
                },
                userThatFill:{
                    select:{
                        name: true,
                    }
                },
                
                start_time: true,
                report_startup_fill: {
                    include: {
                        default_questions_responses: true,
                        specific_questions_responses: true
                    },
                },
                metrology: {
                    select:{
                        id: true,
                        cavity: true,
                        variable: true,
                        value: true,
                        metrology: true,
                        sendToMetrology: true,
                    }
                },
            },
            where: {
                filled: true,
                // open: true,
                fk_status: 2,
                AND: [
                    { 
                     start_time: {
                        gte: dataAnterior,
                    }
                   },
                    { 
                      start_time: {
                        lte:  dataAtual,
                     }
                    }
                   
                  ]
            }
        })
    }

    
    async listStartupAccomplishedAndClosed(): Promise<IListReportStartupDTO[]> {
        const dataAtual = new Date(dayjs().locale('pt-br').subtract(4,'hour').format('YYYY-MM-DDTHH:mm:ssZ'))
        const dataAnterior = new Date(dayjs().locale('pt-br').subtract(28, 'hours').format('YYYY-MM-DDTHH:mm:ss'))
    
        return prismaClient.reportStartup.findMany({
             select: {
                 open: true,
                 code_startup: true,
                 status: {
                    select:{
                        id: true,
                        description: true,
                    }
                 },
                 op:{
                     select:{
                         client: true,
                         code_op: true,
                         code_product: true,
                         desc_product: true,
                         machine: true,
                         product_mold: true,
 
                     }
                 },
                 userThatFill:{
                     select:{
                         name: true,
                     }
                 },
                 
                 start_time: true
             },
             where: {
                 filled: true,
                //  open: true,
                 status:{
                      id: 1
                 },
                 AND: [
                    { 
                     start_time: {
                        gte: dataAnterior,
                    }
                   },
                    { 
                      start_time: {
                        lte:  dataAtual,
                     }
                    }
                   
                  ]
             }
         })
     }


      
     async listStartupConditionallyApprovedAndClosed(): Promise<IListReportStartupDTO[]> {
        const dataAtual = new Date(dayjs().locale('pt-br').subtract(4,'hour').format('YYYY-MM-DDTHH:mm:ssZ'))
        const dataAnterior = new Date(dayjs().locale('pt-br').subtract(28, 'hours').format('YYYY-MM-DDTHH:mm:ss'))
    
        return prismaClient.reportStartup.findMany({
             select: {
                 open: true,
                 code_startup: true,
                 status: {
                    select:{
                        id: true,
                        description: true,
                    }
                 },
                 op:{
                     select:{
                         client: true,
                         code_op: true,
                         code_product: true,
                         desc_product: true,
                         machine: true,
                         product_mold: true,
 
                     }
                 },
                 userThatFill:{
                     select:{
                         name: true,
                     }
                 },
                 
                 start_time: true,
                 report_startup_fill: {
                    include: {
                        default_questions_responses: true,
                        specific_questions_responses: true
                    },
                },
             },
             where: {
                filled: true,
                // open: true,
                 status:{
                  id: 3
                 },
                 AND: [
                    { 
                     start_time: {
                        gte: dataAnterior,
                    }
                   },
                    { 
                      start_time: {
                        lte:  dataAtual,
                     }
                    }
                   
                  ]
             }
         })
     }

}

export { ReportStartupRepositoryInPrisma }