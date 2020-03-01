import {
    USER_INFO,
    LOGOUT
} from './types';
import axios from 'axios'

export function logout() {
    return dispatch => {
        axios.post('/api/user/logout')
            .then(res => {
                if (res.status === 200) {
                    dispatch({
                        type: LOGOUT
                    })
                } else {
                    console.log('logout failed', res)
                }
            }).catch(err => {
                console.log('logout failed', err)
            })
    }
}