import * as React from 'react'
import {Route} from "wouter";
import Dogs from "../dogs/Dogs";
import Litters from "../litters/Litters";
import {Paths} from "../../g_shared/constants/routes";

const PopulationScreen = () => {
  return (
    <div className='h-full'>
      <Route path={Paths.dogs_short}>
        <Dogs/>
      </Route>
      <Route path={Paths.litters_short}>
        <Litters/>
      </Route>
    </div>
  )
}

export default PopulationScreen
