import { Module,forwardRef } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [
    forwardRef(() => EmailModule),
    TypeOrmModule.forFeature([Booking]),

  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],

})
export class BookingModule {}
