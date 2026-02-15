import { JSX } from "react";

type ActionButtonProps = {
  content: () => JSX.Element | JSX.Element;
};

const ActionButton = ({content}:ActionButtonProps) => {
  return typeof content === "function" ? content() : content;
}

export default ActionButton