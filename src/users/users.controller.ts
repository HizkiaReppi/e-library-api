import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import Response from '@/common/utils/Response'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    try {
      return this.usersService.create(createUserDto)
    } catch (error) {
      return Response.error({
        code: HttpStatus.BAD_REQUEST,
        error: error.message,
        data: null,
      })
    }
  }

  @Get()
  async findAll(@Query('limit') limit?: number, @Query('skip') page?: number) {
    try {
      limit = limit ? limit : 10
      page = page ? page : 1

      const data = await this.usersService.findAll(limit, page)

      return Response.getDataWithPagination({
        code: HttpStatus.OK,
        message: 'Data has been retrieved successfully',
        data,
        totalData: data.length,
        totalPage: Math.ceil(data.length / limit),
        page,
        limit,
      })
    } catch (error) {
      return Response.error({
        code: HttpStatus.BAD_REQUEST,
        error: error.message,
        data: null,
      })
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.usersService.findById(id)
      return Response.success({
        code: HttpStatus.OK,
        message: 'Data has been retrieved successfully',
        data,
      })
    } catch (error) {
      return Response.error({
        code: HttpStatus.BAD_REQUEST,
        error: error.message,
        data: null,
      })
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const updatedData = await this.usersService.update(id, updateUserDto)
      return Response.success({
        code: HttpStatus.OK,
        message: 'Data has been updated successfully',
        data: updatedData,
      })
    } catch (error) {
      return Response.error({
        code: HttpStatus.BAD_REQUEST,
        error: error.message,
        data: null,
      })
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.usersService.deactivate(id)
      return Response.noData({
        status: true,
        code: HttpStatus.NO_CONTENT,
        message: 'Data has been deleted successfully',
      })
    } catch (error) {
      return Response.error({
        code: HttpStatus.BAD_REQUEST,
        error: error.message,
        data: null,
      })
    }
  }

  // This method is used to delete data permanently and only for super-admin
  // TODO: Add role middleware to check if the user is an super-admin
  @Delete(':id/force-delete')
  async forceDelete(@Param('id') id: string) {
    try {
      await this.usersService.remove(id)
      return Response.noData({
        status: true,
        code: HttpStatus.NO_CONTENT,
        message: 'Data has been deleted successfully',
      })
    } catch (error) {
      return Response.error({
        code: HttpStatus.BAD_REQUEST,
        error: error.message,
        data: null,
      })
    }
  }
}
