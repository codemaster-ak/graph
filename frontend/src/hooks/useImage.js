import React, {useLayoutEffect, useRef, useState} from 'react';

const LoadingStatus = {
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
}

export default function useImage(url, resizeCoefficient = 15) {

    const [status, setStatus] = useState(LoadingStatus.LOADING)
    const imageElement = useRef(new Image())
    const imageRef = useRef(null)

    useLayoutEffect(() => {
        if (!url) return
        const img = document.createElement('img')
        img.src = url

        img.width = img.naturalWidth / resizeCoefficient
        img.height = img.naturalHeight / resizeCoefficient

        img.addEventListener('load', onload)
        img.addEventListener('error', onError)

        function onload() {
            imageElement.current = img
            setStatus(LoadingStatus.SUCCESS)
        }

        function onError() {
            imageElement.current = undefined
            setStatus(LoadingStatus.ERROR)
        }

        return () => {
            img.removeEventListener('load', onload)
            img.removeEventListener('error', onError)
        }
    }, [status])

    return [imageElement.current, imageRef]
}