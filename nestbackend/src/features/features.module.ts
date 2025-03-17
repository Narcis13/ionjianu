import { Module } from '@nestjs/common';
import { StructureModule } from '../schema/structure/structure.module';

@Module({
  imports: [
    StructureModule
  ],
  exports: [
    StructureModule
  ]
})
export class FeaturesModule {}