import { Module } from '@nestjs/common';
import { StructureAttributesService } from './structure-attributes.service';
import { StructureAttributesController } from './structure-attributes.controller';

@Module({
  controllers: [StructureAttributesController],
  providers: [StructureAttributesService],
})
export class StructureAttributesModule {}