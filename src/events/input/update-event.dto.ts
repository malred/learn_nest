import { PartialType } from "@nestjs/mapped-types";
import { CreateEventDto } from "./create-event.dto";

// 继承CreateEventDto的所有字段,并且是可选的
export class UpdateEventDto extends PartialType(CreateEventDto) { }