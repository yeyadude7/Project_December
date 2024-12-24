import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";

function FadeInText() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <CSSTransition
      in={isVisible}
      timeout={500} // Adjust duration as needed
      classNames="fade-in"
      unmountOnExit
    >
      <h1>HOME PAGE</h1>
    </CSSTransition>
  );
}

export default FadeInText;
