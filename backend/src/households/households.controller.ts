import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { HouseholdsService } from './households.service';
  
  @UseGuards(AuthGuard('jwt'))
  @Controller('households')
  export class HouseholdsController {
    constructor(private readonly householdsService: HouseholdsService) {}
  
    @Post()
    create(@Body() body: { name: string }, @Req() req: any) {
      const userId = req.user.userId;
      return this.householdsService.createHousehold(userId, body.name);
    }
  
    @Get()
    findMine(@Req() req: any) {
      const userId = req.user.userId;
      return this.householdsService.findForUser(userId);
    }
  
    @Post('join')
    join(@Body() body: { inviteCode: string }, @Req() req: any) {
      const userId = req.user.userId;
      return this.householdsService.joinByInviteCode(userId, body.inviteCode);
    }
  }
  