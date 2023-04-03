import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { OutletModule } from './outlet/outlet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidatorModule } from './common/validators/validator.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'web_scrapper',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ValidatorModule,
    OutletModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
