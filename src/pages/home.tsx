import { BasicUserInfo, Hooks, useAuthContext } from "@asgardeo/auth-react";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useState } from "react";
import { default as authConfig } from "../config.json";
import KIDNEY_LOGO from "../images/kideny.png";
import { DefaultLayout } from "../layouts/default";
import { AuthenticationResponse } from "../components";
import { useLocation } from "react-router-dom";
import { LogoutRequestDenied } from "../components/LogoutRequestDenied";
import { USER_DENIED_LOGOUT } from "../constants/errors";

interface DerivedState {
    authenticateResponse: BasicUserInfo,
    idToken: string[],
    decodedIdTokenHeader: string,
    decodedIDTokenPayload: Record<string, string | number | boolean>;
}

/**
 * Home page for the Sample.
 *
 * @param props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const HomePage: FunctionComponent = (): ReactElement => {

    const {
        state,
        signIn,
        signOut,
        getBasicUserInfo,
        getIDToken,
        getDecodedIDToken,
        on
    } = useAuthContext();

    const [ derivedAuthenticationState, setDerivedAuthenticationState ] = useState<DerivedState>(null);
    const [ hasAuthenticationErrors, setHasAuthenticationErrors ] = useState<boolean>(false);
    const [ hasLogoutFailureError, setHasLogoutFailureError ] = useState<boolean>();

    const search = useLocation().search;
    const stateParam = new URLSearchParams(search).get('state');
    const errorDescParam = new URLSearchParams(search).get('error_description');

    useEffect(() => {

        if (!state?.isAuthenticated) {
            return;
        }

        (async (): Promise<void> => {
            const basicUserInfo = await getBasicUserInfo();
            const idToken = await getIDToken();
            const decodedIDToken = await getDecodedIDToken();

            const derivedState: DerivedState = {
                authenticateResponse: basicUserInfo,
                idToken: idToken.split("."),
                decodedIdTokenHeader: JSON.parse(atob(idToken.split(".")[0])),
                decodedIDTokenPayload: decodedIDToken
            };

            setDerivedAuthenticationState(derivedState);
        })();
    }, [ state.isAuthenticated , getBasicUserInfo, getIDToken, getDecodedIDToken ]);

    useEffect(() => {
        if(stateParam && errorDescParam) {
            if(errorDescParam === "End User denied the logout request") {
                setHasLogoutFailureError(true);
            }
        }
    }, [stateParam, errorDescParam]);

    const handleLogin = useCallback(() => {
        setHasLogoutFailureError(false);
        signIn()
            .catch(() => setHasAuthenticationErrors(true));
    }, [ signIn ]);

   /**
     * handles the error occurs when the logout consent page is enabled
     * and the user clicks 'NO' at the logout consent page
     */
    useEffect(() => {
        on(Hooks.SignOut, () => {
            setHasLogoutFailureError(false);
        });

        on(Hooks.SignOutFailed, () => {
            if(!errorDescParam) {
                handleLogin();
            }
        })
    }, [ on, handleLogin, errorDescParam]);

    const handleLogout = () => {
        signOut();
    };

    // If `clientID` is not defined in `config.json`, show a UI warning.
    if (!authConfig?.clientID) {

        return (
            <div className="content">
                <h2>You need to update the Client ID to proceed.</h2>
                <p>Please open &quot;src/config.json&quot; file using an editor, and update
                    the <code>clientID</code> value with the registered application&apos;s client ID.</p>
                <p>Visit repo <a
                    href="https://github.com/asgardeo/asgardeo-auth-react-sdk/tree/master/samples/asgardeo-react-app">README</a> for
                    more details.</p>
            </div>
        );
    }

    if (hasLogoutFailureError) {
        return (
            <LogoutRequestDenied
                errorMessage={USER_DENIED_LOGOUT}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
            />
        );
    }

    return (
        <DefaultLayout
            isLoading={ state.isLoading }
            hasErrors={ hasAuthenticationErrors }
        >
            {
                state.isAuthenticated
                    ? (
                        <div className="content">
                            <AuthenticationResponse
                                derivedResponse={ derivedAuthenticationState }
                            />
                            <button
                                className="btn primary mt-4"
                                onClick={ () => {
                                    handleLogout();
                                } }
                            >
                                Logout
                            </button>
                        </div>
                    )
                    : (
                        <div className="content">
                            <header>
                                <h1>Kidney Stone Predictor</h1>
                                <p>Your Path to Prevention</p>
                            </header>
                            <div className="home-image">
                                <img alt="react-logo" src={ KIDNEY_LOGO } className="react-logo-image logo"/>
                            </div>
                            <h4 className={ "spa-app-description" }>
                                Discover your risk of kidney stone disease with our easy-to-use predictive tool. By answering a few simple questions, you can gain insights into your likelihood of developing kidney stones and learn preventive measures tailored to your lifestyle. Take charge of your kidney health today!&nbsp;
                            </h4>
                            <button
                                className="btn primary"
                                onClick={ () => {
                                    handleLogin();
                                } }
                            >
                                Login
                            </button>
                        </div>
                    )
            }
        </DefaultLayout>
    );
};
