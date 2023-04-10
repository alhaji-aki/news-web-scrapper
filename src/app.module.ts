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
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import redisConfig from './config/redis.config';
import appConfig from './config/app.config';
import { UserModule } from './user/user.module';
import authConfig from './config/auth.config';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import mailConfig from './config/mail.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, authConfig, databaseConfig, mailConfig, redisConfig],
      isGlobal: true,
      expandVariables: true,
    }),
    CacheModule.register({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('redis.host'),
        port: configService.get('redis.port'),
        password: configService.get('redis.password'),
      }),
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
        synchronize: configService.get('app.environment') == 'development',
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          password: configService.get('redis.password'),
        },
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('mail.host'),
          port: +configService.get('mail.port'),
          auth: {
            user: configService.get('mail.auth.username'),
            pass: configService.get('mail.auth.password'),
          },
          ignoreTLS: configService.get('mail.ignoreTLS'),
          secure: configService.get('mail.secure'),
        },
        defaults: {
          from: `"${configService.get('mail.from.name')}" <${configService.get(
            'mail.from.address',
          )}>`,
        },
        template: {
          dir: join(__dirname),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        preview: configService.get<boolean>('mail.preview'),
      }),
    }),
    ScheduleModule.forRoot(),
    ValidatorModule,
    OutletModule,
    CategoryModule,
    ArticleModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
