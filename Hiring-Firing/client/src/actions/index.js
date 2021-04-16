import axios from 'axios';
import { FETCH_USER } from './types';


// Beacuse we are using redux-thunk we are returning a dispatch function
export const fetchUser = () => async (dispatch) => {
    const res = await axios.get(`${process.env.PUBLIC_URL}/api/current_user`);

    dispatch({ type: FETCH_USER, payload: res.data });
};
