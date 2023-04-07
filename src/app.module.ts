import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { OutletModule } from './outlet/outlet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidatorModule } from './common/validators/validator.module';
import { CategoryModule } from './category/category.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ArticleModule } from './article/article.module';
import databaseConfig from './config/database.config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: +configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        autoLoadEntities: true,
        synchronize: true, // TODO: change this use the app environment
      }),
    }),
    ScheduleModule.forRoot(),
    ValidatorModule,
    OutletModule,
    CategoryModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
