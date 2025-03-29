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
        const url = new URL('https://fcdf8c22-fc50-4b45-94ed-2143e9bc4668-prod.e1-us-east-azure.choreoapis.dev/default/kidneyguardian-api/v1/predict');
        url.searchParams.append('param1', formData.gravity);
        url.searchParams.append('param2', formData.ph);
        url.searchParams.append('param3', formData.osmo);
        url.searchParams.append('param4', formData.cond);
        url.searchParams.append('param5', formData.urea);
        url.searchParams.append('param6', formData.calc);

        const headers = {
            accept: 'application/json',
                'Authorization': 'Bearer eyJ4NXQiOiJrZ3BveUxkUW4wYllJX0xuNUR2bU9ZUmlRTzgiLCJraWQiOiJOR0k0TVRRek9XUmtOakk0WVdFM01tSTFPV1prTWpnNFlqVmlZVE00WVRjMU5USTJObUUyWVRBeVpEUXdNbU5rWW1ZMU9ETTBNR1EzT1dSaE1ERmtOUV9SUzI1NiIsInR5cCI6ImF0K2p3dCIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJkVDRkdXBwNmZERGZIZkEzYWJ4NjAyc2ZmZ1lhIiwiYXV0IjoiQVBQTElDQVRJT04iLCJhdWQiOlsiZFQ0ZHVwcDZmRERmSGZBM2FieDYwMnNmZmdZYSIsImNob3JlbzpkZXBsb3ltZW50OnByb2R1Y3Rpb24iXSwibmJmIjoxNzQzMjM1Njc5LCJhenAiOiJkVDRkdXBwNmZERGZIZkEzYWJ4NjAyc2ZmZ1lhIiwib3JnX2lkIjoiZmNkZjhjMjItZmM1MC00YjQ1LTk0ZWQtMjE0M2U5YmM0NjY4IiwiaXNzIjoiaHR0cHM6XC9cL2FwaS5hc2dhcmRlby5pb1wvdFwva2lkbmV5Z3VhcmRpYW5cL29hdXRoMlwvdG9rZW4iLCJleHAiOjE3NzkyMzU2NzksIm9yZ19uYW1lIjoia2lkbmV5Z3VhcmRpYW4iLCJpYXQiOjE3NDMyMzU2NzksImp0aSI6ImQ1NjhjMTAzLWQwMGItNDIwZS1hZWUyLWEyMDVlNWRkNTNlNCIsImNsaWVudF9pZCI6ImRUNGR1cHA2ZkREZkhmQTNhYng2MDJzZmZnWWEifQ.rb9F1x5pFtLnldH0OYoqqnCD9zCZq1_lZIVV8pfGIPogpqT1Z6Sc9tcLWIw0ZhbEw0QsM_77Hz32xaiZ2lwu-NlPd3GVzSYe3-8m22e5ejvSg6Ojp4deBWA50nkK_Qv-bovWHXMGB0Vj2cP_-s_KOSOYamDfVxsPyZND_DNQDPJhbcf7BiCOoHmoPwxJllOhpz2QAg11Pne5DvtsWwfj9xSiLAH7WKU_o8lUgrDNoC37MUszbpJVjVd8dQaaMLJPD9i3y5xhau97GKxJgN7REfXKieqRvF5jDjkyQWmSIz6YtYcIhqUcQre6m8diqTxkVQlafGJPsUTX1q_QezSVUA'
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


