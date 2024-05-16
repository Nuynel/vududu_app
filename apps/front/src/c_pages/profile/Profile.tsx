import * as React from "react";
import {Box, Card, CardBody, CardFooter, Text, Grid} from "grommet";
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";
import {PROFILE_TYPES} from "../../g_shared/types/profile";
import SignOutButton from "../../d_widgets/SignOutButton";
import SectionHeader from "../../e_features/SectionHeader";
import {useState} from "react";
import {useRoute} from "wouter";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";
import Contacts from "../contacts/Contacts";

enum DATA_TYPES {
  PROFILE = 'PROFILE',
  CONTACTS = 'CONTACTS'
}

const ProfileScreen = () => {
  const [matchProfileRoute] = useRoute('/profile')
  const [activeDataType, setActiveDataType] = useState<DATA_TYPES>(matchProfileRoute ? DATA_TYPES.PROFILE : DATA_TYPES.CONTACTS)
  const {isSmall, columns, rows, areas} = useResponsiveGrid();

  const {email, name, type, connectedOrganisations: {
    canineFederation,
    nationalBreedClub,
    canineClub,
    kennel
  }} = useProfileDataStore();

  return (
    <Grid
      rows={rows}
      columns={columns}
      areas={areas}
      height={'100%'}
    >
      {isSmall && (
        <SectionHeader
          activeDataType={activeDataType}
          buttons={[
            {type: DATA_TYPES.PROFILE, label: 'Профиль', link: '/profile'},
            {type: DATA_TYPES.CONTACTS, label: 'Контакты', link: '/contacts'},
          ]}
          isLink={true}
          setActiveDataType={setActiveDataType}
        />
      )}
      <Box gridArea={'content'} pad={{left: 'small', right: 'small'}} background={'lightBackground'}>
        <Box overflow='auto'>
          {matchProfileRoute ? (
            <Card pad='medium' margin='small' background={'white'}>
              <CardBody>
                <Box direction='row'><Text weight='bold' margin={{right: 'xxsmall'}}>E-mail:</Text><Text>{email}</Text></Box>
                { type === PROFILE_TYPES.KENNEL ? (
                  <Box direction='row'><Text weight='bold' margin={{right: 'xxsmall'}}>Название питомника:</Text><Text>{name}</Text></Box>
                ) : (
                  <Box direction='row'><Text weight='bold' margin={{right: 'xxsmall'}}>Имя заводчика:</Text><Text>{name}</Text></Box>
                ) }
                { canineFederation && (<Box direction='row'><Text weight='bold' margin={{right: 'xxsmall'}}>Кинологическая федерация:</Text><Text>{canineFederation}</Text></Box>) }
                { nationalBreedClub && (<Box direction='row'><Text weight='bold' margin={{right: 'xxsmall'}}>Национальный клуб породы:</Text><Text>{nationalBreedClub}</Text></Box>) }
                { canineClub && (<Box direction='row'><Text weight='bold' margin={{right: 'xxsmall'}}>Кинологический клуб:</Text><Text>{canineClub}</Text></Box>) }
                { kennel && (<Box direction='row'><Text weight='bold' margin={{right: 'xxsmall'}}>Питомник:</Text><Text>{kennel}</Text></Box>) }

              </CardBody>
              <CardFooter pad='medium' justify={"center"}>
                <SignOutButton fill={false}/>
              </CardFooter>
            </Card>
          ) : (
            <Contacts/>
          )}
        </Box>
      </Box>
    </Grid>
  );
}

export default ProfileScreen
