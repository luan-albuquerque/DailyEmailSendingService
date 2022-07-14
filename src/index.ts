import schedule from 'node-schedule'
import { MailProvider } from './providers/implementations/MailProviders';
import { ReportStartupRepositoryInPrisma } from './repositories/implementations/ReportStartupRepositoryInPrisma';
import { SendScheduledEmailService } from './services/SendScheduledEmailService';

const rule = new schedule.RecurrenceRule();

rule.hour = 16;
rule.minute = 55;
rule.tz = 'America/Manaus';

const mailProvider = new MailProvider();
const reportStartupRepositoryInPrisma = new ReportStartupRepositoryInPrisma()
const sendScheduledEmailService = new SendScheduledEmailService(reportStartupRepositoryInPrisma,mailProvider);

// const job = schedule.scheduleJob(rule, async function(res){

    sendScheduledEmailService.execute();

// });


