import { useEffect, RefObject } from "react";

export function useClickOutsideSingle <T extends HTMLElement> (ref: RefObject<T | null>, onClickOutside: () => void) {
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {

            if(!ref.current || !(e.target instanceof Node)) 
                return;
            onClickOutside();
        }

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        }
    }, [ref, onClickOutside]);
}

export function useClickOutsideMap <T extends HTMLElement> (refs: RefObject<Map<string , T | null>>, activeId: string, onClickOutside: () => void) {
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if(refs.current)
            {
                const searchElement = refs.current.get(activeId);
                
                if(searchElement && (e.target instanceof Node) && searchElement.contains(e.target)) {
                    return;
                }
                onClickOutside();
            }       
        }

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        }
    }, [activeId, onClickOutside]);
}