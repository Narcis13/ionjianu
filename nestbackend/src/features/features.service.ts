import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export interface TableColumn {
  name: string;
  type: string;
  isNullable: string;
  keyType: string;
  defaultValue: string | null;
  extra: string;
}

export interface TableInfo {
  name: string;
  fieldCount: number;
}

@Injectable()
export class FeaturesService {
  private prisma = new PrismaClient();

  async getModelMetadata(modelName: string) {
    // Get table information from the database
    const tableInfo = await this.prisma.$queryRaw<TableColumn[]>`
      SELECT 
        COLUMN_NAME as name,
        DATA_TYPE as type,
        IS_NULLABLE as isNullable,
        COLUMN_KEY as keyType,
        COLUMN_DEFAULT as defaultValue,
        EXTRA as extra
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = ${modelName}
    `;

    if (!tableInfo || (Array.isArray(tableInfo) && tableInfo.length === 0)) {
      throw new Error(`Model ${modelName} not found`);
    }

    // Format the metadata
    return {
      name: modelName,
      fields: tableInfo.map(field => ({
        name: field.name,
        type: field.type,
        isRequired: field.isNullable === 'NO',
        isUnique: field.keyType === 'UNI',
        isId: field.keyType === 'PRI',
        default: field.defaultValue,
        extra: field.extra
      }))
    };
  }

  async getAllModels() {
    const tables = await this.prisma.$queryRaw<TableInfo[]>`
      SELECT 
        TABLE_NAME as name,
        (
          SELECT COUNT(*) 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_NAME = TABLES.TABLE_NAME
        ) as fieldCount
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `;

    // Convert BigInt to Number before returning
    return tables.map(table => ({
      name: table.name,
      fieldCount: Number(table.fieldCount)
    }));
  }
}