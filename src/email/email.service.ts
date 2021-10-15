import { Injectable, Logger } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class EmailService {
  private nodemailerTransport: Mail;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      service: configService.get('EMAIL_SERVICE'),
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendMail(html: string, subject: string, to: string) {
    const info = await this.nodemailerTransport.sendMail({
      from: '"Juris ⚖️" <' + this.configService.get('EMAIL_USER') + '>',
      to: to,
      subject: subject,
      html: html,
    });

    this.logger.debug('Email sent:');
    console.log(info);

    return info;
  }
}
