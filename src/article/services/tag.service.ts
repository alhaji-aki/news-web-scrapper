import { Injectable } from '@nestjs/common';

@Injectable()
export class TagService {
  index() {
    return `This action returns all tags`;
  }
}
