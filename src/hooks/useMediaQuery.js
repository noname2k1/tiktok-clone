import { useState, useEffect } from 'react';

function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }

        const listener = () => {
            setMatches(media.matches);
        };

        media.addEventListener('change', listener);

        return () => {
            media.removeEventListener('change', listener);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    return matches;
}
export default useMediaQuery;
