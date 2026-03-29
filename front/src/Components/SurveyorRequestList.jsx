import { Button } from '@mui/material';
import React from 'react'

const SurveyorRequestList = ({ surveyorList, handleViewPolicy }) => {
    return (
        <>
            {surveyorList?.length == 0 ? (
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
                        No Surveyor Requests
                    </p>
                </div>
            ) : (
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
                                Customer ID
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
                                Insurance Amount
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
                        {surveyorList?.map((policy, index) => {
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
                                    style={{
                                        borderBottom: "1px solid #E0E0E0",
                                    }}
                                >
                                    <td
                                        style={{
                                            padding: "10px",
                                            fontWeight: "800",
                                            textAlign: "center",
                                        }}
                                    >
                                        {policy?.customerId}
                                    </td>
                                    <td
                                        style={{
                                            padding: "10px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                        }}
                                    >
                                        {policy?.type?.toUpperCase()}
                                    </td>
                                    <td
                                        style={{
                                            padding: "10px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                        }}
                                    >
                                        {policy?.insuranceAmount}
                                    </td>
                                    <td
                                        style={{
                                            padding: "10px",
                                            textAlign: "center",
                                        }}
                                    >
                                        <p
                                            style={{
                                                paddingBlock: "3px",
                                                paddingInline: "10px",
                                                borderRadius: "2vh",
                                                border: `${policy?.policyStatus === "active"
                                                    ? "1px solid green"
                                                    : policy?.policyStatus === "fulfilled"
                                                        ? "1px solid blue"
                                                        : policy?.policyStatus === "rejected"
                                                            ? "1px solid red"
                                                            : "1px solid #9C9C9C"
                                                    }`,
                                                fontSize: "1.5vh",
                                                fontWeight: "bold",
                                                color: `${policy?.policyStatus === "active"
                                                    ? "green"
                                                    : policy?.policyStatus === "fulfilled"
                                                        ? "blue"
                                                        : policy?.policyStatus === "rejected"
                                                            ? "red"
                                                            : "#9C9C9C"
                                                    }`,
                                                width: "100%",
                                                textAlign: "center",
                                            }}
                                        >
                                            {policy?.policyStatus?.toUpperCase()}
                                        </p>
                                    </td>
                                    <td
                                        style={{
                                            padding: "10px",
                                            fontSize: "1.8vh",
                                            textAlign: "center",
                                        }}
                                    >
                                        {formattedDate}
                                    </td>
                                    <td
                                        style={{
                                            padding: "10px",
                                            textAlign: "center",
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            sx={{
                                                fontWeight: "bold",
                                                fontSize: "1.5vh",
                                            }}
                                            onClick={() => handleViewPolicy(policy)}
                                        >
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )
            }
        </>
    )
}

export default SurveyorRequestList