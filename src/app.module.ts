import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { OutletModule } from './outlet/outlet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidatorModule } from './common/validators/validator.module';
import { CategoryModule } from './category/category.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';

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
    ValidatorModule,
    OutletModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
