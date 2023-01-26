import { NS } from "./Bitburner"
import ServerMap from "./ServerMap"

export async function main(ns: NS) {
  // ns.tprint(HEADER_TEXT)
  // ns.print(ns.getRunningScript())

  // const player = JSON.stringify(ns.getPlayer())
  // const res = ns.scan("n00dles")
  const server = new ServerMap(ns)
  await server.buildMap()

  // ns.print(`Player: ${player}`)
  // ns.print(res)

  // ns.print("--------------------")

  // ns.print(Object.keys(ns).join("\n"))

  // ns.print("--------------------")

  const serverString = JSON.stringify(
    await server.findServer("n00dles"),
    null,
    2
  )
  ns.tprint(ns.getGrowTime("silver-helix"))
}

const HEADER_TEXT = `
====================================================================================================================

 ,ggggggggggggggg
dP""""""88"""""""              I8       i8""8i                                                               8I
Yb,_    88                     I8       \`8,,8'                                                               8I
 \`""    88                  88888888     \`Y88aaad8                                                           8I
        88                     I8         d8""""Y8,                                                          8I
        88  ,ggg,     ,g,      I8        ,8P     8b  ,gggggg,    ,ggggg,   gg      gg   ,ggg,,ggg,     ,gggg,8I
        88 i8" "8i   ,8'8,     I8        dP      Y8  dP""""8I   dP"  "Y8gggI8      8I  ,8" "8P" "8,   dP"  "Y8I
  gg,   88 I8, ,8I  ,8'  Yb   ,I8,   _ ,dP'      I8 ,8'    8I  i8'    ,8I  I8,    ,8I  I8   8I   8I  i8'    ,8I
   "Yb,,8P \`YbadP' ,8'_   8) ,d88b,  "888,,_____,dP,dP     Y8,,d8,   ,d8' ,d8b,  ,d8b,,dP   8I   Yb,,d8,   ,d8b,
     "Y8P'888P"Y888P' "YY8P8P8P""Y8  a8P"Y888888P" 8P      \`Y8P"Y8888P"   8P'"Y88P"\`Y88P'   8I   \`Y8P"Y8888P"\`Y8

====================================================================================================================

`
