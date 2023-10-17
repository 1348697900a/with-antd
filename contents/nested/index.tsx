import { StyleProvider } from "@ant-design/cssinjs"
import { Button, Drawer, Progress, message } from "antd"
import antdResetCssText from "data-text:antd/dist/reset.css"
import cssText from "data-text:~/contents/nested/index.css"
import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useMemo, useState } from "react"

import CodeBlock from "~components/codeBlock/index"

import "./index.css"

import { sendToBackground } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"

import { EventType } from "~eventType/index"
import { storage } from "~background"

export const config: PlasmoCSConfig = {
  matches: ["http://localhost:5173/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = antdResetCssText + cssText
  return style
}

/** 进度条初始值，-1 不展示 */
const PROGRESS_INIT_VALUE = -1

function IndexOption() {
  const [open, setOpen] = useState(false)
  const [percent, setPercent] = useState(PROGRESS_INIT_VALUE)
  const [result, setResult] = useState("");

  /** 进度条 */
  chrome.runtime.onMessage.addListener(async (msg, _, res) => {
    sendToBackground({
      name: "log",
      body: msg
    })
    if (msg.name === EventType.progress) {
      const nums = Math.floor(Number(msg.progress) * 100)
      setPercent(nums)
      nums === 100 && showDrawer()
    }
    /** 接口返回的数据 */
    if (msg.name === EventType.result) {
      sendToBackground({
        name: "log",
        body: msg?.data?.code
      })
      setResult(msg?.data?.code || "")
    }
    res({ status: "ok" })
  })

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false);
    init()
  }
  const init = () => {
    setPercent(PROGRESS_INIT_VALUE)
    setResult('');
  }

  const showProgress = useMemo(
    () => percent !== -1 && percent !== 100,
    [percent]
  )
  return (
    <div>
      <StyleProvider
        container={document.querySelector("plasmo-csui").shadowRoot}>
        <Button type="link" onClick={showDrawer}>
          Open {percent}
        </Button>
        {showProgress && (
          <Progress type="circle" percent={percent} className="box" />
        )}
      </StyleProvider>
      <Drawer
        title="i18n 助手"
        width={500}
        placement="right"
        mask={false}
        maskClosable={false}
        onClose={onClose}
        open={open}>
        <div>
          {
            result ? <CodeBlock language='json' code={result} /> : 'loading'
          }
        </div>
      </Drawer>
    </div>
  )
}

export default IndexOption
