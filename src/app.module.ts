import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { OutletModule } from './outlet/outlet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidatorModule } from './common/validators/validator.module';
import { CategoryModule } from './category/category.module';

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
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
