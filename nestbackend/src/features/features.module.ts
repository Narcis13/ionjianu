import { Module } from '@nestjs/common';
import { StructureModule } from '../schema/structure/structure.module';
import { FeaturesController } from './features.controller';
import { FeaturesService } from './features.service';
import { PrismaSchemaParserService } from './prisma-schema-parser.service';
import { StructureAttributesModule } from 'src/schema/structure-attributes/structure-attributes.module';
import { ArticlesModule } from 'src/schema/articles/articles.module';

@Module({
  imports: [
    StructureModule,
    StructureAttributesModule,
    ArticlesModule
  ],
  controllers: [FeaturesController],
  providers: [FeaturesService,PrismaSchemaParserService],
  exports: [
    StructureModule,
    StructureAttributesModule,
    ArticlesModule
  ]
})
export class FeaturesModule {}