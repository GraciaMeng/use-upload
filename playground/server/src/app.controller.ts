import { Controller, HttpCode, Post, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  @HttpCode(200)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile() {
    return { message: 'success' };
  }

  @HttpCode(200)
  @Post('merge')
  async mergeFile() {
    return { message: 'success' };
  }
}
