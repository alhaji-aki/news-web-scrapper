import { Controller, Get } from '@nestjs/common';
import { TagService } from '../services/tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async index() {
    return {
      message: 'Get tags',
      data: await this.tagService.index(),
    };
  }
}
