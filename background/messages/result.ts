import type { PlasmoMessaging } from "@plasmohq/messaging"

import { EventType } from "~eventType/index"

const ERR_CODE = -1
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log(req.body, "result")
  const response = {
    code: 0,
    data: [],
    message: ""
  }
  try {
    const data = await (await fetch("http://localhost:3000/aa")).json()
    response.data = data
  } catch (e) {
    response.code = ERR_CODE
    response.message = "请求openAi接口失败。"
  }
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  })
  chrome.tabs.sendMessage(tab.id, { ...response, name: EventType.result })
  res.send(response)
}

export default handler
