export enum Paths {
  contacts = '/app/contacts',
  documents = '/app/documents',

  population = '/app/population',
  dogs = '/app/population/dogs',
  dogs_short = '/dogs',
  litters = '/app/population/litters',
  litters_short = '/litters',

  dog_creator = '/app/dogs/create-dog',
  dog = '/app/dogs/dog/:id',
  dog_editor = '/app/dogs/dog/:id/editor',

  litter_creator = '/app/litters/create-litter',
  litter = '/app/litters/litter/:id',
  litter_editor = '/app/litters/litter/:id/editor',

  calendar = '/app/events/all',

  events = '/app/events/all/planned',
  events_short = '/planned',
  history = '/app/events/all/history',
  history_short = '/history',

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
  passwordRecoveryExpired = '/app/password-recovery/expired',
  passwordRecoveryFinish = '/app/password-recovery/:recoveryToken',

  subscription = '/app/profile/subscription',
  privacy = '/app/profile/privacy',
  data_export = '/app/profile/data_export',
  breed_creator = '/app/profile/create-breed',
}

export const PublicRoutes = [
  Paths.sign_in,
  Paths.sign_up,
  Paths.confirmEmail,
  Paths.passwordRecovery,
  Paths.passwordRecoveryFinish,
  Paths.passwordRecoveryExpired,
] as const;

export const PrivateRoutes = [
  Paths.contacts,
  Paths.documents,
  Paths.profile,

  Paths.population,

  // Paths.dogs,
  Paths.dog,
  Paths.dog_editor,
  Paths.dog_creator,

  // Paths.litters,
  Paths.litter,
  Paths.litter_editor,
  Paths.litter_creator,

  Paths.calendar,
  // Paths.events,
  // Paths.history,
  Paths.event_creator,
  Paths.event,
  Paths.event_editor,

  Paths.pedigrees,
  Paths.createProfile,
  Paths.breed_creator,
  // Paths.event,
  // Paths.document,
 // Paths.settings,
];
