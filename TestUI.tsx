import React, { useEffect } from 'react'

const TestUI = () => {
    useEffect(() => {
        console.log("Welcome");
    }, [])
    return (
        <div>TestUI</div>
    )
}

export default TestUI