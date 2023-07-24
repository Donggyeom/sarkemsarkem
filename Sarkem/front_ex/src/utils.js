const createRandomId = () => {
    return Math.floor(Math.random()*1048575).toString(16);
  }
  
  
  export default createRandomId;