import { Context } from "grammy";

declare global {
  type yaibContext = Context & { payload: string };
}
