import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import * as fs from 'fs/promises';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: parseInt(process.env.MAILTRAP_PORT, 10),
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });
  }


  getHtmlTemplatePath(template: string) {
    let templatePath = `src/email/template/${template}.ejs`;
    return templatePath;
  }

  async sendMail(to: string, subject: string,template:string,data:any) {
    

    let templatePath = this.getHtmlTemplatePath(template);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const html = ejs.render(templateContent, data);

    const mailOptions = {
      from: 'no-reply@example.com', // Change this to your preferred "from" email
      to,
      subject,
      html:html
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
