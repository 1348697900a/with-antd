import { Button, Card, Col, Form, Input, Radio, Row } from "antd"
import TextArea from "antd/es/input/TextArea"
import cssText from "data-text:~/popup.css"
import React, { useEffect, useState } from "react"
import { createWorker } from "tesseract.js"

import { sendToBackground } from "@plasmohq/messaging"

import { ThemeProvider } from "~theme"
import { useStorage } from "@plasmohq/storage/hook"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}
const srcList = Array.from({
  length: 3
}).map((_, i) => chrome.runtime.getURL(`assets/pic${i}.png`))

function IndexPopup() {
  const [storageFormData, setStorageFormData] = useStorage('storageFormData');
  const [isEdit, setEdit] = useState(false)
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue(storageFormData)
  }, [storageFormData])
  const groupOptions = [
    {
      label: "键",
      value: "key"
    },
    {
      label: "全部",
      value: "all"
    }
  ]
  const formItemList = [
    {
      label: "前缀",
      key: "prefix",
      component: <Input placeholder="input placeholder" />
    },
    {
      label: "知识领域",
      key: "aspect",
      component: <Input placeholder="input placeholder" />
    },
    {
      label: "注入的URL",
      key: "url",
      component: <Input placeholder="input placeholder" />
    },
    {
      label: "翻译范围",
      key: "range",
      component: <Radio.Group options={groupOptions} />
    },
    {
      label: "cookies",
      key: "cookies",
      layout: {
        span: 24
      },
      component: <TextArea placeholder="input placeholder" />
    }
  ]
  const handleSaveData = async () => {
    console.log(isEdit);
    try {
      if (!isEdit) {
        setEdit(true)
      }
      else {
        await form.validateFields();
        setEdit(false);
        setStorageFormData(form.getFieldsValue(true))

      }
    } catch (e) {
      console.log(e);
    }

  }
  const changeFormData = (e) => {
    const [[key, value]] = Object.entries(e) as [string, string][]
    form.setFieldValue(key, value)
  }
  return (
    <div style={{ width: "500px" }}>
      <Card
        title="i18n 助手配置"
        bodyStyle={{ width: "500px" }}
        extra={
          <Button type="link" onClick={handleSaveData}>
            {isEdit ? "保存" : "编辑"}
          </Button>
        }>
        <Form layout="horizontal" disabled={!isEdit} form={form} onValuesChange={changeFormData}>
          <Row gutter={48}>
            {formItemList.map((v) => (
              <Col span={12} {...v.layout}>
                {" "}
                <Form.Item
                  label={v.label}
                  name={v.key}
                  rules={[{ required: true }]}>
                  {v.component}
                </Form.Item>{" "}
              </Col>
            ))}
          </Row>
        </Form>
      </Card>
    </div>
  )
}

export default IndexPopup
