import {
    USER_INFO,
    LOGOUT
} from './types';

export const userReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_INFO: {
            return Object.assign({}, state.user, action.data)
        }
        case LOGOUT: {
            return {}
        }
        default:
            return state
    }
}