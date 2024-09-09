export enum Paths {
  contacts = '/app/contacts',
  documents = '/app/documents',

  dogs = '/app/dogs/all',
  dog_creator = '/app/dogs/create-dog',
  dog = '/app/dogs/dog/:id',
  dog_editor = '/app/dogs/dog/:id/editor',

  litters = '/app/litters',
  litter_creator = '/app/litters/create-litter',
  litter = '/app/litters/litter/:id',
  litter_editor = '/app/litters/litter/:id/editor',

  events = '/app/events/planned',
  history = '/app/events/history',
  event_creator = '/app/events/create-event',
  event = '/app/events/event/:id',
  event_editor = '/app/events/event/:id/editor',

  profile = '/app/profile',
  settings = '/app/settings',
  sign_in = '/app/sign-in',
  sign_up = '/app/sign-up',
  confirmEmail = '/app/confirm-email',
  createProfile = '/app/create-profile',
  document = '/app/document/:id',
  pedigrees = '/app/pedigrees',
  passwordRecovery = '/app/password-recovery',
  passwordRecoveryFinish = '/app/password-recovery/:recoveryToken',
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
