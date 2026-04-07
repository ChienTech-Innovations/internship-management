import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { TrainingPlan } from 'src/training-plans/entities/training-plan.entity';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { InternInformation } from 'src/interns-information/entities/intern-information.entity';
import { Attendance } from 'src/attendance/entities/attendance.entity';
import { ChatSession } from './entities/chat-session.entity';
import { Message, SenderRole } from './entities/message.entity';
import { LlmService, ChatMessage } from '../llm/llm.service';
import { VectorStoreService } from '../rag/services/vector-store.service';
import { InternsInformationService } from '../interns-information/interns-information.service';
import { RAG_TOP_K, RAG_MEMORY_MESSAGE_LIMIT } from '../rag/rag.constants';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatSession)
    private chatSessionRepository: Repository<ChatSession>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(InternInformation)
    private internInfoRepository: Repository<InternInformation>,
    @InjectRepository(TrainingPlan)
    private planRepository: Repository<TrainingPlan>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private llmService: LlmService,
    private vectorStoreService: VectorStoreService,
    private internsInformationService: InternsInformationService,
  ) {}

  /**
   * Tạo phiên chat mới
   */
  async createSession(userId: string, role: string): Promise<ChatSession> {
    const session = this.chatSessionRepository.create({
      userId,
      role,
    });
    return this.chatSessionRepository.save(session);
  }

  /**
   * Lấy thông tin phiên chat kèm toàn bộ tin nhắn
   */
  async getSession(sessionId: string): Promise<ChatSession> {
    const session = await this.chatSessionRepository.findOne({
      where: { id: sessionId },
      relations: ['messages'],
      order: { messages: { createdAt: 'ASC' } },
    });

    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên chat');
    }

    return session;
  }

  /**
   * Lấy tất cả phiên chat của user
   */
  async getUserSessions(userId: string): Promise<ChatSession[]> {
    return this.chatSessionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Gửi tin nhắn và nhận phản hồi từ AI (RAG + memory theo role)
   */
  async sendMessage(
    sessionId: string,
    content: string,
    userId: string,
    role: string,
  ): Promise<{ userMessage: Message; assistantMessage: Message }> {
    const session = await this.chatSessionRepository.findOne({
      where: { id: sessionId },
      relations: ['messages'],
      order: { messages: { createdAt: 'ASC' } },
    });

    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên chat');
    }
    if (session.userId !== userId) {
      throw new ForbiddenException(
        'Bạn không có quyền gửi tin nhắn trong phiên này',
      );
    }

    const userMessage = this.messageRepository.create({
      sessionId,
      sender: SenderRole.USER,
      content,
    });
    await this.messageRepository.save(userMessage);

    const filter: { scope: string; mentorId?: string; internId?: string } = {
      scope:
        role === 'admin' ? 'admin' : role === 'mentor' ? 'mentor' : 'intern',
    };
    if (role === 'mentor') filter.mentorId = userId;
    if (role === 'intern') filter.internId = userId;

    const [ragChunks, roleContext] = await Promise.all([
      this.vectorStoreService.similaritySearch(content, RAG_TOP_K, filter),
      this.getFullContextByRole(userId, role),
    ]);

    const ragContext = ragChunks
      .map((d) => d.pageContent)
      .filter(Boolean)
      .join('\n\n');

    // Luôn gắn dữ liệu đầy đủ theo role từ DB vào context (không phụ thuộc RAG)
    const fullContext = [ragContext, roleContext]
      .filter(Boolean)
      .join('\n\n--- Dữ liệu hiện tại từ hệ thống ---\n\n');

    const messages = this.buildMessagesForLlm(
      session.messages || [],
      content,
      role,
      fullContext,
    );
    const aiResponse = await this.llmService.generateResponse(messages);

    const assistantMessage = this.messageRepository.create({
      sessionId,
      sender: SenderRole.ASSISTANT,
      content: aiResponse,
    });
    await this.messageRepository.save(assistantMessage);

    return { userMessage, assistantMessage };
  }

  /**
   * Lấy đầy đủ dữ liệu theo role từ DB (luôn gọi mỗi lần chat).
   * Contract chi tiết (entity/trường/giới hạn theo từng role): xem CHAT_CONTEXT_CONTRACT.md.
   */
  private async getFullContextByRole(
    userId: string,
    role: string,
  ): Promise<string> {
    if (role === 'admin') return this.getAdminFullContext();
    if (role === 'mentor')
      return (await this.getMentorFallbackContext(userId)) || '';
    if (role === 'intern')
      return (await this.getInternAssignmentsFallbackContext(userId)) || '';
    return '';
  }

  /**
   * Context đầy đủ cho admin: users, thực tập sinh, kế hoạch, bài tập, điểm danh gần đây.
   * Chi tiết contract: CHAT_CONTEXT_CONTRACT.md §2.1.
   */
  private async getAdminFullContext(): Promise<string> {
    const [users, internInfos, plans, assignments, attendances] =
      await Promise.all([
        this.userRepository.find({
          where: { isDeleted: false },
          select: [
            'id',
            'fullName',
            'email',
            'phoneNumber',
            'address',
            'role',
            'status',
          ],
        }),
        this.internInfoRepository.find({
          where: { isDeleted: false },
          relations: ['intern', 'mentor', 'plan'],
        }),
        this.planRepository.find({
          where: { isDeleted: false },
          select: ['id', 'name', 'description'],
        }),
        this.assignmentRepository.find({
          where: { isDeleted: false },
          relations: ['assignee', 'task', 'trainingPlan'],
          order: { dueDate: 'ASC' },
          take: 500,
        }),
        this.attendanceRepository.find({
          relations: ['user'],
          order: { date: 'DESC' },
          take: 200,
        }),
      ]);

    const parts: string[] = [];

    const byRole = users.reduce(
      (acc, u) => {
        acc[u.role] = (acc[u.role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    parts.push(
      `Tổng quan user: admin ${byRole.admin || 0}, mentor ${byRole.mentor || 0}, intern ${byRole.intern || 0}.`,
    );

    if (internInfos.length) {
      const lines = internInfos.map((ii, i) => {
        const iname = ii.intern?.fullName || ii.internId;
        const mname = ii.mentor?.fullName || ii.mentorId || '—';
        const pname = ii.plan?.name || '—';
        const internEmail = ii.intern?.email || '—';
        const internPhone = ii.intern?.phoneNumber || '—';
        const internAddress = ii.intern?.address || '—';
        const startDate = ii.startDate
          ? ii.startDate instanceof Date
            ? ii.startDate.toISOString().split('T')[0]
            : String(ii.startDate)
          : '—';
        const endDate = ii.endDate
          ? ii.endDate instanceof Date
            ? ii.endDate.toISOString().split('T')[0]
            : String(ii.endDate)
          : '—';
        return `${i + 1}. ${iname} - Mentor: ${mname}, Kế hoạch: ${pname}, trạng thái: ${ii.status}, email: ${internEmail}, SĐT: ${internPhone}, địa chỉ: ${internAddress}, bắt đầu: ${startDate}, kết thúc: ${endDate}.`;
      });
      parts.push(`Thực tập sinh (${internInfos.length}):\n${lines.join('\n')}`);
    }

    if (plans.length) {
      parts.push(
        `Kế hoạch đào tạo (${plans.length}): ${plans.map((p) => p.name).join(', ')}.`,
      );
    }

    if (assignments.length) {
      const byPerson = new Map<string, string[]>();
      for (const a of assignments) {
        const name = a.assignee?.fullName || a.assignedTo || '—';
        const taskName = a.task?.name || '—';
        if (!byPerson.has(name)) byPerson.set(name, []);
        byPerson.get(name)!.push(`${taskName}: ${a.status}`);
      }
      const lines = Array.from(byPerson.entries()).map(
        ([name, items]) => `- ${name}: ${items.join('; ')}`,
      );
      parts.push(
        `Tình trạng bài tập từng người (mẫu):\n${lines.slice(0, 50).join('\n')}${lines.length > 50 ? `\n... và ${lines.length - 50} người khác` : ''}`,
      );
    }

    if (attendances.length) {
      const recent = attendances.slice(0, 30).map((a) => {
        const uname = a.user?.fullName || a.userId;
        return `${a.date}: ${uname} (${a.workLocation})`;
      });
      parts.push(`Điểm danh gần đây:\n${recent.join('\n')}`);
    }

    return parts.join('\n\n');
  }

  /**
   * Context cho mentor: danh sách thực tập sinh + tình trạng bài tập từng người.
   * Chi tiết contract: CHAT_CONTEXT_CONTRACT.md §2.2.
   */
  private async getMentorFallbackContext(
    mentorId: string,
  ): Promise<string | null> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const startStr = startOfMonth.toISOString().split('T')[0];
    const endStr = endOfMonth.toISOString().split('T')[0];

    const [interns, assignments, mentorPlans] = await Promise.all([
      this.internsInformationService.findByMentorId(mentorId),
      this.assignmentRepository.find({
        where: { createdBy: mentorId, isDeleted: false },
        relations: ['assignee', 'task', 'trainingPlan'],
        order: { dueDate: 'ASC' },
      }),
      this.planRepository.find({
        where: { createdBy: mentorId, isDeleted: false },
      }),
    ]);

    const parts: string[] = [];

    if (interns.length) {
      const latest = interns[0];
      const earliest = interns[interns.length - 1];
      const toDate = (value?: string | Date) =>
        value
          ? value instanceof Date
            ? value.toISOString().split('T')[0]
            : String(value)
          : '—';

      const completedCount = interns.filter(
        (x) => x.status === 'Completed',
      ).length;
      const notCompletedCount = interns.length - completedCount;

      const lines = interns.map((ii, i) => {
        const internName = ii.intern?.fullName || ii.internId;
        const planName = ii.plan?.name || '—';
        const internEmail = ii.intern?.email || '—';
        const internPhone = ii.intern?.phoneNumber || '—';
        const internAddress = ii.intern?.address || '—';
        const startDate = toDate(ii.startDate);
        const endDate = toDate(ii.endDate);
        return `${i + 1}. ${internName} - Kế hoạch: ${planName}, lĩnh vực: ${ii.field || '—'}, trạng thái: ${ii.status}, email: ${internEmail}, SĐT: ${internPhone}, địa chỉ: ${internAddress}, bắt đầu: ${startDate}, kết thúc: ${endDate}.`;
      });
      const latestName = latest.intern?.fullName || latest.internId || '—';
      const earliestName =
        earliest.intern?.fullName || earliest.internId || '—';
      parts.push(
        `Tổng quan intern của mentor: tổng ${interns.length}, đã hoàn thành ${completedCount}, chưa hoàn thành ${notCompletedCount}. Intern mới nhất (theo startDate): ${latestName} (${toDate(latest.startDate)}). Intern sớm nhất (theo startDate): ${earliestName} (${toDate(earliest.startDate)}).`,
      );
      parts.push(`Danh sách thực tập sinh của mentor:\n${lines.join('\n')}`);

      const internAttendanceLines = await Promise.all(
        interns.map(async (ii) => {
          const uid = ii.internId;
          const attendance = await this.attendanceRepository.find({
            where: { userId: uid },
            order: { date: 'DESC' },
            take: 100,
          });
          const inMonth = attendance.filter(
            (a) => a.date >= startStr && a.date <= endStr,
          );
          const uniqueDates = [...new Set(inMonth.map((a) => a.date).sort())];
          const name = ii.intern?.fullName || uid;
          return `- ${name}: ${uniqueDates.length} ngày (${uniqueDates.join(', ') || 'không có'})`;
        }),
      );
      parts.push(
        `Chấm công intern tháng hiện tại (${now.getMonth() + 1}/${now.getFullYear()}):\n${internAttendanceLines.join('\n')}`,
      );
    }

    if (assignments.length) {
      const byAssignee = new Map<string, { name: string; items: string[] }>();
      const taskSet = new Set<string>();
      const planSet = new Set<string>();
      for (const a of assignments) {
        const uid = a.assignedTo || '';
        const name = a.assignee?.fullName || uid || '—';
        if (!byAssignee.has(uid)) byAssignee.set(uid, { name, items: [] });
        const taskName = a.task?.name || '—';
        const planName = a.trainingPlan?.name || '—';
        taskSet.add(taskName);
        planSet.add(planName);
        const due = a.dueDate
          ? a.dueDate instanceof Date
            ? a.dueDate.toISOString().split('T')[0]
            : String(a.dueDate)
          : '';
        byAssignee
          .get(uid)!
          .items.push(
            `${taskName} [plan: ${planName}]: ${a.status}${due ? ` (hạn ${due})` : ''}`,
          );
      }
      const statusLines = Array.from(byAssignee.values()).map(
        (v) => `- ${v.name}: ${v.items.join('; ')}`,
      );
      parts.push(
        `Tổng quan công việc mentor: ${assignments.length} assignment, ${taskSet.size} task khác nhau, ${planSet.size} training plan, ${mentorPlans.length} training plan do mentor tạo.`,
      );
      parts.push(`Tình trạng bài tập từng người:\n${statusLines.join('\n')}`);
    }

    return parts.length ? parts.join('\n\n') : null;
  }

  /**
   * Context cho intern: thông tin mentor chi tiết, thực tập, chấm công tháng này, bài tập.
   * Chi tiết contract: CHAT_CONTEXT_CONTRACT.md §2.3.
   */
  private async getInternAssignmentsFallbackContext(
    internId: string,
  ): Promise<string | null> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const startStr = startOfMonth.toISOString().split('T')[0];
    const endStr = endOfMonth.toISOString().split('T')[0];

    const [internInfo, assignments, attendancesThisMonth] = await Promise.all([
      this.internInfoRepository.findOne({
        where: { internId, isDeleted: false },
        relations: [
          'mentor',
          'intern',
          'plan',
          'plan.skills',
          'plan.skills.skill',
        ],
        order: { startDate: 'DESC' },
      }),
      this.assignmentRepository.find({
        where: { assignedTo: internId, isDeleted: false },
        relations: ['task', 'trainingPlan', 'skills', 'skills.skill'],
        order: { dueDate: 'ASC' },
      }),
      this.attendanceRepository.find({
        where: { userId: internId },
        order: { date: 'DESC' },
        take: 100,
      }),
    ]);

    const parts: string[] = [];

    if (internInfo) {
      const pname = internInfo.plan?.name || '—';
      const startDate = internInfo.startDate
        ? internInfo.startDate instanceof Date
          ? internInfo.startDate.toISOString().split('T')[0]
          : String(internInfo.startDate)
        : '—';
      const endDate = internInfo.endDate
        ? internInfo.endDate instanceof Date
          ? internInfo.endDate.toISOString().split('T')[0]
          : String(internInfo.endDate)
        : '—';
      parts.push(
        `Thông tin thực tập của tôi: Kế hoạch: ${pname}, lĩnh vực: ${internInfo.field || '—'}, trạng thái: ${internInfo.status}, bắt đầu: ${startDate}, kết thúc: ${endDate}.`,
      );

      const intern = internInfo.intern as User | undefined;
      if (intern) {
        parts.push(
          `Thông tin cá nhân của tôi - Họ tên: ${intern.fullName}, Email: ${intern.email || '—'}, Số điện thoại: ${intern.phoneNumber || '—'}, Địa chỉ: ${intern.address || '—'}.`,
        );
      }

      const mentor = internInfo.mentor as User | undefined;
      if (mentor) {
        const mentorDetails = [
          `Mentor của tôi - Họ tên: ${mentor.fullName}`,
          `Email: ${mentor.email || '—'}`,
          `Số điện thoại: ${mentor.phoneNumber || '—'}`,
          mentor.address ? `Địa chỉ: ${mentor.address}` : null,
        ]
          .filter(Boolean)
          .join(', ');
        parts.push(mentorDetails);
      }

      const planSkills =
        internInfo.plan?.skills
          ?.map((ps) => ps.skill?.name)
          .filter(Boolean)
          .map((name) => String(name)) || [];
      if (planSkills.length) {
        parts.push(
          `Skill trong training plan hiện tại (${planSkills.length}): ${planSkills.join(', ')}.`,
        );
      } else {
        parts.push(
          'Skill trong training plan hiện tại: chưa có dữ liệu skill.',
        );
      }
    }

    const attendancesInMonth = (attendancesThisMonth || []).filter(
      (a) => a.date >= startStr && a.date <= endStr,
    );
    const monthLabel = `${now.getMonth() + 1}/${now.getFullYear()}`;
    if (attendancesInMonth.length > 0) {
      const sortedDates = [...attendancesInMonth].map((a) => a.date).sort();
      const uniqueDates = [...new Set(sortedDates)];
      parts.push(
        `Chấm công tháng này (tháng ${monthLabel}): đã chấm công ${uniqueDates.length} ngày. Các ngày: ${uniqueDates.join(', ')}.`,
      );
    } else {
      parts.push(
        `Chấm công tháng này (tháng ${monthLabel}): 0 ngày (chưa có bản ghi điểm danh).`,
      );
    }

    if (assignments.length) {
      const byStatus = assignments.reduce(
        (acc, a) => {
          acc[a.status] = (acc[a.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );
      parts.push(
        `Tổng quan assignment của tôi: tổng ${assignments.length}, Todo ${byStatus.Todo || 0}, InProgress ${byStatus.InProgress || 0}, Submitted ${byStatus.Submitted || 0}, Reviewed ${byStatus.Reviewed || 0}.`,
      );
      const lines = assignments.map((a, i) => {
        const taskName = a.task?.name || '—';
        const planName = (a.trainingPlan as { name?: string })?.name || '—';
        const skillNames =
          a.skills
            ?.map((s) => s.skill?.name)
            .filter(Boolean)
            .map((name) => String(name)) || [];
        const dueStr = a.dueDate
          ? a.dueDate instanceof Date
            ? a.dueDate.toISOString().split('T')[0]
            : String(a.dueDate)
          : '';
        const submittedAt = a.submittedAt
          ? a.submittedAt instanceof Date
            ? a.submittedAt.toISOString().split('T')[0]
            : String(a.submittedAt)
          : '';
        return `${i + 1}. ${taskName} (kế hoạch: ${planName}) - Trạng thái: ${a.status}${dueStr ? `, hạn: ${dueStr}` : ''}${submittedAt ? `, nộp: ${submittedAt}` : ''}${a.estimatedTime ? `, ước lượng: ${a.estimatedTime}h` : ''}${skillNames.length ? `, skills: ${skillNames.join(', ')}` : ''}.`;
      });
      parts.push(`Bài tập của tôi (tình trạng):\n${lines.join('\n')}`);
    }

    return parts.length ? parts.join('\n\n') : null;
  }

  /**
   * Xây dựng messages cho LLM: system (role + RAG context) + memory + query
   */
  private buildMessagesForLlm(
    previousMessages: Message[],
    currentMessage: string,
    role: string,
    ragContext?: string,
  ): ChatMessage[] {
    const systemContent = this.llmService.getSystemPrompt({
      role,
      ragContext: ragContext || undefined,
    });
    const messages: ChatMessage[] = [{ role: 'user', content: systemContent }];

    const recentMessages = previousMessages.slice(-RAG_MEMORY_MESSAGE_LIMIT);
    for (const msg of recentMessages) {
      messages.push({
        role: msg.sender === SenderRole.USER ? 'user' : 'assistant',
        content: msg.content,
      });
    }
    messages.push({ role: 'user', content: currentMessage });
    return messages;
  }
}
