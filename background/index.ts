import { sendToContentScript } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { SecureStorage } from "@plasmohq/storage/secure"

export {}
console.log("backgroundJs")

const PASSWORD = "password"
const TEST_KEY = "ship"
const TEST_DATA = "1701"

async function testSecureStorage() {
  const storage = new SecureStorage({ area: "local" })
  await storage.clear()

  await storage.setPassword(PASSWORD)
  // Must set password then watch, otherwise the namespace key will mismatch
  storage.watch({
    [TEST_KEY]: (c) => {
      console.log(TEST_KEY, c)
    }
  })

  await storage.set(TEST_KEY, TEST_DATA)

  const foo = await storage.get(TEST_KEY)

  console.log(await storage.getAll())

  await storage.set(TEST_KEY, TEST_DATA + "2")

  await storage.clear()
}

async function testBaseStorage() {
  const storage = new Storage()
  await storage.clear()

  storage.watch({
    "serial-number": (c) => {
      console.log("serial-number", c)
    }
  })

  // The storage.set promise apparently resolves before the watch listener is registered...
  // So we need to wait a bit before adding the next watch if we want to split the watchers. Otherwise, the second watch will get the first set of change as well.
  await new Promise((resolve) => setTimeout(resolve, 470))
}

const main = async () => {
  // await testSecureStorage()

  // Wait for all the watch event to be processed
  await new Promise((resolve) => setTimeout(resolve, 1470))

  await testBaseStorage()
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  })
  // setInterval(() => {
  //   chrome.tabs.sendMessage(1477180668, { greeting: "helloLYX11" })
  // }, 2000)
}

main()
