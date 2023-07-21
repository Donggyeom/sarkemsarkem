
const createSessionId = () => {
  return Math.floor(Math.random()*1048575).toString(16);
}


export default createSessionId;