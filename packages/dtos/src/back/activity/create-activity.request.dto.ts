import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsBoolean,
  IsDateString,
  IsUUID,
  Length,
  ArrayMinSize,
  IsEmail,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ActivityAgeRangeEnum, ActivityTypeEnum } from '@repo/enums';

/**
 * DTO for creating a new activity
 * Contains all possible fields from the Activity entity
 */
export class CreateActivityRequestDto {
  /**
   * Title of the activity
   */
  @IsString({ message: 'Title must be a string' })
  @Length(1, 255, { message: 'Title must be between 1 and 255 characters' })
  title: string;

  /**
   * URL-friendly slug for the activity
   */
  @IsString({ message: 'Slug must be a string' })
  @Length(1, 255, { message: 'Slug must be between 1 and 255 characters' })
  slug: string;

  /**
   * Detailed description of the activity
   */
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  /**
   * Array of age ranges suitable for this activity
   */
  @IsArray({ message: 'Age range must be an array' })
  @ArrayMinSize(1, { message: 'At least one age range must be specified' })
  @IsEnum(ActivityAgeRangeEnum, {
    each: true,
    message: 'Each age range must be a valid ActivityAgeRangeEnum value',
  })
  ageRange: ActivityAgeRangeEnum[];

  /**
   * Location ID for location-based activities
   */
  @IsOptional()
  @IsUUID(4, { message: 'Location ID must be a valid UUID' })
  locationId?: string;

  /**
   * Whether the activity is indoor or outdoor
   */
  @IsBoolean({ message: 'IsIndoor must be a boolean value' })
  @Type(() => Boolean)
  isIndoor: boolean;

  /**
   * Type of activity (location or event)
   */
  @IsEnum(ActivityTypeEnum, {
    message: 'Type must be a valid ActivityTypeEnum value',
  })
  type: ActivityTypeEnum;

  /**
   * Start date for event-based activities
   */
  @IsOptional()
  @IsDateString({}, { message: 'Event start date must be a valid ISO date string' })
  eventStartDate?: string;

  /**
   * End date for event-based activities
   */
  @IsOptional()
  @IsDateString({}, { message: 'Event end date must be a valid ISO date string' })
  eventEndDate?: string;

  /**
   * Contact phone numbers
   */
  @IsArray({ message: 'Contact numbers must be an array' })
  @IsString({ each: true, message: 'Each contact number must be a string' })
  contactNumber: string[];

  /**
   * Contact email addresses
   */
  @IsArray({ message: 'Contact emails must be an array' })
  @IsEmail({}, { each: true, message: 'Each contact email must be a valid email address' })
  contactEmail: string[];

  /**
   * Contact websites
   */
  @IsArray({ message: 'Contact websites must be an array' })
  @IsUrl({}, { each: true, message: 'Each contact website must be a valid URL' })
  contactWebsite: string[];

  /**
   * Physical addresses
   */
  @IsArray({ message: 'Addresses must be an array' })
  @IsString({ each: true, message: 'Each address must be a string' })
  address: string[];

  /**
   * Additional options or features
   */
  @IsArray({ message: 'Options must be an array' })
  @IsString({ each: true, message: 'Each option must be a string' })
  options: string[];

  /**
   * ID of the user who created this activity
   */
  @IsUUID(4, { message: 'Created by must be a valid UUID' })
  createdBy: string;
}
