import { expect } from 'chai';
import { getClassNames } from '../../../src/scripts/lib/utils';
import { DEFAULT_CLASSNAMES } from '../../../src';
import WrappedElement from '../../../src/scripts/components/wrapped-element';

describe('components/wrappedElement', () => {
  let instance;
  let element;

  beforeEach(() => {
    element = document.createElement('select');
    instance = new WrappedElement({
      element,
      classNames: DEFAULT_CLASSNAMES,
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    instance = null;
  });

  describe('constructor', () => {
    it('assigns choices element to class', () => {
      expect(instance.element).to.equal(element);
    });

    it('assigns classnames to class', () => {
      expect(instance.classNames).to.deep.equal(DEFAULT_CLASSNAMES);
    });

    it('sets isDisabled flag to false', () => {
      expect(instance.isDisabled).to.deep.equal(false);
    });
  });

  describe('value getter', () => {
    it('returns element value', () => {
      expect(instance.value).to.deep.equal(element.value);
    });
  });

  describe('isActive getter', () => {
    it('returns whether the "data-choice" attribute is set to "active"', () => {
      instance.element.dataset.choice = 'active';
      expect(instance.isActive).to.equal(true);

      instance.element.dataset.choice = 'inactive';
      expect(instance.isActive).to.equal(false);
    });
  });

  describe('dir getter', () => {
    it('returns the direction of the element', () => {
      expect(instance.dir).to.equal(instance.element.dir);
    });
  });

  describe('conceal', () => {
    let originalStyling;

    beforeEach(() => {
      originalStyling = 'color:red';
      instance.element.setAttribute('style', originalStyling);
    });

    it('hides element', () => {
      instance.conceal();
      expect(instance.element.tabIndex).to.equal(-1);

      const classesToCheck = getClassNames(instance.classNames.input);
      expect(
        [...instance.element.classList].some(
          (className) => classesToCheck.indexOf(className) !== -1,
        ),
      ).to.equal(true);
      expect(instance.element.hidden).to.be.true;
      expect(instance.element.getAttribute('data-choice')).to.equal('active');
      expect(instance.element.getAttribute('data-choice-orig-style')).to.equal(
        originalStyling,
      );
    });
  });

  describe('reveal', () => {
    let originalStyling;

    beforeEach(() => {
      originalStyling = 'color:red';
      instance.element.setAttribute('data-choice-orig-style', originalStyling);
    });

    it('shows element', () => {
      instance.reveal();
      expect(instance.element.tabIndex).to.equal(0);

      const classesToCheck = getClassNames(instance.classNames.input);
      expect(
        [...instance.element.classList].some(
          (className) => classesToCheck.indexOf(className) !== -1,
        ),
      ).to.equal(false);
      expect(instance.element.hidden).to.be.false;
      expect(instance.element.getAttribute('style')).to.equal(originalStyling);
      expect(instance.element.getAttribute('aria-hidden')).to.equal(null);
      expect(instance.element.getAttribute('data-choice')).to.equal(null);
      expect(instance.element.getAttribute('data-choice-orig-style')).to.equal(
        null,
      );
    });
  });

  describe('enable', () => {
    beforeEach(() => {
      instance.disable();
    });

    it('removes disabled attribute', () => {
      expect(instance.element.hasAttribute('disabled')).to.equal(true);
      instance.enable();
      expect(instance.element.hasAttribute('disabled')).to.equal(false);
    });

    it('sets elements disabled state to false', () => {
      expect(instance.element.disabled).to.equal(true);
      instance.enable();
      expect(instance.element.disabled).to.equal(false);
    });

    it('sets isDisabled flag to false', () => {
      expect(instance.isDisabled).to.equal(true);
      instance.enable();
      expect(instance.isDisabled).to.equal(false);
    });
  });

  describe('disable', () => {
    beforeEach(() => {
      instance.enable();
    });

    it('sets disabled attribute (to blank string)', () => {
      expect(instance.element.hasAttribute('disabled')).to.equal(false);
      instance.disable();
      expect(instance.element.getAttribute('disabled')).to.equal('');
    });

    it('sets elements disabled state to true', () => {
      expect(instance.element.disabled).to.equal(false);
      instance.disable();
      expect(instance.element.disabled).to.equal(true);
    });

    it('sets isDisabled flag to true', () => {
      expect(instance.isDisabled).to.equal(false);
      instance.disable();
      expect(instance.isDisabled).to.equal(true);
    });
  });

  describe('triggerEvent', () => {
    it('fires event on element using passed eventType and data', () =>
      new Promise((done) => {
        const data = {
          test: true,
        };

        instance.element.addEventListener('testEvent', ({ detail }) => {
          expect(detail).to.deep.equal(data);
          done(true);
        });

        instance.triggerEvent('testEvent', data);
      }));
  });
});
