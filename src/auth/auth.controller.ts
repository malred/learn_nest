import { Controller, Get, Post, Request, UseGuards, SerializeOptions, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from "./current-user.decorate";
import { User } from "./user.entity";
import { AuthGuardLocal } from "./auth-guard.LOCAL";
import { AuthGuardJwt } from "./auth-guard.jwt";


@Controller('auth')
@SerializeOptions({
    strategy: 'excludeAll' // 序列化时排除所有,res为空
})
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('login')
    // 路由守卫
    @UseGuards(AuthGuardLocal)
    async login(@CurrentUser() user: User) {
        return {
            userId: user.id,
            token: this.authService.getTokenForUser(user)
        }
    }

    @Get('profile')
    // 传递的'jwt'是策略名,
    // 对应PassportStrategy(从passport-jwt导入就是jwt(默认值)),
    // 可以通过 PassportStrategy(Strategy,'xxx')指定,
    // 会自动找实现类
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async getProfile(@CurrentUser() user: User) {
        return user
    }
}
