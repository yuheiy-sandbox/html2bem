import React from 'react'
// import {RadioGroup, Radio} from 'react-radio-group'
import generateCss from './generateCss'
import {DEFAULT_ELEMENT_SEPARATOR, DEFAULT_MODIFIER_SEPARATOR} from './constants'

const DEFAULT_INPUT_VAL = `<ul class="nav nav--main">
  <li class="nav__item"><a href="" class="nav__link">Home</a></li>
  <li class="nav__item"><a href="" class="nav__link">Shop</a></li>
  <li class="nav__item"><a href="" class="nav__link nav__link--special">About</a></li>
</ul>`

export default class App extends React.Component {
  state = {
    input: DEFAULT_INPUT_VAL,
    elementSeparator: DEFAULT_ELEMENT_SEPARATOR,
    modifierSeparator: DEFAULT_MODIFIER_SEPARATOR,
  }

  onChange = ({target: {name, value}}) => {
    this.setState({[name]: value})
  }

  onChangeRadio = (name) => (val) => {
    this.setState({[name]: val})
  }

  render() {
    const {template, input, elementSeparator, modifierSeparator} = this.state
    return <div>
      <header>
        <h1>HTML to BEM</h1>
        <p>Generate CSS selectors from your markup.</p>
      </header>

      <div>
        <div>
          <div>input:</div>
          {/* <RadioGroup name="template" selectedValue={template} onChange={this.onChangeRadio('template')}>
            template:
            {' '}
            <label><Radio value="html" />HTML</label>
            <label><Radio value="pug" />Pug</label>
          </RadioGroup> */}
          <div>
            element separator:
            {' '}
            <input type="text" name="elementSeparator" value={elementSeparator} onChange={this.onChange} />
          </div>
          <div>
            modifier separator:
            {' '}
            <input type="text" name="modifierSeparator" value={modifierSeparator} onChange={this.onChange} />
          </div>
        <div></div>
          <textarea name="input" value={input} onChange={this.onChange} />
        </div>
        <div>
          <div>output:</div>
          <pre>
            <code>
              {(() => {
                try {
                  return generateCss(input, {elementSeparator, modifierSeparator})
                } catch (err) {
                  return err.message
                }
              })()}
            </code>
          </pre>
        </div>
      </div>
    </div>
  }
}
