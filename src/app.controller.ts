import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('/allusers')
  async getUsers() {
    try {
      console.log('any');
      return await this.appService.getUsers();
    } catch (error) {
      return error;
    }
  }
}
