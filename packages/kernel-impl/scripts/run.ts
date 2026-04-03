import { Kernel } from "@onkernel/sdk";
import { createKernelClassicDriver, createKernelDriver } from "../src/driver/index.js";

const main = async () => {
    // const driver = createKernelClassicDriver()
    // const session = await driver.newSession({})
    // console.log(session)

    // await driver.navigateTo({ url: "https://www.wikipedia.org" })
    // const title = await driver.getTitle()
    // console.log(title);


    const sessionId = "b46nxg66m6etsgy94bn1r0ho";
    const client = new Kernel();
    const sessions = await client.browsers.list({
        query: sessionId,
    })

    const session = sessions.items.find(s => s.session_id === sessionId)
    if (!session) {
        throw new Error("Session not found");
    }

    console.log(session)

    const driver = createKernelDriver({ mode: "existing", existingBrowser: {...session }})
    const elementOne = await driver.findElement({ locator: { using: "xpath", value: "//*[@id=\"js-link-box-en\"]/strong" } })
    await driver.elementClick({ elementId: elementOne.elementId })

    const elementTwo = await driver.findElement({ locator: { using: "xpath", value: "//*[@id=\"mp-tfa\"]/p" } })
    const text = await driver.elementGetText({ elementId: elementTwo.elementId })
    const textContext = await driver.elementGetProperty({ elementId: elementTwo.elementId, name: "textContent" })
    console.log({ text, textContext })
};

main().catch(console.error);