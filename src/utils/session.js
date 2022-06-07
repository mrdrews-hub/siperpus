const session = {
    getToken() {
        return sessionStorage.getItem('token')
    },
    getUser() {
        const userLoginParsed = JSON.parse(sessionStorage.getItem('userLogin'))
    }
}

export default session