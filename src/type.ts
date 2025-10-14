import { Context } from "grammy";

declare global {
  type MyContext = Context & { payload: string };
}
