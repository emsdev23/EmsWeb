import axios from 'axios';

const batteryurl="http://121.242.232.211:5000/battery"


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
