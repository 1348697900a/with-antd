import { Button } from "antd"
import React from "react"
import { createWorker } from "tesseract.js"

import { ThemeProvider } from "~theme"

import img from "./assets/test1.png"
import { a } from "./scripts/a"

const srcList = Array.from({
  length: 3
}).map((_, i) => chrome.runtime.getURL(`assets/pic${i}.png`))

function IndexPopup() {

  const handleClick = async () => {
    console.log("click!!")
    const worker = await createWorker("chi_sim", 1, {
      workerPath: chrome.runtime.getURL("scripts/worker.min.js"),
      corePath: chrome.runtime.getURL("scripts/tesseract-core-simd-lstm.js"),
      langPath: chrome.runtime.getURL("scripts/languages"),
      logger(arg) {
        console.log(arg)
      }
    })
    const data = await worker.recognize(img)
    console.log(data)
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
