import { sendToBackground } from "@plasmohq/messaging"
import { Button } from "antd"
import React from "react"
import { createWorker } from "tesseract.js"

import { ThemeProvider } from "~theme"

const srcList = Array.from({
  length: 3
}).map((_, i) => chrome.runtime.getURL(`assets/pic${i}.png`))

function IndexPopup() {

  const handleClick = async () => {
    console.log("click!!222452121")
    try {
      const resp = await sendToBackground({
        name: "ping",
        body: {
          id: 123
        }
      })
      console.log(resp);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <>
      <Button type="primary" onClick={handleClick}>
        221
      </Button>
      {srcList.map((src, i) => (
        <img key={i} src={src} style={{ width: 44, height: 44 }} />
      ))}

    </>
  )
}

export default IndexPopup
