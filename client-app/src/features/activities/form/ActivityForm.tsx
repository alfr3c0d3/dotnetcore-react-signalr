import React, { useState, FormEvent } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activities";
import { v4 as uuid } from "uuid";

interface IProps {
  activity: IActivity;
  setEditMode: (editMode: boolean) => void;

  createActivity: (activity: IActivity) => void;
  editActivity: (activity: IActivity) => void;
}

export const ActivityForm: React.FC<IProps> = ({
  setEditMode,
  activity: initialFormState,
  createActivity,
  editActivity
}) => {
  const initializeForm = () => initialFormState || {};
  const [activity, setActivity] = useState<IActivity>(initializeForm);

  const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  const handleSubmit = () => {
    activity.id ? editActivity(activity) : createActivity({ ...activity, id: uuid() });
  };

  return (
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
        <Button floated="right" type="button" content="Cancel" onClick={() => setEditMode(false)} />
      </Form>
    </Segment>
  );
};
