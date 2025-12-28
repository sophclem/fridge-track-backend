import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  // Make sure the user belongs to the household
  private async ensureUserInHousehold(userId: string, householdId: string) {
    const membership = await this.prisma.householdMember.findUnique({
      where: {
        userId_householdId: {
          userId,
          householdId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this household');
    }
  }

  async listItemsForHousehold(userId: string, householdId: string) {
    await this.ensureUserInHousehold(userId, householdId);

    return this.prisma.item.findMany({
      where: { householdId },
      orderBy: { expiresAt: 'asc' },
    });
  }

  async addItemToHousehold(
    userId: string,
    householdId: string,
    data: {
      name: string;
      quantity: number;
      unit: string;
      location: string;
      expiresAt?: Date | null;
    },
  ) {
    await this.ensureUserInHousehold(userId, householdId);

    return this.prisma.item.create({
      data: {
        householdId,
        ownerId: userId,
        name: data.name,
        quantity: data.quantity,
        unit: data.unit,
        location: data.location,
        expiresAt: data.expiresAt ?? null,
        status: 'active',
      },
    });
  }
}
