import * as React from "react";
import PageComponent from "../../d_widgets/PageComponent";
import {getRuTranslate} from "../../g_shared/constants/translates";

const ContactsScreen = () => {

  const headerProps = {
    title: 'contacts',
    back: false
  }

  return (
    <PageComponent headerProps={headerProps}>
      <div className="p-2 bg-lightBackground">
        <div className="overflow-auto">
          <div className="flex-1 text-center text-lg font-semibold m-4">
            {getRuTranslate('soon')}
          </div>
        </div>
      </div>
    </PageComponent>
  );
}

export default ContactsScreen
