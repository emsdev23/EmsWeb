import axios from 'axios';

const batteryurl="http://localhost:5000/battery"


export function batteryData() {
    return axios.get(batteryurl)
      .then(response => {
        // Process the data here
        return response.data;
      })
      .catch(error => {
        console.error(error);
      });
  }
