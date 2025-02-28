// eslint-disable-next-line import/no-cycle
import { ChoiceFull } from './choice-full';

export interface GroupFull {
  id: number;
  active: boolean;
  disabled: boolean;
  label?: string;
  value?: string;
  element?: HTMLOptGroupElement;
  groupEl?: HTMLElement;
  choices: ChoiceFull[];
}
