const createRandomId = () => {
    let hexaCode = "";
    for (let i = 0; i < 5; i++) {
      hexaCode += Math.floor(Math.random() * 16).toString(16);
    }
    return hexaCode;
  }
  
  
  export default createRandomId;