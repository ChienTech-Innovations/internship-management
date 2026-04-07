import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { InternInformation } from 'src/interns-information/entities/intern-information.entity';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { Attendance } from 'src/attendance/entities/attendance.entity';

export type PeriodReportDto = {
  period: 'week' | 'month';
  from: string;
  to: string;
  internsCount: number;
  submissionsCount: number;
  attendance: {
    totalRegistered: number;
    officeDays: number;
    remoteDays: number;
  };
};

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(InternInformation)
    private readonly internInfoRepository: Repository<InternInformation>,
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  async getReport(
    period: 'week' | 'month',
    from: string,
    to: string,
    mentorId?: string,
  ): Promise<PeriodReportDto> {
    try {
      const [internsCount, submissionsCount, attendanceStats] =
        await Promise.all([
          this.getInternsCountAsOf(to, mentorId),
          this.getSubmissionsCount(from, to, mentorId),
          this.getAttendanceStats(from, to, mentorId),
        ]);

      return {
        period,
        from,
        to,
        internsCount,
        submissionsCount,
        attendance: attendanceStats,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error generating report: ' + (error as Error).message,
      );
    }
  }

  /** When mentorId is set, only count interns assigned to that mentor. */
  private async getInternIdsForMentor(mentorId: string): Promise<string[]> {
    const list = await this.internInfoRepository.find({
      where: { mentorId, isDeleted: false },
      select: ['internId'],
    });
    return list.map((i) => i.internId);
  }

  private async getInternsCountAsOf(
    dateStr: string,
    mentorId?: string,
  ): Promise<number> {
    const options: { where: any } = { where: { isDeleted: false } };
    if (mentorId) {
      options.where.mentorId = mentorId;
    }
    return this.internInfoRepository.count(options);
  }

  private async getSubmissionsCount(
    from: string,
    to: string,
    mentorId?: string,
  ): Promise<number> {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    const qb = this.assignmentRepository
      .createQueryBuilder('a')
      .where('a.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('a.submittedAt IS NOT NULL')
      .andWhere('a.submittedAt BETWEEN :from AND :to', {
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
      });

    if (mentorId) {
      const internIds = await this.getInternIdsForMentor(mentorId);
      if (internIds.length === 0) return 0;
      qb.andWhere('a.assignedTo IN (:...internIds)', { internIds });
    }

    return qb.getCount();
  }

  private async getAttendanceStats(
    from: string,
    to: string,
    mentorId?: string,
  ): Promise<{
    totalRegistered: number;
    officeDays: number;
    remoteDays: number;
  }> {
    const where: any = { date: Between(from, to) };
    if (mentorId) {
      const internIds = await this.getInternIdsForMentor(mentorId);
      if (internIds.length === 0) {
        return { totalRegistered: 0, officeDays: 0, remoteDays: 0 };
      }
      const attendances = await this.attendanceRepository
        .createQueryBuilder('a')
        .where('a.date BETWEEN :from AND :to', { from, to })
        .andWhere('a.userId IN (:...internIds)', { internIds })
        .getMany();
      const totalRegistered = attendances.length;
      const officeDays = attendances.filter(
        (a) => a.workLocation === 'office',
      ).length;
      const remoteDays = attendances.filter(
        (a) => a.workLocation === 'remote',
      ).length;
      return { totalRegistered, officeDays, remoteDays };
    }

    const attendances = await this.attendanceRepository.find({ where });
    const totalRegistered = attendances.length;
    const officeDays = attendances.filter(
      (a) => a.workLocation === 'office',
    ).length;
    const remoteDays = attendances.filter(
      (a) => a.workLocation === 'remote',
    ).length;
    return { totalRegistered, officeDays, remoteDays };
  }

  async getReportCsv(
    period: 'week' | 'month',
    from: string,
    to: string,
    mentorId?: string,
  ): Promise<string> {
    const report = await this.getReport(period, from, to, mentorId);
    const rows = [
      ['Metric', 'Value'],
      ['Period', report.period === 'week' ? 'Week' : 'Month'],
      ['From', report.from],
      ['To', report.to],
      ['Interns count', String(report.internsCount)],
      ['Submissions count', String(report.submissionsCount)],
      ['Attendance (total days)', String(report.attendance.totalRegistered)],
      ['Office', String(report.attendance.officeDays)],
      ['Remote', String(report.attendance.remoteDays)],
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    return '\uFEFF' + csv; // BOM for Excel UTF-8
  }
}
