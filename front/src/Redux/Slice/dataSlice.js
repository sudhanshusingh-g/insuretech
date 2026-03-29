import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    claimPolicy,
    claimRequest,
    createPolicy,
    damageCalculation,
    fulfilledPolicies,
    gerSurveyorList,
    getCustomerPolicyList,
    getGovernmentRequestedList,
    governmentAcceptancePolicy,
} from "../Service/service";

const dataSlice = createSlice({
    name: "data",
    initialState: {
        customerPolicyList: [],
        loadingData: false,
        successData: false,
        errorData: false,
        createPolicyloading: false,
        createPolicySuccess: false,
        createPolicyError: false,
        governmentListLoading: false,
        governmentListSuccess: false,
        governmentListError: false,
        governmentRequestedList: [],
        acceptanceLoading: false,
        acceptanceSuccess: false,
        acceptanceError: false,
        surveyorList: [],
        surveyorListLoading: false,
        surveyorListSuccess: false,
        surveyorListError: false,
        damageDataLoading: false,
        damageDataSuccess: false,
        damageDataError: false,
        waitingForGovt: [],
        claimPolicyLoading: false,
        claimPolicySuccess: false,
        claimPolicyError: false,
        fulfilledLoading: false,
        fulfilledSuccess: false,
        fulfilledError: false,
        customerFulfilledPolicies: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createPolicyData.pending, (state) => {
                state.createPolicyloading = true;
                state.createPolicySuccess = false;
                state.createPolicyError = false;
            })
            .addCase(createPolicyData.fulfilled, (state) => {
                state.createPolicyloading = false;
                state.createPolicySuccess = true;
                state.createPolicyError = false;
            })
            .addCase(createPolicyData.rejected, (state) => {
                state.createPolicyloading = false;
                state.createPolicySuccess = false;
                state.createPolicyError = true;
            })
            .addCase(getCustomerPolicyListData.pending, (state) => {
                state.loadingData = true;
                state.successData = false;
                state.errorData = false;
            })
            .addCase(getCustomerPolicyListData.fulfilled, (state, action) => {
                state.loadingData = false;
                state.successData = true;
                state.errorData = false;
                state.customerPolicyList = action?.payload?.policies;
            })
            .addCase(getCustomerPolicyListData.rejected, (state) => {
                state.loadingData = false;
                state.successData = false;
                state.errorData = true;
            })
            .addCase(governmentRequestList.pending, (state) => {
                state.governmentListLoading = true;
                state.governmentListSuccess = false;
                state.governmentListError = false;
            })
            .addCase(governmentRequestList.fulfilled, (state, action) => {
                state.governmentListLoading = false;
                state.governmentListSuccess = true;
                state.governmentListError = false;
                state.governmentRequestedList = action.payload;
            })
            .addCase(governmentRequestList.rejected, (state) => {
                state.governmentListLoading = false;
                state.governmentListSuccess = false;
                state.governmentListError = true;
            })
            .addCase(governmentAcceptAction.pending, (state) => {
                state.acceptanceLoading = true;
                state.acceptanceSuccess = false;
                state.acceptanceError = false;
            })
            .addCase(governmentAcceptAction.fulfilled, (state) => {
                state.acceptanceLoading = false;
                state.acceptanceSuccess = true;
                state.acceptanceError = false;
            })
            .addCase(governmentAcceptAction.rejected, (state) => {
                state.acceptanceLoading = false;
                state.acceptanceSuccess = false;
                state.acceptanceError = true;
            })
            .addCase(getSurveyorPolicyList.pending, (state) => {
                state.surveyorListLoading = true;
                state.surveyorListSuccess = false;
                state.surveyorListError = false;
            })
            .addCase(getSurveyorPolicyList.fulfilled, (state, action) => {
                state.surveyorListLoading = false;
                state.surveyorListSuccess = true;
                state.surveyorListError = false;
                state.surveyorList = action.payload;
            })
            .addCase(getSurveyorPolicyList.rejected, (state) => {
                state.surveyorListLoading = false;
                state.surveyorListSuccess = false;
                state.surveyorListError = true;
            })
            .addCase(objectDamageData.pending, (state) => {
                state.damageDataLoading = true;
                state.damageDataSuccess = false;
                state.damageDataError = false;
            })
            .addCase(objectDamageData.fulfilled, (state) => {
                state.damageDataLoading = false;
                state.damageDataSuccess = true;
                state.damageDataError = false;
            })
            .addCase(objectDamageData.rejected, (state) => {
                state.damageDataLoading = false;
                state.damageDataSuccess = false;
                state.damageDataError = true;
            })
            .addCase(claimCustomerPolicy.pending, (state, action) => {
                state.claimPolicyLoading = true
                state.claimPolicySuccess = false
                state.claimPolicyError = false
            })
            .addCase(claimCustomerPolicy.fulfilled, (state, action) => {
                state.claimPolicyLoading = false
                state.claimPolicySuccess = true
                state.claimPolicyError = false
            })
            .addCase(claimCustomerPolicy.rejected, (state, action) => {
                state.claimPolicyLoading = false
                state.claimPolicySuccess = false
                state.claimPolicyError = true
            })
            .addCase(fulfilledPoliciedData.pending, (state, action) => {
                state.fulfilledLoading = true
                state.fulfilledSuccess = false
                state.fulfilledError = false
            })
            .addCase(fulfilledPoliciedData.fulfilled, (state, action) => {
                state.fulfilledLoading = false
                state.fulfilledSuccess = true
                state.fulfilledError = false
                state.customerFulfilledPolicies = action.payload?.notifications
            })
            .addCase(fulfilledPoliciedData.rejected, (state, action) => {
                state.fulfilledLoading = false
                state.fulfilledSuccess = false
                state.fulfilledError = true
            })
    },
});

