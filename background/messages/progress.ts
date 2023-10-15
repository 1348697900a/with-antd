import type { PlasmoMessaging } from "@plasmohq/messaging"

import { EventType } from "~eventType/index"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  })
  console.log(tab)
  chrome.tabs.sendMessage(tab.id, { ...req.body, name: EventType.progress })
  res.send({
    status: "progress-ok"
  })
}

export default handler
