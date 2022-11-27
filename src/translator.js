const { isObject } = require('./utils');

class Translator {
  /**
   * @type {import('./data/data-options').DataOptions | undefined}
   * @protected
   */
  data;
  /**
   * @type {import('./data/formatting-context').FormattingContext}
   * @protected
   */
  globalContext;

  /**
   * @type {((text: string | number, num?: number, formatting?: import('./data/formatting-context').FormattingContext, data?: import('./data/values').Values) => string | number) | undefined} 
   * @protected
   */
  extension;

  constructor() {
    this.resetContext();
  }

  /**
   * @param {import('./data/data-options').DataOptions} data 
   * @returns {Translator}
   */
  static create(data) {
    const translator = new Translator();

    translator.add(data);

    return translator;
  }

  /**
   * @param {string | number} text 
   * @param {number | import('./data/formatting-context').FormattingContext | undefined} defaultNumOrFormatting 
   * @param {number | import('./data/formatting-context').FormattingContext | undefined} numOrFormattingOrContext 
   * @param {import('./data/formatting-context').FormattingContext | undefined} formattingOrContext 
   * @returns {string}
   */
  translate(text, defaultNumOrFormatting = undefined, numOrFormattingOrContext = undefined, formattingOrContext = undefined) {
    let num = undefined;
    let formatting = undefined;
    let context = this.globalContext;

    if(isObject(defaultNumOrFormatting)) {
      formatting = defaultNumOrFormatting;

      if(isObject(numOrFormattingOrContext)) {
        context = numOrFormattingOrContext;
      }
    } else if(typeof defaultNumOrFormatting === 'number') {
      num = defaultNumOrFormatting;
      formatting = numOrFormattingOrContext;

      if(formattingOrContext) {
        context = formattingOrContext;
      }
    } else {
      if(typeof numOrFormattingOrContext === 'number') {
        num = numOrFormattingOrContext;
        formatting = formattingOrContext;
      } else {
        formatting = numOrFormattingOrContext;
        
        if(formattingOrContext) {
          context = formattingOrContext;
        }
      }
    }

    return this.translateText(text, num, formatting, context);
  }

  /**
   * @param {import('./data/data-options').DataOptions} data 
   */
  add(data) {
    if(!this.data) {
      this.data = data;
    } else {
      if(data.values && this.data.values) {
        for(const key of Object.keys(data.values)) {
          this.data.values[key] = data.values[key];
        }
      }
  
      if(data.contexts && this.data.contexts) {
        for(const context of data.contexts) {
          this.data.contexts.push(context);
        }
      }
    }
  }

  /**
   * @param {string} key 
   * @param {string} value 
   */
  setContext(key, value) {
    his.globalContext[key] = value;
  }

  /**
   * @param {(text: string | number, num?: number, formatting?: import('./data/formatting-context').FormattingContext, data?: import('./data/values').Values) => string | number} extension 
   */
  extend(extension) {
    this.extension = extension;
  }

  /**
   * @param {string} key 
   */
  clearContext(key) {
    delete this.globalContext[key];
  }

  reset() {
    this.resetData();
    this.resetContext();
  }

  resetData() {
    this.data = {
      values: {},
      contexts: []
    };
  }

  resetContext() {
    this.globalContext = {};
  }

  /**
   * @param {string | number} text 
   * @param {number | undefined} num 
   * @param {import('./data/formatting-context').FormattingContext | undefined} formatting 
   * @param {import('./data/formatting-context').FormattingContext | undefined} context 
   * @returns {string}
   */
  translateText(text, num = undefined, formatting = undefined, context = undefined) {
    context = context || this.globalContext;

    if(!this.data) {
      return this.useOriginalText('' + text, num, formatting);
    }

    const contextData = this.getContextData(this.data, context);

    let result = null;

    if(contextData) {
      result = this.findTranslation(text, num, formatting, contextData?.values);
    }

    if(result === null) {
      result = this.findTranslation(text, num, formatting, this.data.values);
    } 

    if(result === null)  {
      result = this.useOriginalText('' + text, num, formatting);
    }

    return result;  
  }

  /**
   * @param {string | number} text 
   * @param {number | undefined} num 
   * @param {import('./data/formatting-context').FormattingContext | undefined} formatting 
   * @param {import('./data/values').Values | undefined} data 
   * @returns {string | null}
   */
  findTranslation(text, num = undefined, formatting = undefined, data = undefined) {
    let value = data?.[text];

    if(value === undefined) {
      return null;
    }

    if(typeof value === 'object' && !Array.isArray(value)) {
      if(this.extension) {
        value = '' + this.extension(text, num, formatting, value);
        value = this.applyNumbers(value, num || 0);

        return this.applyFormatting(value, formatting);
      } else {
        return this.useOriginalText('' + text, num, formatting);
      }
    }  

    if(num === undefined && typeof value === 'string') {
      return this.applyFormatting(value, formatting);
    } else if(value instanceof Array) {               
      for(const triple of value) {
        if(
          num === undefined && triple[0] === null && triple[1] === null || 
          num !== undefined && (
            triple[0] !== null && num >= triple[0] && (triple[1] === null || num <= triple[1]) || 
            triple[0] === null && triple[1] && num <= triple[1]
          )
        ) {
          const numVal = num || 0;
          const textVal = '' + (triple[2] ?? '');          

          const result = this.applyNumbers(textVal, numVal);

          return this.applyFormatting(result, formatting);
        }
      }
    }

    return null;
  }

  /**
   * @param {string} str 
   * @param {number} num 
   * @returns {string}
   */
  applyNumbers(str, num) {
    str = str.replace('-%n', '' + -num);
    str = str.replace('%n', '' + num);

    return str;
  }

  /**
   * @param {string} text 
   * @param {import('./data/formatting-context').FormattingContext | undefined} formatting 
   * @returns {string}
   */
  applyFormatting(text, formatting = undefined) {
    if(formatting) {
      for(const key of Object.keys(formatting)) {
        const regex = new RegExp(`%{${key}}`, 'g');
        text = text.replace(regex, formatting[key]);
      }
    }

    return text;
  }

  /**
   * @param {import('./data/data-options').DataOptions} data 
   * @param {import('./data/formatting-context').FormattingContext} context 
   * @returns {import('./data/context-options').ContextOptions | null}
   */
  getContextData(data, context) {
    if(!data.contexts) {
      return null;
    }

    for(const ctx of data.contexts) {
      let equal = true;

      for(const key of Object.keys(ctx.matches)) {
        const value = ctx.matches[key];

        equal = equal && value === context[key];

        if(!equal) break;
      }

      if(equal) {
        return ctx;
      }
    }

    return null;
  }

  /**
   * @param {string} text 
   * @param {number | undefined} num 
   * @param {import('./data/formatting-context').FormattingContext | undefined} formatting 
   * @returns {string}
   */
  useOriginalText(text, num = undefined, formatting = undefined) {
    if(num === undefined) {
      return this.applyFormatting(text, formatting);
    }

    return this.applyFormatting(text.replace('%n', '' + num), formatting);
  }
}


module.exports = {
  Translator
};
