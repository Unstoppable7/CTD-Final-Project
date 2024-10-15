import { useRef, useEffect } from "react";
import PropTypes from 'prop-types';

export default function InputWithLabel({
  todoTitle,
  handleTitleChange,
  children,
}) {
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  });

  return (
    <>
      <label htmlFor="todoTitle">{children}</label>
      <input
        name="title"
        id="todoTitle"
        value={todoTitle}
        onChange={handleTitleChange}
        ref={inputRef}
        placeholder="Write something..."
      />
    </>
  );
}

InputWithLabel.propTypes = {
  todoTitle: PropTypes.string,
  handleTitleChange: PropTypes.func,
  children: PropTypes.elementType
}
