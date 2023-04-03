import { Allow } from 'class-validator';

export class BaseDto {
  @Allow()
  // eslint-disable-next-line @typescript-eslint/ban-types
  entity?: Function;
}
