import { Event } from '../entities/event.entity';

export interface IBody {
  challenge?: string;
  event: Event;
}
