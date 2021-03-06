import React, { useContext, Fragment } from "react";
import { observer } from "mobx-react-lite";
import { Item, Label } from "semantic-ui-react";
import ActivityListItem from "./ActivityListItem";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { format } from "date-fns";

const ActivityList: React.FC = () => {
  const { activitiesByDate } = useContext(RootStoreContext).activityStore;

  return (
    <Fragment>
      {activitiesByDate.map(([group, activities]) => (
        <Fragment key={group}>
          <Label size="large" color="blue">
            {format(new Date(group), "eeee do MMMM")}
          </Label>
          <Item.Group divided>
            {activities.map((activity) => (
              <ActivityListItem key={activity.id} activity={activity} />
            ))}
          </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ActivityList);
