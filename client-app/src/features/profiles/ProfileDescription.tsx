import React, { useContext, useState } from "react";
import { Tab, Header, Button, Grid } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import { observer } from "mobx-react-lite";
import ProfileEditForm from "./ProfileEditForm";
import { IProfile } from "../../app/models/profile";

const ProfileDescription = () => {
  const { profile, isCurrentUser, updateProfile, loading } = useContext(RootStoreContext).profileStore;
  const [editMode, setEditMode] = useState(false);

  const handleUpdateProfile = (profile: IProfile) => {
    updateProfile(profile).then(() => setEditMode(false));
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="user" content={`About ${profile!.displayName}`} />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={editMode ? "Cancel" : "Edit Profile"}
              onClick={() => setEditMode(!editMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {editMode ? (
            <ProfileEditForm updateProfile={handleUpdateProfile} profile={profile!} loading={loading} />
          ) : (
            <span>{profile!.bio}</span>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileDescription);
