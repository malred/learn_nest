import { Length, IsString, IsDateString } from "class-validator";

export class CreateEventDto {
    @IsString()
    @Length(5, 255, { message: 'the name length is wrong' })
    name: string;
    @Length(5, 255)
    description: string;
    @IsDateString()
    when: string;
    // 分组
    @Length(5, 255)
    // @Length(5, 255, { groups: ['create'] })
    // @Length(10, 20, { groups: ['update'] })
    address: string;
}