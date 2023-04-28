import React, { useEffect, useState } from "react";
import { Button, Label, Input } from "reactstrap";
import { Copy, CheckCircle } from "react-feather";
import { useFormik } from "formik";
import * as Yup from "yup";

import ErrorMessage from "./ErrorMessage";
import { generateRandomString } from "../utils";

const validationSchema = Yup.object().shape({
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .required("Password confirmation is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const InitialSection = ({ onAccountCreate }) => {
  const [state, setState] = useState({ step: 1, secret: "", copied: false });

  useEffect(() => {
    setState({ ...state, secret: generateRandomString(20) });
  }, []);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      validationSchema,
      initialValues: { password: "", confirmPassword: "" },
      onSubmit: (values) => onAccountCreate(values, state.secret),
    });

  const WelcomeForm = () => {
    return (
      <div>
        <h3 className="my-4">Welcome!</h3>
        <div>
          <Label> Your secret key is </Label>
          <br />
          <strong className="my-2" id="secret">
            {state.secret}
          </strong>
          {!state.copied ? (
            <Copy
              style={{ cursor: "pointer" }}
              className="ms-4"
              size={20}
              color="purple"
              onClick={async () => {
                await navigator.clipboard.writeText(state.secret);
                setState({ ...state, copied: true });
              }}
            />
          ) : (
            <CheckCircle className="ms-4" size={20} color="purple" />
          )}
        </div>
        <Button
          onClick={() => setState({ ...state, step: 2 })}
          className="mt-2"
          color="primary"
        >
          Next
        </Button>
      </div>
    );
  };

  return state.step === 1 ? (
    <WelcomeForm />
  ) : (
    <div className="p-2">
      <Label>Password</Label>
      <Input
        name="password"
        value={values.password}
        onChange={handleChange}
        className="mt-2"
        type="password"
        onBlur={handleBlur}
      />
      <ErrorMessage errors={errors} name="password" touched={touched} />
      <Label>Confirm Password</Label>
      <Input
        className="mt-2"
        name="confirmPassword"
        type="password"
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <ErrorMessage errors={errors} name="confirmPassword" touched={touched} />

      <Button color="primary" className="primary mt-3" onClick={handleSubmit}>
        Initialize
      </Button>
    </div>
  );
};

export default InitialSection;
