import { Module } from '@nestjs/common';
import { StructureModule } from '../schema/structure/structure.module';
import { FeaturesController } from './features.controller';
import { FeaturesService } from './features.service';

@Module({
  imports: [
    StructureModule
  ],
  controllers: [FeaturesController],
  providers: [FeaturesService],
  exports: [
    StructureModule
  ]
})
export class FeaturesModule {}