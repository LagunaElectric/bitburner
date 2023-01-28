import { NS } from "./Bitburner"
import { serverList } from "./lib/constants"
import {
  findBestTarget,
  getRootAccess,
  calcNumThreads
} from "./lib/server-utils"

export async function main(ns: NS) {
  serverList.map(server => {
    const hasRoot = ns.hasRootAccess(server)
    if (!hasRoot) {
      getRootAccess(ns, server)
    }
  })

  const rootedServers = serverList.filter(server => ns.hasRootAccess(server))
  const targetServers = serverList.filter(
    server => server !== "home" && !ns.getPurchasedServers().includes(server)
  )
  const bestTarget = findBestTarget(ns, targetServers)
  const scriptName = "early-hack-template.js"

  for (const server of rootedServers) {
    const numThreads = calcNumThreads(ns, scriptName, server)
    ns.scp("early-hack-template.js", server)
    ns.exec("early-hack-template.js", server, numThreads, bestTarget)
  }
}
