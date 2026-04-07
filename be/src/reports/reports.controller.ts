import { Controller, Get, Query, UseGuards, Header, Res } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { SimpleUserDto } from 'src/users/dto/simple-user.dto';
import { ReportsService } from './reports.service';
import { Response } from 'express';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiOperation({
    summary:
      'Period report (week/month). Mentor: own interns only; Admin: all.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'mentor')
  @ApiQuery({ name: 'period', required: true, enum: ['week', 'month'] })
  @ApiQuery({ name: 'from', required: true, example: '2026-03-01' })
  @ApiQuery({ name: 'to', required: true, example: '2026-03-07' })
  @Get()
  async getReport(
    @User() user: SimpleUserDto,
    @Query('period') period: 'week' | 'month',
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const mentorId = user.role === 'mentor' ? user.id : undefined;
    return this.reportsService.getReport(period, from, to, mentorId);
  }

  @ApiOperation({ summary: 'Export report CSV' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'mentor')
  @ApiQuery({ name: 'period', required: true, enum: ['week', 'month'] })
  @ApiQuery({ name: 'from', required: true, example: '2026-03-01' })
  @ApiQuery({ name: 'to', required: true, example: '2026-03-07' })
  @Get('export')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  async exportCsv(
    @User() user: SimpleUserDto,
    @Query('period') period: 'week' | 'month',
    @Query('from') from: string,
    @Query('to') to: string,
    @Res() res: Response,
  ) {
    const mentorId = user.role === 'mentor' ? user.id : undefined;
    const csv = await this.reportsService.getReportCsv(
      period,
      from,
      to,
      mentorId,
    );
    const filename = `report-${period}-${from}-${to}.csv`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  }
}
