import axios from '@/api'

export const userService = {
    login
};

function login(username, password) {
  return axios.post('/weblogin',{user : username, password : password},{
      withCredentials: true
    })
    .then(
      response  =>  {
        if (response.data.auth){
          const userdata = { "username" : JSON.parse(response.config.data).user, "token" : response.data.token}
          localStorage.setItem('user', JSON.stringify(userdata));
          return response.data;
        }else{
          return Promise.reject("no auth");
        }
      })
      .catch( 
         (error) =>{
           if (error == 401) {
            return Promise.reject("Wrong username or password");
           }else{
            return Promise.reject(error);
           }
      })
}