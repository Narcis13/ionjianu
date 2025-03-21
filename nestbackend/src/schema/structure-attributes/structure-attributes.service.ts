import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StructureAttributesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: Prisma.StructureAttributesCreateInput) {
    return this.databaseService.structureAttributes.create({
      data,
    });
  }

  async findAll() {
    return this.databaseService.structureAttributes.findMany({
      include: {
        structure: true,
      },
    });
  }
 async findAllStructures(){
  return this.databaseService.structure.findMany({});
 }
  async findOne(id: number) {
    return this.databaseService.structureAttributes.findUnique({
      where: { id },
      include: {
        structure: true,
      },
    });
  }

  async update(id: number, data: Prisma.StructureAttributesUpdateInput) {
    return this.databaseService.structureAttributes.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.databaseService.structureAttributes.delete({
      where: { id },
    });
  }
}