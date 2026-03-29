import axiosInstance from "../axiosInstance";

export const customerLogin = async (loginData) => {
    const response = await axiosInstance.post("/customers/login", loginData);
    return response.data;
};

export const surveyorLogin = async (loginData) => {
    const response = await axiosInstance.post("/surveyors/login", loginData);
    return response.data;
};

export const governmentLogin = async (loginData) => {
    const response = await axiosInstance.post("/government/login", loginData);
    return response.data;
};

export const customerRegister = async (registerData) => {
    const response = await axiosInstance.get("/customers/register", registerData);
    return response
};

export const createPolicy = async (data) => {
    const response = await axiosInstance.post("/customers/create", data);
    return response.data
};

export const getCustomerPolicyList = async () => {
    const response = await axiosInstance.get("/customers/policies")
    return response.data
}

export const getGovernmentRequestedList = async () => {
    const response = await axiosInstance.get("/government/policies")
    return response.data
}

export const claimPolicy = async (payload) => {
    const { id, formData } = payload
    const response = await axiosInstance.post(`/customers/claim/${id}`, formData)
    return response.data
}

export const governmentAcceptancePolicy = async (payload) => {
    const { id, action } = payload
    const response = await axiosInstance.put(`/government/approve-reject/${id}`, { action: action })
    return response.data
}

export const gerSurveyorList = async () => {
    const response = await axiosInstance.get("/surveyors/claim-policies")
    return response.data
}

export const damageCalculation = async (payload) => {
    const { assessment, surveyorComments, id } = payload
    const response = await axiosInstance.put(`/surveyors/review/${id}`, {
        assessment: assessment,
        surveyorComments: surveyorComments
    })
    return response.data
}

export const claimRequest = async (data) => {
    const { id, action } = data
    const response = await axiosInstance.put(`/government/claim/approve-reject/${id}`, { action: action })
    return response
}

export const fulfilledPolicies = async () => {
    const response = await axiosInstance.get("/customers/notifications")
    return response.data
}