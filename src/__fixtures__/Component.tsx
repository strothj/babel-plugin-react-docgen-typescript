import * as React from "react";

type Size = "small" | "default" | "large";
type TabIndex = -1 | 0 | 1 | 2;
interface ButtonProps {
  /**
   * Label for button.
   */
  label: string;

  /**
   * Triggered when button is clicked.
   */
  onClick: React.EventHandler<React.SyntheticEvent<any>>;

  /**
   * An optional color to apply to the button.
   * @default #fff
   */
  optionalColor?: string;

  /**
   * Defines the size of the button.
   */
  size?: Size;

  /**
   * Defines the tabIndex of the button.
   */
  tabIndex?: TabIndex;

  /**
   * Defines if a button is disabled.
   */
  disabled?: boolean;
}

/**
 * This is an awesome looking button for React.
 */
class Button extends React.Component<ButtonProps> {
  static defaultProps = {
    label: "label",
    size: "default",
    disabled: false,
    tabIndex: -1,
  };

  render() {
    const { label, onClick } = this.props;

    return (
      <>
        <button onClick={onClick}>{label}</button>
      </>
    );
  }
}

export default Button;
