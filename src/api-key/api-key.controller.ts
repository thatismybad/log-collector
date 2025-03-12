import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { Req } from '@nestjs/common';

@Controller('api-key')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  create(@Body() createApiKeyDto: CreateApiKeyDto) {
    return this.apiKeyService.create(createApiKeyDto);
  }

  @Get()
  findAll(@Query() query, @Req() req) {
    if (!isApiKeyValid(req)) {
      return { message: 'Unauthorized' };
    }
    return this.apiKeyService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    if (!isApiKeyValid(req)) {
      return { message: 'Unauthorized' };
    }
    return this.apiKeyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateApiKeyDto: UpdateApiKeyDto,
    @Req() req,
  ) {
    if (!isApiKeyValid(req)) {
      return { message: 'Unauthorized' };
    }
    return this.apiKeyService.update(id, updateApiKeyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    if (!isApiKeyValid(req)) {
      return { message: 'Unauthorized' };
    }
    return this.apiKeyService.remove(id);
  }
}

function isApiKeyValid(req) {
  return (
    req.headers.authorization &&
    req.headers.authorization.split(' ').length > 1 &&
    req.headers.authorization.split(' ')[0] !== process.env.API_KEY
  );
}
