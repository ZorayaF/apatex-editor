// store/blockRules.js
export const BLOCK_RULES = {
  h1: {
    placement: 'start_of_page',
    uniquePerPage: true,
    forceNewPageIfConflict: true
  },
  paragraph: {
    placement: 'after_selection',
    uniquePerPage: false,
    forceNewPageIfConflict: false
  },
  // Fácil de extender:
  image: {
    placement: 'after_selection',
    uniquePerPage: false,
    forceNewPageIfConflict: false
  }
};
