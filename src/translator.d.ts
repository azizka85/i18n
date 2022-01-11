import { ContextOptions } from './data/context-options';
import { DataOptions } from './data/data-options';
import { FormattingContext } from './data/formatting-context';
import { Values } from './data/values';

export class Translator {
  protected data?: DataOptions;
  protected globalContext: FormattingContext;
  
  protected extension?: (
    text: string | number, 
    num?: number, 
    formatting?: FormattingContext, 
    data?: Values
  ) => string | number;

  constructor();

  static create(data: DataOptions): Translator;

  translate(
    text: string | number, 
    defaultNumOrFormatting?: number | FormattingContext, 
    numOrFormattingOrContext?: number | FormattingContext,
    formattingOrContext?: FormattingContext    
  ): string;

  add(data: DataOptions): void;

  setContext(key: string, value: string): void;
  clearContext(key: string): void;

  extend(
    extension: (
      text: string | number, 
      num?: number, 
      formatting?: FormattingContext, 
      data?: Values
    ) => string | number
  ): void;

  reset(): void;
  resetData(): void;
  resetContext(): void;

  translateText(
    text: string | number, 
    num?: number, 
    formatting?: FormattingContext, 
    context?: FormattingContext
  ): string;

  protected findTranslation(
    text: string | number,
    num?: number,
    formatting?: FormattingContext,
    data?: Values
  ): string | null;

  protected applyNumbers(str: string, num: number): string;
  protected applyFormatting(text: string, formatting?: FormattingContext): string;
  
  protected getContextData(data: DataOptions, context: FormattingContext): ContextOptions | null;

  protected useOriginalText(text: string, num?: number, formatting?: FormattingContext): string;
}
