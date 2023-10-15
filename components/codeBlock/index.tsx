import React, { useEffect, useRef, useState } from 'react';
import Clipboard from 'clipboard';

import 'highlight.js/styles/default.css';
import hljs from 'highlight.js';
import cssText from "data-text:~/components/codeBlock/index.css"
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}
export default function CodeBlock({ language, code }) {
  const preRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (preRef.current) {
      hljs.highlightElement(preRef.current);

      // 创建 clipboard 实例并保存到变量中
      const clipboard = new Clipboard(`#${language}copy_btn`, {
        text: () => code,
      });
      // 监听复制成功事件
      clipboard.on('success', () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
      clipboard.on('error', (e) => {
        alert(e)
      })
      // 销毁 clipboard 实例
      return () => {
        clipboard.destroy();
      };
    }
  }, [code]);
  return (
    <div className="code-block" style={{ position: 'relative', marginTop: 8 }}>
      <pre>
        <code id={language} ref={preRef} className={language}>
          {code}
        </code>
      </pre>
      {/* <button
        id={`${language}copy_btn`}
        style={{ position: 'absolute', top: 4, right: 4, lineHeight: '14px' }}
        className="code-block__button"
        data-clipboard-target={`#${language}`}>
        {copied ? '已复制' : '复制!'} {preRef.current || 'undefined'}
      </button> */}
    </div>
  );
}
