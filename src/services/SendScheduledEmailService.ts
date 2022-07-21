import { IMailProvider } from "../providers/IMailProvider";
import path from "path";
import Handlebars, { log, template } from "handlebars";
import {  FinalResultReportStartupDisapproved } from "../utils/determineReportStartupDisapproved";
import { IListReportStartupDTO } from "../dtos/IListReportStartupDTO";
import dayjs from "dayjs";
import { IReportStartupRepositoryInPrisma } from "../repositories/IReportStartupRepositoryInPrisma";
import { FinalResultReportStartupApproved } from "../utils/determineReportStartuApproved";
var fs = require('fs');


class SendScheduledEmailService{

  constructor(
    private reportStartupRepository: IReportStartupRepositoryInPrisma,
    private mailProvider: IMailProvider
    ){}

  async execute(){
   
    var source = fs.readFileSync(path.join(__dirname,'../assets/handlebars/emailDisapprovedStructure.hbs'), 'utf8');
    
    const attachments =  [{
      filename: 'logotuti.png',
      path:  path.join( __dirname + '../../assets/imgs/logotuti.png'),
      cid: 'unique@cid'
    }]


const startupAccomplished: IListReportStartupDTO[] = await this.reportStartupRepository.listStartupAccomplishedAndClosed();
const startupDisapproved: IListReportStartupDTO[] = await this.reportStartupRepository.listStartupReprovedAndClosed();

const data = await FinalResultReportStartupDisapproved(startupDisapproved);
const data2 = await FinalResultReportStartupApproved(startupAccomplished)


Handlebars.registerPartial(
  "startup", 
  `<tr> <td>{{startup.code_startup}}</td> <td>{{startup.code_op}}</td> <td>{{startup.desc_product}}</td> <td>{{startup.client}}</td> <td>{{startup.final_time}}</td> <td>{{startup.machine}}</td> <td style='color: #FF5349'> {{ startup.default_questions.message }} - {{startup.default_questions.question}} <br> {{ startup.specific_questions.message}} - {{startup.specific_questions.question}} <br> {{ startup.metrology.message}}</td> </tr>`,
 );
 
 Handlebars.registerPartial(
  "startupApproved", 
  `<tr> <td>{{startupApproved.code_startup}}</td> <td>{{startupApproved.code_op}}</td> <td>{{startupApproved.desc_product}}</td> <td>{{startupApproved.client}}</td> <td>{{startupApproved.status}}</td> <td>{{startupApproved.final_time}}</td>  <td>{{startupApproved.machine}}</td> </tr>`,
 );

var template = Handlebars.compile(source);

const dataAtual = dayjs().locale('pt-br').subtract(4,'hour').format('DD/MM/YYYY');
const dataAnterior = dayjs().locale('pt-br').subtract(28, 'hours').format('DD/MM/YYYY');


 this.mailProvider.sendMail({
        from: {
            name: 'SGQ - Sistema de Garantia da Qualidade',
            email: `${process.env.EMAIL_MAIL}`
        }, 
        to:{
            name: 'Colaboradores SGQ',
            email: 'luan.santos@tutiplast.com.br',
          
        },
        subject: `Relatorio de Startups | ${dataAnterior} - ${dataAtual}` , 
        body: template({
          startupDisapproved: data,
          startupAccomplished: data2,
          dataAnterior
        }),
        attachments  
    });
   
  }

}

export { SendScheduledEmailService }