import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { BookingModule } from './booking/booking.module';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env']
    }),
     TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
      migrations: ['dist/db/migrations/*.js'],
      // cli: {
      //   migrationsDir: 'src/db/migrations',
      // },
      entities: [
        'dist/**/*.entity.js',
        'dist/**/entities/*.entity.js',
        'src/**/entities/*.entity.js',
        './build/src/entity/*.js',
      ],
      cache: false,
    }),
    TypeOrmModule.forFeature(),
    UserModule, 
    BookingModule,
     ProductModule,
     AuthModule,
     EmailModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
