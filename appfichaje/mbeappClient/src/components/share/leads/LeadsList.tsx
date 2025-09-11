import React, { useEffect, useState } from 'react'
import { ILead } from '@/client/models/ILead'
import LeadItem from './LeadItem'

const LeadsList = ({ items, pathEdit }: { items: Array<ILead>, pathEdit: string }) => {
    
     // Ordenar los leads: "Poco" al final
     const sortedItems = items.sort((a, b) => {
        if (a.name_tinteresa === 'Poco' && b.name_tinteresa !== 'Poco') {
            return 1;
        } else if (a.name_tinteresa !== 'Poco' && b.name_tinteresa === 'Poco') {
            return -1;
        } else {
            return 0;
        }
    });

    return (
        <div className="bg-white table-content">
            { 
                sortedItems.map((item, index) => {
                    return <LeadItem key={'item-l' + index} item={item} pathEdit={pathEdit} />
                })
            }
        </div>
    )
}

export default LeadsList