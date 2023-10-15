import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log(req.body, "log")
  res.send({
    status: "ok"
  })
}

export default handler
