import {Paths} from "../../g_shared/constants/routes";
import Calendar from "../../c_pages/events/Events";
import Contacts from "../../c_pages/contacts/Contacts";
import Documents from "../../c_pages/documents/Documents";
import Profile from "../../c_pages/profile/Profile";
import Pets from "../../c_pages/dogs/Dogs";
import SignIn from "../../c_pages/signin/SignIn";
import SignUp from "../../c_pages/signup/SignUp";
import ConfirmEmail from "../../c_pages/confirm_email/ConfirmEmail";
import CreateProfile from "../../c_pages/profile/CreateProfile";
import DogInformation from "../../c_pages/dogs/dogInformation/DogInformation";
import DogInformationEditor from "../../c_pages/dogs/dogInformation/DogInformationEditor";
import DogInformationCreator from "../../c_pages/dogs/dogInformation/AddNewDogForm";
import LitterInformation from "../../c_pages/dogs/litterInformation/LitterInformation";
import LitterInformationEditor from "../../c_pages/dogs/litterInformation/LitterInformationEditor";
import EventInformation from "../../c_pages/events/eventInformation/EventInformation";
import EventInfoEditor from "../../c_pages/events/eventInformation/EventInfoEditor";
import Pedigree from "../../c_pages/pedigree/Pedigree";
import PasswordRecovery from "../../c_pages/password_recovery/PasswordRecovery";
import LitterInformationCreator from "../../c_pages/dogs/litterInformation/AddNewLitterForm";

export const componentsMapping = {
  [Paths.events]: {
    component: Calendar,
    private: true,
    path: Paths.events,
  },
  [Paths.history]: {
    component: Calendar,
    private: true,
    path: Paths.history,
  },
  [Paths.contacts]: {
    component: Profile,
    private: true,
    path: Paths.contacts,
  },
  [Paths.documents]: {
    component: Documents,
    private: true,
    path: Paths.documents,
  },
  [Paths.profile]: {
    component: Profile,
    private: true,
    path: Paths.profile,
  },
  [Paths.dogs]: {
    component: Pets,
    private: true,
    path: Paths.dogs,
  },
  [Paths.litters]: {
    component: Pets,
    private: true,
    path: Paths.litters,
  },
  [Paths.sign_in]: {
    component: SignIn,
    private: true,
    path: Paths.sign_in,
  },
  [Paths.sign_up]: {
    component: SignUp,
    private: true,
    path: Paths.sign_up,
  },
  [Paths.confirmEmail]: {
    component: ConfirmEmail,
    private: true,
    path: Paths.confirmEmail,
  },
  [Paths.createProfile]: {
    component: CreateProfile,
    private: true,
    path: Paths.createProfile,
  },
  [Paths.dog]: {
    component: DogInformation,
    private: true,
    path: Paths.dog,
  },
  [Paths.dog_editor]: {
    component: DogInformationEditor,
    private: true,
    path: Paths.dog_editor,
  },
  [Paths.dog_creator]: {
    component: DogInformationCreator,
    private: true,
    path: Paths.dog_creator,
  },
  [Paths.litter]: {
    component: LitterInformation,
    private: true,
    path: Paths.litter,
  },
  [Paths.litter_editor]: {
    component: LitterInformationEditor,
    private: true,
    path: Paths.litter_editor,
  },
  [Paths.litter_creator]: {
    component: LitterInformationCreator,
    private: true,
    path: Paths.litter_creator,
  },
  [Paths.event]: {
    component: EventInformation,
    private: true,
    path: Paths.litter_editor,
  },
  [Paths.event_editor]: {
    component: EventInfoEditor,
    private: true,
    path: Paths.event_editor,
  },
  [Paths.pedigrees]: {
    component: Pedigree,
    private: true,
    path: Paths.pedigrees,
  },
  [Paths.passwordRecovery]: {
    component: PasswordRecovery,
    private: false,
    path: Paths.passwordRecovery,
  },
  [Paths.passwordRecoveryFinish]: {
    component: PasswordRecovery,
    private: false,
    path: Paths.passwordRecoveryFinish,
  },
}
