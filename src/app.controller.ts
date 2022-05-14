import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Post('/allusers')
  async getUsers(@Body() body) {
    try {
      console.log('any');
      console.log(body);
      return await this.appService.getUsers(body);
    } catch (error) {
      return error;
    }
  }
  @Get('/projects')
  async getProjects() {
    try {
      return await this.appService.getProjects();
    } catch (error) {
      return error;
    }
  }
}
