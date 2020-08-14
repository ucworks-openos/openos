import React from 'react'
import signitureCi from '../../assets/images/signiture-ci.svg';

function SignitureCi(props) {
    return (
        <div className={props.color ? "signiture-ci-wrap color" : "signiture-ci-wrap"}>
            <img src={signitureCi} alt="signiture-ci" />
        </div>
    )
}

export default SignitureCi
