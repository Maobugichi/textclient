const checkAuth =  () => {
   try {
      const storedUserData = localStorage.getItem("userData");
      if (!storedUserData) return null;
      const userData = JSON.parse(storedUserData);
      if (!userData || Object.keys(userData).length === 0) {
        console.log('hello')
        return null;
      } else {
        return true;
      }
    } catch (err) {
      console.log('auth error:', err);
      return null;
    }
}

export default checkAuth