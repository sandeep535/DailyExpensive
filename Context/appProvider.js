import AppContext from './appContext';
import { useEffect, useState } from 'react';

export default function AppProvider( props ) {
    const [selectedGroupData, setSelectedGroupData] = useState(new Date());
    
    return (
        <AppContext.Provider value={
            {
                selectedGroupData: selectedGroupData,
                setSelectedGroupDataEvent: (selectedData) => {
                    setSelectedGroupData(selectedData);
                }
            }
        }>
                {props.children}
        </AppContext.Provider>
    );
}
