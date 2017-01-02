import { ActionReducer, Action } from '@ngrx/store';

export interface Notices {
    favouritesOverlayDismissed: boolean;
    dateDismissed: Date;
}

const initialNotices: Notices = {
    favouritesOverlayDismissed: false,
    dateDismissed: null
}
export const INITIAL_NOTICES = 'INITIAL_NOTICES';
export const DISMISS_FAVOURITES = 'DISMISS_FAVOURITES';

export function noticesReducer(state: Notices = initialNotices, action: Action) {
    // console.log('noticesReducer', action);
    switch (action.type) {
        case INITIAL_NOTICES:
            if (action.payload.favouritesOverlayDismissed) {
                const prevDismissed = new Date(action.payload.dateDismissed);
                let now = new Date();
                // Dismissed if previously dismissed and less than 1 day ago
                // console.log(now, prevDismissed, now.valueOf() - prevDismissed.valueOf() < 20 * 1000)
                const dismissed = 
                    action.payload.favouritesOverlayDismissed && 
                    (now.valueOf() - prevDismissed.valueOf() < 24 * 60 * 60 * 1000 )
                    // (now.valueOf() - prevDismissed.valueOf() < 20 * 1000 )
                    return {
                        favouritesOverlayDismissed: dismissed,
                        dateDismissed: now
                    }                
            } else { 
                return state;
                // {
                //     favouritesOverlayDismissed: false,
                //     dateDismissed: null
                // }
            }

        case DISMISS_FAVOURITES:
            let now2 = new Date();
            return {
                favouritesOverlayDismissed: true,
                dateDismissed: now2
            }
            // return Object.assign({}, state, { favouritesOverlayDismissed: !state.favouritesOverlayDismissed })

        default:
            return state;
    }
};
