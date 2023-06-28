import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { LocalStrategy } from "./local.strategy"
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { JwtStrategy } from './auth.strategy';
import { UsersController } from "./user.controller";
@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({ // 异步创建,防止环境变量在module创建时还无法读取
            useFactory: () => ({
                secret: process.env.AUTH_SECRET, // JWT密码(放到.env)
                signOptions: {
                    expiresIn: '60m' // 60min后过期
                }
            })
        })
    ],
    providers: [LocalStrategy, JwtStrategy, AuthService],
    controllers: [AuthController, UsersController]
})
export class AuthModule {

}