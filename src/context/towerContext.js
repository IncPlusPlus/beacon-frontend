import {createContext, useEffect, useState} from "react";

export const TowerContext = createContext({});

export function TowerContextProvider({children}) {
    const hardCodedTowers = {
        "00000000": {
            id: "00000000",
            name: "Cool Tower",
            channels: {
                "00000006": {
                    id: "00000006",
                    name: "general",
                    messages: [
                        {
                            id: "00000000",
                            author: "000000000",
                            content: "Hello, world!"
                        },
                        {
                            id: "00000001",
                            author: "000000000",
                            content: "Hello, world!"
                        },
                        {
                            id: "00000002",
                            author: "000000000",
                            content: "Hello, world!"
                        },
                        {
                            id: "00000003",
                            author: "000000000",
                            content: "Hello, world!"
                        },
                        {
                            id: "00000004",
                            author: "000000000",
                            content: "Hello, world!"
                        },
                        {
                            id: "00000005",
                            author: "000000000",
                            content: "Hello, world!"
                        },
                        {
                            id: "00000006",
                            author: "000000000",
                            content: "Hello, world!"
                        },
                        {
                            id: "00000007",
                            author: "000000000",
                            content: "Hello, world!"
                        },
                        {
                            id: "00000008",
                            author: "000000000",
                            content: "Hello, world!"
                        },
                    ]
                }
            },
            members: [
                "00000000",
                "00000001",
                "00000002",
            ]
        },
        "00000069": {
            id: "00000069",
            name: "Cool Tower 2",
            channels: {
                "00000008": {
                    id: "00000008",
                    name: "memes",
                    messages: [
                        {
                            id: "00000000",
                            author: "000000000",
                            content: "Hello, world!"
                        }
                    ]
                }
            },
            members: [
                "00000000",
                "00000001",
                "00000002",
            ]
        }
    }


    const [towerContext, setTowerContext] = useState({});

    useEffect(() => {
        setTowerContext(hardCodedTowers);
        // TODO: This is temporary until real data can fill it. As such, it's fine that we're breaking some React best practices.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <TowerContext.Provider value={{towerContext: towerContext}}>
            {children}
        </TowerContext.Provider>
    );
}