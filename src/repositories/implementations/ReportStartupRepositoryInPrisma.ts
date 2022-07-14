import { PrismaClient } from "@prisma/client"
import { prismaClient } from "../../prismaClient"

class ReportStartupRepositoryInPrisma implements IReportStartupRepositoryInPrisma{


   async listStartupReprovedAndClosed(): Promise<any> {
       return prismaClient.reportStartup.findMany({
            select: {
                open: true,
                code_startup: true,
                default_questions_disapproved: true
            },
            where: {
                filled: true,
                open: false,
             
            }
        })
    }



}

export { ReportStartupRepositoryInPrisma }