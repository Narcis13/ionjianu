import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { FeaturesService } from './features.service';

@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Get('models/:modelName')
  async getModelMetadata(@Param('modelName') modelName: string) {
    try {
      return await this.featuresService.getModelMetadata(modelName);
    } catch (error) {
      throw new NotFoundException(`Model ${modelName} not found`);
    }
  }

  @Get('models')
  async getAllModels() {
    return await this.featuresService.getAllModels();
  }
}