import React from "react";
import { combineValidators, isRequired } from "revalidate";
import { IProfile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../app/common/form/TextInput";
import TextAreaInput from "../../app/common/form/TextAreaInput";
import { Button, Form } from "semantic-ui-react";

const validate = combineValidators({
  displayName: isRequired("displayName"),
});

interface IProps {
  updateProfile: (profile: IProfile) => void;
  profile: IProfile;
  loading: boolean;
}

const ProfileEditForm: React.FC<IProps> = ({ updateProfile, profile, loading }) => {
  return (
    <FinalForm
      onSubmit={updateProfile}
      validate={validate}
      initialValues={profile!}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form onSubmit={handleSubmit} error>
          <Field name="displayName" component={TextInput} placeholder="Display Name" value={profile!.displayName} />
          <Field name="bio" component={TextAreaInput} placeholder="Bio" value={profile!.bio} rows={3} />
          <Button loading={loading} floated="right" disabled={invalid || pristine} positive content="Update profile" />
        </Form>
      )}
    />
  );
};

export default observer(ProfileEditForm);
