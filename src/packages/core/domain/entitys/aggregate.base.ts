import { DomainEvent } from "../events/domain-event.base";
import { Entity } from "./entity.base";
import { LoggerPort } from "../../infra/logger/logger.port";
import { EmitDomainEvents } from "../events/domain-event.types";
import { AsyncEmitter } from "../events/domain-event.helper";

export abstract class AggregateRoot<Props> extends Entity<Props> {
  #domainEvents: DomainEvent[] = [];

  get domainEvents() {
    return this.#domainEvents;
  }

  set domainEvents(domainEvents: DomainEvent[]) {
    this.#domainEvents = domainEvents;
  }

  protected addEvent(domainEvent: DomainEvent | DomainEvent[]): void {
    if (Array.isArray(domainEvent)) {
      this.domainEvents = [...this.domainEvents, ...domainEvent];
    } else {
      this.domainEvents.push(domainEvent);
    }
  }

  clearEvents(): void {
    this.domainEvents = [];
  }

  async publishEvents(logger: LoggerPort, emitter: AsyncEmitter<EmitDomainEvents>): Promise<void> {
    try {
      const promises = this.domainEvents.map(async (event) => {
        try {
          logger.debug(
            `[RequestID] Publishing "${event.constructor.name}" for aggregate ${this.constructor.name} : ${this.id}`,
            { eventData: JSON.stringify(event) } // Thêm chi tiết sự kiện vào log
          );
          await emitter.emitAsync(event.constructor.name as keyof EmitDomainEvents, event);
        } catch (err) {
          logger.error(
            `Failed to publish event "${event.constructor.name}" for aggregate ${this.constructor.name} : ${this.id}`,
            { error: err }
          );
          throw err; // Hoặc xử lý theo cách khác tùy thuộc vào yêu cầu
        }
      });

      await Promise.all(promises); // Song song hóa việc phát sự kiện
      this.clearEvents();
    } catch (err) {
      logger.error(`Failed to publish events for aggregate ${this.constructor.name} : ${this.id}`, { error: err });
      throw err; // Hoặc xử lý theo cách khác tùy thuộc vào yêu cầu
    }
  }
}