import {Button, Nav} from "grommet";
import {Link, useLocation, useRoute} from "wouter";
import {CalendarIcon, DocumentIcon, PawIcon, GraphIcon, PersonIcon, ContactsIcon} from "../g_shared/icons";
import * as React from "react";
import {Paths} from "../g_shared/constants/routes";

const Menu = ({isDesktop}: {isDesktop: boolean}) => {
  const [currentLocation] = useLocation();

  const [matchDogsRoutes] = useRoute('/dogs/*?')
  const [matchLittersRoutes] = useRoute('/litters/*?')
  const [matchEventsRoutes] = useRoute('/events/*?')
  const [matchProfileRoutes] = useRoute('/profile')
  const [matchContactsRoutes] = useRoute('/contacts')


  const getIconColor = (location) => currentLocation === location ? '#e4b33a' : '#4c4c4c';

  if (isDesktop) {
    return (
      <Nav
        gridArea="nav"
        pad={{horizontal: 'small', vertical: 'medium'}}
        justify='start'
        direction="column"
        border={{color: '#F1F5F8', side: 'top', size: 'xsmall', style: 'solid'}}
      >
        <Link to={Paths.profile} asChild>
          <Button
            label='Профиль'
            icon={<PersonIcon color={getIconColor('/profile')}/>}
          />
        </Link>
        <Link to={Paths.contacts} asChild>
          <Button
            label='Контакты'
            icon={<ContactsIcon color={getIconColor('/contacts')}/>}
          />
        </Link>
        <Link to={Paths.dogs} asChild>
          <Button
            label='Cобаки'
            icon={<PawIcon color={matchDogsRoutes ? '#e4b33a' : '#4c4c4c'}/>}
          />
        </Link>
        <Link to={Paths.litters} asChild>
          <Button
            label='Пометы'
            icon={<PawIcon color={matchLittersRoutes ? '#e4b33a' : '#4c4c4c'}/>}
          />
        </Link>
        <Link to={Paths.events} asChild>
          <Button
            label='События'
            icon={<CalendarIcon color={matchEventsRoutes ? '#e4b33a' : '#4c4c4c'}/>}
          />
        </Link>
        <Link to={Paths.documents} asChild>
          <Button
            label='Документы'
            icon={<DocumentIcon color={getIconColor('/documents')}/>}
          />
        </Link>
        <Link to={Paths.pedigrees} asChild>
          <Button
            label='Родословные'
            icon={<GraphIcon color={getIconColor('/pedigrees')}/>}
          />
        </Link>
      </Nav>
    )
  }

  return (
    <Nav gridArea="nav" height='xxsmall' justify='around' direction="row" border={{color: '#F1F5F8', side: 'top', size: 'xsmall', style: 'solid'}}>
      <Link to={Paths.profile} asChild>
        <Button icon={<PersonIcon  color={(matchProfileRoutes || matchContactsRoutes) ? '#e4b33a' : '#4c4c4c'}/>}/>
      </Link>
      <Link to={Paths.dogs} asChild>
        <Button icon={<PawIcon color={(matchDogsRoutes || matchLittersRoutes) ? '#e4b33a' : '#4c4c4c'}/>}/>
      </Link>
      <Link to={Paths.events} asChild>
        <Button icon={<CalendarIcon color={matchEventsRoutes ? '#e4b33a' : '#4c4c4c'}/>}/>
      </Link>
      <Link to={Paths.documents} asChild>
        <Button icon={<DocumentIcon color={getIconColor('/documents')}/>}/>
      </Link>
      <Link to={Paths.pedigrees} asChild>
        <Button icon={<GraphIcon color={getIconColor('/pedigrees')}/>}/>
      </Link>
    </Nav>
  )
}

export default Menu;
