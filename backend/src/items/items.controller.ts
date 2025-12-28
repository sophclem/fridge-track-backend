import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    UseGuards,
    Req,
    ParseFloatPipe,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { ItemsService } from './items.service';
  
  @UseGuards(AuthGuard('jwt'))
  @Controller('households/:householdId/items')
  export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}
  
    @Get()
    list(@Param('householdId') householdId: string, @Req() req: any) {
      const userId = req.user.userId;
      return this.itemsService.listItemsForHousehold(userId, householdId);
    }
  
    @Post()
    async create(
      @Param('householdId') householdId: string,
      @Body()
      body: {
        name: string;
        quantity: number;
        unit: string;
        location: string;
        expiresAt?: string | null;
      },
      @Req() req: any,
    ) {
      const userId = req.user.userId;
  
      const expiresAt =
        body.expiresAt != null && body.expiresAt !== ''
          ? new Date(body.expiresAt)
          : null;
  
      const quantity = Number(body.quantity);
  
      return this.itemsService.addItemToHousehold(userId, householdId, {
        name: body.name,
        quantity,
        unit: body.unit,
        location: body.location,
        expiresAt,
      });
    }
  }
  