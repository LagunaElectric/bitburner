import { NS } from "../Bitburner"
import { serverList } from "./constants"

/**
 * Finds the best target based on the following criteria:
 * 1. The target must be hackable by the player
 * 2. The target must have the most money
 *
 * @param ns  The {@link NS} context
 * @param targets An {@link Array} of server names
 * @returns A {@link String} of the best target
 */
export const findBestTarget = (ns: NS, targets: string[]) => {
  let bestTarget = targets[0]
  let bestTargetMoney = ns.getServerMaxMoney(bestTarget)
  let playerHackLevel = ns.getHackingLevel()

  for (let target of targets) {
    let targetMoney = ns.getServerMaxMoney(target)
    let targetHackLevel = ns.getServerRequiredHackingLevel(target)

    if (targetHackLevel > playerHackLevel) {
      continue
    }

    if (targetMoney > bestTargetMoney) {
      bestTarget = target
      bestTargetMoney = targetMoney
    }
  }

  return bestTarget
}

/**
 * A utility object containing functions for obtaining root access
 * to servers based on the number of ports required to obtain root
 * access.
 */
export const rootTools = {
  /**
   * Obtains root access to a server that only requires one port.
   * @param ns The {@link NS} context
   * @param hostName The name of the server to hack
   * @returns A {@link Boolean} indicating whether or not the hack was successful
   * @see {@link https://bitburner.readthedocs.io/en/latest/programs.html#brutesshexe}
   */
  single: (ns: NS, hostName: string) => {
    try {
      ns.brutessh(hostName)
      ns.nuke(hostName)
      return true
    } catch {
      return false
    }
  },
  /**
   * Obtains root access to a server that requires two open ports.
   * @param ns The {@link NS} context
   * @param hostName The name of the server to hack
   * @returns A {@link Boolean} indicating whether or not the hack was successful
   * @see {@link https://bitburner.readthedocs.io/en/latest/programs.html#ftpcrackexe}
   */
  double: (ns: NS, hostName: string) => {
    try {
      rootTools.single(ns, hostName)
      ns.ftpcrack(hostName)
      ns.nuke(hostName)
      return true
    } catch {
      return false
    }
  },
  /**
   * Obtains root access to a server that requires three open ports.
   * @param ns The {@link NS} context
   * @param hostName The name of the server to hack
   * @returns A {@link Boolean} indicating whether or not the hack was successful
   * @see {@link https://bitburner.readthedocs.io/en/latest/programs.html#relaysmtpexe}
   */
  triple: (ns: NS, hostName: string) => {
    try {
      rootTools.double(ns, hostName)
      ns.relaysmtp(hostName)
      ns.nuke(hostName)
      return true
    } catch {
      return false
    }
  },
  /**
   * Obtains root access to a server that requires four open ports.
   * @param ns The {@link NS} context
   * @param hostName The name of the server to hack
   * @returns A {@link Boolean} indicating whether or not the hack was successful
   * @see {@link https://bitburner.readthedocs.io/en/latest/programs.html#httpwormexe}
   */
  quad: (ns: NS, hostName: string) => {
    try {
      rootTools.triple(ns, hostName)
      ns.httpworm(hostName)
      ns.nuke(hostName)
      return true
    } catch {
      return false
    }
  },
  /**
   * Obtains root access to a server that requires all ports to be open.
   * @param ns The {@link NS} context
   * @param hostName The name of the server to hack
   * @returns A {@link Boolean} indicating whether or not the hack was successful
   * @see {@link https://bitburner.readthedocs.io/en/latest/programs.html#sqlinjectexe}
   */
  all: (ns: NS, hostName: string) => {
    try {
      rootTools.quad(ns, hostName)
      ns.sqlinject(hostName)
      ns.nuke(hostName)
      return true
    } catch {
      return false
    }
  }
}

export const getRootAccess = (ns: NS, server: string) => {
  const numPortsRequired = ns.getServerNumPortsRequired(server)
  switch (numPortsRequired) {
    case 0:
      ns.nuke(server)
      break
    case 1:
      rootTools.single(ns, server)
      break
    case 2:
      rootTools.double(ns, server)
      break
    case 3:
      rootTools.triple(ns, server)
      break
    case 4:
      rootTools.quad(ns, server)
      break
    case 5:
      rootTools.all(ns, server)
      break
    default:
      throw new Error(`Unknown number of ports required: ${numPortsRequired}`)
  }
}

export const calcNumThreads = (
  ns: NS,
  scriptName: string,
  hostName: string
) => {
  const maxRam = ns.getServerMaxRam(hostName)
  const usedRam = ns.getServerUsedRam(hostName)
  const availableRam = maxRam - usedRam
  const scriptRam = ns.getScriptRam(scriptName)

  return Math.floor(availableRam / scriptRam)
}

export const copyAndExec = (ns: NS, scriptName: string, hostName: string) => {
  ns.killall(hostName, true)

  let numThreads = calcNumThreads(ns, scriptName, hostName)
  if (!numThreads || numThreads === Infinity) return
  if (hostName === "home") numThreads /= 2

  ns.scp(scriptName, hostName)
  ns.exec(scriptName, hostName, numThreads, ...ns.args)
}
