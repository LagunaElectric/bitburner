import { NS, Server } from "./Bitburner"
import Printer from "./printer"

export default class ServerMap {
  private readonly ns: NS
  private _map: ServerNode
  private term: Printer

  constructor(ns: NS) {
    this.ns = ns
    this.term = new Printer(ns, "terminal")
    this._map = new ServerNode(ns, ns.getServer("home"))
  }

  /**
   * The root {@link Server} of the server map.
   */
  get root(): Server {
    return this._map.server
  }

  /**
   * The server map as a tree of {@link ServerNode}.
   */
  get map(): ServerNode {
    return this._map
  }

  async buildMap() {
    await this.populateChildren(this._map)
    this.term.success("Finished building map")
  }

  async findServer(hostname: string): Promise<Server> {
    return (await this.findServerHelper(this._map, hostname)).server
  }

  private async populateChildren(node: ServerNode, parentNode?: ServerNode) {
    await this.ns.sleep(20)
    node.children = this.ns
      .scan(node.server.hostname)
      .filter(
        s => s !== node.server.hostname && s !== parentNode?.server.hostname
      )
      .map(s => new ServerNode(this.ns, this.ns.getServer(s)))

    for (let child of node.children) {
      await this.populateChildren(child, node)
    }
  }

  public toString(): string {
    const forbiddenKeys = [
      "ns",
      "term",
      "contracts",
      "messages",
      "programs",
      "runningScripts",
      "scripts",
      "serversOnNetwork",
      "textFiles"
    ]
    const replacer = (k: any, v: any) => {
      if (forbiddenKeys.includes(k)) return undefined
      if (k === "_server") return v.hostname
      return v
    }

    return JSON.stringify(this._map, replacer, 2)
  }

  private async findServerHelper(
    node: ServerNode,
    hostname: string
  ): Promise<ServerNode | null> {
    if (node.server.hostname === hostname) {
      return node
    }

    for (let child of node.children) {
      let found = await this.findServerHelper(child, hostname)
      if (found) {
        return found
      }
    }

    return null
  }
}

export class ServerNode {
  private readonly ns: NS
  private _server: Server
  children: Array<ServerNode>

  constructor(ns: NS, server: Server) {
    this.ns = ns
    this._server = server
    this.children = []
  }

  get server(): Server {
    return this._server
  }

  update() {
    this._server = this.ns.getServer(this._server.hostname)
  }
}
