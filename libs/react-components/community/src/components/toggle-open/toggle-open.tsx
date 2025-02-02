import cn from 'classnames';
import React from 'react';

import Button, { ButtonProps } from '../button/button';
import { IconProps } from '../icon/icon';
import styles from './toggle-open.module.scss';

export interface ToggleOpenProps extends Omit<ButtonProps, 'children' | 'iconRight' | 'as'> {
  /**
   * Name on the button to open the item
   */
  openText: string;
  /**
   * Name on the button to close the item
   */
  closeText: string;
  /**
   * If the element currently open
   */
  isOpen: boolean;
  /**
   * Name of the icon we want to show on the right.
   * Overidden from ButtonProps, because we dont support string as icon name here
   */
  iconRight?: Partial<IconProps>;
  /**
   * If the element is a button or a div
   * @default button
   */
  as?: 'button' | 'div';
}
export const ToggleOpen = ({
  openText,
  closeText,
  isOpen,
  iconRight,
  as = 'button',
  ...rest
}: ToggleOpenProps): JSX.Element => {
  const ToggleOpenBEM = cn(
    { [styles['toggle--open']]: isOpen },
    { [styles['toggle--close']]: !isOpen },
    iconRight?.className
  );

  return (
    <Button
      data-name="button"
      as={as as 'button' | 'div'}
      iconRight={{ ...iconRight, className: ToggleOpenBEM, name: 'expand_more' }}
      {...rest}
    >
      {isOpen ? closeText : openText}
    </Button>
  );
};
export default ToggleOpen;
