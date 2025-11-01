import { Activity } from '@repo/postgres';

/**
 * DTO for get activity by ID response
 */
export class GetActivityByIdResponseDto {
  activity: Activity;
}
