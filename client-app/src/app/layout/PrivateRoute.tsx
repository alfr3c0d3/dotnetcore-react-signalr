import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { RouteProps, RouteComponentProps, Route, Redirect } from "react-router-dom";
import { RootStoreContext } from "../stores/rootStore";
interface IProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps<any>>;
}
const PrivateRoute: React.FC<IProps> = ({ component: Component, ...rest }) => {
  const { isLoggedIn } = useContext(RootStoreContext).userStore;
  return <Route {...rest} render={(props) => (isLoggedIn ? <Component {...props} /> : <Redirect to={"/"} />)} />;
};
export default observer(PrivateRoute);
