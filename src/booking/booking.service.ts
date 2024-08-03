import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract/abstract.service';
import { EmailService } from 'src/email/email.service';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingService extends AbstractService<Booking>  {

  constructor(
    @Inject(forwardRef(() => EmailService)) private emailService: EmailService,
    @InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>,
  ) {
    super(bookingRepository);
  }


  async createBooking(data:CreateBookingDto) {

   try{

    // await  this.create(data);

    const emailData = {
     client_name:`${data.firstName}`,
     type:data.type,
     date:data.date,
     address:data.address
   }
 
    await this.emailService.sendMail("makaveli@email.com", "Welcome","Booking",emailData);
 
    return { message: 'Booking Successful' };

   }catch(error){
    return Promise.reject(error);
   }

  }


}
