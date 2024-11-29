import * as React from "react";
import PageComponent from "../../d_widgets/PageComponent";
import {getRuTranslate} from "../../g_shared/constants/translates";

const ContactsScreen = () => {
  return (
    <PageComponent>
      <div className="p-2 bg-gray-200">
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
