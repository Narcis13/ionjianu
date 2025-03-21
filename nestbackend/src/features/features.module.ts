import { Module } from '@nestjs/common';
import { StructureModule } from '../schema/structure/structure.module';
import { FeaturesController } from './features.controller';
import { FeaturesService } from './features.service';
import { PrismaSchemaParserService } from './prisma-schema-parser.service';
import { StructureAttributesModule } from 'src/schema/structure-attributes/structure-attributes.module';

@Module({
  imports: [
    StructureModule,
    StructureAttributesModule
  ],
  controllers: [FeaturesController],
  providers: [FeaturesService,PrismaSchemaParserService],
  exports: [
    StructureModule,
    StructureAttributesModule
  ]
})
export class FeaturesModule {}