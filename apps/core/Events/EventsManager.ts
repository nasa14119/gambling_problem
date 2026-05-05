import type { EventManager as IEventManager } from "./types";
import { v4 as uuid } from "uuid";
export abstract class EventManager<
  T extends Record<string, any>,
> implements IEventManager<T> {
  _eventsListeners: IEventManager<T>["_eventsListeners"] = {};
  emit: IEventManager<T>["emit"] = (eventId, payload) => {
    const listeners = this._eventsListeners[eventId];
    if (!listeners) return;
    Array.from(listeners).forEach(([_, listener]) => listener(payload!));
  };
  on: IEventManager<T>["on"] = ({ eventId, listener }, once = false) => {
    if (!this._eventsListeners[eventId])
      this._eventsListeners[eventId] = new Map();
    const id = uuid();
    if (once) {
      this._eventsListeners[eventId]!.set(id, (...args) => {
        listener(...args);
        this.remove(eventId, id);
      });
      return id;
    }
    this._eventsListeners[eventId]!.set(id, listener);
    return id;
  };
  createListeners: IEventManager<T>["createListeners"] = (
    events,
    listener,
    once = false,
  ) => {
    const ids = events.map<string>((event) =>
      this.on(
        { eventId: event, listener: (...args) => listener(event, ...args) },
        once,
      ),
    );
    return ids;
  };
  remove: IEventManager<T>["remove"] = (eventId, id) => {
    if (!this._eventsListeners[eventId]) return;
    if (!this._eventsListeners[eventId].has(id)) return;
    this._eventsListeners[eventId].delete(id);
  };
  createEmiter: IEventManager<T>["createEmiter"] = (eventId) => {
    return (payload) => this.emit(eventId, payload);
  };
  createManage = () => {
    return {
      on: this.on.bind(this),
      emit: this.emit.bind(this),
      getEmiter: this.createEmiter.bind(this),
      remove: this.remove.bind(this),
    };
  };
}
