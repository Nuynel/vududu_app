export enum Paths {
  events = '/events/planned',
  history = '/events/history',
  contacts = '/contacts',
  documents = '/documents',
  dogs = '/dogs',
  litters = '/litters',
  profile = '/profile',
  settings = '/settings',
  sign_in = '/sign-in',
  sign_up = '/sign-up',
  confirmEmail = '/confirm-email',
  createProfile = '/create-profile',
  dog = '/dogs/:id',
  litter = '/dogs/litter/:id',
  event = '/events/:id',
  document = '/document/:id',
  dog_editor = '/dogs/:id/editor',
  litter_editor = '/dogs/litter/:id/editor',
  event_editor = '/events/:id/editor',
  pedigrees = '/pedigrees'
}

export const PublicRoutes = [
  Paths.sign_in,
  Paths.sign_up,
  Paths.confirmEmail,
] as const;

export const PrivateRoutes = [
  Paths.events,
  Paths.history,
  Paths.contacts,
  Paths.documents,
  Paths.dogs,
  Paths.profile,
  Paths.dog,
  Paths.dog_editor,
  Paths.litters,
  Paths.litter,
  Paths.litter_editor,
  Paths.event,
  Paths.event_editor,
  Paths.pedigrees,
  Paths.createProfile,
  // Paths.event,
  // Paths.document,
 // Paths.settings,
];
