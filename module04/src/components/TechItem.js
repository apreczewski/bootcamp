import React from "react";
import PropTypes from "prop-types";

function TechItem({ tech, onRemove }) {
  return (
    <li>
      {tech}
      <button onClick={onRemove} type="button">
        X
      </button>
    </li>
  );
}

TechItem.proptypes = {
  tech: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
};

export default TechItem;
