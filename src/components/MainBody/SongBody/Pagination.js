import React from "react";
import { usePagination, DOTS } from "./usePagination";
import { ArrowLeft, ArrowRight } from "iconsax-react";
const Pagination = (props) => {
    const {
        onPageChange,
        totalCount,
        siblingCount = 1,
        currentPage,
        pageSize,
        className
    } = props;

    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize
    });

    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }

    const onNext = () => {
        if (currentPage < lastPage) {
            onPageChange(currentPage + 1);
        }
    };

    const onPrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    let lastPage = paginationRange[paginationRange.length - 1];
    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", borderTopColor: "#656464", borderTopWidth: '0.5px', borderTopStyle: "solid", }}>
            <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: "24px", paddingRight: "24px", paddingTop: "22px" }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", border: "1px solid #b1b1b1", borderRadius: "8px", width: "112px", height: "36px", cursor: "pointer" }} onClick={onPrevious}>
                    <ArrowLeft size="20" color="#fff" />
                    <span style={{ color: "#fff", verticalAlign: "center", fontWeight: "400", fontSize: "14px", }}>Previous</span>
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    {paginationRange.map((pageNumber) => {
                        if (pageNumber === DOTS) {
                            return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", border: pageNumber !== currentPage ? "1px solid #b1b1b1" : "none", borderRadius: "8px", width: "40px", height: "40px", backgroundColor: pageNumber !== currentPage ? "transparent" : "#000" }} >
                                <span style={{ color: "#fff", verticalAlign: "center", fontWeight: "400", fontSize: "14px", }}>&#8230;</span>
                            </div>
                        }

                        return (
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", border: pageNumber !== currentPage ? "1px solid #b1b1b1" : "none", borderRadius: "8px", width: "40px", height: "40px", backgroundColor: pageNumber !== currentPage ? "transparent" : "#000" }} onClick={() => onPageChange(pageNumber)}>
                                <span style={{ color: "#fff", verticalAlign: "center", fontWeight: "400", fontSize: "14px", }}>{pageNumber}</span>
                            </div>

                        );
                    })}
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", border: "1px solid #b1b1b1", borderRadius: "8px", width: "112px", height: "36px", cursor: "pointer" }} onClick={onNext}>
                    <span style={{ color: "#fff", verticalAlign: "center", fontWeight: "400", fontSize: "14px", }}>Next</span>
                    <ArrowRight size="20" color="#fff" />
                </div>
            </div >
        </div >
    );
};

export default Pagination;
