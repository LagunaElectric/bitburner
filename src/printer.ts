import { NS } from "./Bitburner"

export default class Printer {
  constructor(ns: NS, type: "log" | "terminal") {
    this.ns = ns
    this.type = type
  }

  private ns: NS
  private type: "log" | "terminal"

  public print(...args: any[]): void {
    if (this.type === "log") {
      this.ns.print(...args)
    } else {
      this.ns.tprint(...args)
    }
  }

  public println(...args: any[]): void {
    if (this.type === "log") {
      this.ns.print(...args, "\n")
    } else {
      this.ns.tprint(...args, "\n")
    }
  }

  public error(...args: any[]): void {
    args.unshift("ERROR   > ")
    this.print(...args)
  }

  public errorln(...args: any[]): void {
    args.unshift("ERROR   > ")
    this.println(...args)
  }

  public success(...args: any[]): void {
    args.unshift("SUCCESS > ")
    this.print(...args)
  }

  public successln(...args: any[]): void {
    args.unshift("SUCCESS > ")
    this.println(...args)
  }

  public warn(...args: any[]): void {
    args.unshift("WARN    > ")
    this.print(...args)
  }

  public warnln(...args: any[]): void {
    args.unshift("WARN    > ")
    this.println(...args)
  }

  public info(...args: any[]): void {
    args.unshift("INFO    > ")
    this.print(...args)
  }

  public infoln(...args: any[]): void {
    args.unshift("INFO    > ")
    this.println(...args)
  }
}
