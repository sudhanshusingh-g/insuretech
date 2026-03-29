import { Button } from '@mui/material'
import React from 'react'

const CustomerPendingPolicies = ({ handleClaimPolicyOpen, customerPolicyList }) => {
    return (
        <>
            {customerPolicyList?.length == 0 ?
                (
                    <div
                        style={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <p
                            style={{
                                backgroundColor: "#CCE8EF",
                                paddingInline: "2vw",
                                paddingBlock: "2vh",
                                fontSize: "2.5vh",
                                fontWeight: "bold",
                                border: "2px solid #2EB0D1",
                                borderRadius: "5vh",
                            }}
                        >
                            No Policies
                        </p>
                    </div>
                )
                : (
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontFamily: "Quicksand, sans-serif",
                            marginTop: "20px",
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    backgroundColor: "#f5f5f5",
                                    textAlign: "left",
                                    fontWeight: "900",
                                }}
                            >
                                <th
                                    style={{
                                        padding: "10px",
                                        color: "blue",
                                        textAlign: "center",
                                        fontSize: "1.5vw",
                                    }}
                                >
                                    Policy ID
                                </th>
                                <th
                                    style={{
                                        padding: "10px",
                                        color: "blue",
                                        textAlign: "center",
                                        fontSize: "1.5vw",
                                    }}
                                >
                                    Asset
                                </th>
                                <th
                                    style={{
                                        textAlign: "center",
                                        color: "blue",
                                        fontSize: "1.5vw",
                                    }}
                                >
                                    Status
                                </th>
                                <th
                                    style={{
                                        textAlign: "center",
                                        color: "blue",
                                        fontSize: "1.5vw",
                                    }}
                                >
                                    Date
                                </th>
                                <th
                                    style={{
                                        textAlign: "center",
                                        color: "blue",
                                        fontSize: "1.5vw",
                                    }}
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {customerPolicyList?.map((policy, index) => {
                                const date = policy?.createdAt;
                                const formattedDate = new Date(date).toLocaleDateString(
                                    "en-GB",
                                    {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "2-digit",
                                    }
                                );
                                return (
                                    <tr
                                        key={index}
                                        style={{ borderBottom: "1px solid #E0E0E0" }}
                                    >
                                        <td
                                            style={{
                                                padding: "10px",
                                                fontWeight: "800",
                                                textAlign: "center",
                                            }}
                                        >
                                            {policy.policyId}
                                        </td>
                                        <td
                                            style={{
                                                padding: "10px",
                                                fontWeight: "bold",
                                                textAlign: "center",
                                            }}
                                        >
                                            {policy.type.toUpperCase()}
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <p
                                                style={{
                                                    paddingBlock: "3px",
                                                    paddingInline: "10px",
                                                    borderRadius: "2vh",
                                                    border: `${policy.policyStatus == "active"
                                                        ? "1px solid green"
                                                        : policy.policyStatus == "fulfilled"
                                                            ? "1px solid blue"
                                                            : policy.policyStatus == "rejected"
                                                                ? "1px solid red"
                                                                : policy.policyStatus == "under review"
                                                                    ? "1px solid #E0952B"
                                                                    : "1px solid #9C9C9C"
                                                        }`,
                                                    fontSize: "1.5vh",
                                                    fontWeight: "bold",
                                                    color: `${policy.policyStatus == "active"
                                                        ? "green"
                                                        : policy.policyStatus == "fulfilled"
                                                            ? "blue"
                                                            : policy.policyStatus == "rejected"
                                                                ? "red"
                                                                : policy.policyStatus == "under review"
                                                                    ? "#E0952B"
                                                                    : "#9C9C9C"
                                                        }`,
                                                    width: "100%",
                                                    textAlign: "center",
                                                }}
                                            >
                                                {policy.policyStatus.toUpperCase()}
                                            </p>
                                        </td>
                                        <td
                                            style={{
                                                textAlign: "center",
                                                padding: "10px",
                                                color: "#9C9C9C",
                                                fontSize: "1.8vh",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {formattedDate}
                                        </td>
                                        <td style={{ padding: "10px", textAlign: "center" }}>
                                            <Button
                                                variant="contained"
                                                sx={{ fontWeight: "bold", fontSize: "1.5vh" }}
                                                disabled={policy.policyStatus !== "active"}
                                                onClick={() => handleClaimPolicyOpen(policy)}
                                            >
                                                Claim Policy
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )
            }
        </>
    )
}

export default CustomerPendingPolicies