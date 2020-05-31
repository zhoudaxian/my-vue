
import { parseHTML } from './parseHTML'
import { generate } from './genCode'

export function compileToFunction (templete) {

  // parse html
  const root = parseHTML(templete)

  const code = generate(root)

  const renderFn = new Function(`with(this){return ${code}}`)

  console.log(root, code, renderFn)
  return renderFn
}

