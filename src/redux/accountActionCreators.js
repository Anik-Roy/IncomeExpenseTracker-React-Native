import * as actionTypes from './actionTypes';
import moment from 'moment';
import axios from 'axios';
import { _getUser } from './authActionCreators';

export const addAccount = data => dispatch => {
  _getUser()
    .then(userData => {
      const uid = userData.localId;

      axios.post(`https://expense-tracker-9b728-default-rtdb.firebaseio.com/accounts.json?auth=${userData.idToken}`, {
        ...data,
        userId: uid,
        addedtime: new Date()
      }).then(response => {
        if(response.status === 200) {
          console.log("account id > ",response.data.name);
          dispatch({
              type: actionTypes.ADD_ACCOUNT,
              payload: {
                ...data,
                addedtime: new Date(),
                id: response.data.name
              }
          });
        } else {
          alert(response.error)
        }
      }).catch(err => {
        console.log(err);
      });
    })
    .catch(err => {
      console.log(err);
    })
}

export const deleteAccount = item => (dispatch, getState) => {
  const idToken = getState().authReducer.idToken;
  const localId = getState().authReducer.localId;
  
  console.log("deleteAccount > ", item.id);
  axios.delete(`https://expense-tracker-9b728-default-rtdb.firebaseio.com/accounts/${item.id}.json?auth=${idToken}`)
    .then(response => response.status)
    .then(status => {
      if(status === 200) {
        console.log("ok");
        dispatch({
          type: actionTypes.DELETE_ACCOUNT,
          payload: item
        })
      }
    })  
    .catch(err => {
      console.log(err);
      alert(err);
    });
}

export const updateAccount = item => (dispatch, getState) => {
    const idToken = getState().authReducer.idToken;
    const localId = getState().authReducer.localId;

    console.log("updateAccount > ", item);

    const itemId = item.id;
        
    delete item.id;

    if(idToken !== null && localId !== null) {
        axios.patch(`https://expense-tracker-9b728-default-rtdb.firebaseio.com/accounts/${itemId}.json?auth=${idToken}`, {
        ...item    
        })
        .then(response => {
            if(response.status === 200) {
            dispatch({
                type: actionTypes.UPDATE_ACCOUNT,
                payload: {...item, id: itemId}
            })
            } else {
            alert(response.error);
            }
        })
        .catch(err => alert(err));
    }
}

export const fetchAccounts = () => (dispatch, getState) => {
  const idToken = getState().authReducer.idToken;
  const localId = getState().authReducer.localId;

  if(idToken !== null && localId !== null) {
    axios.get(`https://expense-tracker-9b728-default-rtdb.firebaseio.com/accounts.json?auth=${idToken}&orderBy="userId"&equalTo="${localId}"`)
      .then(response => {
          // console.log("fetchTransaction >",response.data);
          let data = response.data;
          let accounts = [];
          for(let key in data) {
            accounts.push({...data[key], id: key});
          }
          console.log("accounts > ", accounts);
          dispatch({
            type: actionTypes.FETCH_ACCOUNTS,
            payload: accounts
          })
      })
      .catch(err => {
        console.log(err)
        alert("Fetch accounts: ", err);
      });
  }
}

export const mainTime = date => {
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }

  var currentTime = new Date(date);
  // returns the month (from 0 to 11)
  var month = currentTime.getMonth() + 1;

  // returns the day of the month (from 1 to 31)
  var day = currentTime.getDate();

  // returns the year (four digits)
  var year = currentTime.getFullYear();

  // write output MM/dd/yyyy
  const MiliTime = year + "-" + pad(month) + "-" + pad(day);

  // const mainTime = moment(`${a}T00:00:00`).valueOf();
  return moment(`${MiliTime}T00:00:00`).valueOf();
};
