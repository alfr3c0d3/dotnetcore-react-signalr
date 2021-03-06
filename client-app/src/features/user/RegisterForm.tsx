import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button, Header } from "semantic-ui-react";
import TextInput from "../../app/common/form/TextInput";
import { RootStoreContext } from "../../app/stores/rootStore";
import { IUserFormValues } from "../../app/models/user";
import { FORM_ERROR } from "final-form";
import { combineValidators, isRequired } from "revalidate";
import ErrorMessage from "../../app/common/form/ErrorMessage";

const validate = combineValidators({
  userName: isRequired("UserName"),
  displayName: isRequired("Display Name"),
  email: isRequired("Email"),
  password: isRequired("Password"),
});

const RegisterForm = () => {
  const { register } = useContext(RootStoreContext).userStore;

  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        register(values).catch((error) => ({
          [FORM_ERROR]: error,
        }))
      }
      validate={validate}
      render={({ handleSubmit, submitError, invalid, dirtySinceLastSubmit, pristine }) => (
        <Form onSubmit={handleSubmit}>
          <Header as="h2" content="Sign up to Reactivities" color="teal" textAlign="center" />
          <Field component={TextInput} name="userName" placeholder="UserName" />
          <Field component={TextInput} name="displayName" placeholder="Display Name" />
          <Field component={TextInput} name="email" placeholder="Email" />
          <Field component={TextInput} name="password" placeholder="Password" type="password" />
          {submitError && !dirtySinceLastSubmit && <ErrorMessage error={submitError} />}
          <Button disabled={(invalid && !dirtySinceLastSubmit) || pristine} color="teal" content="Register" fluid />
        </Form>
      )}
    />
  );
};

export default observer(RegisterForm);
