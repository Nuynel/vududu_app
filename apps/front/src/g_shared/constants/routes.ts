export enum Paths {
  contacts = '/contacts',
  documents = '/documents',

  dogs = '/dogs/all',
  dog_creator = '/dogs/create-dog',
  dog = '/dogs/dog/:id',
  dog_editor = '/dogs/dog/:id/editor',

  litters = '/litters',
  litter_creator = '/litters/create-litter',
  litter = '/litters/litter/:id',
  litter_editor = '/litters/litter/:id/editor',

  events = '/events/planned',
  history = '/events/history',
  event_creator = '/events/create-event',
  event = '/events/event/:id',
  event_editor = '/events/event/:id/editor',

  profile = '/profile',
  settings = '/settings',
  sign_in = '/sign-in',
  sign_up = '/sign-up',
  confirmEmail = '/confirm-email',
  createProfile = '/create-profile',
  document = '/document/:id',
  pedigrees = '/pedigrees',
  passwordRecovery = '/password-recovery',
  passwordRecoveryFinish = '/password-recovery/:recoveryToken',
}

export const PublicRoutes = [
  Paths.sign_in,
  Paths.sign_up,
  Paths.confirmEmail,
  Paths.passwordRecovery,
  Paths.passwordRecoveryFinish,
] as const;

export const PrivateRoutes = [
  Paths.contacts,
  Paths.documents,
  Paths.profile,

  Paths.dogs,
  Paths.dog,
  Paths.dog_editor,
  Paths.dog_creator,

  Paths.litters,
  Paths.litter,
  Paths.litter_editor,
  Paths.litter_creator,

  Paths.events,
  Paths.history,
  Paths.event_creator,
  Paths.event,
  Paths.event_editor,

  Paths.pedigrees,
  Paths.createProfile,
  // Paths.event,
  // Paths.document,
 // Paths.settings,
];
