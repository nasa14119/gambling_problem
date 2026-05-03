import { v4 as uuid } from "uuid";
export class Game {
  id: string;
  constructor() {
    this.id = uuid();
  }
}
