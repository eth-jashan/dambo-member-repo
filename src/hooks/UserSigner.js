import { useMemo, useState } from "react"

const useUserSigner = (injectedProvider, localProvider) => {
    const [signer, setSigner] = useState()

    useMemo(() => {
        if (injectedProvider) {
            //console.log("🦊 Using injected provider");
            //console.log(injectedProvider.getSigner());
            const injectedSigner = injectedProvider._isProvider
                ? injectedProvider.getSigner()
                : injectedProvider
            setSigner(injectedSigner)
            //console.log(injectedSigner);
        } else {
            //console.log('no provider found')
        }
    }, [injectedProvider])

    return signer
}

export default useUserSigner
