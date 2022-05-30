import {useState, useCallback, useEffect} from 'react';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(false);
  
  
    const login = useCallback((uid, token, expirationDate) => {
      setToken(token);
      setUserId(uid);
      const tokenExpirationDate = expirationDate || new Date(new Date().getTime() +1000*60*60) //now +1 hour    this tokenExpirationDate is a variable and not a state!!
      setTokenExpirationDate(tokenExpirationDate)
      localStorage.setItem(
        'userData', 
        JSON.stringify(
          {
            userId: uid, 
            token: token,
            expiration: tokenExpirationDate.toISOString()     //this tokenExpirationDate is a variable and not a state!!
          }
      ));
    },[]);
  
    const logout = useCallback(() => {
      setToken(null);
      setTokenExpirationDate(null);
      setUserId(null);
      localStorage.removeItem('userData');
    },[]);
  
    useEffect(()=>{
      if(token && tokenExpirationDate){
        const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();       // in milliseconds
        logoutTimer = setTimeout(logout, remainingTime)
      } else {
        clearTimeout(logoutTimer);
      }
    },[logout, token, tokenExpirationDate]);
  
    useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem('userData'));
      if(storedData && storedData.token && new Date(storedData.expiration)>new Date()){
        login(storedData.userId, storedData.token, new Date(storedData.expiration));
      }
    }, [login]);
  
    return { token, login, logout, userId};

}