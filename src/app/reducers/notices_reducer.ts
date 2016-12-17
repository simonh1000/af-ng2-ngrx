import { ActionReducer, Action } from '@ngrx/store';

export interface Notices {
  favouritesOverlayDismissed: boolean;
}

const initialNotices: Notices = {
  favouritesOverlayDismissed: false
}
export const INITIAL_NOTICES = 'INITIAL_NOTICES';
export const DISMISS_FAVOURITES = 'DISMISS_FAVOURITES';

export function noticesReducer(state: Notices = initialNotices, action: Action) {
  // console.log('noticesReducer', action);
  switch (action.type) {
    case INITIAL_NOTICES:
      return Object.assign({}, state, action.payload)

    case DISMISS_FAVOURITES:
      return Object.assign({}, state, {favouritesOverlayDismissed: !state.favouritesOverlayDismissed})

    default:
      return state;
  }
};
