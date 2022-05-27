import setText, { appendText } from "./results.mjs";

export function timeout() {
  //Take async function, set timeout and turn it into a promise to take advantage of benefits of promises.
  const wait = new Promise((resolve) => {
    setTimeout(() => {
      resolve("Timeout!");
    }, 1500);
  }); //Promise is in pending state
  
  //Handle the resolved state/fulfilled state
  wait.then(text => setText(text));

  //Settimeout only fires once after 1500 seconds. 
  /**
   * We created a Promise with resolve state. 
   * use setTimeout to resolve the promise after 1500 seconds
   */
}

export function interval() {
  let counter = 0;
  const wait = new Promise((resolve) => {
    setInterval(() => {
      resolve("Timeout! ");
    }, 1500);
  }); 
  //Set interval calls multiple times. Each time the timer expires.
  
  wait.then(text => setText(text));
}

export function clearIntervalChain() {
  let counter = 0;
  let interval;

  const wait = new Promise((resolve) => {
    interval = setInterval(() => {
      resolve("Timeout! ");
    }, 1500);
  }); 
  //Set interval calls multiple times. Each time the timer expires.
  
  wait.then(text => setText(text)).finally(()=> {
    clearInterval(interval);
  });
}

export function xhr() {
  //xhr calls onerror only when there is network error and request could not be completed. All other errors occur in onload function.
  let request = new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/users/7");
    xhr.onload = () => {
      if(xhr.status === 200){
        resolve(xhr.responseText);
      }
      else {
        reject(xhr.statusText);
      };
    }
    xhr.onerror = () => reject("Request Failed!");
    xhr.send();
  })

  request.then(result => setText(result)).catch(err => setText(err));
  //We have the power to control how a promise is settled (resolved or rejected);
}


//Queue up several promises at once and wait for all of them to complete. 
//Use Case: 
/**
 * I do not want sequential API Calls. 
 * With promises you can make asynchronous calls
 */
export function allPromises() {
  let categories = axios.get("http://localhost:3000/itemCategories");
  let statuses = axios.get("http://localhost:3000/orderStatuses");
  let userTypes = axios.get("http://localhost:3000/userTypes");
  // let h = axios.get("http://localhost:3000/gh");

  //What happens if one of our promises fail? 
  // 


  //Promise all function queues up the promises. The .then function
  /** Result of .then will be array of results. The order will be in order that we added them. 
   * Not in order in which they were resolved. 
    Either all Promises are fulfilled or one is rejected
  */

  Promise.all([categories, statuses,userTypes,h])
  .then(([cat,stat,type,j]) => {
    setText("");

    appendText(JSON.stringify(cat.data));
    appendText(JSON.stringify(stat.data));
    appendText(JSON.stringify(type.data));
    // appendText(JSON.stringify(j.data));
  }).catch((err) => {
    setText(err);
  });

}

//What if the promises are independent. Even if one or two promises fail, I need rest of the data
export function allSettled() {
  let categories = axios.get("http://localhost:3000/itemCategories");
  let statuses = axios.get("http://localhost:3000/orderStatuses");
  let userTypes = axios.get("http://localhost:3000/userTypes");
  let h = axios.get("http://localhost:3000/h");


  /**
   * allSettled returns a different shape of data
   * IT HAS TWO KEYS:
   * a. Status: 
   * b. Value/Reason: Value for resolved. Reject will give reason.
   * 
   * Catch block is not specifically needed.
   * A catch block is recommended 
   */
  Promise.allSettled([categories, statuses,userTypes,h])
  .then((values) => {
    let results  = values.map(v => {
      if(v.status === 'fulfilled') {
        return `Fulfilled: ${JSON.stringify(v.value.data[0])}`
      } else {
        return `Rejected: ${JSON.stringify(v.reason.message)}`
      }   
    });
    setText(results);
  }).catch((err) => {
    setText(err);
  });
}

export function race() {
  let users = axios.get("http://localhost:3000/users");
  let backup = axios.get("http://localhost:3001/users");

  Promise.race([users,backup])
  .then(users => setText(JSON.stringify(users.data)))
  .catch(err => setText(err));

}
