const checkAuth =  () => {
    try {
        const token = localStorage.getItem("userData");
        if (!token || token == 'undefined') {
           console.log(`token: ${token}`)
           return null 
        } else {
           return true
        }
      } catch {
        console.log('error')
      }
}

export default checkAuth