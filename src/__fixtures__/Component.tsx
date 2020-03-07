import * as React from "react";

type Size = "small" | "default" | "large";
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
}

/**
 * This is an awesome looking button for React.
 */
class Button extends React.Component<ButtonProps> {
  static defaultProps = {
    label: "label",
    size: "default",
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
