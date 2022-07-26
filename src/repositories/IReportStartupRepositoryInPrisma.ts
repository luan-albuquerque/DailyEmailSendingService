import { IListReportStartupDTO } from "../dtos/IListReportStartupDTO"

export interface IReportStartupRepositoryInPrisma {
  
    listStartupReprovedAndClosed(): Promise<IListReportStartupDTO[]>
    listStartupAccomplishedAndClosed(): Promise<IListReportStartupDTO[]>
    listStartupConditionallyApprovedAndClosed(): Promise<IListReportStartupDTO[]>
}