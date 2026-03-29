import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { customerLogin, customerRegister, governmentLogin, surveyorLogin } from '../Service/service'

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loginData: {},
        loginLoading: false,
        loginSuccess: false,
        loginError: false,
        registerLoading: false,
        registerSuccess: false,
        registerError: false
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(customerLoginResponse.pending, (state) => {
                state.loginLoading = true
                state.loginSuccess = false
                state.loginError = false
            })
            .addCase(customerLoginResponse.fulfilled, (state, action) => {
                state.loginLoading = false
                state.loginSuccess = true
                state.loginError = false
                state.loginData = action.payload.customer
                localStorage.setItem("token", action.payload?.token)
                localStorage.setItem("user", "customer")
            })
            .addCase(customerLoginResponse.rejected, (state) => {
                state.loginLoading = false
                state.loginSuccess = false
                state.loginError = true
            })
            .addCase(surveyorLoginResponse.pending, (state) => {
                state.loginLoading = true
                state.loginSuccess = false
                state.loginError = false
            })
            .addCase(surveyorLoginResponse.fulfilled, (state, action) => {
                state.loginLoading = false
                state.loginSuccess = true
                state.loginError = false
                state.loginData = action.payload
                localStorage.setItem("token", action.payload?.token)
                localStorage.setItem("user", "surveyor")

            })
            .addCase(surveyorLoginResponse.rejected, (state) => {
                state.loginLoading = false
                state.loginSuccess = false
                state.loginError = true
            })
            .addCase(governmentLoginResponse.pending, (state) => {
                state.loginLoading = true
                state.loginSuccess = false
                state.loginError = false
            })
            .addCase(governmentLoginResponse.fulfilled, (state, action) => {
                state.loginLoading = false
                state.loginSuccess = true
                state.loginError = false
                state.loginData = action.payload
                localStorage.setItem("token", action.payload?.token)
                localStorage.setItem("user", "government")

            })
            .addCase(governmentLoginResponse.rejected, (state) => {
                state.loginLoading = false
                state.loginSuccess = false
                state.loginError = true
            })
            .addCase(registerCustomer.pending, (state) => {
                state.registerLoading = true
                state.registerSuccess = false
                state.registerError = false
            })
            .addCase(registerCustomer.fulfilled, (state) => {
                state.registerLoading = false
                state.registerSuccess = true
                state.registerError = false
            })
            .addCase(registerCustomer.rejected, (state) => {
                state.loginLoading = false
                state.registerSuccess = false
                state.registerError = true
            })
    }
})


export const customerLoginResponse = createAsyncThunk(
    "CUSTOMER/LOGIN",
    async (loginData) => {
        try {
            const response = customerLogin(loginData)
            return response
        } catch (error) {
            console.log("Customer Login Error: ", error)
        }
    }
)

export const surveyorLoginResponse = createAsyncThunk(
    "SURVEYOR/LOGIN",
    async (loginData) => {
        try {
            const response = surveyorLogin(loginData)
            return response
        } catch (error) {
            console.log("Surveyor Login Error: ", error)
        }
    }
)

export const governmentLoginResponse = createAsyncThunk(
    "GOVERNMENT/LOGIN",
    async (loginData) => {
        try {
            const response = governmentLogin(loginData)
            return response
        } catch (error) {
            console.log("Government Login Error: ", error)
        }
    }
)

export const registerCustomer = createAsyncThunk(
    "REGISTER/CUSTOMER",
    async (registerData) => {
        try {
            const response = customerRegister(registerData)
            return response
        } catch (error) {
            console.log("Register Error: ", error)
        }
    }
)
export default authSlice.reducer