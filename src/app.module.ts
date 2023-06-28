import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';
import { AppJapanService } from './app.japan.service';
import { AppDummy } from './app.dummy';
import { ConfigModule } from '@nestjs/config';
import { SchoolModule } from './school/school.module';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { AuthModule } from './auth/auth.module';
@Module({
  // 导入orm框架,配置数据库连接
  imports: [
    // 配置这个,可以读取根目录的.env文件
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      expandVariables: true,
      load: [ormConfig]
    }),
    TypeOrmModule.forRootAsync({
      useFactory: process.env.NODE_ENV !==
        'production' ? ormConfig : ormConfigProd
    }),
    // 导入子模块
    EventsModule,
    SchoolModule,
    AuthModule],
  // 引入controller
  controllers: [AppController],
  providers: [
    // 提供类
    {
      provide: AppService,
      useClass: AppJapanService
    },
    // 提供变量
    {
      provide: 'APP_NAME',
      useValue: 'Nest Events Backend!'
    },
    // 提供函数调用结果
    {
      provide: 'MESSAGE',
      inject: [AppDummy],
      useFactory: (app) => `${app.dummy()}`
    },
    AppDummy
  ],
})
export class AppModule { }
