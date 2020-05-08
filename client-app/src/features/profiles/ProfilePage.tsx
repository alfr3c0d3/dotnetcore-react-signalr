import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { RootStoreContext } from "../../app/stores/rootStore";
import { RouteComponentProps } from "react-router-dom";
import { LoadingComponent } from "../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";

interface RouteParams {
  userName: string;
}

interface IProps extends RouteComponentProps<RouteParams> {}

const ProfilePage: React.FC<IProps> = ({ match }) => {
  const { loadProfile, profile, loadingProfile, follow, unfollow, loading, isCurrentUser, setActiveTab } = useContext(
    RootStoreContext
  ).profileStore;

  useEffect(() => {
    loadProfile(match.params.userName);
  }, [loadProfile, match.params.userName]);

  if (loadingProfile) return <LoadingComponent content="Loading profile..." />;

  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader
          profile={profile!}
          follow={follow}
          unfollow={unfollow}
          loading={loading}
          isCurrentUser={isCurrentUser}
        />
        <ProfileContent setActiveTab={setActiveTab} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ProfilePage);
