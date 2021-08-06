import parse from 'css-parse'

module.exports = function (name="") {
  const themes = {
    // load themes here
  }

  /**
   * Applies a set of css rules on elements of the current page
   * @id  the name of the theme
   */

  // many ways to swap stylesheets
  https://www.rainbodesign.com/pub/css/css-javascript.html
  function applyTheme (id='light', rootComponent=null, rootSel='body') {
    let rules
    try {
      rules = parse(this.theme)
        .stylesheet.rules
        .filter(r => r.type === 'rule')
    } catch (e) {
      return;
    }

    // TRY
    // ref.$forceUpdate()
    // ref.$mount()
    // await this.forceRender(); - clear last applied theme

    // no need, just apply/remove the stylesheet

    rules.forEach(rule => {
      const sel = rule.selectors.length ? '#styles-demo ' + rule.selectors.join(', ') : ''
      const els = [...document.querySelectorAll(sel)]
      rule.declarations
        .filter(dec => dec.type === 'declaration')
        .forEach(dec => {
          els.filter(el => el).forEach(el => {
            const prop = dec.property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
            el.style[prop] = dec.value
          })
        })
    })
  }

  return {
    themes,
    applyTheme
  }
}

// LAZY LOADING
// main.js
// const getCat = () => import('./cat.js')
// later in the code as a response to some user interaction like click or route change
// getCat()
  // .then({ meow } => meow())