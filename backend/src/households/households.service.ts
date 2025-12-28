import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class HouseholdsService {
  constructor(private prisma: PrismaService) {}

  private generateInviteCode() {
    // simple 8-char hex code
    return randomBytes(4).toString('hex');
  }

  async createHousehold(ownerId: string, name: string) {
    const inviteCode = this.generateInviteCode();

    return this.prisma.$transaction(async (tx) => {
      const household = await tx.household.create({
        data: {
          name,
          inviteCode,
        },
      });

      await tx.householdMember.create({
        data: {
          userId: ownerId,
          householdId: household.id,
          role: 'owner',
        },
      });

      return household;
    });
  }

  async findForUser(userId: string) {
    return this.prisma.household.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        members: {
          select: {
            role: true,
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async joinByInviteCode(userId: string, inviteCode: string) {
    const household = await this.prisma.household.findUnique({
      where: { inviteCode },
    });

    if (!household) {
      throw new NotFoundException('Household not found');
    }

    // upsert membership (skip if already in household)
    await this.prisma.householdMember.upsert({
      where: {
        userId_householdId: {
          userId,
          householdId: household.id,
        },
      },
      update: {},
      create: {
        userId,
        householdId: household.id,
        role: 'member',
      },
    });

    return household;
  }
}
