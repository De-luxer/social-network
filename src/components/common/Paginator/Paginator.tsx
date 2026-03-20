import React, { useEffect, useState } from 'react';
import cont from './Paginator.module.css'

type PropsType = {
    portionSize?: number
    totalUsersCount: number
    pageSize: number
    currentPage?: number
    onPageChanged: (page: number) => void
}

let Paginator: React.FC<PropsType> = React.memo(({portionSize = 20, ...props}) => {
    let pagesCount = Math.ceil(props.totalUsersCount / props.pageSize);
    let pages = [];
    for (let i=1; i <= pagesCount; i++) {
        pages.push(i);
    }

    let portionCount = Math.ceil(pagesCount / portionSize);
    let [portionNumber, setPortionNumber] = useState<number>(1);
    let leftPortionPageNumber = (portionNumber - 1) * portionSize + 1;
    let rightPortionPageNumber = portionNumber * portionSize;
    
    useEffect(() => {
        const newPortionNumber = Math.ceil((props.currentPage || 1) / portionSize);
        setPortionNumber(newPortionNumber);
    }, [props.currentPage, pagesCount]);

    if (Number(props.currentPage) > pagesCount) {
        return <></>
    } else {
        return <div className={cont.pagination}>
            {portionNumber > 1 && <button onClick={() => { setPortionNumber(portionNumber - 1) }}>Prev</button>}
            {pages.filter(p => p >= leftPortionPageNumber && p <= rightPortionPageNumber).map(p => {
                return <button type='button' disabled={props.currentPage === p} key={p} onClick={() => {props.onPageChanged(p);}} className={`${props.currentPage === p && cont.pagination_item_active} ${cont.pagination_item}`} >{p}</button>
            })}
            {portionCount > portionNumber && <button onClick={() => { setPortionNumber(portionNumber + 1) }}>Next</button>}
        </div>
    }
})

export default Paginator;