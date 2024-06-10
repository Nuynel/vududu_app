export const dogShortDataFields= [
  'name',
  'fullName',
  'dateOfBirth',
  'breedId',
  'gender',
  'microchipNumber',
  'tattooNumber',
  'pedigreeNumber',
  'color',
] as const;

export const PEDIGREE_GRIDS = {
  COMMON_PEDIGREE: {
    rows: [
      '1fr', '1fr', '1fr', '1fr',
      '1fr', '1fr', '1fr', '1fr',
      '1fr', '1fr', '1fr', '1fr',
      '1fr', '1fr', '1fr', '1fr',
    ],
    columns: [
      'auto', 'auto', 'auto', 'auto',
    ],
    areas: [
      { name: 'f', start: [0, 0], end: [0, 7] },
      { name: 'm', start: [0, 8], end: [0, 15] },

      { name: 'ff', start: [1, 0], end: [1, 3] },
      { name: 'fm', start: [1, 4], end: [1, 7] },
      { name: 'mf', start: [1, 8], end: [1, 11] },
      { name: 'mm', start: [1, 12], end: [1, 15] },

      { name: 'fff', start: [2, 0], end: [2, 1] },
      { name: 'ffm', start: [2, 2], end: [2, 3] },
      { name: 'fmf', start: [2, 4], end: [2, 5] },
      { name: 'fmm', start: [2, 6], end: [2, 7] },

      { name: 'mff', start: [2, 8], end: [2, 9] },
      { name: 'mfm', start: [2, 10], end: [2, 11] },
      { name: 'mmf', start: [2, 12], end: [2, 13] },
      { name: 'mmm', start: [2, 14], end: [2, 15] },

      { name: 'ffff', start: [3, 0], end: [3, 0] },
      { name: 'fffm', start: [3, 1], end: [3, 1] },
      { name: 'ffmf', start: [3, 2], end: [3, 2] },
      { name: 'ffmm', start: [3, 3], end: [3, 3] },

      { name: 'fmff', start: [3, 4], end: [3, 4] },
      { name: 'fmfm', start: [3, 5], end: [3, 5] },
      { name: 'fmmf', start: [3, 6], end: [3, 6] },
      { name: 'fmmm', start: [3, 7], end: [3, 7] },

      { name: 'mfff', start: [3, 8], end: [3, 8] },
      { name: 'mffm', start: [3, 9], end: [3, 9] },
      { name: 'mfmf', start: [3, 10], end: [3, 10] },
      { name: 'mfmm', start: [3, 11], end: [3, 11] },

      { name: 'mmff', start: [3, 12], end: [3, 12] },
      { name: 'mmfm', start: [3, 13], end: [3, 13] },
      { name: 'mmmf', start: [3, 14], end: [3, 14] },
      { name: 'mmmm', start: [3, 15], end: [3, 15] },
    ]
  }
}
