import * as React from "react";
import { Route, Switch, Link } from 'wouter';
import { PrivateRoutes, PublicRoutes, Paths } from "../../g_shared/constants/routes";
import PrivatePageTemplate from "./PrivatePageTemplate";
import PrivateRoute from "../../e_features/PrivateRoute";
import { componentsMapping } from "./componentsMapping";

const Router = () => {
  const CreateProfileComponent = componentsMapping[Paths.createProfile].component

  return (
    <Switch>
      {
        PrivateRoutes.map(path => {
          const DynamicComponent = componentsMapping[path].component;
          if (path === Paths.createProfile) return (
            <Route path={Paths.createProfile} key={Paths.createProfile}>
              <PrivateRoute>
                <CreateProfileComponent />
              </PrivateRoute>
            </Route>
          )
          return (
            <Route path={path} key={path}>
              <PrivatePageTemplate>
                <DynamicComponent />
              </PrivatePageTemplate>
            </Route>
          )
        })
      }
      {
        PublicRoutes.map(path => (
          <Route path={path} key={path} component={componentsMapping[path].component}/>
        ))
      }
      <Route>
        <div> 404 Not found </div>
        <Link to={Paths.events}>Back to events</Link>
      </Route>
    </Switch>
  )
}

export default Router;
