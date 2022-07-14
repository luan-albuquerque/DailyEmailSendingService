import { IMailProvider } from "../providers/IMailProvider";
import path from "path";
import Handlebars, { log } from "handlebars";
var fs = require('fs');


class SendScheduledEmailService{

  constructor(
    private reportStartupRepository: IReportStartupRepositoryInPrisma,
    private mailProvider: IMailProvider
    ){}

  async execute(){
   
    var source = fs.readFileSync(path.join(__dirname,'../assets/handlebars/emailDisapprovedStructure.hbs'), 'utf8');

    var template = Handlebars.compile(source);
    // Pegar imagens
    // const attachments =  [{
    //     filename: 'iconMolde.png',
    //     path: path.join( __dirname + '../../../../utils/img/iconMolde.png'),
    //     cid: 'unique@cid'
    //   }]
   const teste = await this.reportStartupRepository.listStartupReprovedAndClosed();
   
   console.log(teste);
   
   
   await this.mailProvider.sendMail({
        from: {
            name: 'SGQ - Sistema de Garantia da Qualidade ',
            email: 'portariatutiplast@gmail.com'
        }, 
        to:{
            name: 'Luan Albuquerque',
            email: 'luan.santos6605@gmail.com',
          
        },
        subject: `Relatorio de Startups - 06 ` , 
        body:  `${JSON.stringify(teste)}`,
        // attachmnts  
    });
   
  }

}

export { SendScheduledEmailService }