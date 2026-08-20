// store/blockRules.js

export const TEXT_BLOCK_TYPES = [
  "paragraph",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "bullet",
];

export const isTextBlock = (type) => TEXT_BLOCK_TYPES.includes(type);

export const BLOCK_RULES = {
  h1: {
    placement: "start_of_page",
    uniquePerPage: true,
    forceNewPageIfConflict: true,
  },
  h2: {
    placement: "after_selection",
    uniquePerPage: false,
    forceNewPageIfConflict: false,
  },
  h3: {
    placement: "after_selection",
    uniquePerPage: false,
    forceNewPageIfConflict: false,
  },
  h4: {
    placement: "after_selection",
    uniquePerPage: false,
    forceNewPageIfConflict: false,
  },
  h5: {
    placement: "after_selection",
    uniquePerPage: false,
    forceNewPageIfConflict: false,
  },
  paragraph: {
    placement: "after_selection",
    uniquePerPage: false,
    forceNewPageIfConflict: false,
  },
  bullet: {
    placement: "after_selection",
    uniquePerPage: false,
    forceNewPageIfConflict: false,
  },
  image: {
    placement: "after_selection",
    uniquePerPage: false,
    forceNewPageIfConflict: false,
  },
};
