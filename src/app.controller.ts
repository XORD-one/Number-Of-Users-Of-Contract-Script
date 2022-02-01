import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/allusers')
  async getUsers() {
    try {
      return await this.appService.getUsers();
    } catch (error) {
      return error;
    }
  }
}
