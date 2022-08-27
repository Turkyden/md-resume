import { useEffect, useRef, useState, useCallback } from "react";
import Frame from "react-frame-component";
import Split from "react-split";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useLocalStorageState, useSessionStorageState } from "ahooks";
import { Modal, Tooltip, Popover, Button, Input, Drawer, message } from "antd";
import {
  PictureOutlined,
  InsertRowAboveOutlined,
  InsertRowLeftOutlined,
  TableOutlined,
  PrinterOutlined,
  QuestionOutlined,
  ShareAltOutlined,
  SkinOutlined,
  TagOutlined,
} from "@ant-design/icons";
import * as utils from "@/utils";
import base64url from "base64url";

import RESUME from "../../RESUME.md";

import "antd/dist/antd.less";
import "./index.css";
import "pattern.css/dist/pattern.css";

function MySplit({
  direction,
  children,
}: {
  direction: "vertical" | "horizontal" | "full";
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (direction === "vertical") {
      document.querySelector(".monaco-view").style.height = "calc(60% - 5px)";
      document.querySelector(".monaco-view").style.width = "100%";
      document.querySelector(".monaco-editor").style.height = "calc(40% - 5px)";
      document.querySelector(".monaco-editor").style.width = "100%";
      if (!document.querySelector(".gutter")) return;
      document
        .querySelector(".gutter")
        .classList.replace("gutter-horizontal", "gutter-vertical");
      document.querySelector(".gutter").style.height = "10px";
      document.querySelector(".gutter").style.width = "100%";
    } else if (direction === "horizontal") {
      document.querySelector(".monaco-view").style.width = "calc(60% - 5px)";
      document.querySelector(".monaco-view").style.height = "100%";
      document.querySelector(".monaco-editor").style.height = "calc(40% - 5px)";
      document.querySelector(".monaco-editor").style.height = "100%";
      if (!document.querySelector(".gutter")) return;
      document
        .querySelector(".gutter")
        .classList.replace("gutter-vertical", "gutter-horizontal");
      document.querySelector(".gutter").style.height = "100%";
      document.querySelector(".gutter").style.width = "10px";
    } else {
    }
  }, [direction]);

  if (direction === "vertical") {
    return (
      <Split
        className="w-full h-full pt-12"
        direction="vertical"
        minSize={0}
        sizes={[60, 40]}
      >
        {children}
      </Split>
    );
  }
  if (direction === "horizontal") {
    return (
      <Split
        className="w-full h-full pt-12 flex"
        direction="horizontal"
        minSize={0}
        sizes={[60, 40]}
      >
        {children}
      </Split>
    );
  }
  return (
    <div className="w-screen h-screen pt-12 overflow-auto">{children[0]}</div>
  );
}

