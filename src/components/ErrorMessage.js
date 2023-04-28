import React from "react";

const ErrorMessage = (props) => {
  const { touched, name, errors } = props;
  if (!touched[name]) return null;
  return (
    <div className="text-danger fst-italic fw-bold font-size-small">
      {errors[name]}
    </div>
  );
};

export default ErrorMessage;
