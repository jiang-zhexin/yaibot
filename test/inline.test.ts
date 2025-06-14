import { describe, it } from "vitest"
import { matchQuery } from "../src/inline"

describe("inline", () => {
    it("reg", async () => {
        console.log(matchQuery(""))
        console.log(matchQuery("aaaa"))
        console.log(matchQuery("by bbb"))
        console.log(matchQuery("aaaa by bbb"))
        console.log(matchQuery("gif"))
        console.log(matchQuery("gif aaa"))
        console.log(matchQuery("gif by bbb"))
        console.log(matchQuery("gif aaaa by bbb"))
    })
})
