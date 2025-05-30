import { Console } from '@/shared-libs/utils/console';
import React, { useEffect } from 'react';

const TestUI = () => {
    useEffect(() => {
        Console.log("Welcome");
    }, [])
    return (
        <div>TestUI</div>
    )
}

export default TestUI