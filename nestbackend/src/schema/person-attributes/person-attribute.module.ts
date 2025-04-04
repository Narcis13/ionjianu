import { Module } from '@nestjs/common';
import { PersonAttributesService } from './person-attributes.service';
import { PersonAttributesController } from './person-attributes.controller';


@Module({
  controllers: [PersonAttributesController],
  providers: [PersonAttributesService],
})
export class PersonAttributesModule {}