import mitt, { type EventHandlerMap, Emitter, EventType } from "mitt";
import type { EmitDomainEvents } from "./domain-event.types";

// Mở rộng interface Emitter để thêm emitAsync
export interface AsyncEmitter<T extends Record<EventType, unknown>> extends Emitter<T> {
  emitAsync<K extends keyof T>(type: K, e: any): Promise<void>;
}

export function mittAsync(all?: EventHandlerMap<EmitDomainEvents>): AsyncEmitter<EmitDomainEvents> {
  const instance = mitt<EmitDomainEvents>(all) as AsyncEmitter<EmitDomainEvents>;

  instance.emitAsync = async function <K extends keyof EmitDomainEvents>(
    type: K,
    e: any
  ): Promise<void> {
    const handlersType = this.all.get(type);
    if (handlersType) {
      for (const handler of handlersType) {
        try {
          await handler(e);
        } catch (err) {
          console.error(`Error in handler for event ${String(type)}:`, err);
        }
      }
    }

    const handlersWildcard = this.all.get("*");
    if (handlersWildcard) {
      for (const handler of handlersWildcard) {
        try {
          await handler(type, e);
        } catch (err) {
          console.error(`Error in wildcard handler for event ${String(type)}:`, err);
        }
      }
    }
  };

  return instance;
}

export const emitter = mittAsync();