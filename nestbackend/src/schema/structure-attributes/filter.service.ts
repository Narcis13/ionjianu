import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class FilterService {
  /**
   * Creates a Prisma where condition based on filter parameters
   * @param filters Object containing filter parameters
   * @param config Configuration for mapping filter fields to database fields
   * @returns Prisma where condition
   */
  createWhereCondition(
    filters: Record<string, any>,
    config: Record<string, { field: string; operator: string; type?: string }>,
  ): Prisma.StructureAttributesWhereInput {
    const whereCondition: Prisma.StructureAttributesWhereInput = {};
    
    // Remove pagination parameters
    const { page, limit, ...actualFilters } = filters;

    // Process each filter
    Object.keys(actualFilters).forEach((key) => {
      if (actualFilters[key] !== undefined && config[key]) {
        const { field, operator, type } = config[key];
        let value = actualFilters[key];
        
        // Convert value based on type if specified
        if (type === 'number' || type === 'int') {
          // Handle array values for 'in' operator
          if (operator === 'in' && Array.isArray(value)) {
            value = value.map(item => Number(item));
          } else {
            value = Number(value);
          }
        }
        
        switch (operator) {
          case 'equals':
            whereCondition[field] = { equals: value };
            break;
          case 'contains':
            whereCondition[field] = { contains: value };
            break;
          case 'in':
            whereCondition[field] = { in: value };
            break;
          // Add more operators as needed
          default:
            whereCondition[field] = { equals: value };
        }
      }
    });

    return whereCondition;
  }

  /**
   * Creates pagination parameters for Prisma
   * @param filters Object containing pagination parameters
   * @returns Pagination object with skip and take properties
   */
  createPaginationParams(filters: { page?: number; limit?: number }) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    
    return {
      skip: (page - 1) * limit,
      take: limit,
    };
  }
}