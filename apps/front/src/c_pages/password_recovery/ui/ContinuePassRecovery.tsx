import {Box, Button, Card, CardBody, Text} from "grommet";
import {Link} from "wouter";
import * as React from "react";
import useResponsiveGrid from "../../../f_entities/hooks/useResponsiveGrid";

const ContinuePassRecovery = () => {
  const {isSmall} = useResponsiveGrid()

  return (
    <Box
      background={'dark-6'}
      justify={"center"}
      align={"center"}
      fill={true}
    >
      <Card
        background={'white'}
        margin={'large'}
        pad={"medium"}
        width={isSmall ? '90%' : "large"}
      >
        <CardBody>
          <Box>
            <Text>
              На вашу почту выслана ссылка для восстановления пароля. Пожалуйста, перейдите по ней для восстановления аккаунта.
            </Text>
          </Box>
          <Box>
            <Text>
              Возможно, потребуется проверить папку "Спам"
            </Text>
          </Box>
        </CardBody>
        <Link to="/sign-in" style={{display: 'flex', justifyContent: 'center'}}>
          <Button secondary margin='xsmall'>
            На главную
          </Button>
        </Link>
      </Card>
    </Box>
  )
}

export default ContinuePassRecovery