import { ConfigProvider } from "antd"
import type { ReactNode } from "react"
import { StyleProvider } from "@ant-design/cssinjs";
import React from "react";

export const ThemeProvider = ({ children = null as ReactNode }) => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#00b96b"
      }
    }}>
    <StyleProvider container={document.querySelector("plasmo-csui").shadowRoot}>
      {children}
    </StyleProvider>
  </ConfigProvider>
)