export class Translator {
    /**
     * @param {import('./data/data-options').DataOptions} data
     * @returns {Translator}
     */
    static create(data: import('./data/data-options').DataOptions): Translator;
    /**
     * @type {import('./data/data-options').DataOptions | undefined}
     * @protected
     */
    protected data: import('./data/data-options').DataOptions | undefined;
    /**
     * @type {import('./data/formatting-context').FormattingContext}
     * @protected
     */
    protected globalContext: import('./data/formatting-context').FormattingContext;
    /**
     * @type {((text: string | number, num?: number, formatting?: import('./data/formatting-context').FormattingContext, data?: import('./data/values').Values) => string | number) | undefined}
     * @protected
     */
    protected extension: (text: string | number, num?: number, formatting?: import('./data/formatting-context').FormattingContext, data?: import('./data/values').Values) => string | number;
    /**
     * @param {string | number} text
     * @param {number | import('./data/formatting-context').FormattingContext | undefined} defaultNumOrFormatting
     * @param {number | import('./data/formatting-context').FormattingContext | undefined} numOrFormattingOrContext
     * @param {import('./data/formatting-context').FormattingContext | undefined} formattingOrContext
     * @returns {string}
     */
    translate(text: string | number, defaultNumOrFormatting: number | import('./data/formatting-context').FormattingContext | undefined, numOrFormattingOrContext: number | import('./data/formatting-context').FormattingContext | undefined, formattingOrContext: import('./data/formatting-context').FormattingContext | undefined): string;
    /**
     * @param {import('./data/data-options').DataOptions} data
     */
    add(data: import('./data/data-options').DataOptions): void;
    /**
     * @param {string} key
     * @param {string} value
     */
    setContext(key: string, value: string): void;
    /**
     * @param {(text: string | number, num?: number, formatting?: import('./data/formatting-context').FormattingContext, data?: import('./data/values').Values) => string | number} extension
     */
    extend(extension: (text: string | number, num?: number, formatting?: import('./data/formatting-context').FormattingContext, data?: import('./data/values').Values) => string | number): void;
    /**
     * @param {string} key
     */
    clearContext(key: string): void;
    reset(): void;
    resetData(): void;
    resetContext(): void;
    /**
     * @param {string | number} text
     * @param {number | undefined} num
     * @param {import('./data/formatting-context').FormattingContext | undefined} formatting
     * @param {import('./data/formatting-context').FormattingContext | undefined} context
     * @returns {string}
     */
    translateText(text: string | number, num: number | undefined, formatting: import('./data/formatting-context').FormattingContext | undefined, context: import('./data/formatting-context').FormattingContext | undefined): string;
    /**
     * @param {string | number} text
     * @param {number | undefined} num
     * @param {import('./data/formatting-context').FormattingContext | undefined} formatting
     * @param {import('./data/values').Values | undefined} data
     * @returns {string | null}
     */
    findTranslation(text: string | number, num: number | undefined, formatting: import('./data/formatting-context').FormattingContext | undefined, data: import('./data/values').Values | undefined): string | null;
    /**
     * @param {string} str
     * @param {number} num
     * @returns {string}
     */
    applyNumbers(str: string, num: number): string;
    /**
     * @param {string} text
     * @param {import('./data/formatting-context').FormattingContext | undefined} formatting
     * @returns {string}
     */
    applyFormatting(text: string, formatting: import('./data/formatting-context').FormattingContext | undefined): string;
    /**
     * @param {import('./data/data-options').DataOptions} data
     * @param {import('./data/formatting-context').FormattingContext} context
     * @returns {import('./data/context-options').ContextOptions | null}
     */
    getContextData(data: import('./data/data-options').DataOptions, context: import('./data/formatting-context').FormattingContext): import('./data/context-options').ContextOptions | null;
    /**
     * @param {string} text
     * @param {number | undefined} num
     * @param {import('./data/formatting-context').FormattingContext | undefined} formatting
     * @returns {string}
     */
    useOriginalText(text: string, num: number | undefined, formatting: import('./data/formatting-context').FormattingContext | undefined): string;
}
