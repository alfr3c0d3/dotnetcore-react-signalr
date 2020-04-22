import React from "react";
import { observer } from "mobx-react-lite";
import { Item, Button, Segment, Icon, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { IActivity } from "../../../app/models/activity";
import ActivityListItemAttendees from "./ActivityListItemAttendees";

const ActivityListItem: React.FC<{ activity: IActivity }> = ({ activity }) => {
  const host = activity.attendees.find((x) => x.isHost)!;

  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size="tiny" circular src={host.image || "/assets/user.png"} />
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>Hosted by {host.displayName}</Item.Description>
              {activity.isHost && (
                <Item.Description>
                  <Label basic color="orange" content="You are hosting this activity" />
                </Item.Description>
              )}
              {activity.isGoing && !activity.isHost && (
                <Item.Description>
                  <Label basic color="green" content="You are going to this activity" />
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name="clock" /> {format(activity.date, "h:mm a")}
        <Icon name="marker" /> {activity.venue}, {activity.city}
      </Segment>
      <Segment secondary>
        <ActivityListItemAttendees attendees={activity.attendees} />
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button as={Link} to={`/activities/${activity.id}`} floated="right" content="View" color="blue" />
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityListItem);
