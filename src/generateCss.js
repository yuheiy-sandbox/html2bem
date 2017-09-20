import uniq from 'lodash.uniq'
import {DEFAULT_ELEMENT_SEPARATOR, DEFAULT_MODIFIER_SEPARATOR} from './constants'

const getAllClassNames = (rawHtml) => {
  const dammyNode = document.createElement('div')
  dammyNode.innerHTML = rawHtml
  const treeWalker = document.createTreeWalker(dammyNode, NodeFilter.SHOW_ELEMENT)
  const classNames = []
  while (treeWalker.nextNode()) {
    const elementClassNames = treeWalker.currentNode.className
      .split(' ')
      .map(cn => cn.trim())
      .filter(cn => cn)
    classNames.push(...elementClassNames)
  }
  return uniq(classNames)
}

const buildBem = (classNames, {elementSeparator, modifierSeparator}) => {
  return classNames.map(className => {
    let block
    let element
    let modifier
    if (className.includes(elementSeparator)) {
      const splitByElementSeparator = className.split(elementSeparator)
      if (splitByElementSeparator.length !== 2) {
        throw new Error(`\`${className}\` is invalid className`)
      }
      block = splitByElementSeparator[0]
      const splitByModifierSeparator = splitByElementSeparator[1].split(modifierSeparator)
      if (splitByModifierSeparator.length === 1) {
        element = splitByModifierSeparator[0]
      } else if (splitByModifierSeparator.length === 2) {
        element = splitByModifierSeparator[0]
        modifier = splitByModifierSeparator[1]
      } else {
        throw new Error(`\`${className}\` is invalid className`)
      }
    } else if (className.includes(modifierSeparator)) {
      const splitByModifierSeparator = className.split(modifierSeparator)
      if (splitByModifierSeparator.length === 2) {
        block = splitByModifierSeparator[0]
        modifier = splitByModifierSeparator[1]
      } else if (splitByModifierSeparator.length > 2) {
        throw new Error(`\`${className}\` is invalid className`)
      }
    } else {
      block = className
    }

    const selector = {}
    if (block) {
      selector.block = block
    }
    if (element) {
      selector.element = element
    }
    if (modifier) {
      selector.modifier = modifier
    }
    return selector
  })
}

const generateCss = (rawHtml, options = {}) => {
  const elementSeparator = options.elementSeparator || DEFAULT_ELEMENT_SEPARATOR
  const modifierSeparator = options.modifierSeparator || DEFAULT_MODIFIER_SEPARATOR

  const classNames = getAllClassNames(rawHtml)
  const bemSelectors = buildBem(classNames, {elementSeparator, modifierSeparator})
  return bemSelectors.map(({block, element, modifier}) => {
    if (element && modifier) {
      return `.${block}${elementSeparator}${element}${modifierSeparator}${modifier} {\n}`
    } else if (element) {
      return `.${block}${elementSeparator}${element} {\n}`
    } else if (modifier) {
      return `.${block}${modifierSeparator}${modifier} {\n}`
    } else {
      return `.${block} {\n}`
    }
  }).join('\n\n')
}

export default generateCss
