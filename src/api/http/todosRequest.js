import axios from "axios";


let accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2ODYyMDgwMjksIm5iZiI6MTY4NjIwODAyOSwianRpIjoiOTJhYjU5ODQtM2RjNS00NGVkLWJkZmUtOTlmN2QyN2M2MzYzIiwiaWRlbnRpdHkiOnsibmFtZSI6IlNhcmF2YW5hbiBDIiwiZW1haWwiOiJzbWl0aHdpbGxzMTk4OUBnbWFpbC5jb20iLCJ1c2VyX2lkIjoidXNlcl84YzJmZjIxMjhlNzA0OTNmYTRjZWRkMmNhYjk3YzQ5MiIsImljb24iOiJodHRwOi8vd3d3LmdyYXZhdGFyLmNvbS9hdmF0YXIvY2Y5NGI3NGJkNDFiNDY2YmIxODViZDRkNjc0ZjAzMmI_ZGVmYXVsdD1odHRwcyUzQSUyRiUyRnMzLnNsb292aS5jb20lMkZhdmF0YXItZGVmYXVsdC1pY29uLnBuZyIsImJ5X2RlZmF1bHQiOiJvdXRyZWFjaCJ9LCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.hb2zIuFyJ_eL6sAqfP3BgZ7JS2LykBhd1JDWsHeNm6g";
let companyId = "company_0f8d040401d14916bc2430480d7aa0f8";
let userId = "user_8c2ff2128e70493fa4cedd2cab97c492";



// Authentication & getting Access Token

const Authentication = (email, password) => {


  const apiUrl = 'https://stage.api.sloovi.com/login?product=outreach';

  const loginpostData = {
    email: email,
    password: password,
  };

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  const result = axios.post(apiUrl, JSON.stringify(loginpostData), { headers })
  return result;
};


// 2 team data fetch

const commonheaders = {
  'Authorization': `Bearer ${accessToken}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json', 
};

const TeamApi = () => {

  const teamApiUrl = "https://stage.api.sloovi.com/team?product=outreach&company_id=company_0f8d040401d14916bc2430480d7aa0f8";
  const result = axios.get(teamApiUrl, { headers: commonheaders })
  return result;
}


// tasks

// 1.1 adding taks
const fetchputapiUrl = `https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2?company_id=company_0f8d040401d14916bc2430480d7aa0f8`;

const AddTodo = (data) => {
  const result = axios.post(fetchputapiUrl, data, { headers: commonheaders })
    // .then(response => {
    //   // Handle the success response
    //   console.log('Task added successfully:', response.data);
    // })
    // .catch(error => {
    //   // Handle the error response
    //   console.error('Error adding task:', error);
    // });

  return result;
}

// 1.2 getting tasks
const GetTodos = () => {
  const result = axios.get(fetchputapiUrl, { headers: commonheaders })
  return result;
};

// // 1.3 getting single task


const GetSingleTask = (taskId) => {
  const singletaskapiUrl = `https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2/${taskId}?company_id=${companyId}`;

  const result = axios.get(singletaskapiUrl, { headers: commonheaders })
    .then(response => {
      const task = response.data.results;

      // Handle the task
      console.log(task);
    })
    .catch(error => {
      console.error(error);
    });
  return result;
};

// GetSingleTask("demo123");



// 1.4 updatedata

const UpdateTodo = (id, data) => {
  const updateTaskUrl = `https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2/${id}?company_id=company_0f8d040401d14916bc2430480d7aa0f8`;

  const result = axios.put(updateTaskUrl, data, { headers: commonheaders })
  // .then(response => {
  //   // Handle the response
  //   console.log("response code:", response.data.code);
  //   if(response.data.code ===400 || response.data.status === "error"){
  //     console.log("Error occured while updating: ", response.data);
  //     throw(response.data);
  //   }
  //   else{
  //     console.log('Task updated successfully:', response.data);
  //   }


  // })
  // .catch(error => {
  //   // Handle the error
  //   console.error('Error updating task:', error);
  // });


  return result;
};

// 1.5 delete tasks

const DeleteTodo = (id) => {
  const deletetaskApi = `https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2/${id}?company_id=${companyId}`;

  const result = axios.delete(deletetaskApi, { headers: commonheaders })
    .then(response => {
      console.log('Task deleted successfully', response.data);
    })
    .catch(error => {
      console.error('Error deleting task:', error);
    });
  return result;
};

export { GetTodos, AddTodo, UpdateTodo, DeleteTodo, Authentication, TeamApi };
