import { createWorker } from "tesseract.js"

import { sendToBackground } from "@plasmohq/messaging"

import { storage } from "~background"

const initStatusList = [
  "loading tesseract core",
  "initializing tesseract",
  "loading language traineddata",
  "initializing api"
]
let ocrWorker: null | Tesseract.Worker = null
const log = (data) =>
  sendToBackground({
    name: "log",
    body: data
  })
const sendProgress = (body) =>
  sendToBackground({
    name: "progress",
    body
  })
const sendResult = (body) =>
  sendToBackground({
    name: "result",
    body
  })
/** 控制遮罩元素 */
const controlMaskElement = (state: boolean) => {
  const el = document.getElementById("drag-target-container")
  el.style.display = state ? "block" : "none"
  el.style.background = "rgba(70,130,180,0.3)"
}
const initWorker = async () => {
  try {
    if (!ocrWorker) {
      ocrWorker = await createWorker("chi_sim", 1, {
        workerPath: chrome.runtime.getURL("scripts/worker.min.js"),
        corePath: chrome.runtime.getURL(
          "scripts/tesseract.js-core@v5.0.0_tesseract-core-simd-lstm.wasm.js"
        ),
        langPath: chrome.runtime.getURL(
          "scripts/languages/chi_sim.traineddata.gz"
        ),
        logger({ progress, status }) {
          if (!initStatusList.includes(status)) {
            sendProgress({
              progress
            })
            progress === 1 && controlMaskElement(false)
          }
        }
      })
    }
  } catch (e) {
    // await sendToBackground({
    //   name: "worker",
    //   body: {
    //     id: e
    //   }
    // })
  }
}

const handleDragOver = (e) => {
  e.preventDefault()
}
/** 处理拖拽 */
const handleDragElement = async (e) => {
  e.preventDefault()
  const { files } = e.dataTransfer
  const data = await ocrWorker.recognize?.(files[0])
  sendResult(data)
}

const createDragElement = () => {
  const el = document.createElement("div")
  el.id = "drag-target-container"
  el.style.position = "fixed"
  el.style.top = "0"
  el.style.left = "0"
  el.style.width = "100%"
  el.style.height = "100%"
  el.style.zIndex = "1000"
  el.style.display = "none"
  el.style.background = "rgba(70,130,180,0.3)"

  document.body.append(el)
  log("create success!!")

  el.addEventListener("dragover", handleDragOver, false)
  el.addEventListener("drop", handleDragElement, false)
  el.addEventListener("dragleave", () => controlMaskElement(false), false)
  document.body.addEventListener(
    "dragenter",
    (e) => {
      e.preventDefault()
      controlMaskElement(true)
    },
    false
  )
}
const main = async () => {
  const { storageFormData } = await storage.getAll()
  const { url } = JSON.parse(storageFormData || "{}")
  if (url.includes(window.location.href)) {
    initWorker()
    createDragElement()
  }
  alert(window.location.href)
}
main()
