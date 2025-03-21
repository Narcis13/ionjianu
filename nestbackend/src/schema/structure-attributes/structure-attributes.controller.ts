import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StructureAttributesService } from './structure-attributes.service';
import { Prisma } from '@prisma/client';

@Controller('structure-attributes')
export class StructureAttributesController {
  constructor(private readonly structureAttributesService: StructureAttributesService) {}

  @Post()
  create(@Body() createStructureAttributeDto: Prisma.StructureAttributesCreateInput) {
    return this.structureAttributesService.create(createStructureAttributeDto);
  }

  @Get()
  findAll() {
    return this.structureAttributesService.findAll();
  }

  @Get('structure')
  findAllStructures() {
    return this.structureAttributesService.findAllStructures();  
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.structureAttributesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStructureAttributeDto: Prisma.StructureAttributesUpdateInput,
  ) {
    return this.structureAttributesService.update(+id, updateStructureAttributeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.structureAttributesService.remove(+id);
  }
}