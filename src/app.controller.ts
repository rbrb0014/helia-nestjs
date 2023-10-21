import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service.js';
import { ContentsDto } from './dto/contents.dto.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHeliaVersion(): Promise<string> {
    const helia = await this.appService.getHelia();
    return 'Helia is running, PeerId ' + helia.libp2p.peerId.toString();
  }
  async onApplicationShutdown(): Promise<void> {
    await this.appService.onApplicationShutdown();
  }

  @Post('/contents')
  async postContents(@Query('contents') contents: string): Promise<string> {
    return this.appService.postStringContents(contents);
  }

  // @Post('/contents/img')
  // @UseInterceptors(
  //   FileFieldsInterceptor([
  //     { name: 'avatar', maxCount: 1 },
  //     { name: 'background', maxCount: 1 },
  //   ]),
  // )
  // async postImgContents(
  //   @UploadedFiles(
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({ fileType: 'jpg' })
  //       .addMaxSizeValidator({ maxSize: 1000 })
  //       .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
  //   )
  //   contents: ContentsDto,
  // ): Promise<string[]> {
  //   return this.appService.postImgContents(contents);
  // }

  @Get('/:cid')
  async getContents(@Param('cid') cid: string): Promise<string> {
    return this.appService.getStringContents(cid);
  }

  @Delete()
  async garbageCollect() {
    return this.appService.garbageCollect();
  }
}
