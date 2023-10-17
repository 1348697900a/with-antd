import { Storage } from "@plasmohq/storage"

console.log("backgroundJs")
const storage = new Storage()
const main = async () => {
  console.log("xxx")

  // await storage.set("storageFormData", {})
}

main()
export { storage }
// .ts(图文识别结果) -> .background.ts（下发到抽屉组件） -> .tsx() -> .background.ts
//
