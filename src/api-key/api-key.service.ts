import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { PrismaService } from 'src/db/prisma.service';

const defaultParams = {
  page: 1,
  limit: 5,
};

@Injectable()
export class ApiKeyService {
  constructor(private db: PrismaService) {}
  create(createApiKeyDto: CreateApiKeyDto) {
    return this.db.apiKey.create({
      data: createApiKeyDto,
    });
  }

  async findAll(params: QueryParams) {
    const { page, limit, sort, search } = params;
    const pageInt =
      !parseInt(page + '') || parseInt(page + '') < 1
        ? defaultParams.page
        : parseInt(page + '') || defaultParams.page;
    const limitInt =
      !parseInt(limit + '') || parseInt(limit + '') < 1
        ? defaultParams.limit
        : parseInt(limit + '') || defaultParams.limit;

    const result = await this.db.apiKey.findMany({
      skip: (pageInt - 1) * limitInt,
      take: limitInt,
      orderBy: sort
        ? {
            [sort.split('_')[0]]: sort.split('_')[1],
          }
        : {
            id: 'asc',
          },
      ...(search && {
        where: {
          data: {
            contains: search,
          },
        },
      }),
    });

    const total = await this.db.apiKey.count();

    return {
      data: result,
      page: pageInt,
      limit: limitInt,
      total,
      totalPages: Math.ceil(total / limitInt),
    };
  }

  findOne(id: string) {
    return this.db.apiKey.findUnique({
      where: { id },
    });
  }

  update(id: string, updateApiKeyDto: UpdateApiKeyDto) {
    return this.db.apiKey.update({
      where: { id },
      data: updateApiKeyDto,
    });
  }

  remove(id: string) {
    return this.db.apiKey.delete({
      where: { id },
    });
  }
}
