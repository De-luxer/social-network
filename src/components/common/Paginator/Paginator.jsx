import React, { useState } from 'react';
import cont from './Paginator.module.css'

let Paginator = ({portionSize = 20, ...props}) => {
    let pagesCount = Math.ceil(props.totalUsersCount / props.pageSize);
    let pages = [];
    for (let i=1; i <= pagesCount; i++) {
        pages.push(i);
    }

    let portionCount = Math.ceil(pagesCount / portionSize);
    let [portionNumber, setPortionNumber] = useState(1);
    let leftPortionPageNumber = (portionNumber - 1) * portionSize + 1;
    let rightPortionPageNumber = portionNumber * portionSize;

    return <div className={cont.pagination}>
        {portionNumber > 1 && <button onClick={() => {setPortionNumber(portionNumber - 1)}}>Prev</button>}
        {pages.filter(p => p >= leftPortionPageNumber && p<= rightPortionPageNumber).map( p => {
            return <span onClick={() => { props.onPageChanged(p); }} className={`${props.currentPage === p && cont.pagination_item_active} ${cont.pagination_item}`} >{p}</span>
        })}
        {portionCount > portionNumber && <button onClick={() => {setPortionNumber(portionNumber + 1)}}>Next</button>}
    </div>
}

export default Paginator;