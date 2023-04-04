import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { OutletService } from '../services/outlet.service';
import { CreateOutletDto } from '../dto/create-outlet.dto';
import { UpdateOutletDto } from '../dto/update-outlet.dto';
import { CustomBody } from '../../common/decorators/custom-body.decorator';
import { customDecoratorsValidationOptions } from '../../config/validation.config';

@Controller('outlets')
export class OutletController {
  constructor(private readonly outletService: OutletService) {}

  @Get()
  async index() {
    return {
      message: 'Get outlets',
      data: await this.outletService.index(),
    };
  }

  @Post()
  async create(
    @CustomBody(new ValidationPipe(customDecoratorsValidationOptions))
    createOutletDto: CreateOutletDto,
  ) {
    return {
      message: 'Outlet created succcessfully.',
      data: await this.outletService.create(createOutletDto),
    };
  }

  @Get(':outlet')
  async show(@Param('outlet') outlet: string) {
    return {
      message: 'Get outlet',
      data: await this.outletService.show(outlet),
    };
  }

  @Patch(':outlet')
  async update(
    @Param('outlet') outlet: string,
    @CustomBody('outlet', new ValidationPipe(customDecoratorsValidationOptions))
    updateOutletDto: UpdateOutletDto,
  ) {
    return {
      message: 'Outlet updated succcessfully.',
      data: await this.outletService.update(outlet, updateOutletDto),
    };
  }

  @Delete(':outlet')
  async destroy(@Param('outlet') outlet: string) {
    return {
      message: 'Outlet deleted successfully.',
      data: await this.outletService.delete(outlet),
    };
  }
}
