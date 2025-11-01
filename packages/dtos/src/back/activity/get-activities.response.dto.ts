import { Activity } from '@repo/postgres';
import { IPaginate, IMeta } from '../../pagination';

export class GetActivitiesResponseDto implements IPaginate<{ activity: Activity }> {
  items: { activity: Activity }[];
  meta?: IMeta;
}
