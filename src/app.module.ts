import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { FileUploadModule } from './file-upload/file-upload.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailModule } from './email/email.module';

@Module({
  imports: [UsersModule, DatabaseModule, ProductModule, FileUploadModule, AuthModule, ConfigModule.forRoot(), ScheduleModule.forRoot(),EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
