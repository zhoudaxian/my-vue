
import { parseHTML } from './parseHTML'

export function compileToFunction (templete) {

  // parse html
  let root = parseHTML(templete)


  console.log('1', root)
  return function render () {

  }
}

