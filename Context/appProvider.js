import AppContext from './appContext';
import { useEffect, useState } from 'react';

export default function AppProvider( props ) {
    const [selectedGroupData, setSelectedGroupData] = useState();
    const [isUpdate, setIsUpdate] = useState();
    return (
        <AppContext.Provider value={
            {
                selectedGroupData: selectedGroupData,
                setSelectedGroupDataEvent: (selectedData) => {
                    setSelectedGroupData(selectedData);
                },
                setIsUpdateEvent: (data) => {
                    setIsUpdate(data);
                },
                isUpdateData:isUpdate
            }
        }>
                {props.children}
        </AppContext.Provider>
    );
}
