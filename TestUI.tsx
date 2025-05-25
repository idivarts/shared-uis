import { CrashLog } from '@/shared-libs/utils/firebase/crashlytics';
import React, { useEffect } from 'react';

const TestUI = () => {
    useEffect(() => {
        CrashLog.log("Welcome");
    }, [])
    return (
        <div>TestUI</div>
    )
}

export default TestUI