import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  UseGuards,
  Res,
} from '@nestjs/common'
import { Response as ExpressResponse } from 'express'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { JwtAuthGuard } from '@/guards/jwt-auth.guard'
import { RolesGuard } from '@/guards/role.guard'
import { Role } from '@/common/enums/role.enum'
import { Roles } from '@/decorator/roles.decorator'
import Response from '@/common/utils/Response'

@Controller('categories')
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: ExpressResponse,
  ) {
    const data = await this.categoriesService.create(createCategoryDto)
    res.location(`/categories/${data.id}`).send(
      Response.success({
        code: 201,
        message: 'Category has been created successfully',
        data,
      }),
    )
  }

  @Get()
  @Roles(Role.USER, Role.ADMIN, Role.SUPERADMIN)
  async findAll(@Query('limit') limit?: number, @Query('page') page?: number) {
    limit = limit ? +limit : 10
    page = page ? +page : 1

    const data = await this.categoriesService.findAll(limit, page)
    const totalData = await this.categoriesService.countData()

    return Response.getDataWithPagination({
      code: 200,
      message: 'Category has been retrieved successfully',
      data,
      totalData,
      totalPage: Math.ceil(totalData / limit),
      limit,
      page,
    })
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN, Role.SUPERADMIN)
  async findOne(@Param('id') id: string) {
    const data = await this.categoriesService.findById(id)

    return Response.success({
      code: 200,
      message: 'Category has been retrieved successfully',
      data,
    })
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const data = await this.categoriesService.update(id, updateCategoryDto)

    return Response.success({
      code: 200,
      message: 'Category has been updated successfully',
      data,
    })
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles(Role.SUPERADMIN)
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id)
  }
}
