import * as actionTypes from './actionTypes';
import moment from 'moment';
import axios from 'axios';
import { _getUser } from './authActionCreators';

export const addTransaction = data => dispatch => {
  const addedtime = mainTime(data.date);

  _getUser()
    .then(userData=>{
      const uid = userData.localId
      axios.post(`https://expense-tracker-9b728-default-rtdb.firebaseio.com/transactions.json?auth=${userData.idToken}`, {
          ...data,
          userId: uid,
          addedtime
      }).then(response => {

        if(response.status === 200) {
          console.log("post id > ",response.data.name);
          dispatch({
              type: actionTypes.ADD_TRANSACTION,
              payload: {
                ...data,
                addedtime,
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
    });
}

export const deleteTransaction = item => (dispatch, getState) => {
  const idToken = getState().authReducer.idToken;
  const localId = getState().authReducer.localId;
  
  console.log("deleteTransaction > ", item.id);
  axios.delete(`https://expense-tracker-9b728-default-rtdb.firebaseio.com/transactions/${item.id}.json?auth=${idToken}`)
    .then(response => response.status)
    .then(status => {
      if(status === 200) {
        console.log("ok");
        dispatch({
          type: actionTypes.DELETE_TRANSACTION,
          payload: item
        })
      }
    })  
    .catch(err => {
      console.log(err);
      alert(err);
    });
}

export const updateTransaction = item => (dispatch, getState) => {
  const idToken = getState().authReducer.idToken;
  const localId = getState().authReducer.localId;

  console.log("updateTransaction > ",item);
  if(idToken !== null && localId !== null) {
    axios.patch(`https://expense-tracker-9b728-default-rtdb.firebaseio.com/transactions/${item.id}.json?auth=${idToken}`, {
      ...item    
    })
      .then(response => {
        if(response.status === 200) {
          dispatch({
            type: actionTypes.UPDATE_TRANSACTION,
            payload: item
          })
        } else {
          alert(response.error);
        }
      })
      .catch(err => alert(err));
  }
}

export const fetchTransaction = accountId => (dispatch, getState) => {
  const idToken = getState().authReducer.idToken;
  const localId = getState().authReducer.localId;

  if(idToken !== null && localId !== null) {
    axios.get(`https://expense-tracker-9b728-default-rtdb.firebaseio.com/transactions.json?auth=${idToken}&orderBy="accountId"&equalTo="${accountId}"`)
      .then(response => {
          // console.log("fetchTransaction >",response.data);
          let data = response.data;
          let transaction = [];
          for(let key in data) {
            transaction.push({...data[key], id: key});
          }
          console.log("transaction action creators > ", transaction);
          dispatch({
            type: actionTypes.FETCH_TRANSACTION,
            payload: transaction
          })
      })
      .catch(err => {
        console.log(err)
        alert("Fetch transaction: ", err);
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
