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
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { UsersService } from './users.service'
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto'
import { GetAllUsersResponseDto } from './dto/GetAllUsersResponse.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Public } from '@/decorator/public.decorator'
import { Role } from '@/common/enums/role.enum'
import { Roles } from '@/decorator/roles.decorator'
import Response from '@/common/utils/Response'
import { JwtAuthGuard } from '@/guards/jwt-auth.guard'
import { RolesGuard } from '@/guards/role.guard'

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Data has been created successfully',
    type: CreateUserResponseDto,
  })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
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
  @Public()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit of results per page',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number of the results',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Data has been retrieved successfully',
    type: GetAllUsersResponseDto,
  })
  async findAll(@Query('limit') limit?: number, @Query('page') page?: number) {
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
  @ApiBearerAuth()
  @Roles(Role.USER, Role.ADMIN, Role.SUPERADMIN)
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
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
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
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
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
  @ApiBearerAuth()
  @Roles(Role.SUPERADMIN)
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
