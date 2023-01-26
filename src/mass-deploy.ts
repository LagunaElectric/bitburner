import { NS } from "./Bitburner"

export async function main(ns: NS) {
  const { print } = ns
  const servers = ns.scan("home")
  print(Object.keys(ns))
}
