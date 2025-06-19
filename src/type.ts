import { Context } from "grammy"

declare global {
    type MyContext = Context & { payload: string }
    type notNull<T> = {
        [K in keyof T]: Exclude<T[K], null>
    }
}
