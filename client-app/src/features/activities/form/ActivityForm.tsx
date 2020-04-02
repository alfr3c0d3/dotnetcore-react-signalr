import React, { useState, FormEvent, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activities";
import { v4 as uuid } from "uuid";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
  const { activity: initialFormState, createActivity, editActivity, loadActivity, clearActivity } = useContext(
    ActivityStore
  );

  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    description: "",
    category: "",
    date: "",
    city: "",
    venue: ""
  });

  useEffect(() => {
    if (match.params.id && !activity.id) {
      loadActivity(match.params.id).then(() => initialFormState && setActivity(initialFormState));
    }

    return () => {
      clearActivity();
    };
  }, [loadActivity, clearActivity, match.params.id, initialFormState, activity.id]);

  const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  const handleSubmit = () => {
    const currentActivity = activity.id ? activity : { ...activity, id: uuid() };
    let action = activity.id ? editActivity(currentActivity) : createActivity(currentActivity);

    action.then(() => history.push(`/activities/${currentActivity.id}`));
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <Form>
            <Form.Input placeholder="Title" name="title" value={activity.title} onChange={handleInputChange} />
            <Form.TextArea
              rows={2}
              style={{ resize: "none" }}
              placeholder="Description"
              name="description"
              value={activity.description}
              onChange={handleInputChange}
            />
            <Form.Input placeholder="Category" name="category" value={activity.category} onChange={handleInputChange} />
            <Form.Input
              type="datetime-local"
              placeholder="Date"
              name="date"
              value={activity.date}
              onChange={handleInputChange}
            />
            <Form.Input placeholder="City" name="city" value={activity.city} onChange={handleInputChange} />
            <Form.Input placeholder="Venue" name="venue" value={activity.venue} onChange={handleInputChange} />
            <Button floated="right" positive type="submit" content="Submit" onClick={() => handleSubmit()} />
            <Button floated="right" type="button" content="Cancel" onClick={() => history.push("/activities")} />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
