import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.AUTH_SECRET
        })
    }

    async validate(payload: any) {
        // sub是user.id
        return await this.userRepository.findOne({ where: { id: payload.sub } })
    }

    public async hashPassword(password: string): Promise<string> {
        // 参数2是hash的轮数
        return await bcrypt.hash(password, 10)
    }
}