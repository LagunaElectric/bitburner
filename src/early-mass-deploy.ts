import { kill } from "process"
import { NS } from "./Bitburner"

export async function main(ns: NS) {
  const { scp, nuke, exec, sleep, brutessh, fileExists, ftpcrack } = ns
  // Array of all servers that don't need any ports opened
  // to gain root access. These have 16 GB of RAM
  const servers0Port = [
    "sigma-cosmetics",
    "joesguns",
    "nectar-net",
    "hong-fang-tea",
    "harakiri-sushi"
  ]

  // Array of all servers that only need 1 port opened
  // to gain root access. These have 32 GB of RAM
  const servers1Port = ["neo-net", "zer0", "max-hardware", "iron-gym"]

  const servers2Port = [
    "omega-net",
    "crush-fitness",
    "silver-helix",
    "johnson-ortho",
    "the-hub",
    "phantasy",
    "avmnite-02h"
  ]

  // Copy our scripts onto each server that requires 0 ports
  // to gain root access. Then use nuke() to gain admin access and
  // run the scripts.
  for (let i = 0; i < servers0Port.length; ++i) {
    const serv = servers0Port[i]

    nuke(serv)
    copyAndExec(ns, "early-hack-template.js", serv)
  }

  // Wait until we acquire the "BruteSSH.exe" program
  while (!fileExists("BruteSSH.exe")) {
    await sleep(60000)
  }

  // Copy our scripts onto each server that requires 1 port
  // to gain root access. Then use brutessh() and nuke()
  // to gain admin access and run the scripts.
  for (let i = 0; i < servers1Port.length; ++i) {
    const serv = servers1Port[i]

    brutessh(serv)
    nuke(serv)
    copyAndExec(ns, "early-hack-template.js", serv)
  }

  // Wait until we acquire the "BruteSSH.exe" program
  while (!fileExists("FTPCrack.exe")) {
    await sleep(60000)
  }

  for (let i = 0; i < servers2Port.length; ++i) {
    const serv = servers2Port[i]

    ftpcrack(serv)
    brutessh(serv)
    nuke(serv)
    copyAndExec(ns, "early-hack-template.js", serv)
  }
}

const copyAndExec = (ns: NS, scriptName: string, hostName: string) => {
  ns.killall(hostName, true)

  const numThreads = calcNumThreads(ns, scriptName, hostName)
  if (!numThreads || numThreads === Infinity) return

  ns.scp(scriptName, hostName)
  ns.exec(scriptName, hostName, numThreads, ns.args[0])
}

const calcNumThreads = (ns: NS, scriptName: string, hostName: string) => {
  const maxRam = ns.getServerMaxRam(hostName)
  const usedRam = ns.getServerUsedRam(hostName)
  const availableRam = maxRam - usedRam
  const scriptRam = ns.getScriptRam(scriptName, hostName)

  return Math.floor(availableRam / scriptRam)
}

const killIfRunning = (ns: NS, scriptName: string, hostName: string) => {
  ns.print(ns.getRunningScript(scriptName, hostName))
  ns.print(ns.isRunning(scriptName, hostName))
  if (ns.isRunning(scriptName, hostName)) {
    ns.kill(scriptName, hostName)
  }
}
