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
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto)

    return Response.success({
      code: HttpStatus.CREATED,
      message: 'Data has been created successfully',
      data,
    })
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
    limit = limit ? +limit : 10
    page = page ? +page : 1

    const data = await this.usersService.findAll(limit, page)
    const totalData = await this.usersService.countData(true)

    return Response.getDataWithPagination({
      code: HttpStatus.OK,
      message: 'Data has been retrieved successfully',
      data,
      totalData,
      totalPage: Math.ceil(totalData / limit),
      page,
      limit,
    })
  }

  // findAllData only for superadmin
  @Get('all')
  @ApiBearerAuth()
  @Roles(Role.SUPERADMIN)
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
  async findAllData(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    limit = limit ? +limit : 10
    page = page ? +page : 1

    const data = await this.usersService.findAllData(limit, page)
    const totalData = await this.usersService.countData()

    return Response.getDataWithPagination({
      code: HttpStatus.OK,
      message: 'Data has been retrieved successfully',
      data,
      totalData,
      totalPage: Math.ceil(totalData / limit),
      page,
      limit,
    })
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(Role.USER, Role.ADMIN, Role.SUPERADMIN)
  async findOne(@Param('id') id: string) {
    const data = await this.usersService.findById(id)
    return Response.success({
      code: HttpStatus.OK,
      message: 'Data has been retrieved successfully',
      data,
    })
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedData = await this.usersService.update(id, updateUserDto)
    return Response.success({
      code: HttpStatus.OK,
      message: 'Data has been updated successfully',
      data: updatedData,
    })
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  async remove(@Param('id') id: string) {
    return this.usersService.deactivate(id)
  }

  @Patch(':id/activate')
  @ApiBearerAuth()
  @Roles(Role.SUPERADMIN)
  async activate(@Param('id') id: string) {
    return this.usersService.activate(id)
  }

  @Delete(':id/force-delete')
  @ApiBearerAuth()
  @Roles(Role.SUPERADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async forceDelete(@Param('id') id: string) {
    return this.usersService.remove(id)
  }
}
