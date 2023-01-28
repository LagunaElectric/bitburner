import { NS } from "./Bitburner"
import { serverList } from "./lib/constants"
import {
  calcNumThreads,
  copyAndExec,
  findBestTarget,
  rootTools
} from "./lib/server-utils"

export async function main(ns: NS) {
  const { nuke, sleep, fileExists } = ns

  const servers0Port = [
    "sigma-cosmetics",
    "joesguns",
    "nectar-net",
    "hong-fang-tea",
    "harakiri-sushi",
    "n00dles",
    "foodnstuff",
    "home"
  ]

  const servers1Port = ["neo-net", "zer0", "max-hardware", "iron-gym", "CSEC"]

  const servers2Port = [
    "omega-net",
    "crush-fitness",
    "silver-helix",
    "johnson-ortho",
    "the-hub",
    "phantasy",
    "avmnite-02h"
  ]

  for (let i = 0; i < servers0Port.length; ++i) {
    const serv = servers0Port[i]

    nuke(serv)
    copyAndExec(ns, "early-hack-template.js", serv)
  }

  while (!fileExists("BruteSSH.exe")) {
    await sleep(60000)
  }

  for (let i = 0; i < servers1Port.length; ++i) {
    const serv = servers1Port[i]

    rootTools.single(ns, serv)
    copyAndExec(ns, "early-hack-template.js", serv)
  }

  // Wait until we acquire the "FTPCrack.exe" program
  while (!fileExists("FTPCrack.exe")) {
    await sleep(60000)
  }

  for (let i = 0; i < servers2Port.length; ++i) {
    const serv = servers2Port[i]

    rootTools.double(ns, serv)
    copyAndExec(ns, "early-hack-template.js", serv)
  }
}
