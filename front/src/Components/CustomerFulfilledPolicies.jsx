import { Button } from '@mui/material'
import axios from 'axios';
import React from 'react'
import toast from 'react-hot-toast';

const BASE_URL = "http://localhost:12000";

const CustomerFulfilledPolicies = ({ customerFulfilledPolicies }) => {

    const handleDownload = async (pdfFilePath) => {
        try {
            // Construct full file URL
            const fileUrl = `${BASE_URL}${pdfFilePath}`;

            // Fetch the PDF file from the server
            const response = await axios.get(fileUrl, {
                responseType: "blob", // Important for downloading binary files
            });

            // Create a blob from the response data
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);

            // Create a temporary link and trigger download
            const a = document.createElement("a");
            a.href = url;
            a.download = pdfFilePath.split("/").pop(); // Extracts filename from path
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Revoke the object URL to free up memory
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading PDF:", error);
            toast.error("Failed to download certificate.");
        }
    };
    return (
        <>
            {customerFulfilledPolicies?.length == 0 ?
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
                                    Payout Amount
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
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {customerFulfilledPolicies?.map((policy, index) => (
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
                                        {policy?.policyId}
                                    </td>
                                    <td
                                        style={{
                                            padding: "10px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                        }}
                                    >
                                        {policy?.payoutAmount}
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
                                            {policy.policyStatus?.toUpperCase()}
                                        </p>
                                    </td>
                                    <td style={{ padding: "10px", textAlign: "center" }}>
                                        <Button
                                            variant="contained"
                                            sx={{ fontWeight: "bold", fontSize: "1.5vh" }}
                                            // disabled={policy.policyStatus !== "active"}
                                            onClick={() => handleDownload(policy?.certificatePath)}
                                        >
                                            Download Certificate
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            }
        </>
    )
}

export default CustomerFulfilledPolicies