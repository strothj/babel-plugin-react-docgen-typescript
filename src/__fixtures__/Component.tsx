import * as React from "react";

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
   */
  optionalColor?: string;
}

/**
 * This is an awesome looking button for React.
 */
class Button extends React.Component<ButtonProps> {
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
