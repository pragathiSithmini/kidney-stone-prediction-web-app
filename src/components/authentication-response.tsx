import React, { FunctionComponent, ReactElement, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import './home.css';

interface AuthenticationResponsePropsInterface {
    derivedResponse?: any;
}

export const AuthenticationResponse: FunctionComponent<AuthenticationResponsePropsInterface> = (
    props: AuthenticationResponsePropsInterface
): ReactElement => {

    const { derivedResponse } = props;

    const [formData, setFormData] = useState({
        gravity: '0.0',
        ph: '0.0',
        osmo: '0.0',
        cond: '0.0',
        urea: '0.0',
        calc: '0.0',
    });

    const [prediction, setPrediction] = useState('');
    const [risk, setRisk] = useState(0); // Progress cycle percentage
    const [loading, setLoading] = useState(false); // Loading state for API call
    const [error, setError] = useState(''); // Error message state

    const handleChange = (e: { target: { name: string; value: string } }) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Prepare API request
        const url = new URL('https://ae7b9086-12f4-4ec7-9d8a-cb4ca22d2e79-prod.e1-us-east-azure.choreoapis.dev/default/kidney-stone-predictio-ki/v1/predict');
        url.searchParams.append('param1', formData.gravity);
        url.searchParams.append('param2', formData.ph);
        url.searchParams.append('param3', formData.osmo);
        url.searchParams.append('param4', formData.cond);
        url.searchParams.append('param5', formData.urea);
        url.searchParams.append('param6', formData.calc);

        const headers = {
            accept: 'application/json',
                'Authorization': 'Bearer eyJ4NXQiOiJiOUZwNkNuTmYtSENOdDBRY1MydnQ3eUN3U00iLCJraWQiOiJNbVprWlRneE1Ua3lOMkV6WVRBNFlqZzVNMkpsWldFM016Tm1NelE0WkRVd01qQXdNRFZpTTJRellUZ3hOalkxWkRCaE1HVTNaR0UzT0RRNVpEQTVPQV9SUzI1NiIsInR5cCI6ImF0K2p3dCIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJyb1p6NUNYNTdjcG1Dc3RuZUQ2NU1Odko0NzBhIiwiYXV0IjoiQVBQTElDQVRJT04iLCJhdWQiOlsicm9aejVDWDU3Y3BtQ3N0bmVENjVNTnZKNDcwYSIsImNob3JlbzpkZXBsb3ltZW50OnByb2R1Y3Rpb24iXSwibmJmIjoxNzQyMTI0NjcyLCJhenAiOiJyb1p6NUNYNTdjcG1Dc3RuZUQ2NU1Odko0NzBhIiwib3JnX2lkIjoiYWU3YjkwODYtMTJmNC00ZWM3LTlkOGEtY2I0Y2EyMmQyZTc5IiwiaXNzIjoiaHR0cHM6XC9cL2FwaS5hc2dhcmRlby5pb1wvdFwva2lkbmV5c3RvbmVwcmVkaWN0aW9uXC9vYXV0aDJcL3Rva2VuIiwiZXhwIjoxNzc4MTI0NjcyLCJvcmdfbmFtZSI6ImtpZG5leXN0b25lcHJlZGljdGlvbiIsImlhdCI6MTc0MjEyNDY3MiwianRpIjoiZDMwNmFmYTUtOTczNC00MjY2LWIxZTctYTU3MmYyYTQzMGYwIiwiY2xpZW50X2lkIjoicm9aejVDWDU3Y3BtQ3N0bmVENjVNTnZKNDcwYSJ9.eOYEEj5SoujKBqO_c5YIqc2f_juKb0SuJsJtVvz9fdsUPFixCoZXDhX5MIBua_QY39pgDIKnXKxiJjdp8t-75rKjggNYpCxAFH70JZfcM1A0P8UIyeZXZe3Okiz5ju0ttg52gkylMGb4dfeqDBMKJdTWMKGtNVXPrlkwMMuKsWQQSwXc6MuUVqgPnAD_3lOHqoGEo3_zW7O0wO79XMLxQcSv2uiYiblGfnXE1PtfdtZeLGDkz_nTzXxUDwrGm8aZc6COHZDVl-IpQprDpm4S_UQtkNF0oSnJCODCKmb6u0SCtJJzOQ7INEPaQ55TxYANfzkgWPa2MhNiCrq6j3MRUQ'
        };

        try {
            const response = await fetch(url.toString(), { headers });
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            const calculatedRisk = data*100;
            setRisk(parseFloat(calculatedRisk.toFixed(2)));

            setPrediction(
                calculatedRisk > 50
                    ? "You are at risk of getting Kidney Stone"
                    : "You are not at risk of getting Kidney Stone"
            );
        } catch (error: any) {
            setError('Failed to fetch risk prediction. Please try again later.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-container">
            <h2>Kidney Stone Risk Prediction</h2>
            <form onSubmit={handleSubmit} className="input-form">
                <label>
                    Specific Gravity:
                    <input
                        type="text"
                        name="gravity"
                        value={formData.gravity}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    pH:
                    <input
                        type="text"
                        name="ph"
                        value={formData.ph}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Osmolarity:
                    <input
                        type="text"
                        name="osmo"
                        value={formData.osmo}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Conductivity:
                    <input
                        type="text"
                        name="cond"
                        value={formData.cond}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Urea Concentration:
                    <input
                        type="text"
                        name="urea"
                        value={formData.urea}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Calcium Concentration:
                    <input
                        type="text"
                        name="calc"
                        value={formData.calc}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
            {error && <div className="error-message">{error}</div>}
            <div className="prediction-container">
                <h3>Prediction: {prediction}</h3>
                <div className="progress-container" style={{ width: 150, height: 150, margin: "auto" }}>
                    <CircularProgressbar
                        value={risk}
                        text={`${risk}%`}
                        styles={buildStyles({
                            textSize: "16px",
                            pathColor: risk > 50 ? "red" : "green",
                            textColor: "#000",
                            trailColor: "#ddd",
                        })}
                    />
                </div>
            </div>
        </div>
    );
};


