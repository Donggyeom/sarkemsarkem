const createRandomId = () => {
  let randomCode = "";
  for (let i = 0; i < 5; i++) randomCode += (Math.random() * 16).toString(16);
    return randomCode;
  }
  
  
  export default createRandomId;