export const createPolicyData = createAsyncThunk(
    "CREATE/POLICY",
    async (data) => {
        try {
            const response = await createPolicy(data);
            return response;
        } catch (error) {
            console.log("Create Policy Error: ", error)
        }
    }
);

export const getCustomerPolicyListData = createAsyncThunk(
    "GET/POLICY/LIST",
    async () => {
        try {
            const response = await getCustomerPolicyList();
            return response;
        } catch (error) {
            console.log("Policy List Error: ", error)
        }
    }
);

export const governmentRequestList = createAsyncThunk(
    "GET/GOVERNMENT/POLICY/LIST",
    async () => {
        try {
            const response = await getGovernmentRequestedList();
            return response;
        } catch (error) {
            console.log("Get Government Policy Error: ", error)
        }
    }
);

export const claimCustomerPolicy = createAsyncThunk(
    "CLAIM/POLICY/DATA",
    async (id) => {
        try {
            const response = await claimPolicy(id);
            return response;
        } catch (error) {
            console.log("Claim Policy Error: ", error)
        }
    }
);

export const governmentAcceptAction = createAsyncThunk(
    "GOVERNMENT/ACCEPT/POLICY",
    async (data) => {
        try {
            const response = await governmentAcceptancePolicy(data);
            return response;
        } catch (error) {
            console.log("Government Action Error: ", error)
        }
    }
);

export const getSurveyorPolicyList = createAsyncThunk(
    "SURVEYOR/POLICY/LIST",
    async () => {
        try {
            const response = await gerSurveyorList();
            return response;
        } catch (error) {
            console.log("Surveyor Policy List Error: ", error)
        }
    }
);

export const objectDamageData = createAsyncThunk(
    "OBJECT/DAMAGE/DATA",
    async (data) => {
        try {
            const response = await damageCalculation(data);
            return response;
        } catch (error) {
            console.log("Damage Calculation Error: ", error)
        }
    }
);

export const claimRequestResponse = createAsyncThunk(
    "CLAM/REQUEST/RESPONSE",
    async (data) => {
        try {
            const response = await claimRequest(data)
            return response
        } catch (error) {
            console.log("Claim request response: ", error)
        }
    }
)

export const fulfilledPoliciedData = createAsyncThunk(
    "FULFILLED/POLICIES/DATA",
    async () => {
        try {
            const response = await fulfilledPolicies()
            return response
        } catch (error) {
            console.log("Fulfilled policy error: ", error)
        }
    }
)
export default dataSlice.reducer;
