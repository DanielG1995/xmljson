import { Body, Controller, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DataService } from './data.service';
import { FileInterceptor } from '@nestjs/platform-express';

import { SearchParams } from 'src/interfaces';


@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) { }

  @Post()
  async parseData(@Body() xmlData: string, @Query() params: SearchParams) {
    try {
      const json = await this.dataService.loadData(xmlData, params);
      return json;
    } catch (error) {
      console.log(error)
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Query() params: SearchParams) {
    const xmlContent = file.buffer.toString('utf8');
    try {
      const json = await this.dataService.loadData(xmlContent, params);
      return json;
    } catch (error) {
      console.log(error)
    }
  }

  @Post('upload/sync')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileAsync(@UploadedFile() file: Express.Multer.File, @Query() params: SearchParams) {
    const xmlContent = file.buffer.toString('utf8');
    try {
      const json = await this.dataService.loadDataPromises(xmlContent, params);
      return json;
    } catch (error) {
      console.log(error)
    }
  }


}


