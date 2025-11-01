import {
  IsOptional,
  IsString,
  IsDateString,
  IsArray,
  IsEnum,
  IsBoolean,
  IsPositive,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ActivityAgeRangeEnum, ActivityTypeEnum, SortEnum } from '@repo/enums';

/**
 * Enum for sortable fields in get activities request
 */
export enum GetActivitiesRequestSortEnum {
  CREATED_AT = 'activity.createdAt',
  TITLE = 'activity.title',
  EVENT_START_DATE = 'activity.eventStartDate',
}

/**
 * DTO for retrieving activities with filtering, pagination, and sorting options
 */
export class GetActivitiesRequestDto {
  /**
   * Filter by activity title (partial match)
   */
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string;

  /**
   * Filter by activities starting from this date
   */
  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid ISO date string' })
  startDate?: string;

  /**
   * Filter by activities ending before this date
   */
  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid ISO date string' })
  endDate?: string;

  /**
   * Filter by activity slug (exact match)
   */
  @IsOptional()
  @IsString({ message: 'Slug must be a string' })
  slug?: string;

  /**
   * Filter by age ranges suitable for the activity
   */
  @IsOptional()
  @IsArray({ message: 'Age ranges must be an array' })
  @IsEnum(ActivityAgeRangeEnum, {
    each: true,
    message: 'Each age range must be a valid ActivityAgeRangeEnum value',
  })
  ageRanges?: ActivityAgeRangeEnum[];

  /**
   * Filter by indoor/outdoor activities
   */
  @IsOptional()
  @IsBoolean({ message: 'IsIndoor must be a boolean value' })
  @Type(() => Boolean)
  isIndoor?: boolean;

  /**
   * Filter by activity type (location or event)
   */
  @IsOptional()
  @IsEnum(ActivityTypeEnum, {
    message: 'Type must be a valid ActivityTypeEnum value',
  })
  type?: ActivityTypeEnum;

  /**
   * Page number for pagination (1-based)
   */
  @IsOptional()
  @IsPositive({ message: 'Page must be a positive number' })
  @Type(() => Number)
  page?: number;

  /**
   * Number of items per page
   */
  @IsOptional()
  @IsPositive({ message: 'Limit must be a positive number' })
  @Max(100, { message: 'Limit cannot exceed 100 items per page' })
  @Type(() => Number)
  limit?: number;

  /**
   * Field to sort by
   */
  @IsOptional()
  @IsEnum(GetActivitiesRequestSortEnum, {
    message: 'Sort field must be a valid sortable field',
  })
  sort?: GetActivitiesRequestSortEnum = GetActivitiesRequestSortEnum.CREATED_AT;

  /**
   * Sort direction (ascending or descending)
   */
  @IsOptional()
  @IsEnum(SortEnum, {
    message: 'Sort type must be ASC or DESC',
  })
  sortType?: SortEnum = SortEnum.DESC;
}

