import { ClassNames } from '../interfaces/class-names';
import { PassedElementType, PassedElementTypes } from '../interfaces/passed-element-type';

/**
 * Returns true for Unicode code points that render as double-width
 * (CJK, Hangul, fullwidth forms, etc.) relative to the CSS `ch` unit.
 */
function isWideChar(code: number): boolean {
  /* eslint-disable no-mixed-operators */
  return (
    (code >= 0x1100 && code <= 0x115f) || // Hangul Jamo
    code === 0x2329 ||
    code === 0x232a ||
    (code >= 0x2e80 && code <= 0x303e) || // CJK Radicals, Kangxi, CJK Symbols
    (code >= 0x3041 && code <= 0x33bf) || // Hiragana, Katakana, Bopomofo, CJK Compat
    (code >= 0x3400 && code <= 0x4dbf) || // CJK Extension A
    (code >= 0x4e00 && code <= 0x9fff) || // CJK Unified Ideographs
    (code >= 0xa000 && code <= 0xa4cf) || // Yi Syllables / Radicals
    (code >= 0xa960 && code <= 0xa97f) || // Hangul Jamo Extended-A
    (code >= 0xac00 && code <= 0xd7af) || // Hangul Syllables
    (code >= 0xf900 && code <= 0xfaff) || // CJK Compatibility Ideographs
    (code >= 0xfe10 && code <= 0xfe1f) || // Vertical Forms
    (code >= 0xfe30 && code <= 0xfe6f) || // CJK Compatibility Forms
    (code >= 0xff01 && code <= 0xff60) || // Fullwidth Latin / Punctuation
    (code >= 0xffe0 && code <= 0xffe6) || // Fullwidth Signs
    (code >= 0x1b000 && code <= 0x1b001) || // Kana Supplement
    (code >= 0x20000 && code <= 0x2fffd) || // CJK Extension B–D
    (code >= 0x30000 && code <= 0x3fffd) // CJK Extension E+
  );
  /* eslint-enable no-mixed-operators */
}

/**
 * Returns the display width of a string in `ch` units.
 * Uses `Intl.Segmenter` to split grapheme clusters, then counts wide
 * characters (CJK, Hangul, fullwidth forms, etc.) as 2 and all others as 1.
 *
 * Falls back to `str.length` on environments without `Intl.Segmenter`.
 * For accurate CJK width in those environments, add a polyfill:
 *   - https://github.com/cometkim/unicode-segmenter
 *   - https://github.com/surferseo/intl-segmenter-polyfill
 */
function getStringWidth(str: string): number {
  // @ts-expect-error choices.js targets ES2020, but Intl.Segmenter is defined in ES2022
  if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
    // @ts-expect-error choices.js targets ES2020, but Intl.Segmenter is defined in ES2022
    return [...new Intl.Segmenter().segment(str)].reduce(
      (width, { segment }) => width + (isWideChar(segment.codePointAt(0) ?? 0) ? 2 : 1),
      0,
    );
  }

  return str.length;
}

export default class Input {
  element: HTMLInputElement;

  type: PassedElementType;

  classNames: ClassNames;

  preventPaste: boolean;

  isFocussed: boolean;

  isDisabled: boolean;

  constructor({
    element,
    type,
    classNames,
    preventPaste,
  }: {
    element: HTMLInputElement;
    type: PassedElementType;
    classNames: ClassNames;
    preventPaste: boolean;
  }) {
    this.element = element;
    this.type = type;
    this.classNames = classNames;
    this.preventPaste = preventPaste;

    this.isFocussed = this.element.isEqualNode(document.activeElement);
    this.isDisabled = element.disabled;
    this._onPaste = this._onPaste.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }

  set placeholder(placeholder: string) {
    this.element.placeholder = placeholder;
  }

  get value(): string {
    return this.element.value;
  }

  set value(value: string) {
    this.element.value = value;
  }

  addEventListeners(): void {
    const el = this.element;
    el.addEventListener('paste', this._onPaste);
    el.addEventListener('input', this._onInput, {
      passive: true,
    });
    el.addEventListener('focus', this._onFocus, {
      passive: true,
    });
    el.addEventListener('blur', this._onBlur, {
      passive: true,
    });
  }

  removeEventListeners(): void {
    const el = this.element;
    el.removeEventListener('input', this._onInput);
    el.removeEventListener('paste', this._onPaste);
    el.removeEventListener('focus', this._onFocus);
    el.removeEventListener('blur', this._onBlur);
  }

  enable(): void {
    const el = this.element;
    el.removeAttribute('disabled');
    this.isDisabled = false;
  }

  disable(): void {
    const el = this.element;
    el.setAttribute('disabled', '');
    this.isDisabled = true;
  }

  focus(): void {
    if (!this.isFocussed) {
      this.element.focus();
    }
  }

  blur(): void {
    if (this.isFocussed) {
      this.element.blur();
    }
  }

  clear(setWidth = true): this {
    this.element.value = '';
    if (setWidth) {
      this.setWidth();
    }

    return this;
  }

  /**
   * Set the correct input width based on placeholder
   * value or input value
   */
  setWidth(): void {
    // Resize input to contents or placeholder.
    // Uses getStringWidth() instead of .length so that wide characters
    // (CJK, Hangul, fullwidth forms, etc.) are counted as 2ch rather than 1ch,
    // preventing placeholder text truncation for languages like Japanese.
    const { element } = this;
    element.style.minWidth = `${getStringWidth(element.placeholder) + 1}ch`;
    element.style.width = `${getStringWidth(element.value) + 1}ch`;
  }

  setActiveDescendant(activeDescendantID: string): void {
    this.element.setAttribute('aria-activedescendant', activeDescendantID);
  }

  removeActiveDescendant(): void {
    this.element.removeAttribute('aria-activedescendant');
  }

  _onInput(): void {
    if (this.type !== PassedElementTypes.SelectOne) {
      this.setWidth();
    }
  }

  _onPaste(event: ClipboardEvent): void {
    if (this.preventPaste) {
      event.preventDefault();
    }
  }

  _onFocus(): void {
    this.isFocussed = true;
  }

  _onBlur(): void {
    this.isFocussed = false;
  }
}
