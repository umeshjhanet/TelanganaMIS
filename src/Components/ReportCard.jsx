import React, {useEffect,useRef,useState} from "react"


const ReportCard=({name,nameFilesData,nameImagesData,repo})=>{

    const [report, setReport] = useState();
    return(
    <>
                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <div className="summary-card mt-3">
                        <div className="summary-title">
                          <h6
                            className="mt-2"
                            style={{ textTransform: "capitalize" }}
                          >
                            {/* Coll. of Records */}
                            {name}
                          </h6>
                        </div>
                        <p
                          className="text-center"
                          style={{
                            fontSize: "13px",
                            fontWeight: "500",
                            color: "maroon",
                          }}
                        >
                          Files:{" "}
                          {Number(
                            repo?.reduce(
                              (sum, elem) =>
                                sum + Number(elem?.[nameFilesData]) || 0,
                              0
                            )
                          ).toLocaleString("en-IN")}
                          <br />
                          Images:{" "}
                          {Number(
                            repo?.reduce(
                              (sum, elem) =>
                                sum + Number(elem?.[nameImagesData]) || 0,
                              0
                            )
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  
    </>
)

}

export default ReportCard;