export default function IndexPage() {
  const ref = useRef(undefined);

  // const [code, setCode] = useState(RESUME);

  const [files, setFiles] = useLocalStorageState("geek-resume-files", [
    {
      id: new Date().getTime().toString(),
      title: "default.md",
      body: RESUME,
    },
  ]);

  const [current, setCurrent] = useLocalStorageState(
    "geek-resume-current",
    files[0]
  );

  // useEffect(() => {
  //   setCurrent(files[0]);
  // }, [files])

  const [donation, setDonation] = useSessionStorageState("user-message", "0");

  const [direction, setDirection] = useState("horizontal");

  const [visibleT, setVisibleT] = useState(false);

  const [visibleH, setVisibleH] = useState(false);

  const setCode = (code) => {
    setCurrent({ ...current, body: code });
    setFiles(
      files.map((v) => {
        return {
          ...v,
          body: v.id === current.id ? code : v.body,
        };
      })
    );
  };

  const onChangeTitle = (e: Event) => {
    const title = e.target.value;
    setCurrent({ ...current, title });
    setFiles(
      files.map((v) => {
        return {
          ...v,
          title: v.id === current.id ? title : v.title,
        };
      })
    );
  };

  const addNewResume = () => {
    const newResume = {
      id: new Date().getTime().toString(),
      title: "Untitled Document.md",
      body: RESUME,
    };
    setFiles([newResume].concat(files));
    setCurrent(newResume);
  };

  const print = useCallback((e: Event) => {
    if (true) {
      Modal.info({
        title: (
          <span>
            Geek Resume is made with heart by{" "}
            <a
              className="underline"
              target="_blank"
              href="https://github.com/turkyden"
            >
              @turkyden
            </a>
          </span>
        ),
        icon: null,
        maskClosable: true,
        centered: true,
        okText: "Download PDF",
        content: (
          <div>
            <p className="text-center">Glad it helps!</p>
            <p className="text-center">A few ways to say thank you 👇</p>
            <div className="space-y-6">
              <div className="transform hover:scale-105 transition duration-1s ease-in-out flex justify-center items-center contents-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 opacity-90 hover:opacity-100 rounded-full py-2 shadow-xl cursor-pointer ">
                <a
                  className="text-white hover:text-white"
                  target="_blank"
                  href="https://github.com/turkyden"
                >
                  ❤️ Sponsor me on gitHub
                </a>
              </div>
              <div className="transform hover:scale-105 transition duration-1s ease-in-out flex justify-center items-center contents-center bg-gradient-to-r from-green-400 via-blue-500 to-indigo-500 opacity-90 hover:opacity-100 rounded-full py-2 shadow-xl cursor-pointer ">
                <a
                  className="text-white hover:text-white"
                  target="_blank"
                  href="https://github.com/turkyden"
                >
                  😉 Follow me on gitHub
                </a>
              </div>
              <div className="transform hover:scale-105 transition duration-1s ease-in-out flex justify-center items-center contents-center bg-gray-600 hover:bg-gray-700 rounded-full py-2 text-white shadow-xl cursor-pointer ">
                <a
                  className="text-white hover:text-white"
                  target="_blank"
                  href="https://github.com/turkyden/geek-resume"
                >
                  ⭐ Star the interesting project
                </a>
              </div>
            </div>
            {/* <img
              className="w-full"
              src="https://watermark-pro.vercel.app/static/wechat.22a540b9.png"
            /> */}
          </div>
        ),
        onOk: () => utils.print(ref.current, "应聘岗位-求职者-联系方式.pdf"),
      });
      setDonation("1");
    } else {
      utils.print(ref.current, "应聘岗位-求职者-联系方式.pdf");
    }
  }, []);

  const quetion = useCallback((e: Event) => {
    if (true) {
      Modal.info({
        title: <p className="text-center text-xl">Q & A</p>,
        icon: null,
        maskClosable: true,
        centered: true,
        okButtonProps: { hidden: true },
        content: (
          <div>
            <p>Q: Can i write HTML and CSS ?</p>
            <p className="text-gray-500">
              A: Yeah, surported whole in markdown.
            </p>
            <p>Q: Surported TailwindCSS ?</p>
            <p className="text-gray-500">
              A: The version{" "}
              <a
                href="https://www.tailwindcss.cn/"
                className="underline hover:underline"
                target="_blank"
              >
                TailwindCSS@2.2.15
              </a>
              .
            </p>
            <p>Q: How to get the PDF ?</p>
            <p className="text-gray-500">
              A: With target printer in your browser like this. 👇
            </p>
            <div className="my-4 relative">
              <img
                className="shadow w-full"
                src="/assets/screenshot_print.png"
              />
              <span className="absolute right-0 top-12 flex justify-center items-center h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-red-400 to-yellow-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-red-400 to-yellow-500"></span>
              </span>
            </div>
            <a
              href="https://github.com/turkyden/geek-resume/discussions/14"
              target="_blank"
              className="hover:underline"
            >
              Discussions &rarr;
            </a>
            {/* <img
              className="w-full"
              src="https://watermark-pro.vercel.app/static/wechat.22a540b9.png"
            /> */}
          </div>
        ),
      });
      setDonation("1");
    } else {
      utils.print(ref.current, "应聘岗位-求职者-联系方式.pdf");
    }
  }, []);

  return (
    <div
      className="w-screen h-screen overflow-hidden"
      style={{ backgroundColor: "#1e1e1e" }}
    >
      <div
        className="w-full h-12 bg-black absolute top-0 left-0 z-50 flex justify-between items-center px-10 py-2 shadow-lg"
        style={{ backgroundColor: "rgb(36, 41, 47)" }}
      >
        <div className="flex justify-center items-center">
          <a
            className="text-xl font-mono mx-2 transition-all font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-yellow-500 border-0 border-b border-dotted no-underline border-red-500 hover:opacity-90 hover:text-transparent"
            href="https://github.com/turkyden/geek-resume"
            target="_blank"
          >
            GEEK RESUME
          </a>
          {/* <a
            className="ml-4"
            href="https://github.com/turkyden/geek-resume"
            target="_blank"
          >
            <img
              className=""
              alt="GitHub Repo stars"
              src="https://img.shields.io/github/stars/turkyden/geek-resume?style=social"
            />
          </a> */}
        </div>

        <div className="flex space-x-6 justify-between items-center text-gray-400">
          <span
            className={`flex items-center transition duration-1s ease-in-out hover:text-white ${
              direction === "vertical"
                ? "text-yellow-500 hover:text-yellow-500"
                : ""
            }`}
          >
            <InsertRowAboveOutlined
              className="cursor-pointer text-lg"
              onClick={() => setDirection("vertical")}
            />
          </span>
          <span
            className={`flex items-center transition duration-1s ease-in-out hover:text-white ${
              direction === "horizontal"
                ? "text-yellow-500 hover:text-yellow-500"
                : ""
            }`}
          >
            <InsertRowLeftOutlined
              className="cursor-pointer text-lg"
              onClick={() => setDirection("horizontal")}
            />
          </span>
          <span
            className={`flex items-center transition duration-1s ease-in-out hover:text-white ${
              direction === "full"
                ? "text-yellow-500 hover:text-yellow-500"
                : ""
            }`}
          >
            <TableOutlined
              className="cursor-pointer text-lg"
              onClick={() => setDirection("full")}
            />
          </span>
          <div className="w-1 h-4 border-solid border-0 border-l border-gray-500"></div>
          {/* <Popover
            content={
              <div className="w-48 flex flex-wrap">
                <div className="w-24 h-24 text-center flex flex-col items-center justify-center">
                  <img
                    height="36"
                    alt="github"
                    src="https://camo.githubusercontent.com/b079fe922f00c4b86f1b724fbc2e8141c468794ce8adbc9b7456e5e1ad09c622/68747470733a2f2f6564656e742e6769746875622e696f2f537570657254696e7949636f6e732f696d616765732f7376672f6769746875622e737667"
                  ></img>
                  <div className="text-gray-500 pt-2">滤镜</div>
                </div>
                <div className="w-24 h-24 text-center flex flex-col items-center justify-center">
                  <img
                    height="36"
                    alt="github"
                    src="https://camo.githubusercontent.com/b079fe922f00c4b86f1b724fbc2e8141c468794ce8adbc9b7456e5e1ad09c622/68747470733a2f2f6564656e742e6769746875622e696f2f537570657254696e7949636f6e732f696d616765732f7376672f6769746875622e737667"
                  ></img>
                  <div className="text-gray-500 pt-2">社交</div>
                </div>
                <div className="w-24 h-24 text-center flex flex-col items-center justify-center">
                  <img
                    height="36"
                    alt="github"
                    src="https://camo.githubusercontent.com/b079fe922f00c4b86f1b724fbc2e8141c468794ce8adbc9b7456e5e1ad09c622/68747470733a2f2f6564656e742e6769746875622e696f2f537570657254696e7949636f6e732f696d616765732f7376672f6769746875622e737667"
                  ></img>
                  <div className="text-gray-500 pt-2">徽标</div>
                </div>
              </div>
            }
            placement="bottomRight"
            title={null}
          >
            <PictureOutlined className="cursor-pointer text-lg" />
          </Popover> */}
          <SkinOutlined
            title="Theme"
            className="transition duration-1s ease-in-out hover:text-white cursor-pointer text-lg"
            onClick={setVisibleT.bind(this, true)}
          />

          <TagOutlined
            title="Version"
            className="transition duration-1s ease-in-out hover:text-white cursor-pointer text-lg"
            onClick={setVisibleH.bind(this, true)}
          />
          <Popover
            placement="bottom"
            title={null}
            content={
              <div className="space-y-3">
                <div className="flex items-center">
                  <img
                    className="w-4 h-4"
                    src="https://www.zhipin.com/favicon.ico"
                    alt="Boss 直聘"
                  />
                  <a
                    className="pl-2"
                    href="https://www.zhipin.com/"
                    target="_blank"
                  >
                    Boss 直聘
                  </a>
                </div>
                <div className="flex items-center">
                  <img
                    className="w-4 h-4"
                    src="https://www.lagou.com/favicon.ico"
                    alt="拉勾网"
                  />
                  <a
                    className="pl-2"
                    href="https://www.lagou.com/"
                    target="_blank"
                  >
                    拉勾网
                  </a>
                </div>
                <div className="flex items-center">
                  <img
                    className="w-4 h-4"
                    src="https://www.liepin.com/favicon.ico"
                    alt="猎聘"
                  />
                  <a
                    className="pl-2"
                    href="https://www.liepin.com/"
                    target="_blank"
                  >
                    猎聘
                  </a>
                </div>
                <div className="flex items-center">
                  <img
                    className="w-4 h-4"
                    src="https://www.zhaopin.com/favicon.ico"
                    alt="智联招聘"
                  />
                  <a
                    className="pl-2"
                    href="https://www.zhaopin.com/"
                    target="_blank"
                  >
                    智联招聘
                  </a>
                </div>
                <div className="flex items-center">
                  <img
                    className="w-4 h-4"
                    src="https://www.linkedin.com/favicon.ico"
                    alt="领英"
                  />
                  <a
                    className="pl-2"
                    href="https://www.linkedin.com/"
                    target="_blank"
                  >
                    领英
                  </a>
                </div>
                <div className="flex items-center">
                  <img
                    className="w-4 h-4"
                    src="https://maimai.cn/favicon.ico"
                    alt="脉脉"
                  />
                  <a className="pl-2" href="https://maimai.cn/" target="_blank">
                    脉脉
                  </a>
                </div>
                <div className="flex items-center">
                  <img
                    className="w-4 h-4"
                    src="https://www.nowcoder.com/favicon.ico"
                    alt="牛客网"
                  />
                  <a
                    className="pl-2"
                    href="https://www.nowcoder.com/"
                    target="_blank"
                  >
                    牛客网
                  </a>
                </div>
              </div>
            }
            trigger="hover"
          >
            <ShareAltOutlined
              title="Share your resume"
              className="transition duration-1s ease-in-out hover:text-white cursor-pointer text-lg"
              // onClick={() => {
              //   const base64Str = base64url.encode(code);
              //   const code2 = utils.decode(base64Str);
              //   console.log(
              //     "encode",
              //     `https://jijian.turkyden.com/?id=${base64Str}`
              //   );
              //   console.log('decode', code2);
              // }}
            />
          </Popover>
          <PrinterOutlined
            title="Export as PDF"
            className="transition duration-1s ease-in-out hover:text-white cursor-pointer text-lg"
            onClick={print}
          />
          <a
            className="ml-4"
            href="https://github.com/turkyden/geek-resume"
            target="_blank"
          >
            <img
              className=""
              alt="GitHub Repo stars"
              src="https://img.shields.io/github/stars/turkyden/geek-resume?style=social"
            />
          </a>
        </div>
      </div>
      <MySplit direction={direction}>
        <div className="monaco-view flex bg-gray-100 relative overflow-auto | pattern-checks-sm text-gray-300">
          <div className="m-auto A4Wrapper">
            <div ref={ref} className="A4">
              <Frame
                className="w-full border-0 overflow-hidden"
                style={{ height: 1020 }}
                head={
                  <>
                    <link
                      rel="stylesheet"
                      href="https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.min.css"
                    />
                    <link
                      rel="stylesheet"
                      href="https://cdn.jsdelivr.net/npm/github-markdown-css@4.0.0/github-markdown.min.css"
                    />
                    <link
                      rel="stylesheet"
                      href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.15/dist/utilities.css"
                    />
                    <style>{`
                      body{ overflow: hidden }
                      /* Rewrite tailwind css */
                      .bg-clip-text {
                        -webkit-background-clip: text;
                        background-clip: text;
                      }
                    `}</style>
                  </>
                }
              >
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, gfm]}
                  className="markdown-body"
                  components={{
                    // Rewrite `em`s (`*like so*`) to `i` with a red foreground color.
                    a: ({ node, ...props }) => (
                      <a target="__blank" {...props} />
                    ),
                  }}
                >
                  {current.body}
                </ReactMarkdown>
              </Frame>
            </div>
          </div>
        </div>
        <Editor
          wrapperClassName="monaco-editor"
          height="calc(100% - 0px)"
          defaultLanguage="markdown"
          theme="vs-dark"
          value={current.body}
          onChange={setCode}
          // onMount={(editor, monaco) => {
          //   console.log(editor, monaco);
          //   editor.addCommand(
          //     monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_C,
          //     () => {
          //       document.querySelector("#copy_to_clipboard")?.click();
          //     }
          //   );
          //   editor.onContextMenu((e, a) => {
          //     console.log(e, a);
          //   });
          // }}
        />
      </MySplit>
      <div className="text-white fixed bottom-10 right-10">
        <Tooltip placement="topRight" title="Q & A 问题建议">
          <div
            className="cursor-pointer shadow-2xl animate-bounce bg-gradient-to-r from-red-400 to-yellow-500 rounded-full w-8 h-8 flex justify-center items-center"
            onClick={quetion}
          >
            <QuestionOutlined />
          </div>
        </Tooltip>
      </div>
      <Drawer
        title="热门模板"
        placement="right"
        width={240}
        closable={false}
        onClose={setVisibleT.bind(this, false)}
        visible={visibleT}
      >
        <div>
          <div className="space-x-4">
            <div className="" onClick={addNewResume}>
              <img
                className="cursor-pointer transition duration-500 ease-in-out w-48 h-64 shadow border border-solid border-gray-200 hover:border-yellow-500"
                src="/assets/themes/github-light.png"
                alt=""
              />
              <p className="text-center pt-2">Github Light</p>
            </div>
            {/* <div className="" onClick={addNewResume}>
              <div className="cursor-pointer w-48 h-64 transition duration-500 ease-in-out border-3 border-dotted border-gray-300 flex flex-col justify-center items-center rounded">
                <div className="text-4xl text-gray-300">+</div>
              </div>
              <p className="text-center pt-2">New Resume</p>
            </div> */}
          </div>
        </div>
      </Drawer>

      <Drawer
        title="历史记录"
        placement="right"
        width={250}
        closable={false}
        onClose={setVisibleH.bind(this, false)}
        visible={visibleH}
      >
        <div className="py-4">
          {files.map((v) => (
            <div key={v.id} className="px-1 relative">
              <Placeholder
                className={v.id === current.id ? "border-yellow-500" : ""}
                onClick={() => {
                  setCurrent(files.find((a) => a.id === v.id));
                }}
              />
              <div className="pt-2 pb-4">
                <Input
                  className="w-full"
                  style={{ paddingLeft: 0, paddingRight: 0 }}
                  type="text"
                  value={v.title}
                  bordered={false}
                  onChange={onChangeTitle}
                />
              </div>
              {files.length > 1 && (
                <div
                  className="shadow px-2 rounded-full absolute -top-4 -right-4 text-gray-500 cursor-pointer border border-solid border-gray-200 bg-white z-50"
                  onClick={() => {
                    const resFiles = files.filter((a) => a.id !== v.id);
                    const isCurrent = current.id === v.id;
                    isCurrent && setCurrent({ ...resFiles[0] });
                    setFiles(resFiles);
                  }}
                >
                  x
                </div>
              )}
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
}

function Placeholder({ className, ...props }: { className: string }) {
  return (
    <div
      className={`w-48 h-64 shadow border border-solid border-gray-200 hover:border-yellow-500 p-4 ${className}`}
      {...props}
    >
      <div className="flex justify-between mb-4">
        <div className="space-y-2">
          <div className="w-8 h-2 bg-gray-200"></div>
          <div className="w-12 h-2 bg-gray-200"></div>
          <div className="w-20 h-2 bg-gray-200"></div>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-200" />
      </div>
      <div className="space-y-2">
        <div className="w-36 h-2 bg-gray-200"></div>
        <div className="w-36 h-2 bg-gray-200"></div>
        <div className="w-28 h-2 bg-gray-200"></div>
        <div className="w-36 h-2 bg-gray-200"></div>
        <div className="w-36 h-2 bg-gray-200"></div>
        <div className="w-28 h-2 bg-gray-200"></div>
        <div className="w-36 h-2 bg-gray-200"></div>
        <div className="w-14 h-2 bg-gray-200"></div>
        <div className="w-36 h-2 bg-gray-200"></div>
        <div className="w-36 h-2 bg-gray-200"></div>
      </div>
    </div>
  );
}
