import React, { useState, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { IActivityFormValues, ActivityFormValues } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SelectInput from "../../../app/common/form/SelectInput";
import DateInput from "../../../app/common/form/DateInput";
import { category } from "../../../app/common/options/categoryOptions";
import { combineDateAndTime } from "../../../app/common/util/utils";
import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan } from "revalidate";
import { RootStoreContext } from "../../../app/stores/rootStore";

const validate = combineValidators({
  title: isRequired("Title"),
  category: isRequired("Category"),
  description: composeValidators(
    isRequired("Description"),
    hasLengthGreaterThan(4)({ message: "Description needs to be at least 5 characters" })
  )(),
  city: isRequired("City"),
  venue: isRequired("Venue"),
  date: isRequired("Date"),
  time: isRequired("Time"),
});

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
  const { loadActivity, createActivity, editActivity, submitting } = useContext(RootStoreContext).activityStore;

  const [activity, setActivity] = useState<IActivityFormValues>(new ActivityFormValues());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id)
        .then((activity) => setActivity(new ActivityFormValues(activity)))
        .finally(() => setLoading(false));
    }
  }, [loadActivity, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;

    activity.date = dateAndTime;

    if (activity.id) {
      editActivity(activity);
    } else {
      createActivity({ ...activity, id: uuid() });
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            validate={validate}
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field component={TextInput} placeholder="Title" name="title" value={activity.title} />
                <Field
                  component={TextAreaInput}
                  placeholder="Description"
                  name="description"
                  value={activity.description}
                  rows={3}
                />
                <Field
                  component={SelectInput}
                  placeholder="Category"
                  name="category"
                  value={activity.category}
                  options={category}
                />
                <Form.Group>
                  <Field
                    component={DateInput}
                    type="datetime-local"
                    placeholder="Date"
                    name="date"
                    date={true}
                    value={activity.date}
                  />
                  <Field
                    component={DateInput}
                    type="datetime-local"
                    placeholder="Time"
                    name="time"
                    time={true}
                    value={activity.time}
                  />
                </Form.Group>
                <Field component={TextInput} placeholder="City" name="city" value={activity.city} />
                <Field component={TextInput} placeholder="Venue" name="venue" value={activity.venue} />
                <Button
                  loading={submitting}
                  disabled={loading || invalid}
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                />
                <Button
                  disabled={loading}
                  floated="right"
                  type="button"
                  content="Cancel"
                  onClick={
                    activity.id ? () => history.push(`/activities/${activity.id}`) : () => history.push("/activities")
                  }
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
