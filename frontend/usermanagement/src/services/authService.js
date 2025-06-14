import axios from 'axios';

//Set your Backend Base URL
const BASE_URL = "http://localhost:8080";

// CREATE AXIOS INSTANCE
const api = axios.create({
    baseURL: BASE_URL, // Adjust the base URL as per your backend configuration
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for handling cookies cross-origin
});

//Response interceptor to handle errors globally
api.interceptors.response.use(
    (response)=> response,
    (error)=> {
        // globally handle errors
        if (error.response){
            switch (error.response.status){
                case 401: //unauthorized
                    //redirect to login or logout
                    authService.logout();
                    window.location.href = '/login';
                    break;
                case 403: //forbidden
                    console.error("Access forbidden");
                    break;
                case 404: //resource not found
                    console.error("Resource not found");
                    break;
                case 500: //server error
                    console.error("Internal Server error");
                    break;
            }
        }
        else if (error.request) {
            // The request was made but no response was received
            console.error("No response received from server", error.request);
        }
        else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error in setting up request", error.message);
        }
        return Promise.reject(error);
    }
);

const authService = {
    // sign up method
    signupNormalUser: async (username, email, password) => {
        try{
            const response = await api.post('/auth/registernormaluser',{
                username,
                email,
                password
            });
            return response.data;
        }
        catch(error){
            console.error("Sign Up Failed", error);
            throw error;
        }
    },

    // Login method
    login: async (username, password) => {
        try{
            const response = await api.post('/auth/login', {
                username,
                password
            });

            //fetch current user
            const user = await authService.fetchCurrentUser();
            return {
                ...response.data,
                user
            };
        }
        catch(error){
            console.error("Login Failed", error);
            throw error;
        }
    },

    // fetch current user
    fetchCurrentUser: async () => {
        try {
            const response = await api.get('/auth/getcurrentuser');

            // store userdto in local storage for quick access
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        }
        catch(error){
            console.error("Fetch Current User Failed", error);
            
            //if unauthorized
            if(error.response && error.response.status === 401){
                await authService.logout();
            }
            return null;
        }
    },

    //get current user from local storage
    getCurrentUser: () => {
        const user = localStorage.getItem(`user`);
        try{
            return user ? JSON.parse(user) : null;
        }
        catch(error){
            console.error("Error parsing user from local storage", error);
            return null;
        }
    },

    // logout method
    logout: async () => {
        try {
            //call the backend api
            await api.post('/auth/logout');

            //clear user from local storage
            localStorage.removeItem('user');
        }
        catch(error){
            console.error("Logout Failed", error);
            throw error;
        }
    },

    //is authenticated
    isAuthenticated: async () => {
        try{
            //verify authentication by fetching current user
            const user = await authService.fetchCurrentUser();
            return !!user; // returns true if user exists, false otherwise
        }
        catch(error){
            console.error("Error checking authentication", error);
            return false; // if there's an error, assume not authenticated
        }
    },
    // update user profile
    updateProfile: async (userData) => {
        try {
            const response = await api.put(`/users/updateuser/${userData.id}`, userData);
            const currentUser = authService.getCurrentUser();
            const updatedUser = {...currentUser, ...response.data};
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        catch (error) {
            console.error("Update Profile Failed", error);
            throw error;
        }
    },

    //get all users
    getAllUsers: async () => {
        try {
            const response = await api.get('/users/getAllUsers');
            return response.data;
        }
        catch(error){
            console.error('Failed to fetch all users', error);
            throw error
        }
    },

    //delete user
    deleteUser: async (userId) => {
        try{
            const response = await api.delete(`users/deleteuser/${userId}`);
            return response.data
        }
        catch(error){
            console.error('Failed to delete user',error);
            throw error;
        }
    },

    //change password
    changePassword: async (currentPassword, newPassword, confirmPassword) => {
        try{
            const currentUser = authService.getCurrentUser();
            if(!currentUser || !currentUser.id){
                throw new Error('User not Found');
            }
            const response = await api.put(`/users/changepassword/${currentUser.id}`,{
                currentPassword,
                newPassword,
                confirmPassword
            });
            return response.data;
        }
        catch(error){
            console.error("Failed to change the password",error);
            throw error;
        }
    }
};

export {api, authService};